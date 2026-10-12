import { auth } from "@/auth";
import { db } from "@/lib/db";
import { transcriptTurns, voiceSessions } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { classifyDomainTags } from "@/lib/domain-tags";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body: { title?: string } = await request.json().catch(() => ({}));

  const [owned] = await db
    .select({ id: voiceSessions.id })
    .from(voiceSessions)
    .where(and(eq(voiceSessions.id, id), eq(voiceSessions.userId, session.user.id)))
    .limit(1);

  if (!owned) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  const turns = await db
    .select({ text: transcriptTurns.text })
    .from(transcriptTurns)
    .where(eq(transcriptTurns.sessionId, id));

  const classificationText = [body.title ?? "", ...turns.map((t) => t.text)].join(" ");
  const domainTags = classifyDomainTags(classificationText);

  await db
    .update(voiceSessions)
    .set({
      endedAt: new Date(),
      ...(body.title ? { title: body.title } : {}),
      domainTags,
    })
    .where(eq(voiceSessions.id, id));

  return Response.json({ ok: true });
}
