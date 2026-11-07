"use client";
import tutorDashboardData from "@/app/dashboard/tutor/tutorDashboardData";
import { Card, CardBody, CardHeader } from "@/components/ui/Card/Card";
import React, { useEffect, useState } from "react";
import { getTutorDashboardData } from "../api/dashboard.api";
import { ArrowRight, FaceExpressionless, Mail } from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string;
};
const StudentsListingSection = () => {
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getTutorDashboardData();
        console.log(studentsData);
        setStudentsData(response.students);
      } catch (error) {
        console.log("error while feching student data", error);
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
