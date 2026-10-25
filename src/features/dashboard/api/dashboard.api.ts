import { axiosInstance } from "@/api/axiosInstance";
import { TutorDashboardResponse } from "./dashboard.api.types";
import { GET_DASHBOARD_DATA } from "./dashboard.endpoints";

//api function to get the dashboard data for the tutor
export const getTutorDashboardData = async (): Promise<TutorDashboardResponse> => {
  try {
    const response = await axiosInstance.get(GET_DASHBOARD_DATA);
    return response.data;
  } catch (error) {
    console.log("error while fetching tutor dashboard data", error);
    throw error;
  }
};
