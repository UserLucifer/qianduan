import { apiGet, apiPut } from "./http";
import type { UserMeResponse } from "./types";

export type { UserMeResponse };

export const getCurrentUser = () =>
  apiGet<UserMeResponse>("/api/user/me");

export const updateUserAvatar = (data: { avatarKey: string }) =>
  apiPut<UserMeResponse, { avatarKey: string }>("/api/user/avatar", data);
