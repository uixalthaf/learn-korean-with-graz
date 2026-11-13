"use client";

import { useCallback, useEffect, useState } from "react";
import type { ScheduledClass } from "../types";

export const SCHEDULED_CLASSES_CHANGED_EVENT = "scheduled-classes:changed";

export function useScheduledClasses() {
  const [classes, setClasses] = useState<ScheduledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClasses = useCallback(async () => {
    try {
      const response = await fetch("/api/sessions", { credentials: "same-origin", cache: "no-store" });
      const result = (await response.json()) as { classes?: ScheduledClass[]; message?: string };

      if (!response.ok) throw new Error(result.message || "Could not load scheduled classes.");
      setClasses(result.classes ?? []);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load scheduled classes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // The fetch updates loading/data state after the network response; this is an async synchronization effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadClasses();
    window.addEventListener(SCHEDULED_CLASSES_CHANGED_EVENT, loadClasses);
    return () => window.removeEventListener(SCHEDULED_CLASSES_CHANGED_EVENT, loadClasses);
  }, [loadClasses]);

  return { classes, loading, error, refresh: loadClasses };
}
