# Starting Prompts

One self-contained prompt per sprint. Copy the whole block for the relevant sprint as the first message of a fresh Claude Code session running in this project directory. Run sprints in order — do not start Sprint N+1 until Sprint N's entry has been added to `ImplementationPlan.md`'s Progress Log.

---

## Sprint 1 prompt

```
This is sprint 1 of a 6-sprint build for "Project Nexus Hub." Read ImplementationPlan.md in full first — it has the locked-in stack decisions, the full sprint breakdown, and your exact scope for Sprint 1 under the "Sprint 1" heading. Also read PRD.md's sections 1-6 for product context, and the design files referenced in Sprint 1's scope: designs/internal_project_voice_agent/DESIGN.md (front-matter has the full color/typography/spacing token set — port it faithfully) and designs/dashboard_project_nexus_hub/code.html + screen.png.

Your job this sprint, in order:
1. Scaffold a Next.js (App Router, TypeScript) project with Tailwind CSS.
2. Port the full design token set from designs/internal_project_voice_agent/DESIGN.md into the styling layer. Decide once whether to do this as Tailwind config extensions, CSS custom properties, or both, and write that decision into ImplementationPlan.md's "Locked-in decisions" section (edit the "Styling" line to record your final call) so every later sprint follows it.
3. Set up a Vercel project for this repo and provision a Postgres database via the Vercel Marketplace (Neon). Pick a DB access layer (Drizzle ORM is a solid default with Vercel Postgres/Neon) and record the choice in ImplementationPlan.md's "Locked-in decisions" section.
4. Build the static app shell (sidebar nav + top bar) and the static Dashboard layout (Knowledge Base Status cards with placeholder content, central mic button) matching designs/dashboard_project_nexus_hub exactly. No auth, no real data, no ElevenLabs integration, no DB writes — this sprint is scaffold + visuals + infra provisioning only.
5. Deploy to Vercel and confirm the preview URL renders correctly.

Do not implement anything listed as "Out of scope" for Sprint 1 in ImplementationPlan.md — later sprints depend on those being untouched so far.

Before ending this session, you MUST append a Sprint 1 entry to ImplementationPlan.md's "Progress Log" section using the template already there, filled in with what you actually built, any deviations, the styling/DB decisions you locked in, and clear handover notes for Sprint 2 (which builds Google OAuth on top of what you scaffold here). Do not skip this — it is the only context the next session will have.
```

---

## Sprint 2 prompt

```
This is sprint 2 of a 6-sprint build for "Project Nexus Hub." Read ImplementationPlan.md in full first, especially the "Locked-in decisions" section (now updated with Sprint 1's real choices) and the Progress Log's Sprint 1 entry for full handover context — do not re-scaffold anything Sprint 1 already built. Then read the "Sprint 2" heading for your exact scope. Also read PRD.md sections 1-6 for product context, and designs/login_project_nexus_hub/code.html + screen.png for the Login screen you're building.

Before starting, confirm with the user (or check existing env vars) what Google Workspace domain should be allowed to sign in — you need this to implement domain-restricted OAuth. If it's not already set as an env var or documented anywhere in the repo, ask the user directly rather than guessing.

Your job this sprint, in order:
1. Install and configure Auth.js (NextAuth v5) with the Google provider and domain-restricted sign-in.
2. Set up the Auth.js Postgres adapter against the database Sprint 1 provisioned, migrating the standard users/accounts/sessions/verification_tokens tables using the DB access layer Sprint 1 chose (check ImplementationPlan.md's Locked-in decisions for which one).
3. Build the Login screen to match designs/login_project_nexus_hub exactly.
4. Add route protection: every app route requires an authenticated session and redirects to Login if not signed in; Login redirects already-authenticated users to Dashboard.
5. Wire the shell's Account area (built in Sprint 1) to show the real signed-in user and a working sign-out action.

Do not touch ElevenLabs integration, transcript persistence, or Past Transcripts — those are out of scope this sprint per ImplementationPlan.md.

Before ending this session, you MUST append a Sprint 2 entry to ImplementationPlan.md's "Progress Log" section with what you built, any deviations, the exact auth schema/table details, and clear handover notes for Sprint 3 (which builds the ElevenLabs voice integration on top of your route protection).
```

