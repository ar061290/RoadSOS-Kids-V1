# 05_PARENT_COMMAND_CENTER_PDC - PRODUCT DESIGN CONCEPT

## System Architecture Overview

### Component Diagram
`
PARENT COMMAND CENTER ARCHITECTURE

┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND LAYER (Multi-platform)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ iOS App      │  │ Android App  │  │ Web Browser  │           │
│  │ (React       │  │ (React       │  │ (React/Vue   │           │
│  │ Native)      │  │ Native)      │  │ + Vite)      │           │
│  │              │  │              │  │              │           │
│  │ • Maps       │  │ • Maps       │  │ • Maps       │           │
│  │ • Dashboard  │  │ • Dashboard  │  │ • Dashboard  │           │
│  │ • Messaging  │  │ • Messaging  │  │ • Messaging  │           │
│  └────────┬─────┘  └────────┬─────┘  └────────┬─────┘           │
│           │                 │                  │                 │
│           └─────────────────┼──────────────────┘                 │
│                             │                                    │
│                    ┌────────▼────────┐                           │
│                    │ API Client      │                           │
│                    │ (Axios + WS)    │                           │
│                    │ • Auth layer    │                           │
│                    │ • Cache layer   │                           │
│                    │ • Offline queue │                           │
│                    └────────┬────────┘                           │
│                             │                                    │
└─────────────────────────────┼────────────────────────────────────┘
                              │ HTTPS + WebSocket
                              │ (TLS 1.3)
┌─────────────────────────────┼────────────────────────────────────┐
│  BACKEND API LAYER                                               │
├─────────────────────────────┼────────────────────────────────────┤
│                             ▼                                    │
│              ┌──────────────────────────┐                        │
│              │ API Gateway              │                        │
│              │ (Nginx + Rate Limit)     │                        │
│              └─────────────┬────────────┘                        │
│                            │                                    │
│         ┌──────────────────┼──────────────────┐                │
│         ▼                  ▼                  ▼                │
│    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│    │ Parent      │  │ Emergency   │  │ Map/Routing │        │
│    │ Service     │  │ Service     │  │ Service     │        │
│    │ (FastAPI)   │  │ (FastAPI)   │  │ (FastAPI)   │        │
│    │             │  │             │  │             │        │
│    │ • Auth      │  │ • Dispatch  │  │ • Distance  │        │
│    │ • Profile   │  │ • Tracking  │  │ • Traffic   │        │
│    │ • Message   │  │ • Status    │  │ • Hospital  │        │
│    │   Queue    │  │   Updates   │  │   Selection │        │
│    └────────┬────┘  └────────┬────┘  └────────┬────┘        │
│             │                │               │               │
│             └────────────────┼───────────────┘               │
│                              │                              │
│                      ┌───────▼────────┐                     │
│                      │ WebSocket      │                     │
│                      │ Manager        │                     │
│                      │ (Real-time)    │                     │
│                      └───────┬────────┘                     │
│                              │                              │
└──────────────────────────────┼──────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────┐
│  PERSISTENCE LAYER                                           │
├──────────────────────────────┼──────────────────────────────┤
│                              │                              │
│  ┌─────────────┐    ┌────────▼─────────┐                  │
│  │ PostgreSQL  │    │ Redis Cache      │                  │
│  │ Database    │    │ (Real-time data) │                  │
│  │             │    │                  │                  │
│  │ • Parent    │    │ • Session tokens │                  │
│  │   profiles  │    │ • Location cache │                  │
│  │ • Emergency │    │ • Message queue  │                  │
│  │   history   │    │ • Rate limits    │                  │
│  │ • Messages  │    └──────────────────┘                  │
│  │ • Hospital  │                                           │
│  │   data      │    ┌──────────────────┐                  │
│  └─────────────┘    │ S3 Storage       │                  │
│                     │ (Media files)    │                  │
│                     │                  │                  │
│                     │ • Voice messages │                  │
│                     │ • Photos         │                  │
│                     │ • History export │                  │
│                     └──────────────────┘                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
`

