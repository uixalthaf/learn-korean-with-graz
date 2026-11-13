import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { APP_CONFIG } from "@/config/app";
import Providers from "./providers";

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense
          fallback={
            <div className="flex min-h-dvh items-center justify-center bg-background" role="status">
              <span className="flex items-center gap-3 text-sm text-muted">
                <span className="size-4 animate-spin rounded-full border-2 border-primary/25 border-t-primary motion-reduce:animate-none" />
                Loading Learn Korean with Graz…
              </span>
            </div>
          }
        >
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
