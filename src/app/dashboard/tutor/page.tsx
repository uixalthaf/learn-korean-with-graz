import { requireRole } from "@/lib/requiresRole";
import ForbiddenAccess from "@/components/shared/errors/ForbiddenAccess";
import DashboardLayout from "@/components/ui/layout/layout";
import TutorDashboard from "@/features/dashboard/components/TutorDashboard";

const Page = async () => {
  const { authorized, dashboardHref } = await requireRole("TUTOR");

  if (!authorized) {
    return <ForbiddenAccess dashboardHref={dashboardHref} />;
  }

  return (
    <DashboardLayout>
      <TutorDashboard />
    </DashboardLayout>
  );
};

export default Page;
