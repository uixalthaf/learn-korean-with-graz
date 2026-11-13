export interface DashboardStatistic {
  id: string;
  title: string;
  value: number;
}

export interface StudentSummary {
  id: string;
  name: string;
  email: string;
}

export interface TutorDashboardResponse {
  statistics: DashboardStatistic[];
  students: StudentSummary[];
}
