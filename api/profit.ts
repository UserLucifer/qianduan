import { apiGet } from "./http";
import type {
  PageResult,
  ProfitRecordQueryRequest,
  ProfitRecordResponse,
  ProfitSummaryResponse,
} from "./types";

export type { ProfitRecordQueryRequest, ProfitRecordResponse, ProfitSummaryResponse };

export const getProfitSummary = () =>
  apiGet<ProfitSummaryResponse>("/api/profit/summary");

export const getProfitRecords = (params: ProfitRecordQueryRequest = {}) =>
  apiGet<PageResult<ProfitRecordResponse>>("/api/profit/records", { params });
