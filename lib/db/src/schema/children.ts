import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const childrenTable = pgTable("children", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  bloodType: text("blood_type"),
  allergies: text("allergies").array().notNull().default([]),
  medications: text("medications").array().notNull().default([]),
  medicalConditions: text("medical_conditions").array().notNull().default([]),
  parentName: text("parent_name").notNull(),
  parentPhone: text("parent_phone").notNull(),
  deviceId: text("device_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertChildSchema = createInsertSchema(childrenTable).omit({ id: true, createdAt: true });
export type InsertChild = z.infer<typeof insertChildSchema>;
export type Child = typeof childrenTable.$inferSelect;
