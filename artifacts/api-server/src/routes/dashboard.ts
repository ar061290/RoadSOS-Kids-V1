import { Router } from "express";
import { db, incidentsTable, vitalsTable, childrenTable, ambulancesTable, hospitalsTable } from "@workspace/db";
import { ne, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/dashboard/summary", async (req, res) => {
  try {
    const allIncidents = await db.select().from(incidentsTable);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const active = allIncidents.filter((i) => i.status !== "resolved" && i.status !== "at_hospital");
    const critical = active.filter((i) => i.severity === "critical");
    const moderate = active.filter((i) => i.severity === "moderate");
    const resolvedToday = allIncidents.filter((i) => i.resolvedAt && i.resolvedAt >= todayStart);

    const resolvedWithTimes = allIncidents.filter((i) => i.resolvedAt && i.createdAt);
    const avgResponseMs = resolvedWithTimes.length > 0
      ? resolvedWithTimes.reduce((sum, i) => sum + (i.resolvedAt!.getTime() - i.createdAt.getTime()), 0) / resolvedWithTimes.length
      : 0;

    const ambulances = await db.select().from(ambulancesTable);
    const children = await db.select().from(childrenTable);
    const hospitals = await db.select().from(hospitalsTable);

    const deployed = ambulances.filter((a) => a.status !== "available" && a.status !== "offline");
    const available = ambulances.filter((a) => a.status === "available");
    const alertedHospitals = new Set(active.filter((i) => i.hospitalId).map((i) => i.hospitalId));

    res.json({
      activeIncidents: active.length,
      criticalIncidents: critical.length,
      moderateIncidents: moderate.length,
      resolvedToday: resolvedToday.length,
      averageResponseTimeMinutes: Math.round(avgResponseMs / 60000),
      ambulancesDeployed: deployed.length,
      ambulancesAvailable: available.length,
      hospitalsAlerted: alertedHospitals.size,
      totalChildrenRegistered: children.length,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get dashboard summary" });
  }
});

router.get("/dashboard/active-incidents", async (req, res) => {
  try {
    const active = await db
      .select()
      .from(incidentsTable)
      .where(ne(incidentsTable.status, "resolved"))
      .orderBy(desc(incidentsTable.createdAt));

    const now = Date.now();
    const summaries = active.map((i) => ({
      incidentId: i.id,
      childName: i.childName,
      childAge: i.childAge,
      severity: i.severity,
      status: i.status,
      heartRate: i.heartRate,
      temperature: i.temperature,
      ambulanceEtaMinutes: i.ambulanceEtaMinutes,
      hospitalName: i.hospitalName,
      elapsedMinutes: Math.floor((now - i.createdAt.getTime()) / 60000),
      latitude: i.latitude,
      longitude: i.longitude,
    }));
    res.json(summaries);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get active incidents" });
  }
});

export default router;
