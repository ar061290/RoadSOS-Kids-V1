# 07_EMERGENCY_RESPONSE_DASHBOARD_PRD - PRODUCT REQUIREMENTS DOCUMENT

## Executive Summary
The Emergency Response Dashboard is a specialized interface for first responders (paramedics, ambulance crew, emergency dispatch centers) to access real-time incident information during active emergencies. It provides critical child data, recommended medical actions, optimal routing to hospital, and direct communication with parents. Designed for use on tablets/laptops in ambulances and dispatch centers with emphasis on speed, clarity, and critical information.

## Target Users

### Primary: Paramedics/Ambulance Crew
- Demographic: Professional first responders, trained in emergency care
- Device: Ruggedized tablet (iPad/Android) mounted in ambulance
- Stress: High (active emergency response)
- Goals: Access child vitals quickly, optimal hospital routing, parent contact info
- Tech expertise: Medium (familiar with medical devices)

### Secondary: Dispatch Centers
- Role: Route ambulances, manage incident status, communicate with multiple responders
- Device: Desktop computer or tablet
- Goals: Comprehensive incident overview, multiple-incident management
- Tech expertise: High

## Problem Statement
First responders currently lack:
- **Real-time child vitals** during response (only dispatch info available)
- **Smart hospital routing** (must manually decide based on experience)
- **Parent context** (allergies, medications, behavior patterns)
- **Live tracking** to optimize response and hospital coordination

The Emergency Response Dashboard solves this by pushing pre-incident intelligence and live child data directly to responders.

## Use Cases

### Use Case 1: Ambulance Crew Receives Incident Notification

**Scenario**: Ambulance A-14 crew receives call about child emergency

**Timeline**:
`
T=0s: Dispatch center receives incident from RoadSoS backend
  └─ Severity: MODERATE
  └─ Child: Aarav, Age 8
  └─ Location: School Bus Route #42

T=1s: Ambulance tablet receives alert notification
  ├─ Sound: High-priority alert tone
  ├─ Haptic: Continuous vibration
  └─ Display: Red banner "🚨 PEDIATRIC EMERGENCY INBOUND"

T=2s: Paramedic taps notification, dashboard opens
  ├─ Screen shows: Child location, vitals (if available), parent contact
  ├─ Recommendations: "Route to Apollo Hospital (trauma center)"
  └─ Parent status: "Notified, responding"

T=3s: Paramedic reviews quick facts
  ├─ Card 1: Child identity + vitals (HR 125 BPM, Temp 36.8°C)
  ├─ Card 2: Incident details (Impact severity MODERATE, Time 3:27 PM)
  ├─ Card 3: Hospital recommendation (Apollo Trauma Center, 8 min drive)
  └─ Card 4: Parent contact (Mom: +91 98765 43210, Status: En route to hospital)

T=5s: Paramedic starts driving
  └─ Dashboard begins live tracking:
     ├─ Child location map (refreshes every 2s)
     ├─ ETA countdown to child location
     ├─ Recommended route display
     └─ Parent location display (optional)

T=10s: Paramedic receives parent phone call
  ├─ Call is routed through RoadSoS system
  ├─ Call indicator shown on dashboard
  ├─ Parent can see: "Connected to paramedic" on their phone
  └─ Call recording: Automatic (for medical records)
`

### Use Case 2: Dispatch Center Managing Multiple Incidents

**Scenario**: Dispatch manages 3 concurrent pediatric emergencies

`
Dashboard shows:
├─ Main Incident (currently focused): Details of Priority 1 emergency
├─ Secondary Incident: List of Priority 2 emergencies
└─ Tertiary Incident: Queued incidents

Dispatch actions:
1. View Incident A: Review child vitals, parent info, best hospital
2. Assign Ambulance: Click "Assign ambulance" → Select A-14 → Confirm
3. Track Incident A: Live map shows ambulance progress, ETA update
4. Check Incident B: Switch to secondary incident while A-14 en route
5. Reassign if needed: If ambulance delayed, reassign to different unit
6. Communicate: Send messages to ambulances or parents as needed
7. Report incident: Once resolved, file incident report with vital data export
`

## Feature Set

### Feature 1: Incident Alert Card (First Screen)

