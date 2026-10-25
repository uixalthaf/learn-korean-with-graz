"use client";
import React, { useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card/Card";
import { Paperclip } from "lucide-react";

import { getTutorDashboardData } from "../api/dashboard.api";
const StatisticsCard = () => {
  const [statisticsData, setStatisticsData] = React.useState([]);
  useEffect(() => {
    async function fetchStatisticsData() {
      try {
        const data = await getTutorDashboardData();
        setStatisticsData(data.statistics);
      } catch (error) {
        console.error("Error fetching tutor dashboard data:", error);
      }
    }
    fetchStatisticsData();
  }, []);
  return (
    <div className="flex w-full gap-4 py-8 h-auto">
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
  );
};

export default StatisticsCard;
