import { apiGet } from "./http";
import type {
  AiModelResponse,
  ApiResponse,
  GpuModelResponse,
  PageResult,
  ProductQueryRequest,
  ProductResponse,
  RegionResponse,
  RentalCycleRuleResponse,
} from "./types";

export type {
  AiModelResponse,
  ApiResponse,
  GpuModelResponse,
  PageResult,
  ProductQueryRequest,
  ProductResponse,
  RegionResponse,
  RentalCycleRuleResponse,
};

export const getProducts = (params: ProductQueryRequest = {}) =>
  apiGet<PageResult<ProductResponse>>("/api/products", { params });

export const getProductDetail = (productCode: string) =>
  apiGet<ProductResponse>(`/api/products/${productCode}`);

export const getAiModels = () =>
  apiGet<AiModelResponse[]>("/api/ai-models");

export const getGpuModels = (regionId?: number) => {
  const url = regionId ? `/api/gpu-models?regionId=${regionId}` : "/api/gpu-models";
  return apiGet<GpuModelResponse[]>(url);
};

export const getRegions = () =>
  apiGet<RegionResponse[]>("/api/regions");

export const getRentalCycleRules = () =>
  apiGet<RentalCycleRuleResponse[]>("/api/rental-cycle-rules");
