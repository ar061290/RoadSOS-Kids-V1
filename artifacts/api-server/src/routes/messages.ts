import { Router } from "express";
import { db, messagesTable, insertMessageSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/messages", async (req, res) => {
  const parsed = insertMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }
  try {
    const [msg] = await db.insert(messagesTable).values(parsed.data).returning();
    res.status(201).json(msg);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.get("/messages/:incidentId", async (req, res) => {
  try {
    const messages = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.incidentId, req.params.incidentId))
      .orderBy(messagesTable.createdAt);
    res.json(messages);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list messages" });
  }
});

router.get("/incidents/:incidentId/messages", async (req, res) => {
  try {
    const messages = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.incidentId, req.params.incidentId))
      .orderBy(messagesTable.createdAt);
    res.json(messages);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list messages" });
  }
});

export default router;