### Data Flow During Emergency

`
EMERGENCY DETECTION TO PARENT NOTIFICATION:

1. Innerwear Impact (T=0ms)
   └─ Sends: {impact_data, location, vitals} via eSIM

2. Backend Emergency Service (T=50ms)
   └─ Receives: Impact data
   └─ Assesses: Severity algorithm (ML model)
   └─ Output: {severity: "moderate", confidence: 0.92}

3. Parent Service - Message Queue (T=100ms)
   └─ Event: "Emergency detected"
   └─ Action: Queue notification
   └─ Destination: Firebase Cloud Messaging (FCM)

4. FCM Push Gateway (T=150ms)
   └─ Receives: Notification payload
   └─ Route: iOS APNs + Android FCM
   └─ Sends: High-priority notification

5. Parent Device (T=200-3000ms)
   └─ Receives: Push notification
   └─ Sound: High-volume alert (if not silent mode)
   └─ Vibration: 3-second pulse pattern
   └─ Action: Parent taps notification

6. Parent App Loads Dashboard (T=500-2000ms)
   └─ Requests: GET /parent/emergency/status
   └─ Receives: Real-time state snapshot
   └─ Renders: Dashboard with live data
   └─ Establishes: WebSocket connection

7. WebSocket Real-time Stream (T=3000ms onward)
   └─ Parent: Receives updates every 5-10 seconds
   └─ Ambulance position: Updates every 5s
   └─ Child vitals: Updates every 30s
   └─ Status messages: Real-time

TOTAL LATENCY TARGET: <5 seconds (step 1 to step 6 completion)
`

## Technology Stack

### Frontend

**Web (Primary UI Framework)**:
- Framework: React 18+ with TypeScript
- Build tool: Vite (fast development)
- State management: Redux Toolkit or Zustand
- Styling: Tailwind CSS + shadcn/ui
- Real-time: Socket.io client library
- Maps: Mapbox GL JS or Google Maps JS API
- Charts: Recharts or Chart.js

**Mobile (Cross-platform)**:
- Framework: React Native with TypeScript
- Navigation: React Navigation (stack, tab, drawer)
- Real-time: Socket.io for React Native
- Maps: React Native Maps (native iOS/Android components)
- Storage: AsyncStorage (local persistence) + MMKV (faster alternative)
- Notifications: Firebase Cloud Messaging (FCM)

**Web Deployment**:
- Hosting: Vercel (automatic deployment on git push)
- CDN: Vercel Edge Network (global distribution)
- Domain: roadsos.com
- DNS: Cloudflare

**Mobile Deployment**:
- iOS: App Store (through TestFlight first)
- Android: Google Play Store (through Play Console)
- CI/CD: GitHub Actions (build on commit)

### Backend

**Framework**: FastAPI (Python 3.10+)
- Reason: Fast, async-native, automatic OpenAPI docs

**Key libraries**:
- async: aiohttp (for external API calls)
- database: SQLAlchemy ORM + asyncpg (PostgreSQL driver)
- caching: redis + aioredis
- validation: Pydantic v2
- auth: python-jose (JWT handling)
- real-time: Python-socketio + python-engineio

**Deployment**:
- Container: Docker with multi-stage builds
- Orchestration: Kubernetes (EKS on AWS)
- Load balancing: AWS ALB (Application Load Balancer)
- Auto-scaling: AWS Auto Scaling Group

### Database

**Primary**: PostgreSQL 14+
- Reason: ACID compliance, advanced types, scalability

**Schema highlights**:
`sql
-- Parents table
CREATE TABLE parents (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  phone VARCHAR,
  password_hash VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Emergency sessions
CREATE TABLE emergency_sessions (
  id UUID PRIMARY KEY,
  child_id UUID NOT NULL,
  parent_id UUID NOT NULL,
  started_at TIMESTAMP NOT NULL,
  resolved_at TIMESTAMP,
  severity_level INTEGER,
  impact_location POINT,  -- PostgreSQL POINT type for GPS
  ambulance_unit_id VARCHAR,
  hospital_id UUID,
  PRIMARY KEY (id)
);

-- Location history (time-series)
CREATE TABLE location_events (
  id BIGSERIAL PRIMARY KEY,
  emergency_session_id UUID NOT NULL,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  accuracy_meters NUMERIC(5,2),
  timestamp TIMESTAMP NOT NULL,
  FOREIGN KEY (emergency_session_id) REFERENCES emergency_sessions(id)
);

CREATE INDEX idx_location_timestamp ON location_events(emergency_session_id, timestamp DESC);
`

