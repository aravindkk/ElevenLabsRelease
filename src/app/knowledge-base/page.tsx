import { AppShell } from "@/components/shell/AppShell";
import { ComingSoon } from "@/components/shell/ComingSoon";

export default function KnowledgeBasePage() {
  return (
    <AppShell activeHref="/knowledge-base" topBarTitle="Knowledge Base">
      <ComingSoon
        icon="database"
        title="Knowledge Base management"
        description="Adding, removing, and configuring knowledge base sources will be available in a future release. Source status is already visible on the Dashboard."
      />
    </AppShell>
  );
}
