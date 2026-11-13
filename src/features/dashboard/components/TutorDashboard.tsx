"use client";
import { useEffect, useState } from "react";

import { TUTOR_NAME } from "@/config/tutorInfo";
import StatisticsCard from "@/features/dashboard/components/StatisticsCard";
import StudentsListingSection from "@/features/dashboard/components/StudentsListingSection";
import ContinueCard from "./ContinueCard";
import ScheduledClassesList from "@/features/sessions/components/ScheduledClassesList";
import { useScheduledClasses } from "@/features/sessions/hooks/useScheduledClasses";
import { formatDate } from "@/lib/formatDate";

const TutorDashboard = () => {
  const scheduledClasses = useScheduledClasses();
  const [todaysDate, setTodaysDate] = useState("");

  useEffect(() => {
    // Keep the tutor's local calendar date from disagreeing with the server during hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodaysDate(formatDate(new Date()));
  }, []);
  return (
    <div className="w-full bg-background p-1 sm:p-2 md:p-4">
      <div>
        <span>{todaysDate}</span>
        <h2 className="font-bold font-georgia text-xl sm:text-2xl">
          Good Morning , <span>{TUTOR_NAME}</span>
        </h2>
        <span>Today you are teaching 3 group classes. Let&apos;s have a great day.</span>
      </div>

      <StatisticsCard />

      <div className="dashboard-content-grid mt-4 flex gap-4">
        <div className="dashboard-students-panel h-full w-80 min-w-0">
          {/* <CoursesListingSection /> hasnt been inlcuded in the dashboard yet, will be added later */}

          <StudentsListingSection />
        </div>
        <div className="dashboard-primary-panel h-full min-w-0 flex-1">
          <ContinueCard title="Continue Teaching" />
          <div className="mt-4">
            <ScheduledClassesList {...scheduledClasses} audience="tutor" />
          </div>
          {/* <GroupSessionsSection /> */}
          {/* <QuickActionsSection /> hasnt been inlcuded in the dashboard yet, will be added later */}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