**Caching**: Redis for:
- Session tokens
- Real-time location cache (expires 10 seconds)
- Message queues
- Rate limiting counters

### External Integrations

**Maps & Routing**:
- Primary: Google Maps API (Distance Matrix, Directions, Geocoding)
- Fallback: Mapbox API
- Cost optimization: Batch queries, caching

**Emergency Services**:
- Ambulance dispatch: Integration with local EMS dispatch systems (varies by country)
- Alternative: SMS/phone API (Twilio) for manual dispatch

**Push Notifications**:
- Firebase Cloud Messaging (FCM) for Android
- APNs (Apple Push Notification service) for iOS
- Unified via Firebase Admin SDK

**Payment** (optional, for premium features):
- Stripe API (if monetization needed)

## State Management Architecture

### Parent App State Model

`
STATE TREE:

root
├─ auth
│  ├─ isAuthenticated: boolean
│  ├─ user: { id, email, name, photo }
│  ├─ token: string (JWT)
│  ├─ refreshToken: string
│  └─ tokenExpiresAt: timestamp
│
├─ children
│  ├─ byId: {
│  │    "child_uuid_1": {
│  │      id, name, age, photo, relationship
│  │    }
│  │  }
│  └─ allIds: ["child_uuid_1", "child_uuid_2"]
│
├─ emergency
│  ├─ active: boolean
│  ├─ currentEmergency: {
│  │    id, childId, startedAt,
│  │    severity, stage,
│  │    child: { name, location, vitals },
│  │    ambulance: { distance, eta, speed, unitId },
│  │    hospital: { id, name, eta }
│  │  }
│  ├─ emergencyHistory: [ /* past emergencies */ ]
│  └─ events: [ /* timeline events */ ]
│
├─ map
│  ├─ center: { lat, lng }
│  ├─ zoom: number (3-20)
│  ├─ layers: {
│  │    showAmbulances: boolean,
│  │    showHospitals: boolean,
│  │    showTraffic: boolean
│  │  }
│  └─ markers: {
│  │    child: { id, lat, lng, type: "child" },
│  │    ambulance: [ { id, lat, lng, bearing } ],
│  │    hospital: { id, lat, lng }
│  │  }
│
├─ communication
│  ├─ messages: [ /* all messages */ ]
│  ├─ messageQueue: [ /* unsent messages */ ]
│  └─ responderInfo: {
│  │    name, badge, phone, canCall: boolean
│  │  }
│
├─ ui
│  ├─ currentScreen: "dashboard" | "map" | "timeline" | "hospital_info"
│  ├─ isLoading: boolean
│  ├─ error: null | string
│  └─ notifications: [ /* toast/banner messages */ ]
│
└─ connectivity
   ├─ isOnline: boolean
   ├─ wsConnected: boolean
   └─ lastUpdate: timestamp
`

### Redux Actions (example key actions)

`	ypescript
// Emergency actions
const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    setEmergencyActive: (state, action) => {
      state.active = true;
      state.currentEmergency = action.payload;
    },
    updateAmbulancePosition: (state, action) => {
      state.currentEmergency.ambulance.distance = action.payload.distance;
      state.currentEmergency.ambulance.eta = action.payload.eta;
    },
    updateChildVitals: (state, action) => {
      state.currentEmergency.child.vitals = action.payload;
    },
    addTimelineEvent: (state, action) => {
      state.events.push(action.payload);
    },
    resolveEmergency: (state, action) => {
      state.active = false;
      state.emergencyHistory.push({
        ...state.currentEmergency,
        resolvedAt: action.payload.resolvedAt
      });
      state.currentEmergency = null;
    }
  }
});
`

