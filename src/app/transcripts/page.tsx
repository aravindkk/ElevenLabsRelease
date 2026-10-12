import Link from "next/link";
import { and, desc, eq, exists, ilike, inArray, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { AppShell } from "@/components/shell/AppShell";
import { db } from "@/lib/db";
import { transcriptTurns, voiceSessions } from "@/lib/db/schema";
import { classifyDomainTags } from "@/lib/domain-tags";
import { formatDuration, formatSessionDateTime } from "@/lib/session-format";

const ALL_DOMAIN_TAGS = ["Engineering", "GTM", "Exec Summary"];

// Escape ILIKE wildcard characters so a search term like "50%" or "a_b" is
// matched literally instead of as a SQL LIKE pattern.
function escapeLikePattern(value: string) {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}

export default async function TranscriptsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const session = await auth();
  const userId = session!.user!.id!;
  const { q, tag } = await searchParams;

  const searchTerm = q?.trim();

  const whereClauses = [eq(voiceSessions.userId, userId)];
  if (searchTerm) {
    const pattern = `%${escapeLikePattern(searchTerm)}%`;
    whereClauses.push(
      sql`(${ilike(voiceSessions.title, pattern)} or ${exists(
        db
          .select({ one: sql`1` })
          .from(transcriptTurns)
          .where(
            and(
              eq(transcriptTurns.sessionId, voiceSessions.id),
              ilike(transcriptTurns.text, pattern),
            ),
          ),
      )})`,
    );
  }

  const rows = await db
    .select({
      id: voiceSessions.id,
      title: voiceSessions.title,
      startedAt: voiceSessions.startedAt,
      endedAt: voiceSessions.endedAt,
      domainTags: voiceSessions.domainTags,
      lastTurnAt: sql<Date | null>`(select max(${transcriptTurns.createdAt}) from ${transcriptTurns} where ${transcriptTurns.sessionId} = ${voiceSessions.id})`,
    })
    .from(voiceSessions)
    .where(and(...whereClauses))
    .orderBy(desc(voiceSessions.startedAt));

  const sessions = rows.map((row) => ({
    ...row,
    tags:
      row.domainTags && row.domainTags.length > 0
        ? row.domainTags
        : classifyDomainTags(row.title ?? ""),
  }));

  const filtered = tag ? sessions.filter((s) => s.tags.includes(tag)) : sessions;

  const searchForm = (
    <form method="GET" className="relative ml-auto max-w-md flex-1">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
        search
      </span>
      {tag && <input type="hidden" name="tag" value={tag} />}
      <input
        type="text"
        name="q"
        defaultValue={q ?? ""}
        placeholder="Search past queries..."
        className="w-full rounded-lg border border-outline-variant bg-surface py-2 pl-10 pr-4 text-body-md text-text-primary outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
      />
    </form>
  );

  return (
    <AppShell activeHref="/transcripts" topBarTitle="Past Transcripts" topBarSearch={searchForm}>
      <div className="mb-stack-md flex flex-wrap items-center gap-2">
        <Link
          href="/transcripts"
          className={
            !tag
              ? "rounded-full bg-secondary px-3 py-1 text-label-sm font-semibold text-on-secondary"
              : "rounded-full border border-outline-variant px-3 py-1 text-label-sm text-text-secondary hover:bg-surface-container-low"
          }
        >
          All
        </Link>
        {ALL_DOMAIN_TAGS.map((t) => (
          <Link
            key={t}
            href={{
              pathname: "/transcripts",
              query: { ...(q ? { q } : {}), tag: t },
            }}
            className={
              tag === t
                ? "rounded-full bg-secondary px-3 py-1 text-label-sm font-semibold text-on-secondary"
                : "rounded-full border border-outline-variant px-3 py-1 text-label-sm text-text-secondary hover:bg-surface-container-low"
            }
          >
            {t}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-24 text-center text-text-secondary">
          <span className="material-symbols-outlined mb-4 text-[48px] text-outline-variant">
            history
          </span>
          {sessions.length === 0 ? (
            <>
              <h3 className="mb-1 text-headline-sm text-text-primary">
                No past transcripts yet
              </h3>
              <p className="max-w-md text-body-md">
                Start a voice query and it will show up here once it&apos;s
                complete.
              </p>
            </>
          ) : (
            <>
              <h3 className="mb-1 text-headline-sm text-text-primary">
                No matching transcripts
              </h3>
              <p className="max-w-md text-body-md">
                Try a different search term or filter.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-gutter pb-8">
          {filtered.map((s) => (
            <Link
              key={s.id}
              href={`/transcripts/${s.id}`}
              className="group flex flex-col justify-between gap-4 rounded-xl border border-outline-variant/60 bg-surface p-6 transition-shadow hover:shadow-md md:flex-row md:items-center"
            >
              <div className="flex flex-1 flex-col gap-2">
                <h2 className="text-headline-sm font-semibold text-text-primary transition-colors group-hover:text-secondary">
                  {s.title ?? "Untitled session"}
                </h2>
                <div className="flex items-center gap-3 text-label-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      calendar_today
                    </span>
                    {formatSessionDateTime(s.startedAt)}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-outline-variant" />
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      timer
                    </span>
                    {formatDuration(s.startedAt, s.endedAt ?? s.lastTurnAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-surface-container-low px-3 py-1 text-label-sm font-semibold uppercase text-text-primary"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center md:ml-8">
                <span className="flex items-center gap-1 text-label-md font-medium text-secondary group-hover:underline">
                  View Full Transcript
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
