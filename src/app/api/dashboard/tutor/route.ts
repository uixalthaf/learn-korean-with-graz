import tutorDashboardData from "@/app/dashboard/tutor/tutorDashboardData";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalStudents = await prisma.user.count({
      where: {
        role: "STUDENT",
      },
    });

    return NextResponse.json({
      ...tutorDashboardData,
      students,
      statistics: tutorDashboardData.statistics.map((item) =>
        item.id === "total-students" ? { ...item, value: totalStudents } : item,
      ),
    });
  } catch (error) {
    console.error("Tutor dashboard API error:", error);

    return NextResponse.json({ message: "Unable to fetch tutor dashboard data." }, { status: 500 });
  }
}
