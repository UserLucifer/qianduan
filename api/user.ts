import { apiGet, apiPut } from "./http";
import type { UserMeResponse } from "./types";

export type { UserMeResponse };

export interface UpdateUserPasswordRequest {
  oldPassword?: string;
  currentPassword?: string;
  newPassword: string;
}

export const getCurrentUser = () =>
  apiGet<UserMeResponse>("/api/user/me");

export const updateUserAvatar = (data: { avatarKey: string }) =>
  apiPut<UserMeResponse, { avatarKey: string }>("/api/user/avatar", data);

export const updateUserProfile = (data: { nickname: string }) =>
  apiPut<UserMeResponse, { nickname: string }>("/api/user/profile", data);

export const updateUserPassword = (data: UpdateUserPasswordRequest) =>
  apiPut<void, UpdateUserPasswordRequest>("/api/user/password", data);
