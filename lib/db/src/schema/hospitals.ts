import { pgTable, text, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const hospitalsTable = pgTable("hospitals", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  type: text("type").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  traumaBeds: integer("trauma_beds").notNull().default(0),
  icuBeds: integer("icu_beds").notNull().default(0),
  hasPediatricTeam: boolean("has_pediatric_team").notNull().default(false),
  hasTraumaSurgery: boolean("has_trauma_surgery").notNull().default(false),
  hasCTScan: boolean("has_ct_scan").notNull().default(false),
  rating: real("rating").notNull().default(4.0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertHospitalSchema = createInsertSchema(hospitalsTable).omit({ id: true, createdAt: true });
export type InsertHospital = z.infer<typeof insertHospitalSchema>;
export type Hospital = typeof hospitalsTable.$inferSelect;
