import { prisma } from "@/lib/prisma";
import {
  createGoogleMeetEvent,
  getGoogleCalendarAccessToken,
  getGoogleMeetLinkForEvent,
  verifyGoogleCalendarAccount,
} from "./googleCalendar.service";
import type { CreateClassInput, ScheduledClass } from "../types";

type DashboardRole = "TUTOR" | "STUDENT";

export async function listScheduledClasses(userId: string, role: DashboardRole) {
  const where =
    role === "TUTOR"
      ? { tutorId: userId, status: "SCHEDULED" as const, startsAt: { gte: new Date() } }
      : {
          status: "SCHEDULED" as const,
          startsAt: { gte: new Date() },
          enrollments: { some: { studentId: userId } },
        };

  const classes = await prisma.classSession.findMany({
    where,
    orderBy: { startsAt: "asc" },
    take: 50,
    include: { _count: { select: { enrollments: true } } },
  });

  const resolvedMeetLinks = new Map<string, string>();
  const pendingClasses = classes.filter((item) => !item.meetingUrl && item.calendarEventId).slice(0, 10);

  if (pendingClasses.length > 0) {
    try {
      const accessToken = await getGoogleCalendarAccessToken();
      if (accessToken) {
        await verifyGoogleCalendarAccount(accessToken);
        await Promise.all(pendingClasses.map(async (item) => {
          try {
            const meetingUrl = await getGoogleMeetLinkForEvent(accessToken, item.calendarEventId!);
            if (!meetingUrl) return;

            await prisma.classSession.update({
              where: { id: item.id },
              data: { meetingUrl },
            });
            resolvedMeetLinks.set(item.id, meetingUrl);
          } catch (error) {
            console.error("Pending Google Meet link refresh failed:", error);
          }
        }));
      }
    } catch (error) {
      console.error("Google Calendar connection check failed:", error);
    }
  }

  return classes.map((classSession): ScheduledClass => ({
    id: classSession.id,
    title: classSession.title,
    startsAt: classSession.startsAt.toISOString(),
    timeZone: classSession.timeZone,
    durationMinutes: classSession.durationMinutes,
    notes: classSession.notes,
    meetingUrl: classSession.meetingUrl || resolvedMeetLinks.get(classSession.id) || null,
    status: classSession.status,
    studentCount: classSession._count.enrollments,
  }));
}

export async function scheduleClass(tutorId: string, input: CreateClassInput) {
  const createdClass = await prisma.$transaction(async (transaction) => {
    const students = await transaction.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true },
    });

    const classSession = await transaction.classSession.create({
      data: {
        ...input,
        tutorId,
      },
    });

    if (students.length > 0) {
      await transaction.classEnrollment.createMany({
        data: students.map(({ id }) => ({ classSessionId: classSession.id, studentId: id })),
      });
    }

    return { classSession, studentCount: students.length };
  });

  let calendarWarning: "not_configured" | "unavailable" | null = null;

  try {
    const event = await createGoogleMeetEvent(input);
    if (event) {
      const updatedClass = await prisma.classSession.update({
        where: { id: createdClass.classSession.id },
        data: { calendarEventId: event.eventId, meetingUrl: event.meetingUrl },
      });

      return {
        classSession: mapScheduledClass(updatedClass, createdClass.studentCount),
        calendarWarning: event.meetingUrl ? calendarWarning : "unavailable",
      };
    }

    calendarWarning = "not_configured";
  } catch (error) {
    console.error("Google Calendar event creation failed:", error);
    calendarWarning = "unavailable";
  }

  return {
    classSession: mapScheduledClass(createdClass.classSession, createdClass.studentCount),
    calendarWarning,
  };
}

function mapScheduledClass(
  classSession: {
    id: string;
    title: string;
    startsAt: Date;
    timeZone: string;
    durationMinutes: number;
    notes: string | null;
    meetingUrl: string | null;
    status: ScheduledClass["status"];
  },
  studentCount: number,
): ScheduledClass {
  return {
    id: classSession.id,
    title: classSession.title,
    startsAt: classSession.startsAt.toISOString(),
    timeZone: classSession.timeZone,
    durationMinutes: classSession.durationMinutes,
    notes: classSession.notes,
    meetingUrl: classSession.meetingUrl,
    status: classSession.status,
    studentCount,
  };
}
