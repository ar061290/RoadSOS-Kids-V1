# 02_CHILD_WATCH_DEVICE_PDC - PRODUCT DESIGN CONCEPT

## Executive Summary
The Child Watch Device PDC describes the comprehensive technical architecture, design patterns, system interactions, and implementation strategies for the smartwatch interface that enables children to interact with the RoadSoS emergency system. This document provides the blueprint for how the watch communicates with the Smart Innerwear, backend systems, and how it delivers reassurance while maintaining reliability during emergencies.

## Architecture Overview

### System Architecture Diagram
`
┌─────────────────────────────────────────────────────────────────┐
│ ROADSOS KIDS WATCH DEVICE ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐         ┌──────────────────┐               │
│  │ Smart Innerwear │◄────BLE─►│  Child Watch     │               │
│  │   (Primary)     │          │   Device         │               │
│  │                 │          │                  │               │
│  │ • Impact Detect │          │ • Screen UI      │               │
│  │ • Vital Sensors │          │ • Voice Input    │               │
│  │ • AI Chatbot    │          │ • Audio Output   │               │
│  │ • GPS           │          │ • Touch Input    │               │
│  │ • eSIM/WiFi     │          │ • Haptics        │               │
│  └────────┬────────┘          └────────┬─────────┘               │
│           │                            │                         │
│           │          BLE/HTTP/WebSocket│                         │
│           └────────────────┬───────────┘                         │
│                            ▼                                      │
│                   ┌─────────────────────────┐                    │
│                   │  RoadSoS Backend        │                    │
│                   │  (FastAPI)              │                    │
│                   │                         │                    │
│                   │ • State Management      │                    │
│                   │ • AI Routing Engine     │                    │
│                   │ • Emergency Dispatch    │                    │
│                   │ • WebSocket Broadcast   │                    │
│                   └─────────┬───────────────┘                    │
│                             │                                    │
│        ┌────────────────────┼────────────────────┐               │
│        ▼                    ▼                    ▼               │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐        │
│  │   Parent     │   │  Emergency   │   │   External   │        │
│  │  Dashboard   │   │  Responder   │   │   Services   │        │
│  │              │   │  Dashboard   │   │              │        │
│  └──────────────┘   └──────────────┘   └──────────────┘        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
`

### Component Interaction Model

**Watch ◄──► Innerwear (BLE Communication)**
- Protocol: Bluetooth Low Energy 5.2+
- Frequency: 2.4 GHz with frequency hopping
- Max Range: 240 meters (open space)
- Connection Establishment: <500ms
- Data Rate: 1-2 Mbps in connected mode
- Power Mode: Optimized for child device battery life (48+ hour target)

**Watch ◄──► Backend (Primary: BLE Pass-through via Innerwear, Secondary: Direct HTTP/WebSocket)**
- Primary Path: Watch → Innerwear (BLE) → Backend (eSIM/WiFi)
- Fallback Path: Watch → WiFi/LTE → Backend (if available)
- Protocol: WebSocket for real-time updates; HTTP REST for transactional
- Authentication: JWT tokens with 15-minute refresh
- Encryption: TLS 1.3 end-to-end

## Data Flow Architecture

### Emergency Detection Flow - Data Choreography

**Timeline & Data Movement:**
`
T=0.0s:   Innerwear accelerometer captures impact
          |
          Data: {x: 45.2, y: -38.5, z: -52.1} m/s²
          
T=0.05s:  Impact detection algorithm runs locally
          |
          Data: {magnitude: 78.3, threshold: 50, triggered: true}
          
T=0.1s:   Innerwear emits BLE notification to Watch
          |
          BLE Packet: {event: "impact_detected", severity: "pending", timestamp: 1699564800000}
          
T=0.15s:  Watch receives notification, triggers UI state change
          |
          State: {screen: "impact_detected", severity: "pending", voice_enabled: true}
          
T=0.2s:   Watch displays emergency screen with haptic feedback
          |
          Haptics: 3 short bursts (100ms each)
          Audio: Alert tone (95dB, 500-1000Hz frequency sweep)
          
T=0.5s:   Backend AI assessment completes
          |
          Data: {severity: "moderate", recommended_action: "ambulance_dispatch"}
          
T=1.0s:   Watch receives updated state from backend via WebSocket
          |
          Update: {severity: "moderate", eta_ambulance: "7 minutes", message: "Help is coming"}
          
T=1.5s:   Watch plays voice message: "An ambulance is on the way to help you."
          |
          Audio: 2s message at 85dB
          
T=2.0s:   Voice Assistant activates for child interaction
          |
          Prompt: "Can you tell me where it hurts?"
          Listening for 30s max
`

