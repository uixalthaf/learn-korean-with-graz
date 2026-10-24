import React from "react";
import tutorDashboardData from "@/app/dashboard/tutor/tutorDashboardData";
import { Card, CardBody, CardHeader } from "@/components/ui/Card/Card";

const CoursesListingSection = () => {
  return (
    <Card>
      <CardHeader></CardHeader>
      <CardBody>
        {tutorDashboardData.courses.map((course) => (
          <div key={course.id}>
            <p>{course.title}</p>
            <p>{course.description}</p>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default CoursesListingSection;
