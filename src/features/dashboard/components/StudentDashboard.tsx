"use client";
import React from "react";
import { useAppSelector } from "@/store/hooks";

const StudentDashboard = () => {
  const userName = useAppSelector((state) => state.auth.user);
  return (
    <div>
      <h2>Hey {userName?.name ?? "Student"}</h2>
    </div>
  );
};

export default StudentDashboard;
