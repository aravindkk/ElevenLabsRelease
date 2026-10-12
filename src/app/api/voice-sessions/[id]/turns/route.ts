import { auth } from "@/auth";
import { db } from "@/lib/db";
import { transcriptTurns, voiceSessions } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body: {
    role?: "user" | "agent";
    text?: string;
    sequence?: number;
    title?: string;
  } = await request.json().catch(() => ({}));

  if (!body.role || !body.text || typeof body.sequence !== "number") {
    return Response.json({ error: "Invalid turn payload" }, { status: 400 });
  }

  const [owned] = await db
    .select({ id: voiceSessions.id })
    .from(voiceSessions)
    .where(and(eq(voiceSessions.id, id), eq(voiceSessions.userId, session.user.id)))
    .limit(1);

  if (!owned) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  await db.insert(transcriptTurns).values({
    sessionId: id,
    role: body.role,
    text: body.text,
    sequence: body.sequence,
  });

  if (body.title) {
    await db
      .update(voiceSessions)
      .set({ title: body.title })
      .where(eq(voiceSessions.id, id));
  }

  return Response.json({ ok: true });
}
