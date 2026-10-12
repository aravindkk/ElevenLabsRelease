import Link from "next/link";
import { signOut } from "@/auth";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Knowledge Base", icon: "database", href: "/knowledge-base" },
  { label: "Transcripts", icon: "record_voice_over", href: "/transcripts" },
  { label: "Analytics", icon: "query_stats", href: "/analytics" },
  { label: "Settings", icon: "settings", href: "/settings" },
] as const;

type SidebarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

function getInitials(user: SidebarUser | undefined) {
  const source = user?.name ?? user?.email ?? "";
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function Sidebar({
  activeHref,
  user,
}: {
  activeHref: string;
  user?: SidebarUser;
}) {
  return (
    <nav className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-outline-variant bg-primary-container px-4 py-6">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container shadow-sm">
          <span className="material-symbols-outlined text-on-secondary-container">
            hub
          </span>
        </div>
        <div>
          <h1 className="truncate text-title-md font-bold text-on-primary">
            Project Nexus Hub
          </h1>
          <p className="text-label-sm text-on-primary-container">
            Enterprise Voice AI
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === activeHref;
          return (
            <a
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "group flex items-center gap-3 rounded-lg px-3 py-2 font-bold text-on-primary transition-colors duration-200 bg-secondary-container hover:bg-primary-fixed-variant"
                  : "group flex items-center gap-3 rounded-lg px-3 py-2 text-on-primary-container transition-colors duration-200 hover:bg-primary-fixed-variant hover:text-on-primary"
              }
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-label-md">{item.label}</span>
            </a>
          );
        })}
      </div>

      <div className="mb-6 mt-auto px-2">
        <Link
          href="/voice"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary-container px-4 py-2.5 text-label-md font-semibold text-on-secondary-container shadow-sm transition-colors hover:bg-secondary"
        >
          <span className="material-symbols-outlined">mic</span>
          New Voice Query
        </Link>
      </div>

      <div className="space-y-1 border-t border-outline-variant/30 pt-4">
        <a
          href="/help"
          className="group flex items-center gap-3 rounded-lg px-3 py-2 text-on-primary-container transition-colors duration-200 hover:bg-primary-fixed-variant hover:text-on-primary"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="text-label-md">Help Center</span>
        </a>
        <a
          href="/account"
          className="group flex items-center gap-3 rounded-lg px-3 py-2 text-on-primary-container transition-colors duration-200 hover:bg-primary-fixed-variant hover:text-on-primary"
        >
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt=""
              className="h-6 w-6 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-container text-[10px] font-bold text-on-secondary-container">
              {getInitials(user)}
            </div>
          )}
          <span className="truncate text-label-md">
            {user?.name ?? user?.email ?? "Account"}
          </span>
        </a>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-on-primary-container transition-colors duration-200 hover:bg-primary-fixed-variant hover:text-on-primary"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-label-md">Sign out</span>
          </button>
        </form>
      </div>
    </nav>
  );
}
