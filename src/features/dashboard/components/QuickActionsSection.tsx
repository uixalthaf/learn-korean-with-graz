import React from "react";
import tutorDashboardData from "@/app/dashboard/tutor/tutorDashboardData";
import { Card, CardBody, CardHeader } from "@/components/ui/Card/Card";

const QuickActionsSection = () => {
  return (
    <Card>
      <CardHeader></CardHeader>
      <CardBody>
        {tutorDashboardData.quickActions.map((action) => (
          <div key={action.id}>
            <p>{action.title}</p>
            <p>{action.description}</p>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default QuickActionsSection;
