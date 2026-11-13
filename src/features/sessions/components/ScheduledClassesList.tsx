import { CalendarDays, Clock3, Video } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card/Card";
import type { ScheduledClass } from "../types";

type ScheduledClassesListProps = {
  classes: ScheduledClass[];
  loading: boolean;
  error: string | null;
  audience: "tutor" | "student";
};

const formatDateTime = (startsAt: string, timeZone: string) => {
  const date = new Date(startsAt);
  return {
    date: new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone,
    }).format(date),
    time: new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    }).format(date),
  };
};

const ScheduledClassesList = ({ classes, loading, error, audience }: ScheduledClassesListProps) => (
  <Card>
    <CardHeader className="justify-start gap-2">
      <CalendarDays size={20} aria-hidden="true" />
      <span>Upcoming classes</span>
    </CardHeader>
    <CardBody className="space-y-3">
      {loading && <p className="text-sm text-muted">Loading scheduled classes…</p>}
      {!loading && error && <p className="text-sm text-red-700">{error}</p>}
      {!loading && !error && classes.length === 0 && (
        <p className="text-sm text-muted">No classes scheduled as of now.</p>
      )}
      {!loading && !error && classes.map((classSession) => {
        const dateTime = formatDateTime(classSession.startsAt, classSession.timeZone);

        return (
          <article key={classSession.id} className="rounded-xl border border-border bg-background p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-semibold text-heading">{classSession.title}</h3>
                <p className="mt-1 text-sm text-muted">{dateTime.date} · {dateTime.time} · {classSession.durationMinutes} min</p>
                {audience === "tutor" && (
                  <p className="mt-1 text-sm text-muted">{classSession.studentCount} students</p>
                )}
                {classSession.notes && <p className="mt-3 whitespace-pre-wrap text-sm">{classSession.notes}</p>}
              </div>
              {classSession.meetingUrl ? (
                <Button
                  href={classSession.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                  leftIcon={<Video size={16} aria-hidden="true" />}
                >
                  Join class
                </Button>
              ) : (
                <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-muted" role="status">
                  <Clock3 size={15} aria-hidden="true" />
                  Meet link unavailable
                </span>
              )}
            </div>
          </article>
        );
      })}
    </CardBody>
  </Card>
);

export default ScheduledClassesList;
