import { apiGet } from "./http";
import type {
  DashboardSearchQueryRequest,
  DashboardSearchResponse,
  UserDashboardOverviewResponse,
} from "./types";

export type {
  DashboardSearchItemResponse,
  DashboardSearchQueryRequest,
  DashboardSearchResponse,
  UserDashboardOverviewResponse,
} from "./types";

export const getDashboardOverview = () =>
  apiGet<UserDashboardOverviewResponse>("/api/dashboard/overview");

export const searchDashboard = (params: DashboardSearchQueryRequest = {}) =>
  apiGet<DashboardSearchResponse>("/api/dashboard/search", { params });
