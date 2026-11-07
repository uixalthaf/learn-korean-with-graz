"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FolderOpen,
  Settings,
  MailIcon,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  ChevronLast,
  ChevronLeft,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { TUTOR_NAME } from "@/config/tutorInfo";
import sidebarVector from "@/assets/images/sidebar_vector_illustration.png";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import logoutSession from "@/features/auth/logout/logout.api";
import { clearUser } from "@/store/auth/authSlice";

const tutorNavigationItems = [
  { label: "Dashboard", href: "/dashboard/tutor", icon: LayoutDashboard },
  { label: "Students", href: "/students", icon: Users },
  { label: "Courses", href: "/tutor/courses", icon: BookOpen },
  { label: "Group Sessions", href: "/tutor/sessions", icon: CalendarDays },
  { label: "Assignments", href: "/tutor/assignments", icon: ClipboardList },
  { label: "Learning Materials", href: "/tutor/materials", icon: FolderOpen },
  { label: "Messages", href: "/tutor/messages", icon: MailIcon },
  { label: "Settings", href: "/tutor/settings", icon: Settings },
];

const studentNavigationItems = [
  { label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
  { label: "Assignments", href: "/student/assignments", icon: ClipboardList },
  { label: "Learning Materials", href: "/student/materials", icon: FolderOpen },
  { label: "Messages", href: "/student/messages", icon: MailIcon },
  { label: "Settings", href: "/student/settings", icon: Settings },
];

const AppSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const user = useAppSelector((state) => state.auth.user);

  const navigationItems = user?.role === "STUDENT" ? studentNavigationItems : tutorNavigationItems;

  const handleLogout = async () => {
    const success = await logoutSession();

    if (success) {
      dispatch(clearUser());
      router.push("/home");
    }
  };

  return (
    <aside
      className={`relative flex h-screen shrink-0 flex-col border-r border-stone-200 bg-background transition-[width,padding] duration-300 ease-in-out ${
        isCollapsed ? "w-[60px] p-2" : "w-64 p-5"
      }`}
      style={{
        backgroundImage: isCollapsed ? "none" : `url(${sidebarVector.src})`,
        backgroundSize: "140% auto",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0% 85%",
      }}
    >
      {/* Centered sidebar toggle */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center cursor-pointer justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
      >
        {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </button>

      {/* Brand */}
      {!isCollapsed && (
        <Link href="/dashboard/tutor" className="mb-10 block uppercase">
          <h3 className="text-xl font-bold tracking-tight text-emerald-950">Learn Korean</h3>
          <p className="mt-0.5 text-sm text-stone-500">with {TUTOR_NAME}</p>
        </Link>
      )}

      {/* Navigation */}
      <nav aria-label="Dashboard navigation">
        <ul className="space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  aria-label={item.label}
                  className={`flex items-center rounded-xl py-2.5 text-sm font-medium transition-colors ${
                    isCollapsed ? "justify-center px-0" : "gap-3 px-3"
                  } ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-emerald-50 hover:text-emerald-950"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} className="shrink-0" />

                  {!isCollapsed && (
                    <>
                      <span>{item.label}</span>

                      {item.label === "Messages" && (
                        <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                          3
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div
        className={`mt-auto border-t border-stone-200 pt-5 ${
          isCollapsed ? "flex justify-center" : ""
        }`}
      >
        <div className={`flex items-center ${isCollapsed ? "flex-col gap-4" : "gap-3 px-2"}`}>
          <div
            title={isCollapsed ? user?.name : undefined}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-background text-sm font-semibold text-emerald-900"
          >
            {user?.name?.charAt(0).toUpperCase() ?? "G"}
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-stone-800">{user?.name}</div>

              <p className="text-xs text-stone-500">
                {user?.role === "TUTOR"
                  ? "Tutor & Admin"
                  : user?.role === "STUDENT"
                    ? "Student"
                    : "Guest"}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            className="shrink-0 rounded-lg p-1.5 text-stone-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
