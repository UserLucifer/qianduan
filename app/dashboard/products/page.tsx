"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { 
  Cpu, 
  Loader2, 
  MapPin, 
  Server, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BentoCard } from "@/components/shared/BentoGrid";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getAiModels, getGpuModels, getProducts, getRegions, getRentalCycleRules } from "@/api/product";
import { createRentalOrder, estimateRental, payRentalOrder } from "@/api/rental";
import type { 
  AiModelResponse, 
  GpuModelResponse, 
  ProductResponse, 
  RegionResponse, 
  RentalCycleRuleResponse, 
  RentalEstimateResponse 
} from "@/api/types";
import { toErrorMessage } from "@/lib/format";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;
const ESTIMATED_ROW_HEIGHT = 420;

export default function UserProductsPage() {
  /* ─── Layout State ─── */
  const [columns, setColumns] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1280) setColumns(3); // xl
      else if (width >= 768) setColumns(2); // md
      else setColumns(1);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  /* ─── Functional State ─── */
  const [step, setStep] = useState<0 | 1>(0); // 0: List, 1: Configuration
  const [configStep, setConfigStep] = useState<0 | 1 | 2>(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);

  /* ─── Data State ─── */
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [regions, setRegions] = useState<RegionResponse[]>([]);
  const [gpuModels, setGpuModels] = useState<GpuModelResponse[]>([]);
  const [aiModels, setAiModels] = useState<AiModelResponse[]>([]);
  const [cycleRules, setCycleRules] = useState<RentalCycleRuleResponse[]>([]);

  const [regionId, setRegionId] = useState("");
  const [gpuModelId, setGpuModelId] = useState("");
  const [aiModelId, setAiModelId] = useState<number | null>(null);
  const [cycleRuleId, setCycleRuleId] = useState<number | null>(null);
  
  const [estimate, setEstimate] = useState<RentalEstimateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  /* ─── Virtualization Logic ─── */
  const rows = useMemo(() => {
    const res: ProductResponse[][] = [];
    for (let i = 0; i < products.length; i += columns) {
      res.push(products.slice(i, i + columns));
    }
    return res;
  }, [products, columns]);

  const rowCount = rows.length + (hasMore ? 1 : 0);

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 3,
    scrollMargin: containerRef.current?.offsetTop ?? 0,
  });

  /* ─── Data Fetching ─── */
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [regionRes, gpuRes, aiRes, cycleRes] = await Promise.all([
        getRegions(),
        getGpuModels(),
        getAiModels(),
        getRentalCycleRules(),
      ]);
      setRegions(regionRes.data);
      setGpuModels(gpuRes.data);
      setAiModels(aiRes.data);
      setCycleRules(cycleRes.data);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPage = useCallback(async (pNo: number, isInitial = false) => {
    if (isInitial) setLoading(true);
    else setIsFetchingMore(true);

    try {
      const res = await getProducts({
        pageNo: pNo,
        pageSize: PAGE_SIZE,
        regionId: regionId ? Number(regionId) : undefined,
        gpuModelId: gpuModelId ? Number(gpuModelId) : undefined,
      });
      
      const newItems = res.data.records;
      setProducts(prev => isInitial ? newItems : [...prev, ...newItems]);
      setHasMore(newItems.length === PAGE_SIZE);
      setPageNo(pNo);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, [regionId, gpuModelId]);

  useEffect(() => {
    void fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (step === 0) {
      void loadPage(1, true);
    }
  }, [step, regionId, gpuModelId, loadPage]);

  /* ─── Handlers ─── */
  const handleStartRent = (product: ProductResponse) => {
    setSelectedProduct(product);
    setStep(1);
    setConfigStep(0);
    setAiModelId(aiModels[0]?.id || null);
    setCycleRuleId(null);
    setEstimate(null);
    setError(null);
  };

  const handleCancelConfig = () => {
    setStep(0);
    setSelectedProduct(null);
  };

  const handleEstimate = async (ruleId: number) => {
    if (!selectedProduct || !aiModelId) return;
    setCycleRuleId(ruleId);
    try {
      const res = await estimateRental({
        productId: selectedProduct.id,
        aiModelId,
        cycleRuleId: ruleId
      });
      setEstimate(res.data);
    } catch (err) {
      setError(toErrorMessage(err));
    }
  };

  const handleFinalSubmit = async () => {
    if (!selectedProduct || !aiModelId || !cycleRuleId) return;
    setSubmitting(true);
    setError(null);
    try {
      const orderRes = await createRentalOrder({
        productId: selectedProduct.id,
        aiModelId,
        cycleRuleId
      });
      await payRentalOrder(orderRes.data.orderNo);
      setMessage(`订单 ${orderRes.data.orderNo} 已成功下单。`);
      setTimeout(() => {
        setStep(0);
        setMessage(null);
      }, 3000);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Scroll Loader Effect ─── */
  useEffect(() => {
    const lastVirtualRow = virtualizer.getVirtualItems()[virtualizer.getVirtualItems().length - 1];
    if (lastVirtualRow && lastVirtualRow.index >= rows.length && hasMore && !isFetchingMore && !loading) {
      void loadPage(pageNo + 1);
    }
  }, [virtualizer.getVirtualItems(), rows.length, hasMore, isFetchingMore, loading, pageNo, loadPage]);

  /* ─── Render List ─── */
  const renderList = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">地区:</span>
          <Select value={regionId || "ALL"} onValueChange={(val) => setRegionId(val === "ALL" ? "" : val)}>
            <SelectTrigger className="h-9 w-40 bg-background text-foreground">
              <SelectValue placeholder="全部地区" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部地区</SelectItem>
              {regions.map((r) => <SelectItem key={r.id} value={String(r.id)}>{r.regionName}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">GPU型号:</span>
          <Select value={gpuModelId || "ALL"} onValueChange={(val) => setGpuModelId(val === "ALL" ? "" : val)}>
            <SelectTrigger className="h-9 w-48 bg-background text-foreground">
              <SelectValue placeholder="全部型号" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部型号</SelectItem>
              {gpuModels.map((g) => <SelectItem key={g.id} value={String(g.id)}>{g.modelName}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Virtualized Container */}
      <div 
        ref={containerRef}
        className="relative w-full" 
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index >= rows.length;
          const rowItems = rows[virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="absolute left-0 top-0 w-full pb-5"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              {isLoaderRow ? (
                <div className="flex w-full items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {rowItems.map((p) => (
                    <BentoCard key={p.productCode} className="group relative transition-all hover:shadow-md" contentClassName="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {p.regionName}
                          </div>
                          <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground">{p.gpuModelName}</h3>
                          <p className="text-xs text-muted-foreground/80">{p.productCode}</p>
                        </div>
                        <StatusBadge status={(p.availableStock ?? 0) > 0 ? "ACTIVE" : "DISABLED"} label={(p.availableStock ?? 0) > 0 ? "空闲中" : "无库存"} />
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                            <Cpu className="h-3 w-3" /> 显存
                          </div>
                          <div className="text-sm font-semibold">{p.gpuMemoryGb} GB</div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                            <Zap className="h-3 w-3" /> 算力
                          </div>
                          <div className="text-sm font-semibold">{p.gpuPowerTops} TOPS</div>
                        </div>
                      </div>

                      <div className="mt-8 flex items-end justify-between border-t border-border/50 pt-4">
                        <div className="space-y-0.5">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">起步单价</div>
                          <MoneyText value={p.rentPrice} className="text-lg font-bold" />
                        </div>
                        <Button 
                          onClick={() => handleStartRent(p)}
                          disabled={(p.availableStock ?? 0) <= 0}
                          className="bg-[#5e6ad2] text-white hover:bg-[#7170ff]"
                        >
                          开始租赁
                        </Button>
                      </div>
                    </BentoCard>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {products.length === 0 && !loading && (
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-zinc-500">
            没有符合条件的 GPU 产品。
          </div>
        )}
      </div>
    </motion.div>
  );

  /* ─── Render Config ─── */
  const renderConfig = () => {
    if (!selectedProduct) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="mx-auto max-w-4xl"
      >
        <BentoCard className="relative overflow-visible" contentClassName="p-0">
          <div className="flex items-center justify-between border-b border-border/50 p-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleCancelConfig} className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-bold">租赁配置</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((s) => (
                  <div 
                    key={s} 
                    className={cn(
                      "h-1.5 w-8 rounded-full transition-all duration-300",
                      configStep === s ? "bg-[#5e6ad2] w-12" : "bg-muted"
                    )} 
                  />
                ))}
              </div>
              <Button variant="ghost" size="icon" onClick={handleCancelConfig} className="ml-4 h-8 w-8 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {configStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="rounded-xl border border-border bg-muted/30 p-6">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">确认所选算力</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Server className="h-8 w-8" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{selectedProduct.gpuModelName}</div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Cpu className="h-3.5 w-3.5" /> {selectedProduct.gpuMemoryGb}GB</span>
                            <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> {selectedProduct.gpuPowerTops} TOPS</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {selectedProduct.regionName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">基础价格</div>
                        <MoneyText value={selectedProduct.rentPrice} className="text-2xl font-bold" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setConfigStep(1)} className="group h-12 px-8 bg-[#5e6ad2] hover:bg-[#7170ff] text-white">
                      选择 AI 模型 <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {configStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">选择预装 AI 大模型</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiModels.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setAiModelId(m.id)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border text-left transition-all",
                          aiModelId === m.id ? "border-[#5e6ad2] bg-[#5e6ad2]/5 ring-1 ring-[#5e6ad2]" : "border-border bg-background hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", aiModelId === m.id ? "bg-[#5e6ad2] text-white" : "bg-muted text-muted-foreground")}>
                            <Cpu className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-bold">{m.modelName}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{m.modelCode}</div>
                          </div>
                        </div>
                        {aiModelId === m.id && <CheckCircle2 className="h-5 w-5 text-[#5e6ad2]" />}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-6">
                    <Button variant="ghost" onClick={() => setConfigStep(0)} className="text-muted-foreground"><ChevronLeft className="mr-2 h-4 w-4" /> 返回上一步</Button>
                    <Button onClick={() => setConfigStep(2)} disabled={!aiModelId} className="group h-12 px-8 bg-[#5e6ad2] hover:bg-[#7170ff] text-white">下一步: 选择租赁周期 <ChevronRight className="ml-2 h-4 w-4" /></Button>
                  </div>
                </motion.div>
              )}

              {configStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">租赁周期选项</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {cycleRules.map((rule) => (
                        <button
                          key={rule.id}
                          onClick={() => void handleEstimate(rule.id)}
                          className={cn("p-4 rounded-xl border text-center transition-all", cycleRuleId === rule.id ? "border-[#5e6ad2] bg-[#5e6ad2]/5 ring-1 ring-[#5e6ad2]" : "border-border bg-background hover:bg-muted/50")}
                        >
                          <div className="text-sm font-bold">{rule.cycleName}</div>
                          <div className="text-xs text-muted-foreground mt-1">{rule.cycleDays} 天</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="min-h-[140px] rounded-2xl bg-[#10b981]/5 border border-[#10b981]/20 p-8 flex flex-col items-center justify-center text-center">
                    {estimate ? (
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-2">
                        <div className="text-sm font-medium text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-widest">预估总收益</div>
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="text-4xl font-black text-emerald-500 tabular-nums flex items-center justify-center gap-2">
                          <MoneyText value={estimate.expectedTotalProfit} className="text-emerald-500" />
                        </motion.div>
                        <div className="text-xs text-emerald-600/60 dark:text-emerald-400/60">预估日收: <MoneyText value={estimate.expectedDailyProfit} /> | 倍率: {(estimate.yieldMultiplier * 100).toFixed(0)}%</div>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-muted-foreground"><AlertCircle className="h-8 w-8 opacity-20" /><p className="text-sm">请选择上方租赁周期以计算预估收益</p></div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Button variant="ghost" onClick={() => setConfigStep(1)} className="text-muted-foreground"><ChevronLeft className="mr-2 h-4 w-4" /> 返回上一步</Button>
                    <Button onClick={() => void handleFinalSubmit()} disabled={!cycleRuleId || submitting} className="group h-12 px-10 bg-[#5e6ad2] hover:bg-[#7170ff] text-white shadow-lg shadow-[#5e6ad2]/20">
                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                      确认下单并支付
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </BentoCard>
      </motion.div>
    );
  };

  /* ─── Final JSX ─── */
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="算力市场"
        title={step === 0 ? "GPU 产品目录" : "下单配置中心"}
        description={step === 0 ? "直接选择心仪的产品进入丝滑下单流程" : "按需配置您的算力资源"}
      />

      {message && <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-500">{message}</div>}
      {error && <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-500">{error}</div>}

      <AnimatePresence mode="wait">
        {loading && products.length === 0 ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-64 items-center justify-center text-muted-foreground"
          >
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            正在准备算力资源...
          </motion.div>
        ) : step === 0 ? (
          <div key="list">{renderList()}</div>
        ) : (
          <div key="config">{renderConfig()}</div>
        )}
      </AnimatePresence>
    </div>
  );
}
