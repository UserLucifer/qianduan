/**
 * Admin Catalog API Types
 * Synchronized with api-docs.md Schema
 */

export interface AiModel {
  id: number;
  modelCode: string;
  modelName: string;
  vendorName: string;
  logoUrl: string;
  monthlyTokenConsumptionTrillion: number;
  tokenUnitPrice: number;
  deployTechFee: number;
  status: number;
  sortNo: number;
  createdAt: string;
  updatedAt: string;
}

export interface GpuModel {
  id: number;
  modelCode: string;
  modelName: string;
  sortNo: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  productCode: string;
  productName: string;
  machineCode: string;
  machineAlias: string;
  regionId: number;
  gpuModelId: number;
  gpuMemoryGb: number;
  gpuPowerTops: number;
  rentPrice: number;
  tokenOutputPerMinute: number;
  tokenOutputPerDay: number;
  rentableUntil: string;
  totalStock: number;
  availableStock: number;
  rentedStock: number;
  cpuModel: string;
  cpuCores: number;
  memoryGb: number;
  systemDiskGb: number;
  dataDiskGb: number;
  maxExpandDiskGb: number;
  driverVersion: string;
  cudaVersion: string;
  hasCacheOptimization: number;
  status: number;
  sortNo: number;
  versionNo: number;
  createdAt: string;
  updatedAt: string;
}

export interface Region {
  id: number;
  regionCode: string;
  regionName: string;
  sortNo: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface RentalCycleRule {
  id: number;
  cycleCode: string;
  cycleName: string;
  cycleDays: number;
  yieldMultiplier: number;
  earlyPenaltyRate: number;
  status: number;
  sortNo: number;
  createdAt: string;
  updatedAt: string;
}

// Request/Response types for Catalog operations
export interface AdminCatalogQuery {
  pageNo?: number;
  pageSize?: number;
  status?: number;
  product_code?: string;
  region_id?: number;
  gpu_model_id?: number;
  model_code?: string;
  region_code?: string;
  cycle_code?: string;
}
