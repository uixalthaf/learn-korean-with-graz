import { axiosInstance } from "@/api/axiosInstance";
import { SIGNUP_API_URL } from "./signup.endpoints";
import type { SignupPayload, SignupResponse } from "./signup.types";

export const signupUser = async (payload: SignupPayload): Promise<SignupResponse> => {
  const response = await axiosInstance.post<SignupResponse>(SIGNUP_API_URL, payload);
  return response.data;
};