## Real-time Data Pipeline

### WebSocket Message Processing

`	ypescript
// Parent app WebSocket message handler

async function handleWebSocketMessage(message: WSMessage) {
  switch (message.msg_type) {
    case "state_update":
      // Update Redux store
      dispatch(updateAmbulancePosition(message.data.ambulance));
      dispatch(updateChildVitals(message.data.vitals));
      
      // Update map markers
      updateMapMarkers(message.data);
      
      // Refresh UI
      redrawDashboard();
      break;
      
    case "event_notification":
      // Add to timeline
      dispatch(addTimelineEvent(message.data.event));
      
      // Show toast notification
      showToast(message.data.event.description, 'info');
      break;
      
    case "ambulance_arrived":
      // Change UI state
      dispatch(setUIScreen('responder_arrived'));
      
      // Play celebration sound
      playSound('ambulance_arrived.mp3');
      
      // Update dashboard
      showResponderDetails(message.data.responder);
      break;
      
    case "heartbeat":
      // Server ping - respond with pong
      sendHeartbeatAck();
      break;
  }
}
`

### Offline Message Queuing

`	ypescript
// Store unsent messages in AsyncStorage

class MessageQueue {
  private queue: Message[] = [];
  
  async queueMessage(msg: Message) {
    this.queue.push({
      ...msg,
      queued_at: Date.now(),
      retry_count: 0
    });
    
    // Persist to AsyncStorage
    await AsyncStorage.setItem(
      'pending_messages',
      JSON.stringify(this.queue)
    );
  }
  
  async syncPendingMessages(wsConnected: boolean) {
    if (!wsConnected || this.queue.length === 0) return;
    
    for (const msg of this.queue) {
      try {
        const response = await api.post('/messages/send', msg);
        
        if (response.status === 201) {
          // Remove from queue
          this.queue = this.queue.filter(m => m.id !== msg.id);
        }
      } catch (error) {
        msg.retry_count++;
        if (msg.retry_count >= 3) {
          // Give up after 3 retries
          this.queue = this.queue.filter(m => m.id !== msg.id);
        }
      }
    }
    
    // Update storage
    await AsyncStorage.setItem(
      'pending_messages',
      JSON.stringify(this.queue)
    );
  }
}
`

## API Communication Layer

### HTTP Request Interceptor Pattern

`	ypescript
// Automatically refresh JWT tokens and retry requests

const apiClient = axios.create({
  baseURL: 'https://api.roadsos.com',
  timeout: 10000
});

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If 401 and we haven't retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await getRefreshToken();
        const response = await axios.post(
          'https://api.roadsos.com/auth/refresh',
          { refresh_token: refreshToken }
        );
        
        const newToken = response.data.access_token;
        await storeToken(newToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = \Bearer \\;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
`

## Performance Optimization

### Image Optimization
- Child photo: Compressed to <200KB JPEG
- Thumbnails: <50KB WebP format
- Lazy loading: Load images only when visible

### API Response Caching
`	ypescript
// Cache GET requests with 5-minute TTL

const cacheConfig = {
  'GET /parent/emergency/status': 5000, // 5s for real-time
  'GET /hospitals': 300000, // 5 minutes
  'GET /parent/profile': 600000 // 10 minutes
};

// Use react-query or SWR for automatic caching
const { data, isLoading } = useQuery(
  ['emergency', childId],
  () => api.get('/parent/emergency/status'),
  { staleTime: 5000 } // Refetch after 5 seconds
);
`

### Bundle Size Optimization
- Code splitting: Separate chunks for each main screen
- Dynamic imports: Load emergency screen only when needed
- Tree-shaking: Remove unused dependencies
- Target: <500KB main bundle (gzipped)

---

**Document Version:** 1.0
**Target Audience:** Backend architects, frontend leads, DevOps engineers
**Next Document:** 06_PARENT_COMMAND_CENTER_UIUX.md