**Display elements**:
`
┌─────────────────────────────────────────┐
│ 🚨 PEDIATRIC EMERGENCY                  │ ← Alert banner
│ Severity: MODERATE | Time: 3:27 PM    │
├─────────────────────────────────────────┤
│                                         │
│ CHILD: Aarav Kumar, Age 8               │ ← Child identity
│ Photo: [thumbnail]                      │
│                                         │
│ INCIDENT TYPE: School Bus Accident      │ ← Incident details
│ Location: 12.9716°N, 77.5946°E (±8.5m)│
│ Time: 3:27 PM (10 minutes ago)         │
│                                         │
│ VITALS (Latest):                        │ ← Child vitals (if available)
│ Heart Rate: 125 BPM ⬆️ (elevated)      │
│ Temperature: 36.8°C (normal)            │
│ Confidence: 92%                         │
│                                         │
│ PARENT:                                 │ ← Parent contact
│ Mother: Priya Kumar                     │
│ Phone: +91 98765 43210                  │
│ Status: 🟢 En route to hospital        │
│                                         │
│ [Call Parent] [Message] [More Details] │ ← Actions
│                                         │
└─────────────────────────────────────────┘
`

**Requirements**:
- Load time: <1 second
- Font size: Critical info 28pt+
- Color: Red banner for emergency alert
- Contrast: 5:1+ (readable in ambulance lighting)

### Feature 2: Live Map with Routing

**Functionality**:
`
MAP DISPLAY:
├─ Child location (blue marker, center of map)
├─ Ambulance location (red marker with arrow showing direction)
├─ Recommended hospital (green marker with H)
├─ Route path from ambulance to hospital (optimized, dynamic)
├─ Traffic overlay (optional, show congestion)
└─ Street view option (tap marker for street view)

INTERACTIVE CONTROLS:
├─ Tap ambulance marker: Show unit info, contact, status
├─ Tap hospital marker: Show hospital details, bed availability
├─ Tap child marker: Show child details, medical history
├─ Route toggle: Show/hide recommended route
├─ Live tracking: Auto-centers on ambulance if enabled
└─ Navigation button: Opens native maps app for turn-by-turn

UPDATE FREQUENCY:
├─ Child location: Every 2 seconds (from GPS/eSIM)
├─ Ambulance location: Every 3 seconds (from dispatch system)
├─ Traffic: Every 30 seconds (from Google Traffic API)
└─ Route recalculation: If traffic delays >2 minutes ETA
`

**Performance targets**:
- Initial load: <2 seconds
- Marker update: <100ms from source to screen
- Route calculation: <500ms
- Pan/zoom: 60fps smooth

### Feature 3: Hospital Recommendation & Routing

**Smart hospital selection**:
`
RECOMMENDATION CARD:
┌──────────────────────────────────────┐
│ 🏥 RECOMMENDED HOSPITAL              │
│ APOLLO HOSPITAL (Trauma Center)      │
│ Distance: 8 min drive                │
│ Beds Available: 3 Trauma beds        │
│ Pediatric Team: On duty             │
│ Special note: "Patient allergy info │
│ available for emergency team"        │
│ [Accept Route] [View Alternatives]  │
└──────────────────────────────────────┘

ALTERNATIVE HOSPITALS:
├─ Yashoda Hospital: 11 min drive
├─ CARE Hospital: 14 min drive
└─ City General: 18 min drive

RESPONDER ACTIONS:
├─ [Accept] - Route ambulance to this hospital
├─ [Change] - Select different hospital (reason logged)
├─ [Call] - Contact hospital directly
└─ [Details] - View full hospital capabilities
`

### Feature 4: Real-time Vitals Monitoring

**Vital display**:
`
VITALS CARD (Updates every 10 seconds):
├─ Heart Rate: 125 BPM ⬆️ (trending up, concerning)
│  └─ Graph: Last 5 minutes shown as sparkline
│
├─ Temperature: 36.8°C (normal)
│  └─ Graph: Last 5 minutes shown as sparkline
│
├─ Respiratory Rate: (if available from smartwatch)
│
├─ Oxygen Saturation: (if available)
│
└─ Data confidence: 92% (ML model certainty)

ALERTS:
├─ If HR > 140: Visual alert "⚠️ ELEVATED HEART RATE"
├─ If Temp > 38.5°C: Visual alert "⚠️ FEVER DETECTED"
├─ If vitals unavailable >30s: "⚠️ SIGNAL LOST - LTE attempt"
└─ All alerts: Sound + visual + haptic feedback
`

### Feature 5: Direct Communication

