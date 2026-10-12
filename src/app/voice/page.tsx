import { auth } from "@/auth";
import { Sidebar } from "@/components/shell/Sidebar";
import { ActiveVoiceQuery } from "@/components/voice/ActiveVoiceQuery";

export default async function VoicePage() {
  const session = await auth();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeHref="/dashboard" user={session?.user} />
      <main className="relative ml-64 flex h-screen flex-1 flex-col overflow-hidden bg-background">
        <ActiveVoiceQuery />
      </main>
    </div>
  );
}