### Data Structures for Core Operations

**BLE Advertisement Packet (from Innerwear to Watch):**
`json
{
  "event_type": "impact_detected",
  "timestamp": 1699564800123,
  "severity_level": 0-5,
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "accuracy_meters": 8.5,
    "altitude": 645.2,
    "altitude_accuracy": 3.0
  },
  "vitals": {
    "heart_rate": 125,
    "heart_rate_confidence": 0.92,
    "skin_temperature": 36.8,
    "temperature_trend": "stable"
  },
  "acceleration": {
    "x": 45.2,
    "y": -38.5,
    "z": -52.1,
    "magnitude": 78.3
  },
  "innerwear_battery": 78,
  "ble_signal_strength": -45,
  "device_id": "innerwear_abc123xyz",
  "watch_id_target": "watch_def456uvw"
}
`

**Watch State Update Payload (from Backend to Watch):**
`json
{
  "state_id": "state_uuid_v4",
  "update_timestamp": 1699564801500,
  "emergency_status": {
    "is_active": true,
    "severity": "moderate",
    "stage": "ambulance_dispatched",
    "message": "An ambulance is coming to help you.",
    "estimated_arrival_seconds": 420,
    "confidence": 0.95
  },
  "actions_available": [
    {
      "id": "action_talk",
      "label": "Talk to helper",
      "icon": "microphone",
      "enabled": true,
      "priority": 1
    },
    {
      "id": "action_help_info",
      "label": "What to do",
      "icon": "question",
      "enabled": true,
      "priority": 2
    }
  ],
  "parent_status": {
    "notified": true,
    "responding": true,
    "contact_available": true
  }
}
`

## State Machine Design

### Watch Application State Machine

`
State Diagram with Transitions:

[IDLE]
  ├─ Condition: Normal operation, no emergency
  ├─ UI: Clock, basic info
  ├─ Actions: Accept taps, manage brightness
  │
  ├─ Event: BLE notification from innerwear
  └─► [IMPACT_DETECTED]
       │
       ├─ Condition: Impact detected, severity pending
       ├─ UI: Flashing alert, haptic feedback, sound
       ├─ Duration: 2-5 seconds max
       │
       ├─ Event: Severity confirmed as emergency
       └─► [EMERGENCY_ACTIVE]
            │
            ├─ Condition: Emergency confirmed, response initiated
            ├─ UI: Emergency screen with info, voice interaction
            ├─ Actions: Talk button, info button, parent contact
            │
            ├─ Event: Parent/responder confirms resolution
            └─► [POST_EMERGENCY_CARE]
                 │
                 ├─ Condition: Emergency over, transition phase
                 ├─ UI: Calm blue, reassurance messages
                 ├─ Duration: 5-10 minutes
                 │
                 ├─ Event: User dismisses, or auto-timeout
                 └─► [IDLE]
       │
       ├─ Event: False alarm (acceleration <50 m/s²) detected
       └─► [IDLE]

[EMERGENCY_ACTIVE] (Detailed Substates)
  ├─ [EA_AWAITING_RESPONDER]
  │  ├─ Duration: Until ambulance ~1 min away
  │  ├─ Updates: ETA countdown every 10 seconds
  │  └─ Voice: Periodic reassurance "Help is on the way"
  │
  ├─ [EA_RESPONDER_ARRIVING]
  │  ├─ Duration: Final 60 seconds
  │  ├─ Updates: ETA countdown every 1 second
  │  ├─ Voice: "Help is almost here, look for the ambulance"
  │  └─ Visual: Pulsing red indicator
  │
  └─ [EA_RESPONDER_ARRIVED]
     ├─ Duration: Until responder indicates resolution
     ├─ UI: Ambulance icon, responder contact option
     └─ Voice: "The ambulance has arrived. They will help you now."
`

