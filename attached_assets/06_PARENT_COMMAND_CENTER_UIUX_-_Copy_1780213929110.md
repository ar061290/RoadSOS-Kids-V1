# 06_PARENT_COMMAND_CENTER_UIUX - UI/UX GUIDE

## Design System

### Color Palette
- **Emergency Red**: #EF4444 (WCAG AAA 5.5:1 contrast vs white)
- **Action Blue**: #3B82F6 (WCAG AAA 5.4:1 contrast vs white)
- **Success Green**: #10B981 (WCAG AAA 4.8:1 contrast vs white)
- **Background Dark**: #0F172A (primary)
- **Background Light**: #1E293B (cards)
- **Text Primary**: #FFFFFF (100% opacity)
- **Text Secondary**: #CBD5E1 (70% opacity)
- **Neutral**: #64748B

### Typography
- Font: "Inter" (web) / System (mobile)
- Critical info: 32pt Bold
- Primary message: 20pt Regular
- Secondary: 16pt Regular
- Body: 14pt Regular

## Main Dashboard Screen (Emergency View)

### Layout Structure
`
┌─────────────────────────────────────────┐
│ 📍 Emergency Active | 5m 23s             │ ← Header
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🧒 AARAV KUMAR                  │   │ ← Child Card (Large)
│  │ Age 8 | Photo thumbnail        │   │   • Vitals: HR 125, Temp 36.8°C
│  │ Status: 🔴 MODERATE            │   │   • Location: School Bus Route #42
│  └─────────────────────────────────┘   │   • Last update: 3s ago
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🚑 AMBULANCE 2.3 KM AWAY        │   │ ← Ambulance Card
│  │ ETA: 7 Minutes | Speed: 45km/h │   │   • Unit A-14
│  │ Status: 🟢 En Route            │   │   • Driver: James Mitchell
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🏥 APOLLO HOSPITAL              │   │ ← Hospital Card
│  │ Distance: 3.1 km | ETA: 8 min  │   │   • Trauma Center
│  │ Beds Available: 3                │   │   • Confidence: 96%
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [MAP VIEW - Interactive]        │   │ ← Map (Interactive)
│  │ • Child location (blue marker)  │   │   60% of screen height
│  │ • Ambulance (red marker)        │   │
│  │ • Hospital (green marker)       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [Call Responder] [Send Message] │   │ ← Action Buttons
│  │ [View Timeline] [Hospital Info] │   │   (Below map, 2x2 grid)
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
`

### Card Design Specification

**Child Status Card**:
- Height: 100px
- Background: #1E293B with 1px #3B82F6 border
- Padding: 16px
- Border radius: 12px
- Layout: Photo (80px) + Text (flex)
- Font sizes: Name 20pt, Status 16pt

**Ambulance Card**:
- Height: 80px
- Background: #EF4444 with 20% opacity (softer red)
- Border: 2px solid #EF4444
- Animation: Distance/ETA updates with fade animation
- Key metric: "2.3 KM" emphasized (32pt bold)

**Hospital Card**:
- Height: 80px
- Background: #10B981 with 20% opacity
- Border: 2px solid #10B981
- Shows confidence percentage (96%)
- Action on tap: Expand to alternatives

## Map Screen Layout

### Interactive Map with Layers
`
┌─────────────────────────────────────────┐
│ [< Back] Emergency Map          [Layers▼]│ ← Top controls
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │       INTERACTIVE MAP           │   │ ← Full-height map
│  │                                 │   │
│  │   📍 Child                      │   │
│  │      🚑 Ambulance approaching  │   │
│  │         🏥 Hospital             │   │
│  │                                 │   │
│  │  (Pan/Zoom enabled)            │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ Layer toggles:                  │    │ ← Layer panel
│ │ ☑ Child Location               │    │
│ │ ☑ Ambulance                    │    │
│ │ ☑ Hospitals                    │    │
│ │ ☑ Traffic                      │    │
│ │ ☐ Coverage Analytics            │    │
│ └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘

Markers:
- Child: Blue circle with "C" icon
- Ambulance: Red square with directional arrow (updated every 5s)
- Hospital: Green with "H" icon
- User location (optional): Green circle with dot
`

## Timeline Screen Layout

### Chronological Event View
`
┌──────────────────────────────────┐
│ [< Back] Emergency Timeline      │ ← Header
├──────────────────────────────────┤
│                                  │
│ [Now]  3:47 PM                   │ ← Current time badge
│ 📍 Ambulance 2.3 km away        │ ← Event
│    Expected arrival: 7 minutes   │
│                                  │
│ ───────────────────────────────  │ ← Timeline connector
│                                  │
│ [5m ago] 3:42 PM                 │
│ 📊 Emergency Status: MODERATE    │
│    "Backend AI assessed impact"  │
│                                  │
│ ───────────────────────────────  │
│                                  │
│ [12m ago] 3:35 PM                │
│ 📞 Parent Notification Sent      │
│    "Push notification delivered" │
│                                  │
│ ───────────────────────────────  │
│                                  │
│ [20m ago] 3:27 PM                │
│ 💥 Impact Detected               │
│    "Magnitude: 78.3 m/s²"        │
│    [Expand for details]          │
│                                  │
│ [Load more...] [Export as PDF]   │ ← Actions
│                                  │
└──────────────────────────────────┘

Timeline styling:
- Event cards: 100% width, 80px min height
- Icons: Left side, 32px colored circles
- Connector line: 2px #64748B, runs down center-left
- Tap to expand: Show full event details
`

## Hospital Information Screen

