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

  // Use number IDs to match backend types exactly — avoids string/number comparison bugs
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedGpuModelId, setSelectedGpuModelId] = useState<number | null>(null);
  const [aiModelId, setAiModelId] = useState<number | null>(null);
  const [cycleRuleId, setCycleRuleId] = useState<number | null>(null);

  const [estimate, setEstimate] = useState<RentalEstimateResponse | null>(null);
  // Granular loading states — filter panel is NEVER hidden
  const [initLoading, setInitLoading] = useState(true);      // first page load only
  const [gpuLoading, setGpuLoading] = useState(false);       // GPU matrix row only
  const [productsLoading, setProductsLoading] = useState(false); // product grid only
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

  /* ─── Effect 1: Init — load regions + static data (runs once) ─── */
  useEffect(() => {
    const init = async () => {
      setInitLoading(true);
      try {
        const [regionRes, aiRes, cycleRes] = await Promise.all([
          getRegions(),
          getAiModels(),
          getRentalCycleRules(),
        ]);
        setRegions(regionRes.data);
        setAiModels(aiRes.data);
        setCycleRules(cycleRes.data);
        // Auto-select first region (北京A preferred)
        const def = regionRes.data.find(r => r.regionName.includes("北京A")) ?? regionRes.data[0];
        if (def) setSelectedRegionId(def.id);
      } catch (err) {
        setError(toErrorMessage(err));
      } finally {
        setInitLoading(false);
      }
    };
    void init();
  }, []);

  /* ─── Effect 2: Region changed → fetch GPU models ─── */
  useEffect(() => {
    if (selectedRegionId === null) return;
    const rId = selectedRegionId;

    // ★ Synchronous pre-reset: clear stale data BEFORE any async work.
    // This puts the product grid into skeleton mode immediately on region click.
    setSelectedGpuModelId(null);
    setGpuModels([]);
    setProducts([]);
    setPageNo(1);
    setHasMore(true);
    setProductsLoading(true); // skeleton shows immediately

    const fetchGpus = async () => {
      setGpuLoading(true);
      try {
        const res = await getGpuModels(rId);
        setGpuModels(res.data);
        // Auto-select first GPU model (triggers Effect 3 which will clear productsLoading)
        if (res.data.length > 0) setSelectedGpuModelId(res.data[0].id);
        else setProductsLoading(false); // no GPU models → no products to load
      } catch (err) {
        setError(toErrorMessage(err));
        setProductsLoading(false);
      } finally {
        setGpuLoading(false);
      }
    };
    void fetchGpus();
  }, [selectedRegionId]);

  /* ─── Effect 3: Both IDs valid → fetch products ─── */
  useEffect(() => {
    if (selectedRegionId === null || selectedGpuModelId === null) return;
    const rId = selectedRegionId;
    const gId = selectedGpuModelId;

    const fetchProducts = async () => {
      setProductsLoading(true);
      setProducts([]);
      setPageNo(1);
      setHasMore(true);
      try {
        const res = await getProducts({
          pageNo: 1,
          pageSize: PAGE_SIZE,
          regionId: rId,
          gpuModelId: gId,
        });
        setProducts(res.data.records);
        setHasMore(res.data.records.length === PAGE_SIZE);
        setPageNo(1);
      } catch (err) {
        setError(toErrorMessage(err));
      } finally {
        setProductsLoading(false);
      }
    };
    void fetchProducts();
  }, [selectedRegionId, selectedGpuModelId]);

  /* ─── Infinite scroll load-more ─── */
  const loadMore = useCallback(async () => {
    if (selectedRegionId === null || selectedGpuModelId === null) return;
    if (!hasMore || isFetchingMore || productsLoading) return;
    const nextPage = pageNo + 1;
    setIsFetchingMore(true);
    try {
      const res = await getProducts({
        pageNo: nextPage,
        pageSize: PAGE_SIZE,
        regionId: selectedRegionId,
        gpuModelId: selectedGpuModelId,
      });
      setProducts(prev => [...prev, ...res.data.records]);
      setHasMore(res.data.records.length === PAGE_SIZE);
      setPageNo(nextPage);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsFetchingMore(false);
    }
  }, [selectedRegionId, selectedGpuModelId, hasMore, isFetchingMore, productsLoading, pageNo]);

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
    const virtualItems = virtualizer.getVirtualItems();
    if (virtualItems.length === 0) return;
    const last = virtualItems[virtualItems.length - 1];
    if (last && last.index >= rows.length && hasMore && !isFetchingMore && !productsLoading) {
      void loadMore();
    }
  }, [virtualizer.getVirtualItems(), rows.length, hasMore, isFetchingMore, productsLoading, loadMore]);

  /* ─── Render List ─── */
  const renderList = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Matrix Filters */}
      <div className="space-y-6 rounded-2xl border border-border bg-white/50 p-8 dark:bg-white/[0.02]">
        {/* Region Matrix */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            地区选择
          </div>
          <div className="flex flex-wrap gap-2.5">
            {regions.map((r) => (
              <Button
                key={r.id}
                variant={selectedRegionId === r.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegionId(r.id)}
                className={cn(
                  "h-9 rounded-full px-5 text-xs font-medium transition-all duration-200",
                  selectedRegionId === r.id
                    ? "bg-[#5e6ad2] text-white hover:bg-[#7170ff] shadow-lg shadow-[#5e6ad2]/20"
                    : "hover:bg-muted/50"
                )}
              >
                {r.regionName}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-border/40" />

        {/* GPU Matrix */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Cpu className="h-3.5 w-3.5" />
            可用 GPU 型号
          </div>
          <div className="flex flex-wrap gap-2.5">
            {gpuLoading ? (
              // Skeleton placeholders while GPU list loads
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-muted" />
              ))
            ) : (
              <>
                {gpuModels.map((g) => (
                  <Button
                    key={g.id}
                    variant={selectedGpuModelId === g.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedGpuModelId(g.id)}
                    className={cn(
                      "h-9 rounded-full px-5 text-xs font-medium transition-all duration-200",
                      selectedGpuModelId === g.id
                        ? "bg-[#5e6ad2] text-white hover:bg-[#7170ff] shadow-lg shadow-[#5e6ad2]/20"
                        : "hover:bg-muted/50"
                    )}
                  >
                    {g.modelName}
                  </Button>
                ))}
                {gpuModels.length === 0 && selectedRegionId !== null && (
                  <div className="flex items-center gap-2 py-2 text-xs italic text-muted-foreground opacity-60">
                    <AlertCircle className="h-3.5 w-3.5" />
                    该地区暂无可用算力资源
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {productsLoading ? (
        // Skeleton grid — same column layout as real cards, no flicker
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: columns * 2 }).map((_, i) => (
            <div key={i} className="h-[250px] w-full animate-pulse rounded-2xl border border-border bg-muted" />
          ))}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index >= rows.length;
            const rowItems = rows[virtualRow.index];
            const localY = virtualRow.start - virtualizer.options.scrollMargin;

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="absolute left-0 top-0 w-full"
                style={{ transform: `translateY(${localY}px)` }}
              >
                <div className="pb-6">
                  {isLoaderRow ? (
                    <div className="flex w-full items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-[#5e6ad2]" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {rowItems.map((p) => (
                        <BentoCard key={p.productCode} className="group relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" contentClassName="p-7">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                {p.regionName}
                              </div>
                              <h3 className="mt-2.5 text-2xl font-bold tracking-tight text-foreground">{p.gpuModelName}</h3>
                              <p className="mt-1 text-[11px] font-mono text-muted-foreground/60">{p.productCode}</p>
                            </div>
                            <StatusBadge
                              status={(p.availableStock ?? 0) > 0 ? "ACTIVE" : "DISABLED"}
                              label={(p.availableStock ?? 0) > 0 ? "\u7a7a\u95f2\u4e2d" : "\u65e0\u5e93\u5b58"}
                            />
                          </div>

                          <div className="mt-8 grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                                <Cpu className="h-3.5 w-3.5" /> 显存容量
                              </div>
                              <div className="text-base font-bold">{p.gpuMemoryGb} GB</div>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                                <Zap className="h-3.5 w-3.5" /> 算力性能
                              </div>
                              <div className="text-base font-bold">{p.gpuPowerTops} TOPS</div>
                            </div>
                          </div>

                          <div className="mt-9 flex items-end justify-between border-t border-border/50 pt-5">
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">起步单价</div>
                              <MoneyText value={p.rentPrice} className="text-xl font-black text-[#5e6ad2]" />
                            </div>
                            <Button
                              onClick={() => handleStartRent(p)}
                              disabled={(p.availableStock ?? 0) <= 0}
                              className="h-11 rounded-xl bg-[#5e6ad2] px-6 text-xs font-bold text-white transition-all hover:bg-[#7170ff] hover:shadow-lg hover:shadow-[#5e6ad2]/30 dark:bg-[#5e6ad2]"
                            >
                              开始租赁
                            </Button>
                          </div>
                        </BentoCard>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center">
              <AlertCircle className="mb-4 h-10 w-10 text-muted-foreground/30" />
              <h3 className="text-lg font-medium text-muted-foreground">暂无可用算力产品</h3>
              <p className="mt-1 text-sm text-muted-foreground/60">尝试切换其他地区或型号以发现更多资源</p>
            </div>
          )}
        </div>
      )}
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
        {initLoading ? (
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
