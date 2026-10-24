import tutorDashboardData from "@/app/dashboard/tutor/tutorDashboardData";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(tutorDashboardData);
}
