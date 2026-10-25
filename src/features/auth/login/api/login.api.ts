import { axiosInstance } from "@/api/axiosInstance";
import { LOGIN_API_URL } from "./login.endpoints";
import type { LoginPayload } from "./login.types";

//api function for login of the user
export const loginUser = async (payload: LoginPayload) => {
  try {
    const response = await axiosInstance.post(LOGIN_API_URL, payload);
    return response.data;
  } catch (error) {
    console.log("error while validating user credentials", error);
    throw error;
  }
};
