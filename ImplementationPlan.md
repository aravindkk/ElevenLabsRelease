# Implementation Plan: Project Nexus Hub

Source documents: `PRD.md`, `designs/` (design.md, `designs/internal_project_voice_agent/DESIGN.md`, and 4 screen folders: `login_project_nexus_hub`, `dashboard_project_nexus_hub`, `active_voice_query_project_nexus_hub`, `past_transcripts_project_nexus_hub`).

This plan breaks the build into **6 sequential Claude Code sessions ("sprints")**. Each sprint runs in its own fresh Claude Code session with no memory of prior sessions — the only handover mechanism is this file (and `CLAUDE.md`, once generated). **Every sprint MUST end by updating this file's "Progress Log" section** (see bottom) with what was actually built, any deviations from plan, and explicit handover notes for the next sprint. Do not skip this step even if the sprint ran out of time or context — a partial handover is far better than none.

## Locked-in decisions (do not re-litigate these in any sprint)

- **Framework**: Next.js (App Router), deployed on Vercel.
- **Database**: Postgres via Vercel Marketplace (Neon), provisioned in Sprint 1, connected via `@vercel/postgres` or `postgres.js`/`drizzle` (Sprint 1 picks the exact ORM/query layer and records it here).
- **Auth**: Google OAuth via Auth.js (NextAuth v5), domain-restricted sign-in. Auth.js Postgres adapter for session/user storage.
- **Voice**: ElevenLabs Conversational AI, agent id `agent_1901m04h5x08ej7a91czykww6dne`, via `@elevenlabs/client` (or the ElevenLabs React SDK) on the client. A Next.js Route Handler mints a short-lived signed URL/conversation token server-side using an `ELEVENLABS_API_KEY` env var — **the API key must never be sent to or read by the browser.**
- **Knowledge Base Status data**: mocked/seeded for v1 — no real external source integration. Seed data lives in the app (e.g. a seed script or static module) and is described further in Sprint 5.
- **Styling**: Tailwind CSS, with the full color/typography/spacing token set from `designs/internal_project_voice_agent/DESIGN.md` front-matter ported into `tailwind.config.ts` (as theme extensions) and/or CSS custom properties in `globals.css`. Sprint 1 makes the final call on Tailwind-config-only vs. CSS-variables-plus-Tailwind and records it below — every later sprint must reuse those tokens/utility classes rather than inventing new colors or type scales.
- **Design fidelity**: each screen-owning sprint should reference the matching `designs/<screen>/code.html` and `screen.png` directly for structure/spacing/copy, not just the written description in this plan.

## Sprint dependency graph

```
Sprint 1 (Foundation: scaffold, tokens, DB provision, static shell)
   |
   v
Sprint 2 (Auth: Google OAuth, route protection, Login screen, auth DB schema)
   |
   v
Sprint 3 (Voice core: ElevenLabs token route + SDK + Active Voice Query screen, live end-to-end)
   |
   v
Sprint 4 (Persistence: voice_sessions/transcript schema, save-on-complete/interrupt, wire Sprint 3's flow to DB)
   |
   v
Sprint 5 (History + Dashboard data: Past Transcripts screen wired to real data, Dashboard KB cards wired to mock data)
   |
   v
Sprint 6 (Placeholders, edge cases, error handling, responsive/visual QA, deploy verification)
```

Sprints are drawn as a strict line because each one builds runnable code on top of the previous sprint's committed work (this is a from-scratch build, not independent modules). Two things worth noting for future parallelization if ever desired: Sprint 5's Dashboard-KB-cards half and Past-Transcripts half touch different files/routes and don't depend on each other (only both depend on Sprint 4 for the transcripts half, and Sprint 1 for the dashboard shell) — they could be split into separate worktrees if needed. Sprint 6's edge-case/error-handling work similarly touches many small independent surfaces rather than one linear chain.

## Sprint 1 — Foundation: scaffold, design tokens, DB provisioning, static shell

**Depends on**: nothing (first sprint).

**Scope**:
- Scaffold a Next.js (App Router, TypeScript) project with Tailwind CSS.
- Read `designs/internal_project_voice_agent/DESIGN.md` front-matter and port its full color/typography/spacing/radius token set into the styling layer (Tailwind config extension and/or CSS variables — make and record the final call, see below).
- Set up the Vercel project (link via Vercel CLI/skill) and provision a Postgres database via the Vercel Marketplace (Neon). Confirm the connection string is available as a Vercel env var and pulled locally via `vercel env pull`.
- Pick and install the DB access layer (e.g. Drizzle ORM + `@vercel/postgres`, or `postgres.js`) — record the choice below for later sprints.
- Build the **static** app shell: sidebar nav (Dashboard, Knowledge Base, Transcripts, Analytics, Settings, Help Center, Account) and top bar (notification bell icon, history icon, "Live Sync" status pill), matching `designs/dashboard_project_nexus_hub/code.html` + `screen.png`. No auth, no real data yet — sidebar/top bar can render with placeholder active states and static/mock content.
- Build the Dashboard route's static layout (Knowledge Base Status cards with placeholder content, the central mic button placeholder) purely as a visual match to the design — no click behavior or real data wiring yet, that comes in later sprints.
- Do NOT implement auth, ElevenLabs integration, or any DB writes yet — those are explicitly out of scope for this sprint.
- Deploy to Vercel (a working preview deployment, even with placeholder content) to confirm the pipeline works end-to-end before later sprints add complexity.

