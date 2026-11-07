"use client";

import React from "react";
import { ArrowRight, Clock, Play, UserRound, Video } from "lucide-react";

import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card/Card";

import { useAppSelector } from "@/store/hooks";
import koreanBookCat from "@/assets/images/korean_book_cat.png";
import { Button } from "@/components/ui/Button/Button";
import ContinueCard from "./ContinueCard";

const StudentDashboard = () => {
  const user = useAppSelector((state) => state.auth.user);

  const upcomingSessions = [
    {
      id: 1,
      day: "Fri",
      date: "24",
      month: "Oct",
      title: "Korean Conversation Practice",
      time: "5:00 PM – 5:30 PM",
      tutor: "Minji Kim",
      action: "Join Session",
    },
    {
      id: 2,
      day: "Sun",
      date: "26",
      month: "Oct",
      title: "Beginner Korean – Lesson 3",
      time: "11:00 AM – 12:00 PM",
      tutor: "Jisoo Park",
      action: "View Details",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <section>
        <h2 className="text-3xl font-bold tracking-tight text-heading">
          Hello, {user?.name ?? "Student"}!
        </h2>

        <p className="mt-2 text-base text-muted-foreground">
          Keep going! You're making great progress.
        </p>
      </section>
      <ContinueCard title="Continue Learning" />
    </div>
  );
};

export default StudentDashboard;
