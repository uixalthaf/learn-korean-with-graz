"use client";
import { Card, CardBody, CardHeader } from "@/components/ui/Card/Card";
import { useEffect, useState } from "react";
import { getTutorDashboardData } from "../api/dashboard.api";
import { ArrowRight } from "lucide-react";
import type { StudentSummary } from "../api/dashboard.api.types";

const StudentsListingSection = () => {
  const [studentsData, setStudentsData] = useState<StudentSummary[]>([]);
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getTutorDashboardData();
        setStudentsData(response.students);
      } catch (error) {
        console.error("Unable to load tutor student summary.", error);
      }
    };
    fetchStudents();
  }, []);
  return (
    <Card>
      <CardHeader>
        <div className="w-100 flex items-center gap-2 justify-between">
          Your Students
          <a className="flex items-center gap-1 text-sm" href="/students">
            View All <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-2">
          {studentsData.map((student) => (
            <p className="flex gap-2" key={student.id}>
              {student.name}
            </p>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default StudentsListingSection;
