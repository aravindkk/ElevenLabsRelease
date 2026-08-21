---
name: Internal Project Voice Agent
colors:
  surface: '#FFFFFF'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#F8FAFC'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
  text-primary: '#1E293B'
  text-secondary: '#64748B'
  warning: '#F59E0B'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

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
