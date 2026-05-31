import { Router } from "express";
import { z } from "zod/v4";
import { db, vitalsTable, incidentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const sensorSchema = z.object({
  deviceId: z.string(),
  timestamp: z.string(),
  accelerometerX: z.number(),
  accelerometerY: z.number(),
  accelerometerZ: z.number(),
  heartRate: z.number(),
  temperature: z.number(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const handleSensorData = async (req: import("express").Request, res: import("express").Response) => {
  const parsed = sensorSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid sensor payload", details: parsed.error.issues });
    return;
  }
  try {
    const d = parsed.data;
    const mag = Math.sqrt(d.accelerometerX ** 2 + d.accelerometerY ** 2 + d.accelerometerZ ** 2);
    const confidence = Math.min(1, 0.7 + (d.heartRate > 40 && d.heartRate < 200 ? 0.3 : 0));
    const alerts: string[] = [];
    if (d.heartRate > 140) alerts.push("high_heart_rate");
    if (d.heartRate < 50) alerts.push("low_heart_rate");
    if (d.temperature > 38.5) alerts.push("fever");
    if (mag > 15) alerts.push("high_impact");
    const [incident] = await db.select().from(incidentsTable).where(eq(incidentsTable.status, "active")).limit(1);
    if (!incident) { res.json({ processed: true, incidentId: null, impactMagnitude: mag, alerts, confidence }); return; }
    const [vitals] = await db.insert(vitalsTable).values({
      incidentId: incident.id, heartRate: d.heartRate, temperature: d.temperature,
      accelerometerX: d.accelerometerX, accelerometerY: d.accelerometerY, accelerometerZ: d.accelerometerZ,
      impactMagnitude: mag, latitude: d.latitude, longitude: d.longitude, confidence, alerts, timestamp: new Date(d.timestamp),
    }).returning();
    res.json({ processed: true, incidentId: incident.id, vitalsId: vitals.id, impactMagnitude: mag, alerts, confidence });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to process sensor data" });
  }
};

router.post("/innerwear/sensor-data", handleSensorData);

router.post("/sensor-data", async (req, res) => {
  const parsed = sensorSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid sensor payload", details: parsed.error.issues });
    return;
  }
  try {
    const d = parsed.data;
    const mag = Math.sqrt(d.accelerometerX ** 2 + d.accelerometerY ** 2 + d.accelerometerZ ** 2);
    const confidence = Math.min(1, 0.7 + (d.heartRate > 40 && d.heartRate < 200 ? 0.3 : 0));
    const alerts: string[] = [];
    if (d.heartRate > 140) alerts.push("high_heart_rate");
    if (d.heartRate < 50) alerts.push("low_heart_rate");
    if (d.temperature > 38.5) alerts.push("fever");
    if (mag > 15) alerts.push("high_impact");

    const [incident] = await db
      .select()
      .from(incidentsTable)
      .where(eq(incidentsTable.status, "active"))
      .limit(1);

    if (!incident) {
      res.json({ processed: true, incidentId: null, impactMagnitude: mag, alerts, confidence });
      return;
    }

    const [vitals] = await db.insert(vitalsTable).values({
      incidentId: incident.id,
      heartRate: d.heartRate,
      temperature: d.temperature,
      accelerometerX: d.accelerometerX,
      accelerometerY: d.accelerometerY,
      accelerometerZ: d.accelerometerZ,
      impactMagnitude: mag,
      latitude: d.latitude,
      longitude: d.longitude,
      confidence,
      alerts,
      timestamp: new Date(d.timestamp),
    }).returning();

    res.json({ processed: true, incidentId: incident.id, vitalsId: vitals.id, impactMagnitude: mag, alerts, confidence });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to process sensor data" });
  }
});

export default router;
