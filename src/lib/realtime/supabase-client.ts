"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let realtimeClient: SupabaseClient | null = null;
let cachedToken: { value: string; expiresAt: number } | null = null;

export function getRealtimeClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return null;
  if (realtimeClient) return realtimeClient;

  realtimeClient = createClient(url, publishableKey, {
    accessToken: async () => {
      if (cachedToken && cachedToken.expiresAt - Date.now() > 60_000) {
        return cachedToken.value;
      }

      const response = await fetch("/api/realtime/token", {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Unable to authorize the realtime connection.");

      const result = (await response.json()) as { token: string; expiresAt: number };
      cachedToken = { value: result.token, expiresAt: result.expiresAt };
      return result.token;
    },
  });

  return realtimeClient;
}
