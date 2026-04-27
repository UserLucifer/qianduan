import { apiGet, apiPost } from "./http";
import type {
  CreateWithdrawOrderRequest,
  PageResult,
  WithdrawOrderQueryRequest,
  WithdrawOrderResponse,
} from "./types";

export type {
  CreateWithdrawOrderRequest,
  WithdrawOrderQueryRequest,
  WithdrawOrderResponse,
};

export const createWithdrawOrder = (data: CreateWithdrawOrderRequest) =>
  apiPost<WithdrawOrderResponse, CreateWithdrawOrderRequest>("/api/withdraw/orders", data);

export const getWithdrawOrders = (params: WithdrawOrderQueryRequest = {}) =>
  apiGet<PageResult<WithdrawOrderResponse>>("/api/withdraw/orders", { params });

export const getWithdrawOrderDetail = (withdrawNo: string) =>
  apiGet<WithdrawOrderResponse>(`/api/withdraw/orders/${withdrawNo}`);

export const cancelWithdrawOrder = (withdrawNo: string) =>
  apiPost<void>(`/api/withdraw/orders/${withdrawNo}/cancel`);
