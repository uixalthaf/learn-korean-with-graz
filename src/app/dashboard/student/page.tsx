import DashboardLayout from "@/components/ui/layout/layout";
import StudentDashboard from "@/features/dashboard/components/StudentDashboard";
import ForbiddenAccess from "@/components/shared/errors/ForbiddenAccess";
import { requireRole } from "@/lib/requiresRole";

const Page = async () => {
  const { authorized, dashboardHref } = await requireRole("STUDENT");

  if (!authorized) {
    return <ForbiddenAccess dashboardHref={dashboardHref} />;
  }

  return (
    <DashboardLayout>
      <StudentDashboard />
    </DashboardLayout>
  );
};

export default Page;
