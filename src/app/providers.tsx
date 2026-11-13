"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { makeStore } from "@/store/store";
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
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <AuthSessionRestorer />
      {children}
    </Provider>
  );
}
