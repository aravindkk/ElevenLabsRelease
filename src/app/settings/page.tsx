import { AppShell } from "@/components/shell/AppShell";
import { ComingSoon } from "@/components/shell/ComingSoon";

export default function SettingsPage() {
  return (
    <AppShell activeHref="/settings" topBarTitle="Settings">
      <ComingSoon
        icon="settings"
        title="Settings"
        description="Notification preferences and organization/user management are on the roadmap for a future release."
      />
    </AppShell>
  );
}
