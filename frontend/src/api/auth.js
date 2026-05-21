import apiClient from "./client";

export const registerUser = (payload) =>
  apiClient.post("/auth/register", payload);

export const loginUser = (payload) =>
  apiClient.post("/auth/login", payload);

export const verifyEmailToken = (payload) =>
  apiClient.post("/auth/verify-email", payload);

export const resendVerificationEmail = (payload) =>
  apiClient.post("/auth/resend-verification", payload);

export const requestPasswordReset = (payload) =>
  apiClient.post("/auth/forgot-password", payload);

export const resetPasswordWithToken = (payload) =>
  apiClient.post("/auth/reset-password", payload);

export const refreshAuthToken = () =>
  apiClient.post("/auth/refresh");

export const getMyProfile = () =>
  apiClient.get("/auth/me");

export const updateMyProfile = (payload) =>
  apiClient.patch("/auth/profile", payload);

export const logoutUser = () =>
  apiClient.post("/auth/logout");