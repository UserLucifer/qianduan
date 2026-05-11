import { apiGet } from "./http";
import type {
  PageResult,
  ProfitTrendQueryRequest,
  ProfitTrendResponse,
  ProfitRecordQueryRequest,
  ProfitRecordResponse,
  ProfitSummaryResponse,
} from "./types";

export type {
  ProfitRecordQueryRequest,
  ProfitRecordResponse,
  ProfitSummaryResponse,
  ProfitTrendQueryRequest,
  ProfitTrendResponse,
};

export const getProfitSummary = () =>
  apiGet<ProfitSummaryResponse>("/api/profit/summary");

export const getProfitRecords = (params: ProfitRecordQueryRequest = {}) =>
  apiGet<PageResult<ProfitRecordResponse>>("/api/profit/records", { params });

export const getProfitTrend = (params: ProfitTrendQueryRequest) =>
  apiGet<ProfitTrendResponse>("/api/profit/trend", { params });
