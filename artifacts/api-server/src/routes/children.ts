import { Router } from "express";
import { db, childrenTable, insertChildSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/children", async (req, res) => {
  try {
    const children = await db.select().from(childrenTable).orderBy(childrenTable.createdAt);
    res.json(children);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list children" });
  }
});

router.post("/children", async (req, res) => {
  const parsed = insertChildSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }
  try {
    const [child] = await db.insert(childrenTable).values(parsed.data).returning();
    res.status(201).json(child);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create child" });
  }
});

router.get("/children/:childId", async (req, res) => {
  try {
    const [child] = await db.select().from(childrenTable).where(eq(childrenTable.id, req.params.childId));
    if (!child) { res.status(404).json({ error: "Child not found" }); return; }
    res.json(child);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get child" });
  }
});

export default router;
