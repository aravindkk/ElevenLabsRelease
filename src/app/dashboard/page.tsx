import { AppShell } from "@/components/shell/AppShell";
import { KnowledgeBaseCard } from "@/components/dashboard/KnowledgeBaseCard";

const KB_SOURCES = [
  {
    icon: "engineering",
    title: "Engineering & Sprints",
    domainTag: "Engineering",
    lastUpdated: "10 mins ago",
  },
  {
    icon: "campaign",
    title: "Marketing & GTM",
    domainTag: "GTM",
    lastUpdated: "10 mins ago",
  },
  {
    icon: "summarize",
    title: "Executive Summary",
    domainTag: "Exec Summary",
    lastUpdated: "10 mins ago",
  },
] as const;

export default function DashboardPage() {
  return (
    <AppShell activeHref="/dashboard">
      <div className="mb-stack-lg">
        <h2 className="mb-stack-sm text-headline-md text-text-primary">
          Knowledge Base Status
        </h2>
        <p className="mb-stack-md text-body-md text-text-secondary">
          System sources are active and indexing real-time data.
        </p>
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          {KB_SOURCES.map((source) => (
            <KnowledgeBaseCard key={source.title} {...source} />
          ))}
        </div>
      </div>

      <div className="flex min-h-[400px] flex-1 flex-col items-center justify-center">
        <div className="group relative mb-stack-md flex h-48 w-48 cursor-pointer items-center justify-center">
          <div className="pulse-ring absolute inset-0 rounded-full bg-secondary-container/20 transition-colors group-hover:bg-secondary-container/30" />
          <div className="pulse-ring-2 absolute inset-4 rounded-full bg-secondary-container/30 transition-colors group-hover:bg-secondary-container/40" />
          <div className="pulse-ring-3 absolute inset-8 rounded-full bg-secondary-container/40 transition-colors group-hover:bg-secondary-container/50" />
          <button
            type="button"
            className="relative z-10 flex h-24 w-24 transform items-center justify-center rounded-full border-4 border-surface bg-secondary-container text-on-secondary-container shadow-lg transition-all duration-300 hover:scale-105 hover:bg-secondary"
            aria-label="Start a new voice query"
          >
            <span className="material-symbols-outlined text-[40px]">mic</span>
          </button>
        </div>
        <h3 className="mb-2 text-headline-sm text-text-primary">
          Tap to ask about project status
        </h3>
        <p className="max-w-md text-center text-body-md text-text-secondary">
          Nexus Hub is connected to all active project streams. Ask a
          question to get instant, synthesized insights.
        </p>
      </div>
    </AppShell>
  );
}
