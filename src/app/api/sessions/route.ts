import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/getSession";
import { parseCreateClassInput } from "@/features/sessions/types";
import { listScheduledClasses, scheduleClass } from "@/features/sessions/services/sessions.service";

export async function GET() {
  try {
    const session = await getOptionalSession();
    if (!session) {
      return NextResponse.json({ message: "Sign in to view classes." }, { status: 401 });
    }

    if (session.user.role !== "TUTOR" && session.user.role !== "STUDENT") {
      return NextResponse.json({ message: "You cannot view scheduled classes." }, { status: 403 });
    }

    const classes = await listScheduledClasses(session.user.id, session.user.role);
    return NextResponse.json({ classes });
  } catch (error) {
    console.error("List scheduled classes error:", error);
    return NextResponse.json({ message: "Unable to load scheduled classes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getOptionalSession();
    if (!session) {
      return NextResponse.json({ message: "Sign in to schedule a class." }, { status: 401 });
    }

    if (session.user.role !== "TUTOR") {
      return NextResponse.json({ message: "Only tutors can schedule classes." }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "Send valid class details." }, { status: 400 });
    }

    const parsed = parseCreateClassInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ message: parsed.message }, { status: 400 });
    }

    const result = await scheduleClass(session.user.id, parsed.value);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Schedule class error:", error);
    return NextResponse.json({ message: "Unable to schedule this class right now." }, { status: 500 });
  }
}
