import { Card, CardBody, CardHeader } from "@/components/ui/Card/Card";
import StudentListingTable from "@/features/students/components/StudentListingTable";

export default function StudentsPage() {
  return (
    <div className="w-full bg-background p-1 sm:p-2 md:p-4">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Your Students</h2>
        </CardHeader>
        <CardBody>
          <StudentListingTable />
        </CardBody>
      </Card>
    </div>
  );
}
