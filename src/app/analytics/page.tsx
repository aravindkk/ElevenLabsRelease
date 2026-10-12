import { AppShell } from "@/components/shell/AppShell";
import { ComingSoon } from "@/components/shell/ComingSoon";

export default function AnalyticsPage() {
  return (
    <AppShell activeHref="/analytics" topBarTitle="Analytics">
      <ComingSoon
        icon="query_stats"
        title="Analytics"
        description="Usage metrics, query volume, and popular topics will land here in a future release."
      />
    </AppShell>
  );
}
