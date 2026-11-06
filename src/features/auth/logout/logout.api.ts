import { axiosInstance } from "@/api/axiosInstance";
import { LOGOUT_SESSION } from "./logout.endpoints";

const logoutSession = async () => {
  try {
    await axiosInstance.post(LOGOUT_SESSION);
    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
};

export default logoutSession;
