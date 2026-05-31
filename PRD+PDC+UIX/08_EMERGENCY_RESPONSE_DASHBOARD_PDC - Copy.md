# 08_EMERGENCY_RESPONSE_DASHBOARD_PDC - PRODUCT DESIGN CONCEPT

## System Architecture for Responder Dashboard

### High-Level Architecture
`
RESPONDER DASHBOARD ARCHITECTURE

┌────────────────────────────────────────┐
│  RESPONDER DEVICES (Tablet/Laptop)    │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Emergency Response Dashboard     │ │
│  │ (React/Vue)                      │ │
│  │ • Incident alert                 │ │
│  │ • Live vitals monitoring         │ │
│  │ • Maps & routing                 │ │
│  │ • Communication interface        │ │
│  └──────────────────────────────────┘ │
│  ↓                                     │
│  ┌──────────────────────────────────┐ │
│  │ Offline Cache (Service Worker)   │ │
│  │ • Last incident state            │ │
│  │ • Medical history cache          │ │
│  │ • Hospital directory             │ │
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
         ↓ HTTPS + WebSocket
┌────────────────────────────────────────┐
│  BACKEND API LAYER                     │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ API Gateway + Authentication    │ │
│  │ (Rate limiting, auth, routing)   │ │
│  └──────────────────────────────────┘ │
│           ↓                            │
│  ┌──────────────────────────────────┐ │
│  │ Responder Service (FastAPI)     │ │
│  │ • Incident details              │ │
│  │ • Vitals streaming              │ │
│  │ • Hospital routing              │ │
│  └──────────────────────────────────┘ │
│           ↓                            │
│  ┌──────────────────────────────────┐ │
│  │ WebSocket Manager               │ │
│  │ (Real-time vitals, status)       │ │
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  DATA SOURCES                          │
├────────────────────────────────────────┤
│ • Child vitals (from innerwear)       │
│ • Location (GPS from innerwear)        │
│ • Parent profile (PostgreSQL)          │
│ • Hospital directory (PostgreSQL)      │
│ • Traffic data (Google Maps API)       │
└────────────────────────────────────────┘
`

## Technology Stack

### Frontend
- Framework: React 18 or Vue 3 (choose for code generation)
- State: Redux Toolkit or Pinia
- Styling: Tailwind + shadcn/ui
- Maps: Mapbox GL JS
- Real-time: Socket.io client
- Offline: Workbox (Service Worker)

### Backend
- Framework: FastAPI (Python 3.10+)
- Async: asyncio + aiohttp
- Database: PostgreSQL + Redis
- Maps: Google Maps API / Mapbox API
- Authentication: JWT + OAuth 2.0
- Real-time: python-socketio

### Deployment
- Container: Docker
- Orchestration: Kubernetes
- Load balancer: AWS ALB
- CDN: CloudFront

## Data Flow Architecture

### Incident Dispatch Flow
`
1. Child detects impact (innerwear)
   └─ Sends: acceleration data

2. Backend processes emergency
   └─ Outputs: incident_id, severity

3. Dispatch center receives incident
   └─ Notification with initial data

4. Dispatch assigns ambulance
   └─ Sends: ambulance_id, ambulance_location

5. Responder tablet receives assignment
   └─ Displays: Incident details, recommended hospital

6. Responder WebSocket connects
   ├─ Subscribes to: incident_id
   ├─ Receives: Vitals every 10 seconds
   ├─ Receives: Location every 2 seconds
   └─ Receives: Status updates (real-time)

7. Responder accepts incident
   └─ Sends: Status "en_route"
   └─ Backend: Notifies parent "ambulance on the way"

8. Responder arrives at hospital
   ├─ Sends: Status "at_hospital"
   ├─ Hospital: Receives incident with vitals history
   └─ Parent: Receives notification "child at hospital"
`

### Offline Resilience

`
Normal operation:
  Responder → Internet → Backend → Updates

Connection lost:
  1. Detect loss (WebSocket disconnect)
  2. Switch to HTTP fallback (every 30 seconds)
  3. Cache last known incident state
  4. Queue outgoing messages
  5. Show "offline" indicator
  6. Continue showing cached vitals (labeled as stale)

Connection restored:
  1. Re-establish WebSocket
  2. Sync queued messages
  3. Request full state update
  4. Resume real-time updates
  5. Remove "offline" indicator
`

