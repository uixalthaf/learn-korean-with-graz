import React from "react";

import { TUTOR_NAME } from "@/config/tutorInfo";
import StatisticsCard from "@/features/dashboard/components/StatisticsCard";
import GroupSessionsSection from "@/features/dashboard/components/GroupSessionsSection";
import StudentsListingSection from "@/features/dashboard/components/StudentsListingSection";
import CoursesListingSection from "@/features/dashboard/components/CoursesListingSection";
import QuickActionsSection from "@/features/dashboard/components/QuickActionsSection";

const AppBody = () => {
  return (
    <div className="max-h-[calc(100vh-64px)] w-full bg-background p-4">
      <div>
        <span>Thu 23 Oct 2026 </span>
        <h2 className="font-bold font-georgia text-2xl">
          Good Morning , <span>{TUTOR_NAME}</span>
        </h2>
        <span>Today you are teaching 3 group classes Let's have a greay day.</span>
      </div>

      <StatisticsCard />
      <div className="mt-4 flex gap-4">
        <div className="flex-1 h-full">
          <GroupSessionsSection />
          {/* <QuickActionsSection /> hasnt been inlcuded in the dashboard yet, will be added later */}
        </div>
        <div className=" flex-1 h-full">
          {/* <CoursesListingSection /> hasnt been inlcuded in the dashboard yet, will be added later */}
          <StudentsListingSection />
        </div>
      </div>
    </div>
  );
};

export default AppBody;
