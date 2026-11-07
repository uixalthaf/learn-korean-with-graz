"use client";
import React, { useEffect, useState } from "react";

import { TUTOR_NAME } from "@/config/tutorInfo";
import StatisticsCard from "@/features/dashboard/components/StatisticsCard";
import GroupSessionsSection from "@/features/dashboard/components/GroupSessionsSection";
import StudentsListingSection from "@/features/dashboard/components/StudentsListingSection";
import CoursesListingSection from "@/features/dashboard/components/CoursesListingSection";
import QuickActionsSection from "@/features/dashboard/components/QuickActionsSection";
import ContinueCard from "./ContinueCard";
import { formatDate } from "@/lib/formatDate";

const TutorDashboard = () => {
  const [todaysDate, setTodaysDate] = useState("");

  useEffect(() => {
    setTodaysDate(formatDate(new Date()));
  }, []);
  return (
    <div className="max-h-[calc(100vh-64px)] w-full bg-background p-6">
      <div>
        <span>{todaysDate}</span>
        <h2 className="font-bold font-georgia text-2xl">
          Good Morning , <span>{TUTOR_NAME}</span>
        </h2>
        <span>Today you are teaching 3 group classes Let's have a greay day.</span>
      </div>

      <StatisticsCard />

      <div className="mt-4 flex gap-4">
        <div className="h-full w-80">
          {/* <CoursesListingSection /> hasnt been inlcuded in the dashboard yet, will be added later */}

          <StudentsListingSection />
        </div>
        <div className="flex-1 h-full">
          <ContinueCard title="Continue Teaching" />
          {/* <GroupSessionsSection /> */}
          {/* <QuickActionsSection /> hasnt been inlcuded in the dashboard yet, will be added later */}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
