# Project Nexus Hub

Internal enterprise web app: stakeholders get instant voice-driven project status updates via an ElevenLabs Conversational AI agent (`agent_1901m04h5x08ej7a91czykww6dne`), instead of pinging PMs. See `PRD.md` for full product context.

This is a fresh repo — no code has been scaffolded yet. Build proceeds as 6 sequential sprints; see `ImplementationPlan.md` for scope-per-sprint, locked-in stack decisions, and the Progress Log (handover notes between sprints). Starting prompts for each sprint are in `STARTING_PROMPTS.md`.

## Stack (locked in — see ImplementationPlan.md for detail)

- Next.js (App Router, TypeScript) on Vercel
- Postgres via Vercel Marketplace (Neon)
- Auth.js (NextAuth v5), Google OAuth, domain-restricted
- ElevenLabs Conversational AI via `@elevenlabs/client`, token minted server-side only — `ELEVENLABS_API_KEY` must never reach the browser
- Tailwind CSS, tokens sourced from `designs/internal_project_voice_agent/DESIGN.md` front-matter

## Conventions

- Design references: `designs/<screen_name>/code.html` + `screen.png` for each screen; match these, not just written descriptions.
- Every sprint session must end by appending an entry to `ImplementationPlan.md`'s Progress Log before finishing — read the latest entries there before starting any work.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
