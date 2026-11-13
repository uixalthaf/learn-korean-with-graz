export type ScheduledClass = {
  id: string;
  title: string;
  startsAt: string;
  timeZone: string;
  durationMinutes: number;
  notes: string | null;
  meetingUrl: string | null;
  status: "SCHEDULED" | "CANCELLED" | "COMPLETED";
  studentCount: number;
};

export type CreateClassInput = {
  title: string;
  startsAt: Date;
  timeZone: string;
  durationMinutes: number;
  notes: string | null;
};

export type CreateClassInputResult =
  | { ok: true; value: CreateClassInput }
  | { ok: false; message: string };

const ALLOWED_DURATIONS = new Set([30, 45, 60, 90, 120]);

export function parseCreateClassInput(body: unknown): CreateClassInputResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, message: "Enter the class details and try again." };
  }

  const data = body as Record<string, unknown>;
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const startsAt = typeof data.startsAt === "string" ? new Date(data.startsAt) : new Date(NaN);
  const timeZone = typeof data.timeZone === "string" ? data.timeZone : "";
  const durationMinutes = Number(data.durationMinutes);
  const notes = typeof data.notes === "string" ? data.notes.trim() : "";

  if (title.length < 2 || title.length > 160) {
    return { ok: false, message: "Class name must be between 2 and 160 characters." };
  }

  if (Number.isNaN(startsAt.getTime()) || startsAt <= new Date()) {
    return { ok: false, message: "Choose a valid future date and time." };
  }

  if (!ALLOWED_DURATIONS.has(durationMinutes)) {
    return { ok: false, message: "Choose one of the available class durations." };
  }

  if (notes.length > 4000) {
    return { ok: false, message: "Notes must be 4,000 characters or fewer." };
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format();
  } catch {
    return { ok: false, message: "Choose a valid time zone." };
  }

  return {
    ok: true,
    value: {
      title,
      startsAt,
      timeZone,
      durationMinutes,
      notes: notes || null,
    },
  };
}
