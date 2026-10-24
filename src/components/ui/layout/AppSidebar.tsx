import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FolderOpen,
  Settings,
  MessagesSquare,
  MailIcon,
} from "lucide-react";
import { TUTOR_NAME } from "@/config/tutorInfo";
import Image from "next/image";
import sidebarVector from "@/assets/images/sidebar_vector_illustration.png";

const navigationItems = [
  { label: "Dashboard", href: "/tutor", icon: LayoutDashboard },
  { label: "Students", href: "/tutor/students", icon: Users },
  { label: "Courses", href: "/tutor/courses", icon: BookOpen },
  { label: "Group Sessions", href: "/tutor/sessions", icon: CalendarDays },
  { label: "Assignments", href: "/tutor/assignments", icon: ClipboardList },
  { label: "Learning Materials", href: "/tutor/materials", icon: FolderOpen },
  { label: "Messages", href: "/tutor/messages", icon: MailIcon },
  { label: "Settings", href: "/tutor/settings", icon: Settings },
];

const AppSidebar = () => {
  return (
    <aside
      className="flex min-h-screen w-64 shrink-0 flex-col border-r border-stone-200 bg-[#FAF9F6] p-5"
      style={{
        backgroundImage: `url(${sidebarVector.src})`,
        backgroundSize: "140% auto",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0% 85%",
      }}
    >
      {/* Brand */}
      <Link href="/tutor" className="mb-10 block uppercase">
        <h3 className="text-xl font-bold tracking-tight text-emerald-950">Learn Korean</h3>
        <p className="mt-0.5 text-sm text-stone-500">with {TUTOR_NAME}</p>
      </Link>

      {/* Navigation */}
      <nav aria-label="Tutor navigation">
        <ul className="space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    item.href === "/tutor"
                      ? "bg-emerald-900 text-white"
                      : "text-stone-600 hover:bg-emerald-50 hover:text-emerald-950"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{item.label}</span>
                  {item.label === "Messages" && (
                    <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                      3
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Tutor profile */}
      <div className="mt-auto border-t border-stone-200 pt-5">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-900">
            G
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-stone-800">Graz</p>
            <p className="text-xs text-stone-500">Tutor & Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
