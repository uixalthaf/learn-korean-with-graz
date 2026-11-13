import { randomUUID } from "node:crypto";

type GoogleEvent = {
  id?: string;
  hangoutLink?: string;
  conferenceData?: {
    entryPoints?: Array<{ entryPointType?: string; uri?: string }>;
    createRequest?: { status?: { statusCode?: "pending" | "success" | "failure" } };
  };
};

type CalendarClassDetails = {
  title: string;
  notes: string | null;
  startsAt: Date;
  durationMinutes: number;
  timeZone: string;
};

const TUTOR_CALENDAR_EMAIL = "armann.shah28@gmail.com";

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Google Calendar request failed (${response.status}).`);
  }

  return (await response.json()) as T;
}

export async function getGoogleCalendarAccessToken(): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId && !clientSecret && !refreshToken) return null;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Google Calendar environment is incomplete.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  const token = await readJson<{ access_token: string }>(response);
  return token.access_token;
}

export async function verifyGoogleCalendarAccount(accessToken: string): Promise<void> {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const account = await readJson<{ email?: string }>(response);
  const expectedEmail = (process.env.GOOGLE_CALENDAR_EMAIL || TUTOR_CALENDAR_EMAIL).toLowerCase();

  if (account.email?.toLowerCase() !== expectedEmail) {
    throw new Error("The connected Google account does not match the tutor calendar email.");
  }
}

function getMeetingUrl(event: GoogleEvent) {
  return (
    event.hangoutLink ||
    event.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri ||
    null
  );
}

async function getGoogleCalendarEvent(accessToken: string, eventId: string) {
  const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID || "primary");
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${encodeURIComponent(eventId)}`,
    { headers: { authorization: `Bearer ${accessToken}` }, cache: "no-store" },
  );
  return readJson<GoogleEvent>(response);
}

export async function createGoogleMeetEvent(
  classDetails: CalendarClassDetails,
): Promise<{ eventId: string; meetingUrl: string | null } | null> {
  const accessToken = await getGoogleCalendarAccessToken();
  if (!accessToken) return null;
  await verifyGoogleCalendarAccount(accessToken);

  const endAt = new Date(classDetails.startsAt.getTime() + classDetails.durationMinutes * 60_000);
  const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID || "primary");
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1&sendUpdates=none`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        summary: classDetails.title,
        description: classDetails.notes || undefined,
        start: { dateTime: classDetails.startsAt.toISOString(), timeZone: classDetails.timeZone },
        end: { dateTime: endAt.toISOString(), timeZone: classDetails.timeZone },
        conferenceData: {
          createRequest: {
            requestId: randomUUID(),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      }),
      cache: "no-store",
    },
  );
  let event = await readJson<GoogleEvent>(response);
  if (!event.id) throw new Error("Google Calendar did not return an event ID.");
  const eventId = event.id;

  // Meet conference creation is asynchronous; poll briefly before publishing the class.
  for (let attempt = 0; !getMeetingUrl(event) && event.conferenceData?.createRequest?.status?.statusCode === "pending" && attempt < 5; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    event = await getGoogleCalendarEvent(accessToken, eventId);
  }

  return { eventId, meetingUrl: getMeetingUrl(event) };
}

export async function getGoogleMeetLinkForEvent(accessToken: string, eventId: string) {
  const event = await getGoogleCalendarEvent(accessToken, eventId);
  return getMeetingUrl(event);
}
