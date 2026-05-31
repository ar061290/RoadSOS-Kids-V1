import { Router } from "express";
import { db, hospitalsTable } from "@workspace/db";

const router = Router();

router.get("/hospitals", async (req, res) => {
  try {
    const hospitals = await db.select().from(hospitalsTable).orderBy(hospitalsTable.name);
    const { lat, lng } = req.query as { lat?: string; lng?: string };
    if (lat && lng) {
      const refLat = parseFloat(lat);
      const refLng = parseFloat(lng);
      const withDistance = hospitals.map((h) => {
        const dlat = h.latitude - refLat;
        const dlng = h.longitude - refLng;
        const distKm = Math.sqrt(dlat * dlat + dlng * dlng) * 111;
        const etaMin = Math.round((distKm / 60) * 60);
        const confidenceScore = Math.max(0.5, 1 - distKm / 50);
        return {
          ...h,
          distanceKm: Math.round(distKm * 10) / 10,
          etaMinutes: etaMin,
          confidenceScore: Math.round(confidenceScore * 100) / 100,
        };
      });
      withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
      res.json(withDistance);
      return;
    }
    res.json(hospitals.map((h) => ({ ...h, distanceKm: 0, etaMinutes: 0, confidenceScore: 1 })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list hospitals" });
  }
});

export default router;
