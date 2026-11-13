"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { makeStore, type AppStore } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { setUser, clearUser } from "@/store/auth/authSlice";

function AuthSessionRestorer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401 && isMounted) {
            dispatch(clearUser());
          }
          return;
        }

        const data = await response.json();

        if (isMounted && data.user) {
          dispatch(setUser(data.user));
        }
      } catch (error) {
        console.error("Session restoration failed:", error);
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<AppStore | null>(null);

  useEffect(() => {
    const initializeTimer = window.setTimeout(() => setStore(makeStore()), 0);
    return () => window.clearTimeout(initializeTimer);
  }, []);

  if (!store) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background" role="status">
        <span className="flex items-center gap-3 text-sm text-muted">
          <span className="size-4 animate-spin rounded-full border-2 border-primary/25 border-t-primary motion-reduce:animate-none" />
          Starting Learn Korean with Graz…
        </span>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <AuthSessionRestorer />
      {children}
    </Provider>
  );
}
