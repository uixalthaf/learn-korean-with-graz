import { axiosInstance } from "@/api/axiosInstance";

//api function to get the dashboard data for the tutor
export const getTutorDashboardData = async () => {
  try {
    const reponse = await axiosInstance.get("/dashboard/tutor");
    return reponse.data;
  } catch (error) {
    console.log("error while fetching tutor dashboard data", error);
    throw error;
  }
};
