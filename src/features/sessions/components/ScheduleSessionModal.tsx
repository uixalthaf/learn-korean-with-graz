"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { CalendarDays, Clock3, X } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { SCHEDULED_CLASSES_CHANGED_EVENT } from "../hooks/useScheduledClasses";

type ScheduleSessionModalProps = {
  open: boolean;
  onClose: () => void;
};

const ScheduleSessionModal = ({ open, onClose }: ScheduleSessionModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const date = String(formData.get("date") || "");
    const time = String(formData.get("startTime") || "");
    const startsAt = new Date(`${date}T${time}`);

    if (Number.isNaN(startsAt.getTime())) {
      setFeedback({ kind: "error", message: "Choose a valid date and start time." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          title: formData.get("title"),
          startsAt: startsAt.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          durationMinutes: Number(formData.get("durationMinutes")),
          notes: formData.get("notes"),
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        classSession?: { studentCount: number; meetingUrl: string | null };
        calendarWarning?: "not_configured" | "unavailable" | null;
      };

      if (!response.ok || !result.classSession) {
        throw new Error(result.message || "Unable to schedule the class.");
      }

      window.dispatchEvent(new Event(SCHEDULED_CLASSES_CHANGED_EVENT));
      form.reset();

      const studentMessage = `The class is visible to ${result.classSession.studentCount} students on their dashboards.`;
      const meetMessage = result.classSession.meetingUrl
        ? "Google Meet is ready."
        : result.calendarWarning === "not_configured"
          ? "Google Calendar is not connected, so no Meet link was created."
          : "The class was saved, but Google Meet could not be created.";

      setFeedback({ kind: "success", message: `${studentMessage} ${meetMessage}` });
    } catch (error) {
      setFeedback({
        kind: "error",
        message: error instanceof Error ? error.message : "Unable to schedule the class.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="schedule-session-title"
      aria-describedby="schedule-session-description"
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-start gap-3 border-b border-border p-5 sm:p-7">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-background text-primary-deep">
          <CalendarDays size={21} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="schedule-session-title" className="text-xl font-semibold text-heading">
            Schedule a session
          </h2>
          <p id="schedule-session-description" className="mt-1 text-sm text-muted">
            Plan a class. All current students will see it on their dashboards.
          </p>
        </div>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close schedule session dialog"
          className="rounded-lg p-2 text-muted transition hover:bg-surface hover:text-foreground"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <form className="space-y-5 p-5 sm:p-7" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-heading">
          <span className="mb-1.5 block">Class name</span>
          <input
            name="title"
            autoFocus
            required
            placeholder="e.g. Beginner Korean conversation"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-heading">
            <span className="mb-1.5 block">Date</span>
            <input
              name="date"
              required
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <label className="block text-sm font-medium text-heading">
            <span className="mb-1.5 block">Start time</span>
            <span className="relative block">
              <Clock3 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                name="startTime"
                required
                type="time"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </span>
          </label>
        </div>

        <label className="block text-sm font-medium text-heading">
          <span className="mb-1.5 block">Duration</span>
          <select
            name="durationMinutes"
            defaultValue="60"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          >
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1 hour 30 minutes</option>
            <option value="120">2 hours</option>
          </select>
        </label>

        <label className="block text-sm font-medium text-heading">
          <span className="mb-1.5 block">Notes <span className="font-normal text-muted">(optional)</span></span>
          <textarea
            name="notes"
            rows={3}
            placeholder="Add a topic, preparation details, or anything students should know."
            className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>

        {feedback && (
          <p
            role={feedback.kind === "error" ? "alert" : "status"}
            className={`rounded-lg px-3 py-2 text-sm ${
              feedback.kind === "error" ? "bg-red-50 text-red-800" : "bg-accent-background text-primary-deep"
            }`}
          >
            {feedback.message}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
          <Button variant="outline" disabled={isSubmitting} onClick={() => dialogRef.current?.close()} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Scheduling…" : "Schedule session"}
          </Button>
        </div>
      </form>
    </dialog>
  );
};

export default ScheduleSessionModal;
