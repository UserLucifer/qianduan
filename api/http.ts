import type { AxiosRequestConfig } from "axios";
import axiosClient from "@/lib/axios";
import type { ApiResponse } from "./types";

export function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  return axiosClient.get<ApiResponse<T>, ApiResponse<T>>(url, config);
}

export function apiPost<T, D = void>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  return axiosClient.post<ApiResponse<T>, ApiResponse<T>, D>(url, data as D, config);
}

export function apiPut<T, D>(
  url: string,
  data: D,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  return axiosClient.put<ApiResponse<T>, ApiResponse<T>, D>(url, data, config);
}
