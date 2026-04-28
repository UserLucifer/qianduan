import type { AxiosRequestConfig } from "axios";
import userAxiosClient, { adminAxiosClient } from "@/lib/axios";
import type { ApiResponse } from "./types";

// --- 用户端 API 方法 ---

export function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  return userAxiosClient.get<ApiResponse<T>, ApiResponse<T>>(url, config);
}

export function apiPost<T, D = void>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  return userAxiosClient.post<ApiResponse<T>, ApiResponse<T>, D>(url, data as D, config);
}

export function apiPut<T, D>(
  url: string,
  data: D,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  return userAxiosClient.put<ApiResponse<T>, ApiResponse<T>, D>(url, data, config);
}

// --- 管理端 API 方法 ---

export function adminApiGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  return adminAxiosClient.get<ApiResponse<T>, ApiResponse<T>>(url, config);
}

export function adminApiPost<T, D = void>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  return adminAxiosClient.post<ApiResponse<T>, ApiResponse<T>, D>(url, data as D, config);
}

export function adminApiPut<T, D>(
  url: string,
  data: D,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  return adminAxiosClient.put<ApiResponse<T>, ApiResponse<T>, D>(url, data, config);
}