## State Machine for Responder Dashboard

`
INITIAL
  ↓
[Waiting for incident]
  ├─ State: IDLE
  ├─ Display: "Waiting for incident..."
  └─ Event: Incident notification received
     ↓
[Incident received]
  ├─ State: INCIDENT_RECEIVED
  ├─ Display: Quick facts card
  ├─ Data: Child ID, incident severity, location
  └─ Event: Responder accepts incident
     ↓
[En route to child]
  ├─ State: EN_ROUTE
  ├─ Display: Map with live tracking, vitals
  ├─ Update freq: Every 2-5 seconds
  ├─ Data: Child location, ambulance location, ETA
  └─ Event: Responder arrives at child
     ↓
[On scene]
  ├─ State: ON_SCENE
  ├─ Display: Child vitals, medical history, parent contact
  ├─ Update freq: Every 1 second (higher urgency)
  ├─ Data: Full vitals, real-time child response
  └─ Event: Responder confirms transport to hospital
     ↓
[Transporting]
  ├─ State: TRANSPORTING
  ├─ Display: Hospital routing, vitals, parent comms
  ├─ Update freq: Every 5 seconds (reduced battery impact)
  ├─ Data: Route, hospital details, traffic updates
  └─ Event: Responder arrives at hospital
     ↓
[At hospital]
  ├─ State: AT_HOSPITAL
  ├─ Display: Hospital info, handoff data, incident report
  └─ Event: Responder ends transport
     ↓
[Incident completed]
  ├─ State: COMPLETED
  ├─ Display: Incident summary, export options
  └─ Return to IDLE
`

## API Endpoints for Responder Dashboard

### GET /responder/incident/{incident_id}
`
Request:
  Headers: Authorization: Bearer JWT
  
Response (200):
  {
    "incident_id": "uuid",
    "created_at": 1699564800000,
    "severity": "moderate",
    "child": {
      "name": "Aarav Kumar",
      "age": 8,
      "photo_url": "https://..."
    },
    "location": {
      "latitude": 12.9716,
      "longitude": 77.5946
    },
    "vitals": {
      "heart_rate": 125,
      "temperature": 36.8
    },
    "parent": {
      "name": "Priya Kumar",
      "phone": "+91 98765 43210"
    },
    "recommended_hospital": {
      "name": "Apollo Hospital",
      "distance_km": 3.1,
      "eta_minutes": 8
    }
  }

Cache: 0 seconds (always fresh)
Retry: Exponential backoff
`

### WebSocket /ws/responder/incident/{incident_id}/stream
`
Subscribe to real-time updates:
  GET /ws/responder/incident/incident_uuid/stream?token=JWT HTTP/1.1
  Upgrade: websocket

Receive messages:
  {
    "msg_type": "vitals_update",
    "timestamp": 1699564800000,
    "data": {
      "heart_rate": 125,
      "temperature": 36.8,
      "location": {
        "latitude": 12.9716,
        "longitude": 77.5946
      }
    }
  }

Frequency: Every 2-10 seconds (adaptive based on state)
`

## Performance Optimization

### Bundle Size
- Target: <600KB gzipped
- Technique: Code splitting by screen, tree-shaking, lazy loading

### Network
- Compression: gzip/brotli for all responses
- Caching: Browser cache headers, service worker cache
- Batching: Combine multiple requests when possible

### Rendering
- Virtual scrolling: For long lists
- Memoization: React.memo for expensive components
- Time slicing: Render non-critical components later

### Battery (for tablet in vehicle)
- WebSocket: Longer intervals in TRANSPORTING state
- Screen: Brightness auto-adjust, screen sleep after 10 min
- CPU: CPU throttling when not actively used

## Security Architecture

### Authentication
- JWT tokens with 15-minute expiry
- Refresh tokens for extended sessions
- MFA recommended for dispatch centers

### Authorization
- Responder can only see assigned incidents
- Dispatch can see all incidents in their jurisdiction
- Role-based access control (RBAC)

### Data Protection
- TLS 1.3 for all communications
- AES-256 encryption at rest
- HIPAA compliance

### Audit Logging
- All access logged with timestamp, user, action
- Retention: 7 years for compliance

---

**Document Version:** 1.0
**Target Audience:** Backend architects, security engineers
**Next Document:** 09_EMERGENCY_RESPONSE_DASHBOARD_UIUX.md
