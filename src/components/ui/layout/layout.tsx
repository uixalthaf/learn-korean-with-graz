"use client";

import React, { useState } from "react";
import AppSidebar from "@/components/ui/layout/AppSidebar";
import AppHeader from "@/components/ui/layout/AppHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="dashboard-shell flex h-dvh w-full overflow-hidden">
      <AppSidebar
        mobileNavOpen={mobileNavOpen}
        onNavigate={() => setMobileNavOpen(false)}
        onClose={() => setMobileNavOpen(false)}
      />
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="dashboard-backdrop fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader onMenuClick={() => setMobileNavOpen((open) => !open)} />
        <main className="dashboard-main min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
