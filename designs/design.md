# Design System: Internal Project Voice Agent

## 1. Design Philosophy
This tool is meant to replace manual stakeholder updates typically handled by product management. It needs to look highly functional, trustworthy, and efficient. It is an internal enterprise tool, so clarity, data freshness, and readability are prioritized over flashy marketing elements.

## 2. Typography
* **Primary Font:** `Inter` or `Roboto`. These are clean, highly legible sans-serif fonts perfect for data-heavy internal dashboards and long-form transcripts.
* **Weights:**
  * Regular (400) for standard text and transcripts.
  * Medium (500) for UI elements, buttons, and secondary headers.
  * Semi-Bold (600) for main page titles and primary data points.

## 3. Color Palette
The palette should reflect enterprise reliability while making the voice AI feel active and approachable.
* **Primary/Brand:** `#0F172A` (Slate 900) - For main navigation, dark mode sidebars, and primary text. It grounds the application in a professional tone.
* **Accent/Action:** `#2563EB` (Blue 600) - For primary buttons, links, and the active state of the microphone.
* **Voice Active State:** `#10B981` (Emerald 500) - Used specifically for the voice recording state (pulsing animations, live transcription indicators) to signal active listening.
* **Backgrounds:**
  * App Background: `#F8FAFC` (Slate 50) - A very soft, cool off-white to reduce eye strain.
  * Card/Surface Background: `#FFFFFF` (White) - For transcript containers, chat bubbles, and document status cards.
* **Text & Typography Colors:**
  * Primary Text: `#1E293B` (Slate 800)
  * Secondary Text (Timestamps, Metadata): `#64748B` (Slate 500)
* **Status Indicators:**
  * Success/Fresh Data: `#10B981` (Green)
  * Warning/Stale Data: `#F59E0B` (Amber)

## 4. Key UI Components
* **Timestamp Badges:** Small, pill-shaped indicators (e.g., `Last updated: 2 hours ago`) placed prominently near domain tags (Engineering, GTM, Exec Summary) using a subtle gray background with the success green dot.
* **Microphone Interface:** A central floating action button or a docked bottom bar. When active, it should have a soft, pulsing, concentric ring animation in the Emerald Green accent color.
* **Transcript Bubbles:** Differentiated alignment (User on the right in Blue, AI on the left in subtle Slate) similar to familiar chat interfaces, but wider to accommodate dense, professional updates.
