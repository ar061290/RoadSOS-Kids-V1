import { db, childrenTable, hospitalsTable, ambulancesTable, incidentsTable, vitalsTable, messagesTable, timelineEventsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.execute(sql`TRUNCATE timeline_events, messages, vitals, incidents, ambulances, hospitals, children RESTART IDENTITY CASCADE`);

  // Children
  const [emma] = await db.insert(childrenTable).values({
    name: "Emma Chen",
    age: 8,
    gender: "female",
    bloodType: "A+",
    allergies: ["Penicillin", "Peanuts"],
    medications: ["Ventolin (as needed)"],
    medicalConditions: ["Mild asthma"],
    parentName: "David Chen",
    parentPhone: "+1-555-0192",
    deviceId: "DEVICE-001",
  }).returning();

  const [liam] = await db.insert(childrenTable).values({
    name: "Liam Torres",
    age: 11,
    gender: "male",
    bloodType: "O-",
    allergies: ["Sulfa drugs"],
    medications: [],
    medicalConditions: [],
    parentName: "Maria Torres",
    parentPhone: "+1-555-0274",
    deviceId: "DEVICE-002",
  }).returning();

  const [sofia] = await db.insert(childrenTable).values({
    name: "Sofia Patel",
    age: 6,
    gender: "female",
    bloodType: "B+",
    allergies: ["Latex", "Tree nuts"],
    medications: ["EpiPen"],
    medicalConditions: ["Severe nut allergy"],
    parentName: "Priya Patel",
    parentPhone: "+1-555-0381",
    deviceId: "DEVICE-003",
  }).returning();

  console.log("Children seeded.");

  // Hospitals
  const [choa] = await db.insert(hospitalsTable).values({
    name: "Children's Healthcare of Atlanta",
    type: "Pediatric Trauma Center",
    latitude: 33.7849,
    longitude: -84.3762,
    address: "1405 Clifton Rd NE, Atlanta, GA 30322",
    phone: "+1-404-785-5437",
    traumaBeds: 12,
    icuBeds: 24,
    hasPediatricTeam: true,
    hasTraumaSurgery: true,
    hasCTScan: true,
    rating: 4.9,
  }).returning();

  const [grady] = await db.insert(hospitalsTable).values({
    name: "Grady Memorial Hospital",
    type: "Level I Trauma Center",
    latitude: 33.7477,
    longitude: -84.3871,
    address: "80 Jesse Hill Jr Dr SE, Atlanta, GA 30303",
    phone: "+1-404-616-1000",
    traumaBeds: 20,
    icuBeds: 40,
    hasPediatricTeam: true,
    hasTraumaSurgery: true,
    hasCTScan: true,
    rating: 4.7,
  }).returning();

  const [piedmont] = await db.insert(hospitalsTable).values({
    name: "Piedmont Atlanta Hospital",
    type: "General Hospital",
    latitude: 33.8074,
    longitude: -84.3722,
    address: "1968 Peachtree Rd NW, Atlanta, GA 30309",
    phone: "+1-404-605-5000",
    traumaBeds: 8,
    icuBeds: 16,
    hasPediatricTeam: false,
    hasTraumaSurgery: true,
    hasCTScan: true,
    rating: 4.4,
  }).returning();

  console.log("Hospitals seeded.");

  // Ambulances
  const [amb1] = await db.insert(ambulancesTable).values({
    unitNumber: "AMB-7",
    driverName: "Officer James Reid",
    driverPhone: "+1-404-555-0171",
    status: "en_route",
    latitude: 33.761,
    longitude: -84.382,
    speedKmh: 72,
  }).returning();

  const [amb2] = await db.insert(ambulancesTable).values({
    unitNumber: "AMB-12",
    driverName: "Officer Sarah Kim",
    driverPhone: "+1-404-555-0228",
    status: "available",
    latitude: 33.792,
    longitude: -84.391,
    speedKmh: 0,
  }).returning();

  const [amb3] = await db.insert(ambulancesTable).values({
    unitNumber: "AMB-3",
    driverName: "Officer Marcus Brown",
    driverPhone: "+1-404-555-0315",
    status: "on_scene",
    latitude: 33.741,
    longitude: -84.368,
    speedKmh: 0,
  }).returning();

  console.log("Ambulances seeded.");

  // Active incident — critical
  const [incident1] = await db.insert(incidentsTable).values({
    childId: emma.id,
    childName: emma.name,
    childAge: emma.age,
    severity: "critical",
    status: "en_route",
    incidentType: "bicycle_accident",
    latitude: 33.758,
    longitude: -84.388,
    locationAddress: "Centennial Olympic Park Dr, Atlanta, GA",
    heartRate: 118,
    temperature: 37.4,
    vitalsConfidence: 0.94,
    heartRateTrend: "rising",
    parentName: emma.parentName,
    parentPhone: emma.parentPhone,
    parentStatus: "en_route",
    ambulanceId: amb1.id,
    ambulanceUnit: amb1.unitNumber,
    ambulanceEtaMinutes: 4,
    ambulanceDistanceKm: 3.2,
    hospitalId: choa.id,
    hospitalName: choa.name,
    impactMagnitude: 18.4,
  }).returning();

  // Moderate incident
  const [incident2] = await db.insert(incidentsTable).values({
    childId: liam.id,
    childName: liam.name,
    childAge: liam.age,
    severity: "moderate",
    status: "on_scene",
    incidentType: "fall",
    latitude: 33.741,
    longitude: -84.368,
    locationAddress: "Atlanta BeltLine Trail, Atlanta, GA",
    heartRate: 94,
    temperature: 36.9,
    vitalsConfidence: 0.88,
    heartRateTrend: "stable",
    parentName: liam.parentName,
    parentPhone: liam.parentPhone,
    parentStatus: "notified",
    ambulanceId: amb3.id,
    ambulanceUnit: amb3.unitNumber,
    ambulanceEtaMinutes: 0,
    ambulanceDistanceKm: 0,
    hospitalId: grady.id,
    hospitalName: grady.name,
    impactMagnitude: 9.2,
  }).returning();

  console.log("Incidents seeded.");

  // Update ambulances with their assigned incidents
  const { ambulancesTable: at } = await import("@workspace/db");
  const { eq } = await import("drizzle-orm");
  await db.update(at).set({ assignedIncidentId: incident1.id }).where(eq(at.id, amb1.id));
  await db.update(at).set({ assignedIncidentId: incident2.id }).where(eq(at.id, amb3.id));

  // Vitals for incident 1
  const vitalsData = [
    { hr: 105, temp: 37.1, mag: 18.4 },
    { hr: 108, temp: 37.2, mag: 3.1 },
    { hr: 112, temp: 37.3, mag: 2.4 },
    { hr: 115, temp: 37.3, mag: 1.8 },
    { hr: 118, temp: 37.4, mag: 1.2 },
    { hr: 120, temp: 37.4, mag: 0.9 },
  ];

  const now = Date.now();
  for (let i = 0; i < vitalsData.length; i++) {
    const v = vitalsData[i];
    await db.insert(vitalsTable).values({
      incidentId: incident1.id,
      heartRate: v.hr,
      temperature: v.temp,
      impactMagnitude: v.mag,
      confidence: 0.9 + i * 0.01,
      alerts: v.hr > 115 ? ["high_heart_rate"] : [],
      timestamp: new Date(now - (vitalsData.length - i) * 30000),
    });
  }

  // Vitals for incident 2
  for (let i = 0; i < 4; i++) {
    await db.insert(vitalsTable).values({
      incidentId: incident2.id,
      heartRate: 90 + i * 2,
      temperature: 36.8 + i * 0.05,
      impactMagnitude: 9.2 - i * 0.5,
      confidence: 0.85 + i * 0.01,
      alerts: [],
      timestamp: new Date(now - (4 - i) * 45000),
    });
  }

  console.log("Vitals seeded.");

  // Timeline for incident 1
  const tlBase = now - 25 * 60000;
  await db.insert(timelineEventsTable).values([
    {
      incidentId: incident1.id,
      eventType: "incident_created",
      title: "Emergency Detected",
      description: "High-impact collision detected by innerwear sensor. Impact magnitude: 18.4g",
      timestamp: new Date(tlBase),
    },
    {
      incidentId: incident1.id,
      eventType: "alert_sent",
      title: "Parent Notified",
      description: "Push notification sent to David Chen (+1-555-0192)",
      timestamp: new Date(tlBase + 20000),
    },
    {
      incidentId: incident1.id,
      eventType: "alert_sent",
      title: "Dispatch Alerted",
      description: "Emergency services notified. Closest ambulance: AMB-7",
      timestamp: new Date(tlBase + 45000),
    },
    {
      incidentId: incident1.id,
      eventType: "status_en_route",
      title: "Ambulance En Route",
      description: "AMB-7 dispatched. ETA: 4 minutes. Distance: 3.2 km",
      timestamp: new Date(tlBase + 90000),
    },
    {
      incidentId: incident1.id,
      eventType: "vitals_update",
      title: "Vitals Update",
      description: "Heart rate: 118 bpm (rising). Temperature: 37.4°C. Confidence: 94%",
      timestamp: new Date(tlBase + 120000),
    },
  ]);

  // Timeline for incident 2
  const tl2Base = now - 18 * 60000;
  await db.insert(timelineEventsTable).values([
    {
      incidentId: incident2.id,
      eventType: "incident_created",
      title: "Emergency Detected",
      description: "Fall detected by innerwear sensor. Impact magnitude: 9.2g",
      timestamp: new Date(tl2Base),
    },
    {
      incidentId: incident2.id,
      eventType: "alert_sent",
      title: "Parent Notified",
      description: "Push notification sent to Maria Torres (+1-555-0274)",
      timestamp: new Date(tl2Base + 30000),
    },
    {
      incidentId: incident2.id,
      eventType: "status_en_route",
      title: "Ambulance En Route",
      description: "AMB-3 dispatched. ETA: 3 minutes",
      timestamp: new Date(tl2Base + 60000),
    },
    {
      incidentId: incident2.id,
      eventType: "status_on_scene",
      title: "Ambulance On Scene",
      description: "AMB-3 arrived. Paramedics attending to Liam Torres",
      timestamp: new Date(tl2Base + 240000),
    },
  ]);

  // Messages for incident 1
  await db.insert(messagesTable).values([
    {
      incidentId: incident1.id,
      senderType: "system",
      senderName: "RoadSoS System",
      recipientType: "parent",
      messageType: "alert",
      content: "EMERGENCY ALERT: Emma has been detected in a high-impact accident. Ambulance AMB-7 is en route. ETA: 4 min.",
      deliveryStatus: "delivered",
    },
    {
      incidentId: incident1.id,
      senderType: "child",
      senderName: "Emma Chen",
      recipientType: "parent",
      messageType: "auto_response",
      content: "I pressed YES — I need help",
      deliveryStatus: "delivered",
    },
    {
      incidentId: incident1.id,
      senderType: "parent",
      senderName: "David Chen",
      recipientType: "responder",
      messageType: "text",
      content: "On my way! She has a penicillin allergy — please tell the paramedics",
      deliveryStatus: "delivered",
    },
    {
      incidentId: incident1.id,
      senderType: "responder",
      senderName: "AMB-7 Crew",
      recipientType: "parent",
      messageType: "text",
      content: "Noted — allergy on record. We will be there in approximately 4 minutes. Stay calm.",
      deliveryStatus: "delivered",
    },
  ]);

  // Messages for incident 2
  await db.insert(messagesTable).values([
    {
      incidentId: incident2.id,
      senderType: "system",
      senderName: "RoadSoS System",
      recipientType: "parent",
      messageType: "alert",
      content: "ALERT: Liam had a fall on the BeltLine Trail. Ambulance AMB-3 is on scene.",
      deliveryStatus: "delivered",
    },
    {
      incidentId: incident2.id,
      senderType: "responder",
      senderName: "AMB-3 Crew",
      recipientType: "parent",
      messageType: "text",
      content: "We are with Liam. He is conscious and responsive. Moderate injury to left arm.",
      deliveryStatus: "delivered",
    },
  ]);

  console.log("Messages and timeline seeded.");
  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
