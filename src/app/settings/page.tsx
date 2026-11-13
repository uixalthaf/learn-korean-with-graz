import DashboardLayout from "@/components/ui/layout/layout";
import SettingsPage from "@/features/settings/components/SettingsPage";
import { getSession } from "@/lib/getSession";

export default async function Page() {
  await getSession();

  return (
    <DashboardLayout>
      <SettingsPage />
    </DashboardLayout>
  );
}