**Parent call interface**:
`
INCOMING CALL FROM PARENT:
├─ Display: "Mom is calling"
├─ Options: [Accept] [Decline] [Send Message]
├─ Auto-record: All calls recorded for medical records
└─ Transcription: Real-time speech-to-text (optional)

CALL ACTIVE:
├─ Speaker: Audio output with volume control
├─ Mute: Option to mute ambulance side (not recording)
├─ Transfer: Option to transfer call to hospital
├─ Notes: Quick note-taking during call
└─ Call log: Call history with timestamps

DISPATCH-TO-RESPONDER MESSAGE:
├─ "Change route to CARE Hospital (better bed availability)"
├─ Delivery: Instant, with sound alert
├─ Acknowledgment: Responder must confirm
└─ Log: All messages saved to incident report
`

### Feature 6: Child Medical History

**Pre-incident intelligence**:
`
MEDICAL PROFILE (if available in system):
├─ Allergies: Penicillin (ALERT: RED background), Peanuts
├─ Medications: None current
├─ Medical conditions: Mild asthma (well-controlled)
├─ Previous trauma: Fractured arm (age 6, healed)
├─ Blood type: O+
├─ Emergency contacts: Mom, Dad, Grandma
├─ Behavior notes: "Anxious in stressful situations"
├─ Communication preferences: "Child responds well to calm voice"
└─ Last health checkup: 3 months ago (normal)

CRITICAL ALERTS:
├─ 🔴 Penicillin allergy (shown prominently)
├─ 🟡 Asthma history (monitor respiratory rate)
└─ 🟢 O+ blood type (immediately available for transfusion if needed)

SOURCE NOTE: "Data from parent emergency profile. Accuracy: High (updated 2 months ago)"
`

## Data & API Requirements

### Incident Notification Payload

`json
{
  "incident_id": "incident_uuid_v4",
  "timestamp": 1699564800000,
  "severity": "moderate",
  "incident_type": "transportation_accident",
  "child": {
    "id": "child_uuid_v4",
    "name": "Aarav Kumar",
    "age": 8,
    "gender": "M",
    "photo_url": "https://cdn.roadsos.com/photos/aarav.jpg"
  },
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "accuracy_meters": 8.5,
    "address": "School Bus Route #42, Bangalore"
  },
  "vitals": {
    "heart_rate": 125,
    "temperature": 36.8,
    "last_update": 1699564799000,
    "confidence": 0.92
  },
  "parent": {
    "name": "Priya Kumar",
    "phone": "+91 98765 43210",
    "status": "en_route_to_hospital"
  },
  "recommended_hospital": {
    "id": "hospital_apollo_1",
    "name": "Apollo Hospital",
    "type": "trauma_center",
    "distance_km": 3.1,
    "eta_minutes": 8,
    "bed_availability": 3
  }
}
`

### Real-time Vitals Endpoint

`
WebSocket: GET /ws/responder/incident/{incident_id}/vitals
Updates every 10 seconds:
{
  "msg_type": "vitals_update",
  "incident_id": "incident_uuid_v4",
  "timestamp": 1699564800000,
  "vitals": {
    "heart_rate": 125,
    "heart_rate_trend": "increasing",
    "temperature": 36.8,
    "status_alerts": [
      "HR_ELEVATED"
    ]
  }
}
`

## Performance & Scalability

### Response Time Requirements
- Incident notification: <2 seconds
- Dashboard load: <1 second
- Vital update: <500ms
- Route calculation: <1 second
- Hospital lookup: <200ms

### Concurrent Capacity
- Responders: 10,000+ concurrent
- Incidents: 1,000+ concurrent
- Data updates: 100,000+ per second

## Success Metrics

### Innovation (Target: 90+ points)
- Real-time child vital sign monitoring
- AI-powered hospital routing
- Parent-responder integrated communication
- Mobile-optimized for vehicles

### Technical Excellence (Target: 95+ points)
- 99.9% uptime during emergencies
- <500ms real-time updates
- Offline capability for disconnected areas
- Cross-platform support (iOS, Android, Web)

### User Impact (Target: 95+ points)
- Responder decision-making time reduced by 50%
- Hospital selection accuracy >95%
- Parent confidence in response increases by 80%+
- Measurable improvement in emergency outcomes

---

**Document Version:** 1.0
**Last Updated:** [CURRENT_DATE]
**Target Audience:** First responders, emergency dispatch, product managers
**Next Document:** 08_EMERGENCY_RESPONSE_DASHBOARD_PDC.md
