# PRD: Project Nexus Hub

## 1. Why this product would work

Product managers at mid-to-large companies spend a disproportionate amount of their week acting as a human API: answering the same "what's the status of X" question from execs, sales, and other stakeholders, repeated across Slack threads, email, and standup recaps. The underlying information (sprint boards, GTM docs, exec summaries) already exists — the bottleneck is retrieval and synthesis, not data creation.

Conversational voice AI (ElevenLabs Conversational AI) has reached a point where a stakeholder can ask a natural-language question out loud and get a synthesized, source-grounded answer back in seconds, in a natural back-and-forth, without a PM in the loop. Project Nexus Hub packages this as an internal enterprise tool: point the agent at your knowledge sources, let anyone with access ask questions by voice, and keep a searchable transcript history so answers are auditable and reusable. This is worth building now specifically because ElevenLabs' Conversational AI SDK makes production-grade, low-latency voice agents embeddable in a web app without building STT/TTS/turn-taking infrastructure from scratch.

## 2. Market alternatives

What a stakeholder reaches for today instead of this product:

- **Direct Slack/email pings to the PM** — the default and the thing this product replaces. Slow, interrupts the PM, and the answer isn't captured anywhere reusable.
- **Status meetings / standups** — synchronous, low-frequency, and stakeholders who aren't in the room still don't get answers in real time.
- **Internal wikis (Notion, Confluence)** — require the stakeholder to already know where to look and to read, not ask; go stale because someone has to remember to update them.
- **General-purpose AI assistants wired to internal docs (Glean, Guru, internal ChatGPT/Claude + RAG)** — closest adjacent category. These are text-first search/chat tools over internal knowledge; they don't offer a voice-native, conversational interface tuned specifically for "ask about project status" and don't ship a purpose-built transcript/session UX for this use case.
- **Dashboards (Jira/Linear boards, Looker/Tableau reports)** — good for numbers, bad for "explain in plain language what changed and why," which is what stakeholders actually ask.

## 3. User pain points

- A VP of Sales, mid-call with a prospect, needs to know if a promised Q3 feature is still on track. They can't interrupt the call to Slack the PM and wait 20 minutes for a reply — they need an answer in the next 30 seconds, and they'd rather ask a question out loud than dig through a Jira board they don't have permissions or patience for.
- A PM gets the same "is GTM still on track for Sept 15?" question from three different stakeholders in one afternoon — once from an exec in a hallway, once in a Slack DM, once in a recurring sync — and answers it three times in three slightly different ways, none of which are written down anywhere.
- A new stakeholder joins a project mid-stream and has no fast way to get oriented — reading six weeks of Slack history or a stale wiki page isn't realistic before their first meeting on the project.
- An exec preparing for a board update wants to double check something a PM told them verbally two weeks ago but has no record of that conversation to go back to — there's no transcript, so they either trust their memory or re-ask.
- A stakeholder asks a follow-up question ("and what about the backend blockers?") expecting the same conversational thread to carry context, the way a real conversation with a PM would, not a fresh disconnected search query each time.

## 4. Goals and success metrics

- **Reduce PM interruption load**: measurable drop in status-related Slack/email pings to PMs from stakeholders who have adopted the tool (self-reported or inferred from usage volume replacing ping volume).
- **Time-to-answer**: median time from "stakeholder has a question" to "stakeholder has a spoken answer" under 30 seconds, end-to-end (auth already done, straight to mic tap → first agent response).
- **Adoption**: % of target stakeholder group (non-PM roles: sales, exec, support, cross-functional leads) who complete at least one voice query per week within 4 weeks of rollout.
- **Trust/accuracy**: low rate of "that answer was wrong or unhelpful" feedback (needs a lightweight feedback mechanism — flagged as a possible v2 feature) and high knowledge-base freshness (sources updated within a defined SLA, e.g. < 24h stale).
- **Retention of institutional knowledge**: % of voice sessions that get revisited via Past Transcripts (a proxy for whether the transcript archive is actually useful, not just a compliance afterthought).

## 5. Features to build

### Must-have (v1)

- **Google OAuth login gate** — enterprise-only access; no self-serve signup. Unauthenticated users are redirected to the login screen and cannot reach any app route.
- **Dashboard** — Knowledge Base Status cards (source name, domain tag, "last updated" freshness indicator) and the primary voice query entry point (large mic button + "New Voice Query" sidebar action).
- **Live voice conversation** — powered by the ElevenLabs Conversational AI agent (`agent_1901m04h5x08ej7a91czykww6dne`) via the ElevenLabs JS/React SDK, using a short-lived signed URL / conversation token minted by a backend route. The ElevenLabs API key never reaches the browser.
- **Real-time transcript rendering** — user and agent turns rendered live as the conversation happens, styled per design (blue right-aligned user bubbles, white left-aligned agent cards tagged with source domain), mic state (idle / listening / speaking) reflected visually per the design system's pulsing-ring treatment.
- **Session persistence** — every completed voice session is saved: title (derived from the first user utterance or agent-provided summary), start timestamp, duration, domain tags, full transcript (all turns).
- **Past Transcripts** — searchable/filterable list of past sessions (by title/keyword and by domain tag) with a detail view showing the full saved transcript.
- **Global navigation shell** — sidebar (Dashboard, Knowledge Base, Transcripts, Analytics, Settings, Help Center, Account) and top bar (notifications icon, history icon, Live Sync status pill) matching the design, present across all authenticated routes.
- **Responsive layout** for standard desktop/laptop widths (this is an internal enterprise tool primarily used at a desk; mobile is not a v1 requirement unless stated otherwise).

