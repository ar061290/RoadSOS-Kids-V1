import { Router } from "express";
import { db, timelineEventsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/dashboard/timeline/:incidentId", async (req, res) => {
  try {
    const events = await db
      .select()
      .from(timelineEventsTable)
      .where(eq(timelineEventsTable.incidentId, req.params.incidentId))
      .orderBy(asc(timelineEventsTable.timestamp));
    res.json(events);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get timeline" });
  }
});

router.get("/incidents/:incidentId/timeline", async (req, res) => {
  try {
    const events = await db
      .select()
      .from(timelineEventsTable)
      .where(eq(timelineEventsTable.incidentId, req.params.incidentId))
      .orderBy(asc(timelineEventsTable.timestamp));
    res.json(events);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get timeline" });
  }
});

export default router;
