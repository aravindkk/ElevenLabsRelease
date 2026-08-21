export function KnowledgeBaseCard({
  icon,
  title,
  domainTag,
  lastUpdated,
}: {
  icon: string;
  title: string;
  domainTag: string;
  lastUpdated: string;
}) {
  return (
    <div className="rounded-xl border border-outline-variant/50 bg-surface p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-lg bg-surface-container p-2">
          <span className="material-symbols-outlined text-secondary-container">
            {icon}
          </span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface-container-low px-2 py-1 text-label-sm text-text-secondary">
          <span className="h-1.5 w-1.5 rounded-full bg-on-tertiary-container shadow-[0_0_8px_rgba(0,150,104,0.6)]" />
          {domainTag}
        </span>
      </div>
      <h3 className="mb-1 text-headline-sm text-text-primary">{title}</h3>
      <p className="text-label-md text-text-secondary">
        Last updated: {lastUpdated}
      </p>
    </div>
  );
}
