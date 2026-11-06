"use client";

import React from "react";
import { ArrowRight, Clock, Play, UserRound, Video } from "lucide-react";

import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card/Card";

import { useAppSelector } from "@/store/hooks";
import koreanBookCat from "@/assets/images/korean_book_cat.png";
import { Button } from "@/components/ui/Button/Button";

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
      <Card
        className="bg-primary text-white h-44 w-80"
        style={{
          backgroundImage: `url(${koreanBookCat.src})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: " cover",
        }}
      >
        <CardHeader>
          <CardTitle className="!text-lg">Continue Learning</CardTitle>
        </CardHeader>
        <CardBody>
          <Button variant="primary" size="sm" className="mt-4">
            Continue
            <Play className="ml-2 h-4 w-4" />
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentDashboard;
