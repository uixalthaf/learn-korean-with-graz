import { axiosInstance } from "@/api/axiosInstance";
import { LOGIN_API_URL } from "./login.endpoints";
import type { LoginPayload } from "./login.types";

//api function for login of the user
export const loginUser = async (payload: LoginPayload) => {
  const response = await axiosInstance.post(LOGIN_API_URL, payload);
  return response.data;
};
