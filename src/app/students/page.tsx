import { Card, CardBody, CardHeader } from "@/components/ui/Card/Card";
import DashboardLayout from "@/components/ui/layout/layout";
import StudentListingTable from "@/features/students/components/StudentListingTable";

const page = () => {
  return (
    <DashboardLayout>
      <div className="max-h-[calc(100vh-64px)] w-full bg-background p-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Your Students</h2>
          </CardHeader>
          <CardBody>
            <StudentListingTable />
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default page;
