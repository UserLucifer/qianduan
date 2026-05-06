import { apiGet, apiPost } from "./http";
import type {
  NotificationQueryRequest,
  LocaleQuery,
  PageResult,
  SysNotification,
} from "./types";

export type { NotificationQueryRequest, SysNotification as UserNotification };

export const getUserNotifications = (params: NotificationQueryRequest = {}) =>
  apiGet<PageResult<SysNotification>>("/api/notifications", { params });

export const getNotificationDetail = (id: number, params: LocaleQuery = {}) =>
  apiGet<SysNotification>(`/api/notifications/${id}`, { params });

export const markAsRead = (id: number, params: LocaleQuery = {}) =>
  apiPost<SysNotification>(`/api/notifications/${id}/read`, undefined, {
    params,
    headers: params.language ? { "Accept-Language": params.language } : undefined,
  });

export const markAllAsRead = () =>
  apiPost<number>("/api/notifications/read-all");
