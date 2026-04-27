import { apiGet } from "./http";
import type {
  PageResult,
  SettlementOrderQueryRequest,
  SettlementOrderResponse,
} from "./types";

export type { SettlementOrderQueryRequest, SettlementOrderResponse };

export const getSettlementOrders = (params: SettlementOrderQueryRequest = {}) =>
  apiGet<PageResult<SettlementOrderResponse>>("/api/settlement/orders", { params });

export const getSettlementOrderDetail = (settlementNo: string) =>
  apiGet<SettlementOrderResponse>(`/api/settlement/orders/${settlementNo}`);