### State Transition Logic (Code-Like Pseudocode)

`python
class WatchStateManager:
    def __init__(self):
        self.current_state = "IDLE"
        self.state_entered_at = time.time()
        self.emergency_metadata = {}
        
    def handle_ble_notification(self, notification):
        """Called when innerwear sends BLE packet"""
        if notification.magnitude > 50:
            self.transition_to("IMPACT_DETECTED")
            self.emergency_metadata = notification.parse()
            self.play_alert_sequence()
        else:
            # False alarm, ignore
            pass
    
    def transition_to(self, new_state):
        """Handle state machine transitions"""
        exit_actions = self.get_exit_actions(self.current_state)
        execute_all(exit_actions)
        
        self.current_state = new_state
        self.state_entered_at = time.time()
        
        entry_actions = self.get_entry_actions(new_state)
        execute_all(entry_actions)
        
        self.schedule_ui_update()
    
    def get_entry_actions(self, state):
        """Map state to entry behaviors"""
        actions = {
            "IMPACT_DETECTED": [
                ("haptic", {"pattern": "triple_pulse", "duration_ms": 100}),
                ("sound", {"frequency": 800, "duration_ms": 500}),
                ("ui_update", {"screen": "impact_alert", "color": "#FF4444"}),
                ("schedule_transition", {"target_state": "EMERGENCY_ACTIVE", "delay_seconds": 3})
            ],
            "EMERGENCY_ACTIVE": [
                ("ui_update", {"screen": "emergency_active", "show_eta": True}),
                ("voice", {"message": "An ambulance is coming to help you."}),
                ("enable_action_buttons", True)
            ],
            "IDLE": [
                ("ui_update", {"screen": "clock", "color": "#FFFFFF"}),
                ("disable_action_buttons", True),
                ("stop_alerts", True)
            ]
        }
        return actions.get(state, [])
    
    def handle_websocket_update(self, update):
        """Process updates from backend"""
        if update.emergency_resolved:
            self.transition_to("POST_EMERGENCY_CARE")
        elif update.eta_seconds < 60:
            self.update_eta_display(update.eta_seconds)
            self.play_approaching_sound()
`

## Watch Operating Modes

### Mode 1: Paired with Innerwear (Primary)
- Connection Status: BLE Connected
- Data Source: Innerwear (primary), WiFi (secondary)
- Latency: <200ms for state updates
- Battery: Moderate drain (typical 8-10% per emergency alert cycle)
- Features: Full emergency capability, voice interaction, live vitals
- Fallback: If innerwear BLE disconnects >5 minutes, initiate WiFi fallback

### Mode 2: Paired but Innerwear Offline
- Connection Status: BLE searching/failed
- Data Source: WiFi/LTE direct to backend
- Latency: 500-1000ms
- Battery: Increased drain (WiFi active)
- Features: Voice interaction, live ETA tracking, but limited vitals
- Retry: Attempt BLE reconnection every 30 seconds

### Mode 3: Lost Innerwear (Manual Override)
- Connection Status: BLE lost >10 minutes
- Data Source: WiFi/LTE only
- Latency: 500-2000ms
- Battery: Very high drain
- Features: SOS button only, limited voice
- Action: Alert parent immediately, suggest manual parent notification

## Communication Protocols

### BLE Protocol Specification

**Connection Parameters:**
- Min Connection Interval: 100ms (watch can be updated every 100ms if needed)
- Max Connection Interval: 1000ms (default, extends battery life)
- Slave Latency: 20 events (watch can skip up to 20 connection events)
- Connection Timeout: 10 seconds (clean disconnection if not responsive)

**GATT Services (Generic Attribute Profile):**

Service UUID: 6E400001-B5A3-F393-E0A9-E50E24DCCA9E (Nordic UART Service)
- Characteristic RX: 6E400002-B5A3-F393-E0A9-E50E24DCCA9E (Write)
- Characteristic TX: 6E400003-B5A3-F393-E0A9-E50E24DCCA9E (Notify)

