import { auth } from "@/auth";
import { db } from "@/lib/db";
import { voiceSessions } from "@/lib/db/schema";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [row] = await db
    .insert(voiceSessions)
    .values({ userId: session.user.id })
    .returning({ id: voiceSessions.id });

  return Response.json({ id: row.id });
}
