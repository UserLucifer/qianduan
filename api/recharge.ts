import { apiGet, apiPost } from "./http";
import type {
  CreateRechargeOrderRequest,
  PageResult,
  RechargeChannelResponse,
  RechargeOrderQueryRequest,
  RechargeOrderResponse,
} from "./types";

export type {
  CreateRechargeOrderRequest,
  RechargeChannelResponse,
  RechargeOrderQueryRequest,
  RechargeOrderResponse,
};

export const getRechargeChannels = () =>
  apiGet<RechargeChannelResponse[]>("/api/recharge/channels");

export const createRechargeOrder = (data: CreateRechargeOrderRequest) =>
  apiPost<RechargeOrderResponse, CreateRechargeOrderRequest>("/api/recharge/orders", data);

export const getRechargeOrders = (params: RechargeOrderQueryRequest = {}) =>
  apiGet<PageResult<RechargeOrderResponse>>("/api/recharge/orders", { params });

export const getRechargeOrderDetail = (rechargeNo: string) =>
  apiGet<RechargeOrderResponse>(`/api/recharge/orders/${rechargeNo}`);

export const cancelRechargeOrder = (rechargeNo: string) =>
  apiPost<void>(`/api/recharge/orders/${rechargeNo}/cancel`);