### Later (v1.5+ / explicitly out of scope for initial build)

- Real Knowledge Base integrations (pulling live freshness data from actual systems — Jira, Confluence, Slack, etc.) — v1 ships with mocked/seeded knowledge base status data.
- Functional Knowledge Base management screen (add/remove/configure sources).
- Functional Analytics screen (usage metrics, query volume, popular topics).
- Functional Settings screen beyond a placeholder (notification prefs, org/user management).
- Per-answer feedback mechanism (thumbs up/down on agent responses) for accuracy tracking.
- Role-based access control / per-domain permissions (e.g. restrict Exec Summary domain to certain roles).
- Multi-turn context carried explicitly across separate sessions (each session is self-contained in v1).
- Notifications (bell icon is present in the shell but not wired to real notifications in v1).

## 6. Edge cases

- **Mic/audio permission denied** — user denies browser mic access; show a clear inline error state explaining what to do, don't silently fail.
- **ElevenLabs connection failure** — signed URL fetch fails, WebSocket/session drops mid-conversation, or the agent times out — surface a visible error/reconnect state in the Active Voice Query view rather than a frozen "..." typing indicator.
- **Empty states** — no past transcripts yet (new user), no knowledge base sources configured, search with zero results.
- **Interrupted session** — user closes the tab or navigates away mid-conversation; partial transcript should still be persisted (best-effort) rather than lost entirely.
- **Auth edge cases** — OAuth token expiry mid-session, revoked access, user not in the allowed enterprise domain/org (if domain restriction is enforced).
- **Concurrent sessions** — same user opens a second voice query tab/window; define whether this is blocked or allowed as independent sessions.
- **Stale knowledge base data** — a source hasn't updated within SLA; dashboard should visually flag it (amber "Warning/Stale" state already defined in the design system) rather than presenting it as fresh.
- **Long transcripts** — a session runs long (the past-transcripts design shows sessions up to 1h12m); transcript detail view and live view must handle scrolling/virtualization gracefully, not degrade.
- **Search/filter edge cases** — special characters in search, filtering by a domain tag with no matching sessions.
- **Duplicate/rapid mic taps** — user taps the mic button repeatedly before a session initializes; must debounce/guard against duplicate session starts.

## 7. Phases of implementation

1. **Foundation** — project scaffold, design system tokens (colors/typography/spacing from `designs/internal_project_voice_agent/DESIGN.md`) wired into the styling layer, auth (Google OAuth) and route protection, app shell (sidebar + top bar) with static/mock data, deployed to a working hosting pipeline early.
2. **Core voice loop** — backend route to mint ElevenLabs signed URL/conversation token, ElevenLabs SDK integration on the client, Active Voice Query screen with live transcript rendering and mic/session state handling end-to-end against the real agent.
3. **Persistence & history** — data layer for sessions/transcripts, save-on-session-complete (and best-effort save-on-interrupt), Past Transcripts list + detail view wired to real saved data, search/filter.
4. **Dashboard & polish** — Knowledge Base Status cards wired to seeded/mocked data with freshness states, placeholder Settings/Analytics/Knowledge Base screens, empty states, error states, edge-case handling from Section 6, responsive/visual QA against the design screenshots.

## 8. GTM plan

This is an internal enterprise tool, so "go-to-market" means internal rollout, not public marketing:

- **Channel**: direct rollout inside the organization — announced via the same channels stakeholders currently use to ping PMs (Slack, email), framed as "ask Nexus Hub instead of pinging the team."
- **Initial positioning**: "Get an instant, spoken answer on any project's status — no more waiting on a PM to reply." Target the highest-friction stakeholder group first (likely sales/exec, given they're the most interrupt-driven and time-constrained).
- **Launch sequencing**: soft-launch with PMs/project owners first so they can seed and validate the knowledge base sources before opening access to the broader stakeholder group; expand access org-wide (or per-project) once a handful of real projects have live, fresh knowledge base data behind them. Track adoption metrics (Section 4) weekly post-launch to catch low engagement early.

## Open questions

1. **Backend/database for persistence**: no backend/data store has been chosen yet. Recommended default: Vercel-hosted Next.js app with a Postgres database provisioned via the Vercel Marketplace (e.g. Neon), used for both auth session/user records and voice session/transcript storage. Confirm before Sprint 1 locks in the stack.
2. **Knowledge Base data source**: is there a real system of record for "Engineering & Sprints," "Marketing & GTM," and "Executive Summary" freshness, or is this mocked/seeded for v1? PRD assumes **mocked/seeded data for v1** (Section 5), with real integration deferred to v1.5+. Confirm this assumption.
3. **Hosting target**: environment has both Vercel and Railway tooling available. Recommended default: **Vercel** (Next.js-native, integrates cleanly with the Postgres marketplace option above, and Vercel Functions support the streaming/WebSocket needs of the ElevenLabs SDK). Confirm before Sprint 1.
4. **OAuth domain restriction**: should Google sign-in be restricted to a specific company domain (e.g. `@company.com`), or is any Google account acceptable for v1 (with access control handled some other way)? Assumed domain-restricted for an enterprise-internal tool unless told otherwise.
