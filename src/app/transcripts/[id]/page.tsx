import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { AppShell } from "@/components/shell/AppShell";
import { db } from "@/lib/db";
import { transcriptTurns, voiceSessions } from "@/lib/db/schema";
import { formatDuration, formatSessionDateTime } from "@/lib/session-format";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default async function TranscriptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const userId = session!.user!.id!;
  const { id } = await params;

  const [voiceSession] = await db
    .select()
    .from(voiceSessions)
    .where(and(eq(voiceSessions.id, id), eq(voiceSessions.userId, userId)))
    .limit(1);

  if (!voiceSession) notFound();

  const turns = await db
    .select()
    .from(transcriptTurns)
    .where(eq(transcriptTurns.sessionId, id))
    .orderBy(asc(transcriptTurns.sequence));

  const lastTurnAt = turns.length > 0 ? turns[turns.length - 1].createdAt : null;

  return (
    <AppShell activeHref="/transcripts">
      <div className="flex flex-1 flex-col">
        <div className="mb-stack-md flex items-center justify-between gap-4 border-b border-outline-variant/50 pb-stack-md">
          <div>
            <Link
              href="/transcripts"
              className="mb-2 flex items-center gap-1 text-label-md text-text-secondary hover:text-secondary"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              Back to Past Transcripts
            </Link>
            <h2 className="text-headline-md text-text-primary">
              {voiceSession.title ?? "Untitled session"}
            </h2>
            <div className="mt-1 flex items-center gap-3 text-label-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  calendar_today
                </span>
                {formatSessionDateTime(voiceSession.startedAt)}
              </span>
              <span className="h-1 w-1 rounded-full bg-outline-variant" />
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  timer
                </span>
                {formatDuration(voiceSession.startedAt, voiceSession.endedAt ?? lastTurnAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-stack-lg overflow-y-auto py-stack-lg">
          {turns.length === 0 && (
            <p className="text-center text-body-md text-text-secondary">
              This session has no saved turns.
            </p>
          )}

          {turns.map((turn) =>
            turn.role === "user" ? (
              <div key={turn.id} className="flex flex-col items-end gap-1">
                <div className="max-w-[85%] rounded-t-xl rounded-bl-xl rounded-br-sm bg-secondary p-4 text-on-secondary shadow-sm">
                  <p className="text-body-lg">{turn.text}</p>
                </div>
                <div className="flex items-center gap-1 text-label-sm text-text-secondary">
                  <span>{formatTime(turn.createdAt)}</span>
                  <span className="material-symbols-outlined text-[14px]">
                    check_circle
                  </span>
                </div>
              </div>
            ) : (
              <div key={turn.id} className="flex flex-col items-start gap-1">
                <div className="flex max-w-[85%] items-end gap-3">
                  <div className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high text-primary shadow-sm">
                    <span className="material-symbols-outlined">smart_toy</span>
                  </div>
                  <div className="rounded-t-xl rounded-br-xl rounded-bl-sm border border-outline-variant/60 bg-surface p-5 text-text-primary shadow-sm">
                    <p className="text-body-lg leading-relaxed">{turn.text}</p>
                  </div>
                </div>
                <div className="pl-11 text-label-sm text-text-secondary">
                  <span>{formatTime(turn.createdAt)}</span>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </AppShell>
  );
}
