// Best-effort domain-tag classification for a voice session.
//
// The ElevenLabs SDK gives no per-utterance domain/source field (see Sprint 3's
// Progress Log entry), and there's no real Knowledge Base integration in v1
// (mocked data only, see src/lib/kb-seed.ts). So a session's domain tags are
// derived by keyword-matching its title + transcript text against the same
// domain tags used for the mocked KB sources — an approximation, not a real
// classification, but enough to power the Past Transcripts filter UI.

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  Engineering: [
    "engineering",
    "sprint",
    "backend",
    "frontend",
    "blocker",
    "deploy",
    "bug",
    "code",
    "api",
  ],
  GTM: [
    "gtm",
    "go-to-market",
    "marketing",
    "campaign",
    "launch",
    "positioning",
    "messaging",
  ],
  "Exec Summary": [
    "exec",
    "executive",
    "summary",
    "strategy",
    "review",
    "kickoff",
    "roadmap",
    "quarterly",
    "performance",
  ],
};

export function classifyDomainTags(text: string): string[] {
  const lower = text.toLowerCase();
  const tags = Object.entries(DOMAIN_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => lower.includes(keyword)))
    .map(([tag]) => tag);
  return tags;
}
