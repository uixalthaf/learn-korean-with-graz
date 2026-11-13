import { requireRole } from "@/lib/requiresRole";
import ForbiddenAccess from "@/components/shared/errors/ForbiddenAccess";
import TutorDashboard from "@/features/dashboard/components/TutorDashboard";

const Page = async () => {
  const { authorized, dashboardHref } = await requireRole("TUTOR");

  if (!authorized) {
    return <ForbiddenAccess dashboardHref={dashboardHref} />;
  }

  return <TutorDashboard />;
};

export default Page;