**Out of scope**: auth, voice, persistence, Past Transcripts screen, Login screen.

**Deliverable**: a deployed, unauthenticated Next.js app showing the static shell + Dashboard visual layout, with design tokens wired in and a working Postgres database provisioned (empty, no schema yet).

## Sprint 2 — Auth: Google OAuth, route protection, Login screen, auth schema

**Depends on**: Sprint 1 (project scaffold, design tokens, provisioned Postgres, app shell components to protect).

**Scope**:
- Install and configure Auth.js (NextAuth v5) with the Google provider, domain-restricted sign-in (only allow a specific Google Workspace domain — read the domain from an env var; Sprint 2's starting prompt should ask the user for the domain if not already known).
- Set up the Auth.js Postgres adapter, creating the standard `users`/`accounts`/`sessions`/`verification_tokens` tables via migration.
- Build the Login screen matching `designs/login_project_nexus_hub/code.html` + `screen.png` (branding, "Sign in with Google" button, "Secure Enterprise Portal" copy, Privacy Policy/Terms links — links can be placeholder `#` targets for v1).
- Add route protection middleware: all app routes (Dashboard, Knowledge Base, Transcripts, Analytics, Settings) require an authenticated session; unauthenticated requests redirect to Login. The Login route itself must redirect authenticated users away (to Dashboard).
- Wire the shell's Account area (bottom of sidebar) to show the real signed-in user's name/avatar/initials and a working sign-out action.

**Out of scope**: ElevenLabs integration, transcript/session persistence, Past Transcripts, Dashboard real data.

**Deliverable**: a deployed app where unauthenticated users see only the Login screen, Google sign-in works end-to-end (domain-restricted), and all other routes are protected and show the real signed-in user in the shell.

## Sprint 3 — Voice core: ElevenLabs token route, SDK integration, Active Voice Query screen

**Depends on**: Sprint 2 (auth/route protection must exist so this screen is only reachable when signed in).

**Scope**:
- Add a Next.js Route Handler (server-side only) that mints a short-lived ElevenLabs signed URL / conversation token for agent id `agent_1901m04h5x08ej7a91czykww6dne`, using an `ELEVENLABS_API_KEY` env var read only on the server. This sprint's starting prompt must tell the user to add `ELEVENLABS_API_KEY` to their Vercel/local env before running the session, since the sprint cannot proceed without it.
- Install `@elevenlabs/client` (or the official React SDK) on the client and wire it to call the token route, then start/stop a live conversation with the agent.
- Build the Active Voice Query screen matching `designs/active_voice_query_project_nexus_hub/code.html` + `screen.png`: header with session title + "Live Sync Active" badge, chat-style transcript area (user turns as blue right-aligned bubbles, agent turns as white left-aligned cards tagged with source domain + timestamp), and the bottom docked control bar (mic button with idle/listening/speaking visual states per the design's pulsing-ring treatment, stop button, live waveform visualizer).
- Wire the Dashboard's mic button / "New Voice Query" action to navigate into a new Active Voice Query session.
- This sprint's transcript rendering is **in-memory/live only** — do not implement DB persistence yet (that's Sprint 4). It's fine (and expected) for a page refresh to lose the conversation at this stage.
- Handle the basic happy path thoroughly (mic permission granted, connection succeeds, turns render live) — deeper error-state handling (permission denied, connection failure, etc.) is deferred to Sprint 6, but don't leave obviously broken states (e.g. an infinite spinner with no fallback) if avoidable at low cost.

**Out of scope**: persistence, Past Transcripts, deep error/edge-case handling (deferred to Sprint 6), Dashboard real KB data.

**Deliverable**: a signed-in user can tap the mic, have a real live voice conversation with the ElevenLabs agent, and see the transcript render in real time matching the design — working end-to-end against the real agent, not mocked.

## Sprint 4 — Persistence: session/transcript data layer

**Depends on**: Sprint 3 (the live voice conversation flow that needs to be persisted).

**Scope**:
- Design and migrate the schema for voice sessions and transcripts (e.g. `voice_sessions` table: id, user_id, title, started_at, ended_at/duration, domain_tags; `transcript_turns` table: id, session_id, role [user/agent], text, domain_tag (nullable), created_at/sequence). Keep this additive to the Sprint 2 auth schema — no changes to `users`/`accounts`/`sessions`.
- On session completion (user ends the call or the agent ends it), write the full session + all turns to the database.
- Implement **best-effort save-on-interrupt**: if the user navigates away or closes the tab mid-conversation, persist whatever transcript exists so far (e.g. via a `beforeunload`/`visibilitychange` handler firing a best-effort save request, or incremental turn-by-turn writes as the conversation progresses — pick the approach that fits the SDK's event model and record the choice below).
- Derive the session title from the first user utterance (or an agent-provided summary if the SDK exposes one) — match the style shown in `designs/past_transcripts_project_nexus_hub` session titles (e.g. "GTM Strategy Review").
- No new screens in this sprint — this is purely the data layer plus wiring the existing Sprint 3 screen to actually write real data. Verify by completing a voice session and confirming a row appears in the database.

**Out of scope**: Past Transcripts UI (Sprint 5 reads this data), Dashboard KB cards.

**Deliverable**: completing (or interrupting) a voice session reliably results in a persisted session + transcript in Postgres, verified directly against the database.

## Sprint 5 — Past Transcripts screen + Dashboard Knowledge Base data

**Depends on**: Sprint 4 (persisted session data to list/search) and Sprint 1 (Dashboard shell/layout to wire real data into).

**Scope**:
- Build the Past Transcripts screen matching `designs/past_transcripts_project_nexus_hub/code.html` + `screen.png`: searchable list of sessions (title, date/time, duration, domain tags, "View Full Transcript" link), reading real data from the Sprint 4 schema. Implement search (by title/keyword) and filter (by domain tag) against real query logic, not client-side-only on a tiny mock array.
- Build a transcript detail view (full saved transcript for a given session, reusing the transcript-bubble styling from Sprint 3's Active Voice Query screen where sensible).
- Handle the empty state: no past transcripts yet for a new user.
- Create a seed module/script for **mocked Knowledge Base Status data** (e.g. "Engineering & Sprints," "Marketing & GTM," "Executive Summary," each with a domain tag and a "last updated" timestamp) and wire the Dashboard's Knowledge Base Status cards (built statically in Sprint 1) to this seeded data, including the stale/fresh visual state (amber "Warning/Stale" vs. green "Fresh" per the design system, based on how old the mocked timestamp is).

**Out of scope**: real external KB source integrations (explicitly deferred per PRD), Settings/Analytics screens.

**Deliverable**: Past Transcripts shows real persisted sessions with working search/filter and a working detail view; Dashboard Knowledge Base Status cards show seeded data with correct fresh/stale visual states.

## Sprint 6 — Placeholders, edge cases, error handling, QA, deploy verification

**Depends on**: all prior sprints (this is the hardening/polish pass over the full app).

**Scope**:
- Build lightweight placeholder screens for **Settings**, **Analytics**, and **Knowledge Base** (the sidebar nav items that have no dedicated design) — simple "coming soon" style pages consistent with the design system, not full features (explicitly out of scope per PRD).
- Implement the edge cases listed in `PRD.md` Section 6, specifically:
  - Mic/audio permission denied — clear inline error state with guidance.
  - ElevenLabs connection failure / mid-session drop — visible error/reconnect state instead of a frozen UI.
  - OAuth token expiry mid-session — graceful re-auth redirect, not a silent failure.
  - Long transcripts — confirm scrolling/rendering holds up for long sessions (spot-check with a seeded long transcript).
  - Duplicate/rapid mic taps — debounce/guard against duplicate session starts.
  - Search/filter edge cases on Past Transcripts (special characters, zero results).
  - Empty states audit across all screens (Knowledge Base, Transcripts, etc.).
- Responsive/visual QA pass: compare every screen against its `screen.png` at standard desktop widths and fix visual drift.
- Final deploy verification: confirm the production Vercel deployment works end-to-end (login → dashboard → voice query → persisted transcript → past transcripts), and that all required env vars (`ELEVENLABS_API_KEY`, DB connection string, Google OAuth credentials, allowed domain) are set in the Vercel project, not just locally.

**Out of scope**: any new functional feature work beyond what's listed above.

**Deliverable**: a polished, production-ready v1 deployment with placeholder screens for unbuilt nav items, the PRD's edge cases handled, and visual fidelity confirmed against the design screenshots.

---

## Progress Log

**Instructions for every sprint**: before ending your session, append a new entry below (do not overwrite prior entries) using this template. Be specific — the next sprint's session has no memory beyond what you write here.

```
### Sprint N — [status: complete / partial / blocked] — [date]

**What was built**: ...
**Deviations from plan**: ... (or "none")
**Key decisions/choices made**: ... (e.g. ORM picked, styling approach finalized, schema details)
**Known issues / TODO carried forward**: ...
**Handover notes for Sprint N+1**: ...
```

(No sprints completed yet — this log is empty until Sprint 1 runs.)
