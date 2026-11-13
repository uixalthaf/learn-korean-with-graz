"use client";

import { useState } from "react";
import { Bell, Menu, Plus } from "lucide-react";
import { Button } from "../Button/Button";
import Input from "../Input/Input";
import ScheduleSessionModal from "@/features/sessions/components/ScheduleSessionModal";

const AppHeader = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [scheduleOpen, setScheduleOpen] = useState(false);

  return (
    <header className="dashboard-header flex h-16 w-full shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="dashboard-menu-button inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="dashboard-search min-w-0">
          <Input placeholder="Search Students..." />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <Button
          variant="primary"
          className="dashboard-schedule-button"
          onClick={() => setScheduleOpen(true)}
        >
          <Plus size={16} />
          <span>Schedule a session</span>
        </Button>
        <button type="button" aria-label="Notifications" className="rounded-lg p-2 text-foreground hover:bg-surface">
          <Bell size={20} />
        </button>
      </div>
      <ScheduleSessionModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </header>
  );
};

export default AppHeader;
