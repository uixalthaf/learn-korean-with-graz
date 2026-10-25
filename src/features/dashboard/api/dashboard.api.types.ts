export interface DashboardStatistic {
  id: string;
  title: string;
  value: number;
  change: string;
  changeLabel: string;
  icon: string;
  color: string;
}

export interface GroupSession {
  id: string;
  title: string;
  course: string;
  level: string;
  date: string;
  startTime: string;
  endTime: string;
  timeLabel: string;
  studentCount: number;
  platform: string;
  meetingUrl: string;
  status: "upcoming";
  tutor: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  initials: string;
  course: string;
  level: string;
  progress: number;
  attendance: number;
  status: "active";
  joinedAt: string;
  lastActive: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  studentCount: number;
  durationWeeks: number;
  progress: number;
  status: "active";
  thumbnail: string | null;
  accentColor: string;
}

export interface TutorDashboardResponse {
  statistics: DashboardStatistic[];
  groupSessions: GroupSession[];
  students: Student[];
  quickActions: QuickAction[];
  courses: Course[];
}
