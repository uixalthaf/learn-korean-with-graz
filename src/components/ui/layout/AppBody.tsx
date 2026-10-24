import React from "react";
import { Card, CardBody } from "../Card/Card";
import { Book, Calendar, GroupIcon, Paperclip } from "lucide-react";
import { TUTOR_NAME } from "@/config/tutorInfo";

const statisticsData = [
  {
    id: "total-students",
    title: "Total Students",
    value: 24,
    change: "+2",
    changeLabel: "joined this week",
    icon: "Users",
    color: "sage",
  },
  {
    id: "active-courses",
    title: "Active Courses",
    value: 4,
    change: "+1",
    changeLabel: "new course this month",
    icon: "BookOpen",
    color: "pink",
  },
  {
    id: "upcoming-sessions",
    title: "Upcoming Sessions",
    value: 6,
    change: "3",
    changeLabel: "scheduled for today",
    icon: "CalendarDays",
    color: "cream",
  },
  {
    id: "pending-assignments",
    title: "Pending Assignments",
    value: 8,
    change: "5",
    changeLabel: "awaiting review",
    icon: "ClipboardCheck",
    color: "wood",
  },
];
const AppBody = () => {
  return (
    <div className="max-h-[calc(100vh-64px)] w-full bg-background p-4">
      <div>
        <span>Thu 23 Oct 2026 </span>
        <h2 className="font-bold">
          Hey Good Morning <span>{TUTOR_NAME}</span>
        </h2>
        <span>Today you are teaching 3 group classes Let's have a greay day.</span>
      </div>
      <div className="flex w-full gap-4 p-4 h-auto">
        {statisticsData.map((stat) => (
          <Card className={`p-4 flex-1 bg-${stat.color}`} key={stat.id}>
            <CardBody className="flex items-center gap-4">
              <Paperclip />

              <div>
                <span>{stat.title}</span>
                <h2 className="text-2xl font-bold">{stat.value}</h2>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppBody;