### Detailed Hospital Selection
`
┌─────────────────────────────────┐
│ [< Back] Hospital Selection    │ ← Header
├─────────────────────────────────┤
│                                 │
│ RECOMMENDED (96% confidence)    │ ← Recommendation badge
│                                 │
│ �� APOLLO HOSPITAL              │
│ Trauma Center                   │
│ ⭐⭐⭐⭐⭐ (4.8/5 rating)         │
│                                 │
│ Distance: 3.1 km                │ ← Key metrics (24pt)
│ ETA: 8 minutes                  │
│ Available Beds: 3               │
│                                 │
│ CAPABILITIES:                   │ ← Full details
│ ✅ Trauma Surgery               │
│ ✅ ICU (10 beds)               │
│ ✅ Pediatric Team              │
│ ✅ CT Scan Available           │
│ ✅ Blood Bank                  │
│                                 │
│ CONTACT:                        │
│ Phone: +91 98765 43210          │
│ Address: Plot 123, Medical Lane │
│                                 │
│ [Accept] [View Alternatives]    │ ← Actions
│ [Call Hospital] [Get Directions]│
│                                 │
└─────────────────────────────────┘

Alternatives (if shown):
- Yashoda Hospital: 78% confidence
- CARE Hospital: 65% confidence
- City General: 43% confidence
`

## Communication Interface

### Send Message to Child
`
┌─────────────────────────────────┐
│ Message to AARAV               │ ← Header
├─────────────────────────────────┤
│                                 │
│ MESSAGE TYPE:                   │
│ ⚫ Voice message (recommended)   │ ← 3 options
│ ○ Text message                  │
│ ○ Preset message                │
│                                 │
│ [Start Recording] 🎤            │ ← Voice record UI
│                                 │
│ "Aarav, mommy is on the way.   │ ← Transcribed text
│  You're safe. Stay calm."       │ (as parent records)
│                                 │
│ Duration: 3.2 seconds           │
│                                 │
│ [Re-record] [Send] [Cancel]    │ ← Actions
│                                 │
│ ─ PRESET MESSAGES ─             │
│ • "Mommy is coming"             │
│ • "You're safe, stay calm"     │
│ • "Help is on the way"         │
│                                 │
└─────────────────────────────────┘

Delivery status:
- Sent ✓ (in timeline)
- Delivered ✓✓ (reached device)
- Played ✓✓✓ (child heard it)
`

## Responsive Breakpoints

### Desktop (>1024px)
- Layout: 2-column (main content + sidebar)
- Map: 60% width, always visible
- Dashboard cards: Right sidebar, stacked vertically
- Buttons: Full-width in sidebar

### Tablet (768px - 1024px)
- Layout: 1-column with horizontal scroll
- Map: 70% height
- Cards: Horizontal scroll carousel
- Buttons: 2 columns (2x2 grid)

### Mobile (<768px)
- Layout: Full-width, stacked
- Map: Full-screen (swipe up for cards)
- Cards: Full-width, stacked vertically
- Buttons: Stacked vertically, 100% width

## Animations & Transitions

### ETA Countdown Animation
`
Every 10 seconds:
  1. Fade out current ETA (200ms)
  2. Update number
  3. Fade in new ETA (200ms)
  4. Slight scale animation (1.0 → 1.05 → 1.0)
`

### Marker Update Animation (Map)
`
Ambulance position update:
  1. Draw line from old position to new position
  2. Move marker along path (smooth curve)
  3. Duration: 5 seconds (matches update frequency)
  4. Update heading arrow direction
`

### Card Transition Animation
`
When dashboard loads:
  1. Fade in background (300ms)
  2. Child card slides in from top (400ms)
  3. Ambulance card slides in (400ms, 100ms delay)
  4. Hospital card slides in (400ms, 200ms delay)
  5. Map fades in (500ms)
`

## Accessibility Features

### Motor Accessibility
- Button size: 56px minimum (touch-friendly)
- Tap targets: 48px minimum spacing
- Swipe gestures: Large swipe areas (not tiny)
- No rapid required interactions

### Visual Accessibility
- Color contrast: 4.5:1 minimum (WCAG AA)
- Font size: 14pt minimum for body text
- High contrast mode: Supported (respects system preference)
- Icons always paired with text labels

### Auditory Accessibility
- All sounds have visual equivalents
- Emergency notifications: Visual + haptic + sound
- Volume levels: Configurable (5 levels)

### Cognitive Accessibility
- Simple language: Avoid jargon
- Clear hierarchy: Most important info first
- Loading states: Always show loading indicator
- Error messages: Constructive, not blaming

## Dark/Light Mode

### Dark Mode (Default)
- Background: #0F172A
- Cards: #1E293B
- Text: #FFFFFF
- Accent: #3B82F6
- Red (emergency): #EF4444

### Light Mode (Optional)
- Background: #FFFFFF
- Cards: #F8FAFC
- Text: #0F172A
- Accent: #2563EB
- Red (emergency): #DC2626

## Testing Checklist

- [ ] Emergency dashboard loads in <2 seconds
- [ ] Map renders smoothly at 60fps
- [ ] WebSocket updates visible in <500ms
- [ ] All buttons are 56px+ and easily tappable
- [ ] Text readable in bright sunlight (high contrast)
- [ ] Accessibility: Screen reader narrates all content
- [ ] Responsive: Layout adapts to all screen sizes
- [ ] Performance: Mobile memory < 150MB
- [ ] Offline mode: Messages queue and sync when online

---

**Document Version:** 1.0
**Target Audience:** Product designers, frontend developers
**Next Document:** 07_EMERGENCY_RESPONSE_DASHBOARD_PRD.md
