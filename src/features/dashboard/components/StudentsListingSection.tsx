import tutorDashboardData from "@/app/dashboard/tutor/tutorDashboardData";
import { Card, CardBody, CardHeader } from "@/components/ui/Card/Card";
import React from "react";

const StudentsListingSection = () => {
  return (
    <Card>
      <CardHeader></CardHeader>
      <CardBody>
        {tutorDashboardData.students.map((student) => (
          <div key={student.id}>
            <p>{student.name}</p>
            <p>{student.email}</p>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default StudentsListingSection;
