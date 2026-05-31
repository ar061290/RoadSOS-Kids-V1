# 03_CHILD_WATCH_DEVICE_UIUX - UI/UX GUIDE

## Design Philosophy
The Child Watch UI must be optimized for high-stress scenarios where a child may be injured, frightened, or unable to focus. Every design decision prioritizes:
1. **Clarity**: Information conveyed instantly without reading
2. **Simplicity**: Maximum 2-3 taps to perform any action
3. **Safety**: Large touch targets (minimum 60px), high contrast
4. **Reassurance**: Warm colors, calm animations, honest communication
5. **Accessibility**: Works for ages 6-14, varying motor skills and literacy

## Color Palette & Accessibility

### Primary Colors
- **Emergency Red**: #FF4444 (RGB 255, 68, 68) - Used for alerts, danger states
  - WCAG AAA compliant against white (#FFFFFF): 5.8:1 contrast
  - WCAG AAA compliant against dark background (#0B1020): 8.3:1 contrast
  
- **Calm Blue**: #2563EB (RGB 37, 99, 235) - Used for normal state, reassurance
  - Against white: 5.2:1 contrast
  - Against dark: 6.1:1 contrast

- **Success Green**: #10B981 (RGB 16, 185, 145) - Used for confirmations
  - Against white: 4.8:1 contrast
  - Against dark: 7.2:1 contrast

- **Neutral Gray**: #94A3B8 (RGB 148, 163, 184) - Used for secondary text
  - Against white: 3.5:1 contrast (adequate for non-critical text)

- **Background Dark**: #0B1020 (RGB 11, 16, 32) - Primary app background
- **Background Light**: #1F2937 (RGB 31, 41, 55) - Card/container backgrounds

### Color Usage by State
`
IDLE STATE:
  ├─ Background: #0B1020 (dark, calm)
  ├─ Primary text: #FFFFFF (white, high contrast)
  ├─ Secondary text: #94A3B8 (gray, readable)
  └─ Accent: #2563EB (blue, subtle)

IMPACT_DETECTED STATE:
  ├─ Background: Pulsing fade from #FF4444 to #FFA3A3 (0.5s cycle)
  ├─ Primary text: #FFFFFF (high visibility)
  ├─ Icons: #FFFFFF or #FF4444 (alternating)
  └─ Animation: Rapid pulse effect

EMERGENCY_ACTIVE STATE:
  ├─ Background: #0B1020 (stable, safe)
  ├─ Header bar: #FF4444 (steady, indicates active emergency)
  ├─ Primary text: #FFFFFF
  ├─ Button accent: #2563EB (interaction color)
  └─ Status bar: #10B981 (shows "Help coming")

POST_EMERGENCY_CARE STATE:
  ├─ Background: Gradient #1F2937 to #2563EB (calming gradient)
  ├─ Primary text: #FFFFFF
  ├─ Reassurance text: #10B981
  └─ Overall feel: Warm, supportive
`

## Typography Hierarchy

### Font Selection
- Family: "Inter" (default), fallback "System Default"
- Weights: Light (300), Regular (400), Medium (500), Bold (700)

### Font Sizes by Context
`
CRITICAL INFORMATION (Emergency Status):
  Font Size: 64pt
  Weight: Bold (700)
  Line Height: 72pt
  Example: "HELP IS COMING"
  Position: Top 20% of screen
  Justification: Maximum visibility, instant recognition

PRIMARY MESSAGE (What to do now):
  Font Size: 32pt
  Weight: Medium (500)
  Line Height: 40pt
  Example: "An ambulance is on the way"
  Position: Center of screen
  Justification: Clear direction without stress

SECONDARY MESSAGE (Additional info):
  Font Size: 24pt
  Weight: Regular (400)
  Line Height: 32pt
  Example: "ETA: 7 minutes"
  Position: Below primary
  Justification: Informative but not overwhelming

BODY TEXT (Prompts, explanations):
  Font Size: 20pt
  Weight: Regular (400)
  Line Height: 28pt
  Example: "Can you tell me where it hurts?"
  Position: Voice assistant prompts
  Justification: Clear audio + text backup

SMALL TEXT (Secondary UI):
  Font Size: 16pt
  Weight: Light (300)
  Line Height: 24pt
  Example: "Battery: 78%"
  Position: Status indicators
  Justification: Readable but not intrusive

BUTTON TEXT (Call-to-action):
  Font Size: 28pt
  Weight: Bold (700)
  Line Height: 36pt
  Example: "TALK TO HELPER"
  Position: Button labels
  Justification: Easy to read while stressed
`

### Typography Accessibility
- Minimum font size: 16pt (secondary text only)
- Contrast ratio all text: Minimum 4.5:1 (WCAG AA)
- Letter spacing: +0.05em for body text (improves readability)
- Anti-aliasing: Enabled for all text

## Screen Wireframes & Layouts

### Screen 1: IDLE State (Clock/Home Screen)
`
┌─────────────────────────────────┐
│ 9:45                    100%  ●  │  ← Time, battery indicator
│                                 │
│                                 │
│                                 │
│        🕐  9:45 AM              │  ← Large clock display
│                                 │
│      Wednesday, Nov 8           │  ← Date info
│                                 │
│                                 │
│   ┌────────────────────────────┐│  ← Status bar
│   │ 🟢 All Good - Ready to Help│  │
│   └────────────────────────────┘│
│                                 │
│     [⬅]          [≡]          [⟳] │  ← Navigation buttons
└─────────────────────────────────┘

Dimensions:
  Screen size: 240x280 pixels (typical smartwatch)
  Safe area: 8px margins all sides
  Touch targets: 60px minimum
  
Interactivity:
  Long-press clock: Settings (optional)
  Tap [≡]: Menu (notifications, help)
  Tap [⟳]: Refresh connection status
  Tap [⬅]: Previous screen (if available)
`

### Screen 2: IMPACT_DETECTED State (Alert Screen)
`
┌─────────────────────────────────┐
│         🚨 IMPACT! 🚨            │  ← Flashing red,
│        ⚠️⚠️⚠️⚠️⚠️⚠️⚠️               │     pulsing animation
│                                 │
│                                 │
│  RoadSoS Is Checking            │
│     You're Safe?                │
│                                 │
│                                 │
│    ⊙ ⊙  (Listening indicator)   │
│                                 │
│     [YES]          [NO]         │  ← Touch targets 70px
│                                 │
└─────────────────────────────────┘

Dimensions:
  Animation cycle: 0.5 seconds (rapid pulse)
  Color transition: #FF4444 → #FFA3A3 → #FF4444
  Sound: 95dB alert tone (500-1000Hz sweep)
  Haptic: 3 short pulses (100ms each)
  Duration: 2-5 seconds max, then auto-advance to EMERGENCY_ACTIVE
  
Buttons:
  YES: Confirms child is in distress, proceeds to emergency care
  NO: False alarm, returns to IDLE (after 10s countdown option)
`

### Screen 3: EMERGENCY_ACTIVE State (Main Emergency Screen)
`
┌─────────────────────────────────┐
│ 🚨 HELP IS COMING               │  ← Red header, size 28pt
├─────────────────────────────────┤
│                                 │
│       🚑 7 MINUTES AWAY         │  ← Large, centered, size 48pt
│                                 │
│    The ambulance found you!     │
│    Stay calm. You're safe.      │  ← Size 20pt, reassuring tone
│                                 │
├─────────────────────────────────┤
│  Parent Status: ✅ Coming       │  ← Live parent location
│                                 │
│         🔊 Help Listener ON     │  ← Voice assistant active
│                                 │
│  [TALK TO HELPER]   [INFO]      │  ← Primary actions
│                                 │
│  ETA updating every 10 seconds  │  ← Subtle status
│                                 │
└─────────────────────────────────┘

Dimensions:
  Header bar: 40px height, #FF4444 background, white text
  Main content area: 200px, centered content
  Button area: 60px height, buttons 65px wide
  Refresh rate: ETA updates every 10 seconds with animation
  
Button Specifications:
  TALK TO HELPER:
    - 65px × 55px, rounded corners 10px
    - Background: #2563EB
    - Text color: #FFFFFF, size 24pt, bold
    - Tap feedback: 100ms highlight
    - Action: Activate voice recording, play prompt
    
  INFO:
    - 65px × 55px, rounded corners 10px
    - Background: #1F2937
    - Text color: #FFFFFF, size 20pt
    - Action: Show detailed info screen

Animation:
  ETA countdown: Fade-in/fade-out animation every 10 seconds
  Parent location indicator: Pulsing green dot when parent confirmed
  Status text: Updates with reassuring messages
`

### Screen 4: VOICE_INTERACTION State
`
┌─────────────────────────────────┐
│ 🎤 I'm Listening...             │  ← Size 28pt, animated
│                                 │
│  ≈ ≈≈ ≈≈≈ ≈ ≈ ≈ ≈ ≈≈ ≈≈ ≈ ≈   │  ← Audio waveform animation
│                                 │
│                                 │
│  "Tell me where it hurts"       │  ← Size 24pt, parent message
│                                 │
│                                 │
│                                 │
│   Recording: 12 seconds...      │  ← Size 20pt, timer
│                                 │
│           [DONE]                │  ← Skip button
│                                 │
│      Estimated wait time:       │
│         Still calculating...    │
│                                 │
└─────────────────────────────────┘

Dimensions:
  Audio waveform: Animated bars (5 bars, 8px each) updating 10Hz
  Recording time: Max 30 seconds, but allow "DONE" early
  Feedback: Vibration pulse every 5 seconds to reassure recording active
  
Voice Specifications:
  Sample rate: 16 kHz (balanced between quality and bandwidth)
  Encoding: Opus at 32kbps (for low bandwidth)
  Timeout: 30 seconds maximum
  Silence detection: >2 seconds of silence auto-completes
  Noise floor threshold: -40dB (reject pure noise)
`

### Screen 5: RESPONDER_ARRIVING State
`
┌─────────────────────────────────┐
│ 🚨 HELP IS HERE                 │  ← Size 36pt, pulsing red
├─────────────────────────────────┤
│                                 │
│     🚑  1 MINUTE AWAY           │  ← Size 40pt, urgent
│                                 │
│  Look for the ambulance!        │  ← Size 24pt
│  Wave your hand if you can.     │
│                                 │
│      (Blue and red lights)      │  ← Size 16pt, descriptive
│                                 │
│                                 │
│                                 │
│   🚑 Coming around corner...    │  ← Live update every 10s
│                                 │
│    [EMERGENCY BUTTON]           │  ← Tap for direct radio
│                                 │
└─────────────────────────────────┘

Dimensions:
  Main message: Size 40pt, color #FF4444
  Urgency: Rapid red pulsing (0.3s cycle)
  Button: 70px × 50px, bright red, easy to tap in panic
  
Animation:
  Pulsing effect: #FF4444 → #FF7777 → #FF4444
  Frequency: 3 pulses per second (urgent but not distracting)
`

### Screen 6: RESPONDER_ACTIONS State (First Responder Help)
`
┌─────────────────────────────────┐
│ ✅ First Responders Arrived     │  ← Size 28pt, green
│                                 │
│   Paramedic Name: James         │  ← Size 20pt
│   Badge: Paramedic A-14         │
│                                 │
│   🚑 Location: East Wing Entry  │  ← Size 18pt
│                                 │
│   Status: They're on their way  │  ← Size 20pt
│                                 │
│                                 │
│   [Contact Paramedic]           │  ← Size 24pt button
│                                 │
│   ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯   │
│                                 │
│    In pain? Tell us 1-10        │
│    [1] [5] [10]                 │
│                                 │
└─────────────────────────────────┘

Dimensions:
  Status: Green color #10B981 for confidence
  Contact button: 65px × 50px, background #2563EB
  Pain scale: 3 quick buttons, 50px each
  Text color: #FFFFFF on dark background
`

### Screen 7: POST_EMERGENCY_CARE State
`
┌─────────────────────────────────┐
│                                 │
│   ✅ You Did Great! 🎉           │  ← Size 32pt, celebration tone
│                                 │
│                                 │
│   You're in good hands now.     │  ← Size 22pt, reassuring
│                                 │
│                                 │
│   The paramedics will help.     │
│   You were very brave.          │  ← Size 20pt
│                                 │
│                                 │
│   [STAY CALM]  [TALK TO MOM]    │  ← Options for next step
│                                 │
│                                 │
│   Hospital: Regional Medical    │  ← Size 18pt, info
│   ETA: 12 minutes               │
│                                 │
│   Transport: Ambulance A-14     │
│                                 │
└─────────────────────────────────┘

Dimensions:
  Background: Gradient from #1F2937 to #2563EB (calming)
  Text: Warm and supportive tone
  Duration: This screen shows for 5-10 minutes post-emergency
  Auto-advance: Back to modified IDLE after timeout
  
Button Specs:
  STAY CALM: Plays guided breathing exercise (5 min)
  TALK TO MOM: Routes to parent voice call
`

## State Transition Animations

### Transition: IDLE → IMPACT_DETECTED
`
Duration: 200ms
Effect:
  1. Screen fade (200ms): Current content fades to black
  2. Alert flash (100ms): #FF4444 fills screen
  3. Pulsing begins: 0.5s cycle starts
  4. Sound queued: 95dB alert tone plays
  5. Haptic queued: 3-pulse pattern starts

Code pseudocode:
  animate_fade_out(duration=200ms)
  then:
    animate_pulse_in(color=#FF4444, start_opacity=1, cycle=500ms)
  simultaneously:
    play_sound(frequency=800Hz, duration=500ms)
    play_haptic(pattern="triple_pulse")
`

### Transition: IMPACT_DETECTED → EMERGENCY_ACTIVE
`
Duration: 800ms
Effect:
  1. Pulse slows (500ms): Reduce frequency from 0.5s to 2s cycle
  2. Content fades in (500ms): Text appears over slowly changing background
  3. Stabilize (800ms): Background becomes static dark, header stays red
  4. Button fade in (600ms): Action buttons fade in from bottom

Code:
  slow_down_pulse(new_cycle=2000ms)
  then:
    fade_in_content(duration=500ms)
    fade_in_buttons(duration=600ms, direction="from_bottom")
`

### Transition: EMERGENCY_ACTIVE → RESPONDER_ARRIVING
`
Duration: 600ms
Effect:
  1. Acceleration (600ms): ETA countdown accelerates visually
  2. Color intensify (400ms): Red header intensifies
  3. New message slides in (400ms): "HELP IS HERE" slides up
  4. Pulsing accelerates (400ms): Red pulse increases to 3Hz

Code:
  slide_message_up(new_text="HELP IS HERE", duration=400ms)
  intensify_color(target=#FF4444, from=#FF7777)
  accelerate_pulse(new_frequency=3Hz)
`

## Gesture Interactions

### Touch Targets (Minimum 60px)
All interactive elements must be at least 60px in both dimensions for children with developing motor skills.

`
BUTTON SPECIFICATIONS:
  Standard Button:
    Width: 65px
    Height: 55px
    Border radius: 8px
    Padding: 4px (internal spacing)
    
  Large Button (Critical actions):
    Width: 80px
    Height: 65px
    Border radius: 10px
    
  Feedback on touch:
    Visual: 100ms opacity change (0.7 → 1.0)
    Haptic: 30ms vibration pulse
    Audio: Optional soft click (optional, can be disabled)
`

### Gesture Recognition

**TAP (Single Press)**
- Activation time: 200-300ms after finger contact
- Distance tolerance: ±10px (accounts for finger size)
- Actions: Button press, screen confirmation
- Feedback: Immediate visual highlight

**HOLD (Long Press)**
- Activation time: 2000ms (2 seconds)
- Usage: Settings access (non-critical)
- Feedback: Visual countdown indicator
- Cancellation: Finger lift before 2s

**SWIPE (Directional Gesture)**
- Direction: Left/Right only (vertical disabled to prevent accidental triggers)
- Distance minimum: 40px
- Speed: 20-500 pixels/second
- Usage: Navigation between screens (if needed)
- Feedback: Screen slide animation

**DOUBLE TAP**
- Usage: Not used in emergency screens (prevent false triggers)
- Alternative: Single tap only for all critical actions

## Accessibility Features

### Motor Accessibility
- Touch targets: 60px minimum (recommended for ages 6-12)
- No requires precise multi-finger gestures
- No timed interactions (user can take as long as needed)
- Large buttons with clear visual feedback

### Visual Accessibility
- High contrast: 4.5:1 minimum (WCAG AA for all text)
- No color-only information: Always pair with icons/text
- Icons: Clear, high-resolution (48px+ for critical functions)
- Text scaling: Support 150% font scaling without overflow

### Auditory Accessibility
- All sounds have visual indicator (waveform animation, text notification)
- Voice output: Clear, slow speech rate (130 WPM for children)
- Text backup: Every voice message displays as text

### Cognitive Accessibility
- Language: Simple, direct instructions (target 6-year-old comprehension level)
- No jargon: Replace "GPS" with "location", "vitals" with "health info"
- Reassurance: Frequent positive reinforcement ("You're doing great!")
- Clear next steps: What happens next is always explained

### Example: Simple Language by Age
`
Age 6-8:
  "Help is coming!" (simple, positive)
  "Tell me where it hurts" (simple verb, concrete noun)

Age 9-12:
  "An ambulance is on the way to help you" (slightly more detail)
  "Can you describe where the pain is?" (more complex grammar)

Age 13-14:
  "Emergency services have been dispatched to your location" (full detail)
  "Please provide details of your injury for the paramedics" (formal, respectful)
`

## Animation Timings

### Standard Animation Curves
`
EASE-IN-OUT (default for most animations):
  Easing function: cubic-bezier(0.25, 0.46, 0.45, 0.94)
  Use case: Screen transitions, content fades
  
EASE-OUT (deceleration, natural feel):
  Easing function: cubic-bezier(0.0, 0.0, 0.58, 1.0)
  Use case: Button presses, confirmations
  
EASE-IN (acceleration):
  Easing function: cubic-bezier(0.42, 0.0, 1.0, 1.0)
  Use case: Alert onset, urgent transitions
  
LINEAR (constant speed):
  Easing function: cubic-bezier(0.0, 0.0, 1.0, 1.0)
  Use case: Progress bars, constant movement
`

### Animation Durations by Context
`
ALERT ONSET: 100-200ms (urgent, snappy)
  - Impact detection alert: 200ms fade-in
  
NORMAL TRANSITIONS: 300-800ms (comfortable, not rushed)
  - Screen change: 500ms cross-fade
  - Button press response: 100ms highlight
  
LONG-FORM ANIMATIONS: 2000-5000ms (calming, meditative)
  - Breathing exercise: 4 seconds per breath cycle
  - Reassurance message: Fade-in over 3 seconds
  
NEVER EXCEED: 1 second for emergency information display
  - Users need to see critical info immediately
  - Animation should never delay emergency details
`

## Dark Mode (Primary) & Light Mode (Secondary)

### Dark Mode (Default)
- Background: #0B1020
- Primary text: #FFFFFF (100% opacity)
- Secondary text: #94A3B8 (70% opacity)
- Accent: #2563EB
- Red: #FF4444

Rationale: Reduces eye strain during stress, commonly used on medical devices.

### Light Mode (Optional)
- Background: #FFFFFF
- Primary text: #0B1020 (100% opacity)
- Secondary text: #475569 (70% opacity)
- Accent: #2563EB (darker shade #1E40AF)
- Red: #DC2626

Dark mode forced in emergency states regardless of setting.

## Voice Interface Specification

### Voice Prompts (Pre-recorded & AI-generated)

**Prompt 1: Initial Reassurance (Emergency Start)**
`
Audio file: voice_messages/reassurance_01.ogg
Duration: 2.0 seconds
Speaker: Calm adult (gender-neutral), child-appropriate tone
Text: "An ambulance is coming to help you. You're safe. We're with you."
Playback conditions:
  - Triggered on transition to EMERGENCY_ACTIVE
  - Plays at 85dB (comfortable listening level)
  - Can be skipped by child action
  - Repeats every 60 seconds if no activity
`

**Prompt 2: Pain Assessment**
`
Audio file: voice_messages/pain_assessment.ogg
Duration: 2.5 seconds
Speaker: Same calm adult
Text: "Can you tell me where it hurts? Point to the spot or say the area."
Playback conditions:
  - Triggered after reassurance completes
  - Child has 30 seconds to respond
  - Records voice input
  - If no response: AI shows pain scale (1-10 buttons)
`

**Prompt 3: First Aid Guidance (Age-appropriate)**
`
For age 6-8:
  "Stay still and take deep breaths. The ambulance drivers know how to help."
  
For age 9-12:
  "Stay calm and try to stay still. The paramedics are trained to help injuries."
  
For age 13-14:
  "Remain calm and minimize movement to prevent worsening your condition. The paramedics are arriving with medical equipment."
`

**Prompt 4: Responder Arrival**
`
Audio file: voice_messages/responder_arrival.ogg
Duration: 1.5 seconds
Text: "The ambulance is here! Wave if you can so they can find you!"
Playback conditions:
  - Triggered when ambulance within 1 minute
  - Plays at 90dB (louder to grab attention)
  - Can be repeated by child action
`

### Voice Recognition

**Child Speech Recognition:**
- Model: Custom trained on child speech patterns (kids have higher pitch, faster rate)
- Accuracy target: >85% for common pain location keywords
- Keywords: "head", "arm", "leg", "chest", "stomach", "back", "all over"
- Fallback: If recognition <80% confidence, offer button selection

**Ambient Noise Handling:**
- Noise floor detection: -40dB to -20dB (depends on location)
- Adaptive noise cancellation: 6dB SNR improvement
- Test scenario: Recognition accuracy >85% in 80dB ambient noise (school bus)

## Microinteractions

### Button Press Microinteraction
`
Timeline:
  T=0ms: Finger touches button
    Visual: Button highlights (opacity: 0.8 → 1.0)
    Haptic: 10ms micro-vibration pulse
  
  T=100ms: Visual feedback display
    Visual: Button remains highlighted
    
  T=200ms: Finger lifts
    Visual: Fade out highlight (200ms cross-fade)
    Audio: Optional soft click (optional, can be muted)
    
  T=250ms: Action executes
    Result: Screen change, voice playback, etc.
`

### ETA Countdown Microinteraction
`
Every 10 seconds during emergency:
  T=0ms: Current ETA displayed (e.g., "7 MINUTES AWAY")
  T=100ms: Fade out (200ms opacity: 1.0 → 0.0)
  T=300ms: New ETA displayed (e.g., "6 MINUTES AWAY")
  T=400ms: Fade in (200ms opacity: 0.0 → 1.0)
  
Effect: Smooth, continuous countdown feeling
`

### Voice Recording Waveform Animation
`
During voice input:
  - 5 vertical bars represent audio levels
  - Update frequency: 10Hz (every 100ms)
  - Bar height: Maps to current audio level (-60dB to 0dB)
  - Colors: Gradient from #94A3B8 (quiet) to #2563EB (loud) to #FF4444 (too loud)
  - Damping: Moving average filter smooths rapid fluctuations
`

## Screen Layouts by Device

### Smartwatch Typical (240x280 pixels - PRIMARY)
`
Safe area: 224x264 pixels (8px margins)
Orientation: Portrait only (typically square, but treated as portrait)

Layout grid:
  - Header bar: 40px height (if needed)
  - Content area: ~180px height
  - Button area: 60px height
  - Status bar: 20px height
`

### Smartwatch Larger (360x360 pixels - SECONDARY)
`
Safe area: 344x344 pixels (8px margins)

Scaling rules:
  - Font sizes: Scale 1.5x (64pt → 96pt)
  - Touch targets: Scale 1.5x (60px → 90px)
  - Padding: Scale 1.25x (maintain proportions)
  - Animations: Same duration (speed naturally increases with larger movement)
`

### Smartwatch Tiny (198x198 pixels - MINIMUM SUPPORT)
`
Safe area: 182x182 pixels (8px margins)

Optimization rules:
  - Critical message only (no secondary text)
  - Font size minimum: 28pt (critical), 20pt (primary)
  - Buttons: Stack vertically (space limited horizontally)
  - Status indicator: Compact dot icons only
`

## Testing Scenarios

### Usability Testing Checklist
1. **Visibility**: All text readable at 3 feet distance
2. **Touch accuracy**: Children age 7-14 can tap buttons without mistakes
3. **Understanding**: Child comprehends what's happening in <3 seconds
4. **Stress**: UI remains functional during high-stress scenarios (simulated)
5. **Color blindness**: Design works for red-green color blind users
6. **Accessibility**: Keyboard/switch access works for physical disabilities

### A/B Testing (Recommended)
- Test 1: Red alert vs. Blue+warning icon (which is more visible in panic?)
- Test 2: 60px vs. 50px buttons (optimal size for child motor skills)
- Test 3: 28pt vs. 36pt critical text (optimal readability under stress)

---

**Document Version:** 1.0
**Last Updated:** [CURRENT_DATE]
**Target Audience:** UI/UX designers, frontend developers, QA testers
**Next Document:** 04_PARENT_COMMAND_CENTER_PRD.md
