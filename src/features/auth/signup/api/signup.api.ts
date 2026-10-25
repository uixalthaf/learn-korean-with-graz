import { axiosInstance } from "@/api/axiosInstance";
import { SIGNUP_API_URL } from "./signup.endpoints";
import type { SignupPayload, SignupResponse } from "./signup.types";

export const signupUser = async (payload: SignupPayload): Promise<SignupResponse> => {
  try {
    const response = await axiosInstance.post<SignupResponse>(SIGNUP_API_URL, payload);

    return response.data;
  } catch (error) {
    console.error("Error while registering the user", error);
    throw error;
  }
};
