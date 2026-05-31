import { pgTable, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ambulancesTable = pgTable("ambulances", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  unitNumber: text("unit_number").notNull(),
  driverName: text("driver_name").notNull(),
  driverPhone: text("driver_phone").notNull(),
  status: text("status").notNull().default("available"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  speedKmh: real("speed_kmh"),
  assignedIncidentId: text("assigned_incident_id"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAmbulanceSchema = createInsertSchema(ambulancesTable).omit({ id: true });
export type InsertAmbulance = z.infer<typeof insertAmbulanceSchema>;
export type Ambulance = typeof ambulancesTable.$inferSelect;
