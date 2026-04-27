"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Cpu, Loader2, MapPin, Search, Server, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BentoCard } from "@/components/shared/BentoGrid";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getAiModels, getGpuModels, getProducts, getRegions, getRentalCycleRules } from "@/api/product";
import { createRentalOrder, estimateRental, payRentalOrder } from "@/api/rental";
import type { AiModelResponse, GpuModelResponse, ProductResponse, RegionResponse, RentalCycleRuleResponse, RentalEstimateResponse } from "@/api/types";
import { toErrorMessage } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function UserProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [regions, setRegions] = useState<RegionResponse[]>([]);
  const [gpuModels, setGpuModels] = useState<GpuModelResponse[]>([]);
  const [aiModels, setAiModels] = useState<AiModelResponse[]>([]);
  const [cycleRules, setCycleRules] = useState<RentalCycleRuleResponse[]>([]);
  const [regionId, setRegionId] = useState("");
  const [gpuModelId, setGpuModelId] = useState("");
  const [query, setQuery] = useState("");
  const [aiModelId, setAiModelId] = useState<number | null>(null);
  const [cycleRuleId, setCycleRuleId] = useState<number | null>(null);
  const [estimates, setEstimates] = useState<Record<number, RentalEstimateResponse>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productRes, regionRes, gpuRes, aiRes, cycleRes] = await Promise.all([
        getProducts({
          pageNo: 1,
          pageSize: 100,
          regionId: regionId ? Number(regionId) : undefined,
          gpuModelId: gpuModelId ? Number(gpuModelId) : undefined,
        }),
        getRegions(),
        getGpuModels(),
        getAiModels(),
        getRentalCycleRules(),
      ]);
      setProducts(productRes.data.records);
      setRegions(regionRes.data);
      setGpuModels(gpuRes.data);
      setAiModels(aiRes.data);
      setCycleRules(cycleRes.data);
      setAiModelId((current) => current ?? aiRes.data[0]?.id ?? null);
      setCycleRuleId((current) => current ?? cycleRes.data[0]?.id ?? null);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [gpuModelId, regionId]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) =>
      [product.productName, product.productCode, product.gpuModelName, product.regionName]
        .some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [products, query]);

  const handleEstimate = async (productId: number) => {
    if (!aiModelId || !cycleRuleId) return;
    setError(null);
    try {
      const res = await estimateRental({ productId, aiModelId, cycleRuleId });
      setEstimates((current) => ({ ...current, [productId]: res.data }));
    } catch (err) {
      setError(toErrorMessage(err));
    }
  };

  const handleRent = async (productId: number) => {
    if (!aiModelId || !cycleRuleId) {
      setError("请先选择 AI 模型和租赁周期。");
      return;
    }
    setError(null);
    setMessage(null);
    try {
      const orderRes = await createRentalOrder({ productId, aiModelId, cycleRuleId });
      await payRentalOrder(orderRes.data.orderNo);
      setMessage(`租赁订单 ${orderRes.data.orderNo} 已创建并提交支付。`);
      await fetchData();
    } catch (err) {
      setError(toErrorMessage(err));
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="算力市场"
        title="GPU 产品目录"
        description="按地区、GPU 型号和业务关键词筛选可租赁算力，基于真实估算接口计算收益。"
      />

      <BentoCard>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索产品、GPU 型号、地区"
              className="h-9 bg-background pl-9 text-foreground"
            />
          </div>
          <Select value={regionId || "ALL"} onValueChange={(val) => setRegionId(val === "ALL" ? "" : val)}>
            <SelectTrigger className="h-9 bg-background text-foreground">
              <SelectValue placeholder="全部地区" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部地区</SelectItem>
              {regions.map((region) => <SelectItem key={region.id} value={String(region.id)}>{region.regionName}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={gpuModelId || "ALL"} onValueChange={(val) => setGpuModelId(val === "ALL" ? "" : val)}>
            <SelectTrigger className="h-9 bg-background text-foreground">
              <SelectValue placeholder="全部 GPU" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部 GPU</SelectItem>
              {gpuModels.map((gpu) => <SelectItem key={gpu.id} value={String(gpu.id)}>{gpu.modelName}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => void fetchData()} className="bg-[#5e6ad2] text-white hover:bg-[#7170ff] dark:bg-[#5e6ad2] dark:text-white">应用筛选</Button>
        </div>
      </BentoCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BentoCard title="AI 模型" description="影响部署费用与收益估算">
          <div className="flex flex-wrap gap-2">
            {aiModels.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => setAiModelId(model.id)}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm transition",
                  aiModelId === model.id
                    ? "border-blue-200 bg-blue-50 text-blue-600 dark:border-[#5e6ad2] dark:bg-[#5e6ad2]/20 dark:text-zinc-50"
                    : "border-gray-100 bg-gray-50 text-slate-600 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:text-zinc-100"
                )}
              >
                {model.modelName}
              </button>
            ))}
          </div>
        </BentoCard>
        <BentoCard title="租赁周期" description="不同周期对应收益倍率">
          <div className="flex flex-wrap gap-2">
            {cycleRules.map((rule) => (
              <button
                key={rule.id}
                type="button"
                onClick={() => setCycleRuleId(rule.id)}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm transition",
                  cycleRuleId === rule.id
                    ? "border-blue-200 bg-blue-50 text-blue-600 dark:border-[#5e6ad2] dark:bg-[#5e6ad2]/20 dark:text-zinc-50"
                    : "border-gray-100 bg-gray-50 text-slate-600 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:text-zinc-100"
                )}
              >
                {rule.cycleName} / {rule.cycleDays} 天
              </button>
            ))}
          </div>
        </BentoCard>
      </div>

      {message ? <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{message}</div> : null}
      {error ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</div> : null}

      {loading ? (
        <div className="flex h-48 items-center justify-center text-zinc-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          正在加载算力产品
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {filteredProducts.map((product) => {
            const estimate = estimates[product.id];
            return (
              <BentoCard key={product.productCode} className="min-h-full" contentClassName="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {product.regionName}
                    </div>
                    <h2 className="mt-2 text-xl font-medium tracking-tight text-slate-900 dark:text-zinc-50">{product.gpuModelName}</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">{product.productName}</p>
                  </div>
                  <StatusBadge status={(product.availableStock ?? 0) > 0 ? "ACTIVE" : "DISABLED"} label={(product.availableStock ?? 0) > 0 ? "可租赁" : "暂无库存"} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Spec icon={Cpu} label="显存" value={`${product.gpuMemoryGb} GB`} />
                  <Spec icon={Zap} label="算力" value={`${product.gpuPowerTops} TOPS`} />
                  <Spec icon={Server} label="CPU / 内存" value={`${product.cpuCores} 核 / ${product.memoryGb}GB`} />
                  <Spec icon={Server} label="可用库存" value={`${product.availableStock}/${product.totalStock}`} />
                </div>

                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-zinc-500">租赁价格</span>
                    <MoneyText value={product.rentPrice} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-zinc-500">预计日收益</span>
                    {estimate ? (
                      <MoneyText value={estimate.expectedDailyProfit} className="text-emerald-600 dark:text-emerald-300" />
                    ) : (
                      <button type="button" onClick={() => void handleEstimate(product.id)} className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-[#9aa2ff] dark:hover:text-zinc-100">
                        调用估算
                      </button>
                    )}
                  </div>
                </div>

                <ConfirmActionButton
                  title="确认租赁 GPU 算力"
                  description={`将创建并支付 ${product.productName} 的租赁订单，请确认余额充足。`}
                  confirmText="确认租赁"
                  className="w-full border-gray-200 bg-slate-900 text-white hover:bg-slate-800 dark:border-white/10 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  onConfirm={() => handleRent(product.id)}
                >
                  发起租赁
                </ConfirmActionButton>
              </BentoCard>
            );
          })}
          {filteredProducts.length === 0 ? (
            <div className="col-span-full rounded-lg border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-zinc-500">
              没有符合条件的 GPU 产品。
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function Spec({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Cpu;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-slate-900 dark:text-zinc-100">{value}</div>
    </div>
  );
}