---

## Sprint 3 prompt

```
This is sprint 3 of a 6-sprint build for "Project Nexus Hub." Read ImplementationPlan.md in full first, especially "Locked-in decisions" and the Progress Log entries for Sprints 1-2, for full handover context. Then read the "Sprint 3" heading for your exact scope. Also read PRD.md sections 1-6, and designs/active_voice_query_project_nexus_hub/code.html + screen.png for the screen you're building.

IMPORTANT — before starting: this sprint requires a real ElevenLabs API key set as ELEVENLABS_API_KEY in both your local env and the Vercel project's env vars, for agent id agent_1901m04h5x08ej7a91czykww6dne. If it's not already set, stop and ask the user for it — do not proceed with a fake/placeholder key, and do not hardcode it anywhere in source. It must only ever be read server-side.

Your job this sprint, in order:
1. Build a Next.js Route Handler that mints a short-lived ElevenLabs signed URL / conversation token server-side for agent_1901m04h5x08ej7a91czykww6dne, reading ELEVENLABS_API_KEY only on the server.
2. Install @elevenlabs/client (or the official React SDK) on the client, call the token route, and implement starting/stopping a live conversation.
3. Build the Active Voice Query screen to match designs/active_voice_query_project_nexus_hub exactly: header with session title + "Live Sync Active" badge, live chat-style transcript (blue right-aligned user bubbles, white left-aligned agent cards tagged with domain + timestamp), and the bottom docked control bar with mic states (idle/listening/speaking with pulsing-ring visuals), stop button, and live waveform visualizer.
4. Wire the Dashboard's mic button and "New Voice Query" sidebar action (built in Sprint 1) to start a new Active Voice Query session.
5. Get this working end-to-end against the real ElevenLabs agent — test an actual voice conversation, not just UI shell.

This sprint's transcript is in-memory/live only — do NOT implement database persistence (that's Sprint 4's job). A page refresh losing the conversation at this stage is expected and fine. Deep error-state handling (permission denied, connection failures) is deferred to Sprint 6 — handle the happy path solidly, avoid obviously broken dead-end states, but don't over-invest in edge cases here.

Before ending this session, you MUST append a Sprint 3 entry to ImplementationPlan.md's "Progress Log" section with what you built, any deviations, details on how the ElevenLabs SDK is wired in (event model, session lifecycle), and clear handover notes for Sprint 4 (which persists this conversation flow to the database).
```

---

## Sprint 4 prompt

```
This is sprint 4 of a 6-sprint build for "Project Nexus Hub." Read ImplementationPlan.md in full first, especially "Locked-in decisions" and the Progress Log entries for Sprints 1-3, for full handover context — pay close attention to Sprint 3's notes on the ElevenLabs SDK's event model, since that determines how you'll hook in persistence. Then read the "Sprint 4" heading for your exact scope. Also read PRD.md section 6 (edge cases) for context on what "best-effort save-on-interrupt" needs to handle.

Your job this sprint, in order:
1. Design and migrate a schema for voice sessions and transcripts (e.g. voice_sessions and transcript_turns tables) as an additive migration on top of the existing auth schema from Sprint 2 — do not modify the users/accounts/sessions tables.
2. Implement save-on-completion: when a voice session ends (user or agent ends the call), write the full session + all turns to the database.
3. Implement best-effort save-on-interrupt: if the user navigates away or closes the tab mid-conversation, persist whatever transcript exists so far. Pick the approach that fits how Sprint 3 wired the ElevenLabs SDK's events (documented in Sprint 3's Progress Log entry) — e.g. incremental turn-by-turn writes as the conversation progresses, or a beforeunload/visibilitychange best-effort flush.
4. Derive a human-readable session title from the first user utterance (or an agent-provided summary if available), matching the style of titles shown in designs/past_transcripts_project_nexus_hub (e.g. "GTM Strategy Review").
5. Verify by completing a real voice session end-to-end and confirming the session + transcript rows land correctly in Postgres.

No new screens this sprint — Past Transcripts UI is Sprint 5's job. This sprint is purely the data layer plus wiring Sprint 3's existing screen to actually persist.

Before ending this session, you MUST append a Sprint 4 entry to ImplementationPlan.md's "Progress Log" section with what you built, the exact schema you created, any deviations, and clear handover notes for Sprint 5 (which builds the Past Transcripts UI reading this data, and the Dashboard KB cards).
```

