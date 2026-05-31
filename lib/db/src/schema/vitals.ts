import { pgTable, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const vitalsTable = pgTable("vitals", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  incidentId: text("incident_id").notNull(),
  heartRate: integer("heart_rate").notNull(),
  temperature: real("temperature").notNull(),
  accelerometerX: real("accelerometer_x"),
  accelerometerY: real("accelerometer_y"),
  accelerometerZ: real("accelerometer_z"),
  impactMagnitude: real("impact_magnitude"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  confidence: real("confidence").notNull().default(0.9),
  alerts: text("alerts").array().notNull().default([]),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertVitalsSchema = createInsertSchema(vitalsTable).omit({ id: true });
export type InsertVitals = z.infer<typeof insertVitalsSchema>;
export type Vitals = typeof vitalsTable.$inferSelect;