**Emergency Alert Notification Format:**
`
Byte 0-1:   Message Type (0x0001 = Emergency Alert)
Byte 2-3:   Severity (0=low, 1=moderate, 2=critical)
Byte 4-7:   Timestamp (Unix seconds)
Byte 8-9:   Heart Rate (BPM)
Byte 10-29: GPS coordinates (fixed-point, 20 bytes)
Byte 30-31: CRC16 checksum
`

**Response from Watch:**
`
Byte 0-1:   Message Type (0x0002 = Alert Acknowledgment)
Byte 2:     Screen State (0=received, 1=displayed, 2=voice_started)
Byte 3-4:   CRC16 checksum
`

### HTTP REST Endpoints (Fallback)

**POST /watch/state/update**
- Purpose: Get latest emergency state
- Auth: Bearer JWT token
- Request:
`json
{
  "watch_id": "watch_def456uvw",
  "last_state_id": "state_uuid_v4_previous",
  "battery_level": 45,
  "connectivity": "wifi",
  "signal_strength": -52
}
`
- Response (200):
`json
{
  "status": "success",
  "state": {
    "state_id": "state_uuid_v4_new",
    "emergency_active": true,
    "message": "Help is on the way",
    "eta_seconds": 300
  }
}
`
- Latency Target: <500ms P99
- Retry Logic: Exponential backoff (1s, 2s, 4s, 8s max)

### WebSocket Real-Time Updates

**Connection Upgrade:**
`
GET /ws/watch/stream?token=JWT_TOKEN&watch_id=watch_def456uvw HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

Response 101: Switching Protocols
`

**Message Format (JSON over WebSocket):**
`json
{
  "msg_type": "state_update",
  "msg_id": 1,
  "timestamp": 1699564801500,
  "data": {
    "emergency_stage": "ambulance_en_route",
    "eta_seconds": 420,
    "vitals_update": {
      "heart_rate": 128,
      "timestamp": 1699564801400
    },
    "action_available": "voice_chat_ready"
  }
}
`

**Heartbeat (sent by watch every 30 seconds):**
`json
{
  "msg_type": "heartbeat",
  "msg_id": 2,
  "timestamp": 1699564830000,
  "watch_battery": 42
}
`

## Decision Trees

### Emergency Severity Classification (On-Device)

`
IF acceleration_magnitude >= 80 AND impact_duration_ms >= 100:
    ├─ IF heart_rate > 140:
    │  ├─ SEVERITY = CRITICAL
    │  └─ ACTION = IMMEDIATE_AMBULANCE_DISPATCH
    │
    ├─ ELIF heart_rate > 110 AND movement_detected:
    │  ├─ SEVERITY = MODERATE
    │  └─ ACTION = QUICK_ASSESSMENT_NEEDED
    │
    └─ ELSE:
       ├─ SEVERITY = LOW
       └─ ACTION = MONITOR_CHILD_RESPONSE

ELSE IF acceleration_magnitude >= 50 AND acceleration_magnitude < 80:
    ├─ SEVERITY = POTENTIAL
    ├─ WAIT_FOR_CHILD_INPUT = 30 seconds
    └─ IF NO_CHILD_RESPONSE: SEVERITY = LOW, ACTION = MONITOR

ELSE:
    ├─ FALSE_ALARM = True
    └─ ACTION = RESUME_NORMAL
`

### Voice Assistant Response Logic

`
IF emergency_active AND innerwear_ai_available:
    ├─ PRIORITY_1: Play reassurance message (2 seconds)
    ├─ PRIORITY_2: Ask pain location (listening for 30 seconds)
    ├─ PRIORITY_3: Ask pain severity (1-10 scale)
    ├─ PRIORITY_4: Provide first aid guidance (if age appropriate)
    └─ PRIORITY_5: Keep child calm with periodic updates

ELSE IF emergency_active AND innerwear_ai_unavailable:
    ├─ Play pre-recorded reassurance message
    ├─ Display text: "Help is coming"
    └─ Enable text-based parent contact button

ELSE IF child_speaks_unprompted:
    ├─ Record voice message
    ├─ Send to backend for transcription
    ├─ Relay to parent/responder
    └─ Respond with acknowledgment sound
`

