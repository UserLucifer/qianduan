import { apiGet, apiPost, apiPut } from "./http";
import type {
  CreateWithdrawAddressRequest,
  CreateWithdrawOrderRequest,
  PageResult,
  UpdateWithdrawAddressRequest,
  WithdrawAddressResponse,
  WithdrawOrderQueryRequest,
  WithdrawOrderResponse,
} from "./types";

export type {
  CreateWithdrawAddressRequest,
  CreateWithdrawOrderRequest,
  UpdateWithdrawAddressRequest,
  WithdrawAddressResponse,
  WithdrawOrderQueryRequest,
  WithdrawOrderResponse,
};

// --- Withdraw Orders ---

export const createWithdrawOrder = (data: CreateWithdrawOrderRequest) =>
  apiPost<WithdrawOrderResponse, CreateWithdrawOrderRequest>("/api/withdraw/orders", data);

export const sendWithdrawEmailCode = () =>
  apiPost<void>("/api/withdraw/email-code/send");

export const getWithdrawOrders = (params: WithdrawOrderQueryRequest = {}) =>
  apiGet<PageResult<WithdrawOrderResponse>>("/api/withdraw/orders", { params });

export const getWithdrawOrderDetail = (withdrawNo: string) =>
  apiGet<WithdrawOrderResponse>(`/api/withdraw/orders/${withdrawNo}`);

export const cancelWithdrawOrder = (withdrawNo: string) =>
  apiPost<void>(`/api/withdraw/orders/${withdrawNo}/cancel`);

// --- Withdraw Address Book ---

export const getWithdrawAddresses = () =>
  apiGet<WithdrawAddressResponse[]>("/api/withdraw/addresses");

export const createWithdrawAddress = (data: CreateWithdrawAddressRequest) =>
  apiPost<WithdrawAddressResponse, CreateWithdrawAddressRequest>("/api/withdraw/addresses", data);

export const updateWithdrawAddress = (addressId: number, data: UpdateWithdrawAddressRequest) =>
  apiPut<WithdrawAddressResponse, UpdateWithdrawAddressRequest>(`/api/withdraw/addresses/${addressId}`, data);

export const deleteWithdrawAddress = (addressId: number) =>
  apiPost<void>(`/api/withdraw/addresses/${addressId}/delete`);

export const setDefaultWithdrawAddress = (addressId: number) =>
  apiPost<void>(`/api/withdraw/addresses/${addressId}/default`);
