"use client";
import React, { useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card/Card";
import { Paperclip } from "lucide-react";

import { getTutorDashboardData } from "../api/dashboard.api";
import type { DashboardStatistic } from "../api/dashboard.api.types";
const StatisticsCard = () => {
  const [statisticsData, setStatisticsData] = React.useState<DashboardStatistic[]>([]);
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
    <div className="dashboard-statistics-grid grid w-full grid-cols-1 gap-3 py-6 sm:grid-cols-2 xl:grid-cols-4">
      {statisticsData.map((stat) => (
        <Card className="flex-1 bg-white p-4" key={stat.id}>
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