## Offline Capability Design

### Local Data Caching Strategy

**Watch Local Storage (assuming 8GB total):**
- Emergency State Cache: 500 MB (recent emergency records)
- Voice Messages Cache: 200 MB (pre-recorded prompts, reassurance)
- GPS Data Cache: 100 MB (location history, last 7 days)
- Config/App Code: 1 GB (watch app, system files)
- Free Space: ~6.2 GB (buffer)

**Emergency Detection Offline:**
- Impact Detection: Fully local, always available
- Severity Classification: Runs locally using cached ML model (50KB)
- Action Queuing: Queue all actions (voice prompts, display updates) with timestamps
- Sync When Online: Replay all queued actions with original timing

**Data Sync Sequence (When Connectivity Restored):**
`
1. Establish BLE connection to innerwear (if available)
2. Transfer queued events: {"queue_id": "uuid", "events": [...], "checksum": "xxx"}
3. Receive confirmation and replay instruction
4. Clear local queue
5. Request full state update from backend via WebSocket
6. Sync voice messages and ML models (if updated)
7. Return to normal operation
`

## Battery Optimization Architecture

### Power Consumption Breakdown
- CPU (when active): 200mW
- Screen (always on): 150mW
- BLE (connected, idle): 20mW
- BLE (advertising): 15mW
- GPS receiver: 180mW
- Wi-Fi (connected): 80mW
- Audio output: 100mW (average, varies by volume)

### Battery Saving Strategies
1. **Screen Management:**
   - Default brightness: 30% (adjustable)
   - Auto-sleep after 5 minutes: 2mW standby mode
   - Emergency override: Always wake and 100% brightness on alert
   - Target: Screen on time 18-20 hours (typical child usage)

2. **BLE Connection Management:**
   - Connection Interval: Adaptive from 100ms to 2000ms based on emergency state
   - Slave Latency: Use maximum allowed when not in emergency
   - Periodic Disconnect/Reconnect: If no data for 5 minutes, disconnect for 30s, then reconnect
   - Target: 48+ hour battery life in idle state

3. **CPU Scaling:**
   - Main CPU: 2.0 GHz when active, 0.5 GHz when in background
   - Coprocessor: Always-on 200 MHz for impact detection
   - GPU: Disabled except during animation frames
   - Sleep: Deep sleep 99% of time when not in use

4. **Voice Assistant Management:**
   - Wake-word detection: Uses low-power coprocessor only
   - Voice recording: Only on-demand during emergency
   - Voice playback: 96 kbps compressed audio
   - Target: Voice interaction adds <5% to battery drain

### Power Model Example (48-hour battery cycle)
`
Idle (no emergency): 95 hours potential @ 2mW average
├─ Screen sleep 23h @ 2mW
├─ BLE connection idle 23h @ 20mW  (converted: 2h equivalent)
├─ Periodic sync 2h @ 50mW (converted: 0.5h equivalent)
└─ Total = ~25.5h equivalent continuous at 2mW

Emergency event (5 min): 100mW average
├─ Alert sounds/haptics: 50mW
├─ Voice interaction: 200mW
├─ Screen on: 150mW
├─ GPS active: 180mW
└─ Conservative: Use 100mW for 5 minutes = 0.5h equivalent

48-hour battery with 2x daily emergency events:
└─ 2 × 25.5h (idle) + 2 × 0.5h (emergency) = 52.5h potential
└─ Accounting for inefficiencies (~10%): 47.25h realistic
`

## Performance Targets (Critical for Hackathon)

**Latency Requirements:**
- BLE notification to watch alert sound: <200ms
- WebSocket message to screen update: <500ms
- Voice message playback initiation: <1000ms
- GPS fix after emergency: <10 seconds
- Child button press to backend notification: <2 seconds

**Availability:**
- Emergency feature uptime: 99.95% (4 nines)
- BLE connection stability: 99% successful reconnect within 5 seconds
- Voice assistant: Available 99.9% during emergency
- Fallback to WiFi: Automatic within 30 seconds if BLE fails

