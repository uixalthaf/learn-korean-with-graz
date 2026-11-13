import DashboardLayout from "@/components/ui/layout/layout";
import MessagesPage from "@/features/messages/components/MessagesPage";
import { getSession } from "@/lib/getSession";

export default async function Page() {
  await getSession();

  return (
    <DashboardLayout>
      <MessagesPage />
    </DashboardLayout>
  );
}
