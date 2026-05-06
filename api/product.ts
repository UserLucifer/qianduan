import { apiGet } from "./http";
import type {
  AiModelResponse,
  ApiResponse,
  GpuModelResponse,
  LocaleQuery,
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
  LocaleQuery,
  PageResult,
  ProductQueryRequest,
  ProductResponse,
  RegionResponse,
  RentalCycleRuleResponse,
};

export const getProducts = (params: ProductQueryRequest = {}) =>
  apiGet<PageResult<ProductResponse>>("/api/products", { params });

export const getProductDetail = (productCode: string, params: LocaleQuery = {}) =>
  apiGet<ProductResponse>(`/api/products/${productCode}`, { params });

export const getAiModels = (params: LocaleQuery = {}) =>
  apiGet<AiModelResponse[]>("/api/ai-models", { params });

export const getGpuModels = (regionId?: number, params: LocaleQuery = {}) =>
  apiGet<GpuModelResponse[]>("/api/gpu-models", {
    params: {
      ...params,
      ...(regionId ? { regionId } : {}),
    },
  });

export const getRegions = (params: LocaleQuery = {}) =>
  apiGet<RegionResponse[]>("/api/regions", { params });

export const getRentalCycleRules = (params: LocaleQuery = {}) =>
  apiGet<RentalCycleRuleResponse[]>("/api/rental-cycle-rules", { params });
