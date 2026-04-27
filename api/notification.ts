import { apiGet, apiPost } from "./http";
import type {
  NotificationQueryRequest,
  PageResult,
  SysNotification,
} from "./types";

export type { NotificationQueryRequest, SysNotification as UserNotification };

export const getUserNotifications = (params: NotificationQueryRequest = {}) =>
  apiGet<PageResult<SysNotification>>("/api/notifications", { params });

export const getNotificationDetail = (id: number) =>
  apiGet<SysNotification>(`/api/notifications/${id}`);

export const markAsRead = (id: number) =>
  apiPost<SysNotification>(`/api/notifications/${id}/read`);

export const markAllAsRead = () =>
  apiPost<number>("/api/notifications/read-all");
