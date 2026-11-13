"use client";

import { useAppSelector } from "@/store/hooks";
import ContinueCard from "./ContinueCard";
import ScheduledClassesList from "@/features/sessions/components/ScheduledClassesList";
import { useScheduledClasses } from "@/features/sessions/hooks/useScheduledClasses";

const StudentDashboard = () => {
  const user = useAppSelector((state) => state.auth.user);
  const scheduledClasses = useScheduledClasses();

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <section>
        <h2 className="text-3xl font-bold tracking-tight text-heading">
          Hello, {user?.name ?? "Student"}!
        </h2>

        <p className="mt-2 text-base text-muted">
          Keep going! You&apos;re making great progress.
        </p>
      </section>
      <ContinueCard title="Continue Learning" />
      <ScheduledClassesList {...scheduledClasses} audience="student" />
    </div>
  );
};

export default StudentDashboard;
