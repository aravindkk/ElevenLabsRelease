import type { ReactNode } from "react";
import { auth } from "@/auth";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export async function AppShell({
  activeHref,
  topBarTitle,
  topBarSearch,
  children,
}: {
  activeHref: string;
  topBarTitle?: string;
  topBarSearch?: ReactNode;
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeHref={activeHref} user={session?.user} />
      <main className="ml-64 flex h-screen flex-1 flex-col overflow-hidden bg-background">
        <TopBar title={topBarTitle} search={topBarSearch} />
        <div className="relative flex-1 overflow-y-auto p-gutter">
          <div className="mx-auto flex h-full max-w-container-max flex-col">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