**Memory Constraints:**
- Watch App RAM usage: <150MB peak
- Screen rendering frame buffer: 30MB
- Audio buffer: 2MB
- Network queue: 5MB
- ML model loading: <50MB

## Integration Points with Other Systems

### Watch ◄──► Innerwear Data Handshake
- Watch requests vitals data every 5 seconds during emergency
- Innerwear sends: HR, temp, location update every 10 seconds
- Watch caches last 24 hours of vitals
- On innerwear disconnect: Switch to estimated vitals from watch sensors (if available)

### Watch ◄──► Parent Dashboard
- Watch transmits child voice input → Parent Dashboard real-time
- Parent clicks "message" on dashboard → Plays voice message on watch
- Parent updates emergency status → Watch screen refreshes immediately
- Parent location sharing → Watch shows parent distance/ETA

### Watch ◄──► Emergency Responder
- Responder accepts incident → Watch shows "Help is coming, they said (ETA)"
- Responder location broadcast → Watch shows ambulance location on map
- Responder requests child details → Watch prompts additional info
- Responder indicates arrival → Watch transitions to "First responders are here"

## Testing & Validation Strategy

### Functional Testing Scenarios
1. **BLE Connectivity Tests:**
   - Connect/disconnect cycle: 100 iterations
   - Verify all messages received correctly: 99.5%+ success
   - Range test: Verify 240m range at -95dBm signal
   
2. **Emergency Flow Tests:**
   - Simulate accelerometer impact → Verify alert plays <200ms
   - Simulate backend update → Verify state change <500ms
   - Simulate voice command → Verify recorded and sent <2s

3. **Offline Mode Tests:**
   - Disable WiFi/BLE → Verify emergency detection still works
   - Queue 10 events offline → Verify replay order and timing correct
   - Sync after offline period → Verify consistency with backend

4. **Voice Tests:**
   - Ambient noise 80dB → Verify voice recognition accuracy >85%
   - Child speech (high pitch) → Verify accuracy >90%
   - Noise cancellation with crying background → Verify clarity

### Performance Testing
- Load test: 100 concurrent WebSocket connections → <100ms latency P99
- Battery test: Emergency cycle 5 times/day for 10 days → >40 hours battery
- Screen update rate: 60fps during animations → No frame drops
- Memory leak test: Run 48 hours → No memory growth >5MB

## Deliverables for Code Generation

### Code Artifacts to Generate
1. watch_app/App.swift (iOS) or MainActivity.kt (Android) - Main app entry
2. watch_app/StateManager.ts - State machine implementation
3. watch_app/BleManager.ts - BLE communication
4. watch_app/UIScreens.tsx - React Native screens
5. watch_app/VoiceAssistant.ts - Voice handling
6. watch_app/OfflineManager.ts - Offline capability
7. watch_app/BatteryOptimizer.ts - Power management
8. watch_app/Config.ts - All constants and thresholds
9. watch_app/Tests.ts - Unit tests for all modules

### Configuration Files
- config.json: All magic numbers, timeouts, thresholds
- ml_models/impact_detector_model.onnx: Lightweight ML model for impact detection
- ssets/voice_messages.json: All pre-recorded voice message paths and timings
- ssets/haptic_patterns.json: Haptic pattern definitions

## Security Architecture

### Cryptographic Approach
- All BLE packets: AES-128 encryption with keys rotated every 24 hours
- WebSocket: TLS 1.3 with certificate pinning
- JWT tokens: RS256 signing, 15-minute expiry, refresh token in secure storage
- Local data encryption: AES-256 for sensitive cache

### Authentication Flow
1. Watch starts → Loads JWT from secure storage
2. JWT expired → Use refresh token to get new JWT
3. New JWT → Resume WebSocket connection
4. Connection dropped >1 min → Prompt for re-authentication
5. Invalid token → Force logout, clear local cache

### Authorization Model
- Watch can only access its own emergency session data
- Cross-watch access: Forbidden
- Parent can access all their children's data
- Responder can access assigned incidents only

---

**Document Version:** 1.0
**Last Updated:** [CURRENT_DATE]
**Target Audience:** Software developers, architects, QA engineers
**Next Document:** 03_CHILD_WATCH_DEVICE_UIUX.md
