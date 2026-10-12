// Mocked/seeded Knowledge Base source data for v1 (no real external KB integration — see PRD.md Section 5).
// A source is "stale" once its lastUpdatedAt falls outside the freshness SLA (PRD Section 4: <24h).

export const KB_FRESHNESS_SLA_HOURS = 24;

export type KnowledgeBaseSource = {
  icon: string;
  title: string;
  domainTag: string;
  lastUpdatedAt: Date;
};

const HOUR = 60 * 60 * 1000;

export function getKnowledgeBaseSources(now: Date = new Date()): KnowledgeBaseSource[] {
  return [
    {
      icon: "engineering",
      title: "Engineering & Sprints",
      domainTag: "Engineering",
      lastUpdatedAt: new Date(now.getTime() - 10 * 60 * 1000),
    },
    {
      icon: "campaign",
      title: "Marketing & GTM",
      domainTag: "GTM",
      lastUpdatedAt: new Date(now.getTime() - 30 * HOUR),
    },
    {
      icon: "summarize",
      title: "Executive Summary",
      domainTag: "Exec Summary",
      lastUpdatedAt: new Date(now.getTime() - 3 * HOUR),
    },
  ];
}

export function isStale(lastUpdatedAt: Date, now: Date = new Date()) {
  return now.getTime() - lastUpdatedAt.getTime() > KB_FRESHNESS_SLA_HOURS * HOUR;
}

export function formatRelativeTime(date: Date, now: Date = new Date()) {
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.round(diffMs / (60 * 1000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
