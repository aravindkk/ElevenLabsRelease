import type { ReactNode } from "react";

export function TopBar({
  title,
  search,
}: {
  title?: string;
  search?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-outline-variant bg-surface px-6 py-3 text-primary shadow-sm">
      <div className="flex flex-1 items-center gap-6">
        {title && (
          <h1 className="text-headline-md font-bold text-text-primary">
            {title}
          </h1>
        )}
        {search}
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary"
          aria-label="History"
        >
          <span className="material-symbols-outlined">history</span>
        </button>
        <div className="mx-2 h-6 w-px bg-outline-variant" />
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-secondary-container px-4 py-2 text-label-sm font-semibold text-on-secondary-container shadow-sm transition-colors hover:bg-secondary"
        >
          <span className="h-2 w-2 rounded-full bg-on-tertiary-container" />
          Live Sync
        </button>
      </div>
    </header>
  );
}
