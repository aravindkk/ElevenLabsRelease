import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({
  activeHref,
  children,
}: {
  activeHref: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeHref={activeHref} />
      <main className="ml-64 flex h-screen flex-1 flex-col overflow-hidden bg-background">
        <TopBar />
        <div className="relative flex-1 overflow-y-auto p-gutter">
          <div className="mx-auto flex h-full max-w-container-max flex-col">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
