import { apiGet } from "./http";
import type {
  CommissionRecordQueryRequest,
  CommissionRecordResponse,
  CommissionSummaryResponse,
  PageResult,
} from "./types";

export type {
  CommissionRecordQueryRequest,
  CommissionRecordResponse,
  CommissionSummaryResponse,
};

export const getCommissionSummary = () =>
  apiGet<CommissionSummaryResponse>("/api/commission/summary");

export const getCommissionRecords = (params: CommissionRecordQueryRequest = {}) =>
  apiGet<PageResult<CommissionRecordResponse>>("/api/commission/records", { params });
