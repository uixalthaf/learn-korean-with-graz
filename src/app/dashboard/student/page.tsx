import DashboardLayout from "@/components/ui/layout/layout";
import StudentDashboard from "@/features/dashboard/components/StudentDashboard";

const page = () => {
  return (
    <DashboardLayout>
      <StudentDashboard />
    </DashboardLayout>
  );
};

export default page;
