import { Router } from "express";
import { db, ambulancesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

const router = Router();

const locationUpdateSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  speedKmh: z.number().optional(),
  status: z.string().optional(),
});

router.get("/ambulances", async (req, res) => {
  try {
    const ambulances = await db.select().from(ambulancesTable).orderBy(ambulancesTable.unitNumber);
    res.json(ambulances);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list ambulances" });
  }
});

router.put("/ambulances/:ambulanceId/location", async (req, res) => {
  const parsed = locationUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }
  try {
    const [updated] = await db
      .update(ambulancesTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(ambulancesTable.id, req.params.ambulanceId))
      .returning();
    if (!updated) { res.status(404).json({ error: "Ambulance not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update ambulance location" });
  }
});

export default router;
