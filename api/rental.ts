import { apiGet, apiPost } from "./http";
import type {
  ApiCredentialResponse,
  ApiDeployInfoResponse,
  ApiDeployOrderResponse,
  CreateRentalOrderRequest,
  PageResult,
  ProfitRecordQueryRequest,
  ProfitRecordResponse,
  RentalEstimateRequest,
  RentalEstimateResponse,
  RentalOrderDetailResponse,
  RentalOrderQueryRequest,
  RentalOrderSummaryResponse,
  SettlementOrderResponse,
} from "./types";

export type {
  ApiCredentialResponse,
  ApiDeployInfoResponse,
  ApiDeployOrderResponse,
  CreateRentalOrderRequest,
  RentalEstimateRequest,
  RentalEstimateResponse,
  RentalOrderDetailResponse,
  RentalOrderQueryRequest,
  RentalOrderSummaryResponse,
};

export const getRentalOrders = (params: RentalOrderQueryRequest = {}) =>
  apiGet<PageResult<RentalOrderSummaryResponse>>("/api/rental/orders", { params });

export const getRentalOrderDetail = (orderNo: string) =>
  apiGet<RentalOrderDetailResponse>(`/api/rental/orders/${orderNo}`);

export const estimateRental = (data: RentalEstimateRequest) =>
  apiPost<RentalEstimateResponse, RentalEstimateRequest>("/api/rental/estimate", data);

export const createRentalOrder = (data: CreateRentalOrderRequest) =>
  apiPost<RentalOrderDetailResponse, CreateRentalOrderRequest>("/api/rental/orders", data);

export const payRentalOrder = (orderNo: string) =>
  apiPost<RentalOrderDetailResponse>(`/api/rental/orders/${orderNo}/pay`);

export const cancelRentalOrder = (orderNo: string) =>
  apiPost<RentalOrderDetailResponse>(`/api/rental/orders/${orderNo}/cancel`);

export const startOrder = (orderNo: string) =>
  apiPost<RentalOrderDetailResponse>(`/api/rental/orders/${orderNo}/start`);

export const settleEarly = (orderNo: string) =>
  apiPost<SettlementOrderResponse>(`/api/rental/orders/${orderNo}/settle-early`);

export const getRentalApiCredential = (orderNo: string) =>
  apiGet<ApiCredentialResponse>(`/api/rental/orders/${orderNo}/api-credential`);

export const getRentalDeployInfo = (orderNo: string) =>
  apiGet<ApiDeployInfoResponse>(`/api/rental/orders/${orderNo}/deploy-info`);

export const getRentalDeployOrder = (orderNo: string) =>
  apiGet<ApiDeployOrderResponse>(`/api/rental/orders/${orderNo}/deploy-order`);

export const payDeployFee = (orderNo: string) =>
  apiPost<ApiDeployOrderResponse>(`/api/rental/orders/${orderNo}/deploy/pay`);

export const getRentalOrderProfits = (
  orderNo: string,
  params: ProfitRecordQueryRequest = {},
) =>
  apiGet<PageResult<ProfitRecordResponse>>(`/api/rental/orders/${orderNo}/profits`, {
    params,
  });