---

## Sprint 5 prompt

```
This is sprint 5 of a 6-sprint build for "Project Nexus Hub." Read ImplementationPlan.md in full first, especially "Locked-in decisions" and the Progress Log entries for Sprints 1-4, for full handover context — pay close attention to Sprint 4's notes on the exact voice_sessions/transcript_turns schema, since you're querying it directly. Then read the "Sprint 5" heading for your exact scope. Also read designs/past_transcripts_project_nexus_hub/code.html + screen.png, and PRD.md's description of the Dashboard Knowledge Base Status cards.

Your job this sprint, in order:
1. Build the Past Transcripts screen matching designs/past_transcripts_project_nexus_hub exactly: session list (title, date/time, duration, domain tags, "View Full Transcript" link) reading real data from Sprint 4's schema, with working search (by title/keyword) and filter (by domain tag) implemented as real query logic against the database.
2. Build a transcript detail view showing the full saved transcript for a session, reusing the transcript-bubble styling from the Active Voice Query screen (Sprint 3) where it fits.
3. Handle the empty state for a new user with no past transcripts yet.
4. Create a seed module/script with mocked Knowledge Base Status data (source names like "Engineering & Sprints," "Marketing & GTM," "Executive Summary," each with a domain tag and a "last updated" timestamp) and wire the Dashboard's Knowledge Base Status cards (built statically in Sprint 1) to this seeded data — including correct fresh vs. stale visual states (green "fresh" vs. amber "warning/stale") based on how old each mocked timestamp is, per the design system in designs/internal_project_voice_agent/DESIGN.md.

Real external Knowledge Base source integrations are explicitly out of scope (deferred per PRD.md) — mocked/seeded data only.

Before ending this session, you MUST append a Sprint 5 entry to ImplementationPlan.md's "Progress Log" section with what you built, any deviations, and clear handover notes for Sprint 6 (the final hardening/QA/polish pass over the whole app).
```

---

## Sprint 6 prompt

```
This is sprint 6 (final sprint) of a 6-sprint build for "Project Nexus Hub." Read ImplementationPlan.md in full first, especially "Locked-in decisions" and every Progress Log entry from Sprints 1-5, for complete handover context on the entire app as built. Then read the "Sprint 6" heading for your exact scope. Also read PRD.md in full, especially Section 6 (Edge Cases), since that's your primary checklist this sprint.

Your job this sprint, in order:
1. Build lightweight placeholder screens for Settings, Analytics, and Knowledge Base (sidebar nav items with no dedicated design) — simple "coming soon" pages styled consistently with the design system tokens, not functional features.
2. Work through PRD.md Section 6's edge cases and implement handling for each, at minimum: mic/audio permission denied (clear inline error + guidance), ElevenLabs connection failure or mid-session drop (visible error/reconnect state, not a frozen UI), OAuth token expiry mid-session (graceful re-auth redirect), long transcripts (verify scrolling/rendering holds up), duplicate/rapid mic taps (debounce/guard against duplicate session starts), Past Transcripts search/filter edge cases (special characters, zero results), and an empty-state audit across all screens.
3. Do a responsive/visual QA pass comparing every built screen against its corresponding designs/*/screen.png at standard desktop widths, and fix visual drift you find.
4. Final deploy verification: confirm the production Vercel deployment works end-to-end for the full flow (login → dashboard → voice query → persisted transcript → past transcripts → sign out), and confirm every required env var (ELEVENLABS_API_KEY, DB connection string, Google OAuth client id/secret, allowed OAuth domain) is actually set in the Vercel project itself, not just locally.

This is the last planned sprint — do not start new functional features beyond what's listed above and in ImplementationPlan.md's Sprint 6 scope.

Before ending this session, append a final Sprint 6 entry to ImplementationPlan.md's "Progress Log" documenting what was fixed/verified, any remaining known issues, and a short "v1 complete" summary of the overall state of the app for whoever picks this up next (a future v1.5 sprint or a human reviewer).
```
