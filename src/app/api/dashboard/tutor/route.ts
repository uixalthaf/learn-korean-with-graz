import { prisma } from "@/lib/prisma";
import { getOptionalSession } from "@/lib/getSession";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getOptionalSession();

    if (!session) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    if (session.user.role !== "TUTOR") {
      return NextResponse.json({ message: "Tutor access required." }, { status: 403 });
    }

    const [students, totalStudents, upcomingSessions] = await Promise.all([
      prisma.user.findMany({
        where: { role: "STUDENT" },
        select: { id: true, name: true, email: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.classSession.count({
        where: { tutorId: session.user.id, status: "SCHEDULED", startsAt: { gte: new Date() } },
      }),
    ]);

    return NextResponse.json({
      students,
      statistics: [
        { id: "total-students", title: "Total Students", value: totalStudents },
        { id: "upcoming-sessions", title: "Upcoming Sessions", value: upcomingSessions },
      ],
    });
  } catch (error) {
    console.error("Tutor dashboard API error:", error);

    return NextResponse.json({ message: "Unable to fetch tutor dashboard data." }, { status: 500 });
  }
}
