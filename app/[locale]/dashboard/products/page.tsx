"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
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
  AlertCircle,
  ReceiptText,
  Wallet,
  ArrowUpRight
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
import { getWalletInfo } from "@/api/wallet";
import type {
  AiModelResponse,
  GpuModelResponse,
  ProductResponse,
  RegionResponse,
  RentalCycleRuleResponse,
  RentalEstimateResponse,
  WalletMeResponse
} from "@/api/types";
import { formatNumber, toErrorMessage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { normalizeLocale } from "@/i18n/locales";

const PAGE_SIZE = 12;
const ESTIMATED_ROW_HEIGHT = 500;

type ProductCardLabels = {
  available: string;
  outOfStock: string;
  lowStock: string;
  currentPrice: string;
  startRent: string;
  specs: {
    vram: string;
    compute: string;
    cpu: string;
    memory: string;
    disk: string;
    cuda: string;
    driver: string;
    cacheOptimized: string;
    cacheStandard: string;
  };
};

function getProductCardLabels(locale: string): ProductCardLabels {
  const isZh = locale === "zh-CN";

  return {
    available: isZh ? "可租" : "Available",
    outOfStock: isZh ? "已租完" : "Sold out",
    lowStock: isZh ? "紧张" : "Limited",
    currentPrice: isZh ? "当前租赁价格" : "Current rental price",
    startRent: isZh ? "开始租赁" : "Start rental",
    specs: {
      vram: isZh ? "显存" : "VRAM",
      compute: isZh ? "算力" : "Compute",
      cpu: "CPU",
      memory: isZh ? "内存" : "Memory",
      disk: isZh ? "磁盘" : "Disk",
      cuda: "CUDA",
      driver: "Driver",
      cacheOptimized: isZh ? "已启用缓存优化" : "Cache optimized",
      cacheStandard: isZh ? "标准缓存" : "Standard cache",
    },
  };
}

function formatGpuCores(count: number, locale: string) {
  return locale === "zh-CN" ? `${formatNumber(count, locale)} 核` : `${formatNumber(count, locale)} cores`;
}

function getMachineLabel(product: ProductResponse) {
  return product.machineAlias || product.machineCode || product.productCode;
}

function buildTechLine(productId: number) {
  const points = Array.from({ length: 16 }, (_, index) => {
    const x = index * (320 / 15);
    const wave = Math.sin((productId + 5) * (index + 1) * 0.31) * 15;
    const step = Math.cos((productId + index) * 0.53) * 8;
    const y = Math.max(16, Math.min(70, 43 + wave + step));
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
  });
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  const area = `${line} L320 92 L0 92 Z`;
  const markerIndexes = [3, 8, 12];

  return { points, line, area, markerIndexes };
}

function ProductTechLine({
  productId,
  signalBars,
}: {
  productId: number;
  signalBars: number;
}) {
  const { points, line, area, markerIndexes } = buildTechLine(productId);

  return (
    <div className="relative h-[104px] overflow-hidden rounded-xl border border-border bg-[linear-gradient(to_right,hsl(var(--ui-border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--ui-border))_1px,transparent_1px),linear-gradient(180deg,hsl(var(--ui-background))_0%,hsl(var(--ui-muted))_100%)] bg-[size:34px_100%,100%_26px,100%_100%] text-foreground">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 320 92"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={area} fill="currentColor" opacity="0.055" />
        <path d={line} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {markerIndexes.map((index) => {
          const point = points[index];
          return point ? <circle key={index} cx={point.x} cy={point.y} r="3" fill="currentColor" /> : null;
        })}
      </svg>
      <div className="absolute right-3 top-3 flex items-center gap-1.5">
        {Array.from({ length: signalBars }).map((_, index) => (
          <span key={index} className="h-1 w-5 rounded-full bg-foreground/80" />
        ))}
      </div>
    </div>
  );
}

function CacheOptimizationMark({
  enabled,
  label,
}: {
  enabled: boolean;
  label: string;
}) {
  return (
    <div
      role="img"
      title={label}
      aria-label={label}
      className={cn(
        "flex h-[104px] w-20 shrink-0 items-center justify-center rounded-xl border transition-colors",
        enabled
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
          : "border-border bg-background text-muted-foreground"
      )}
    >
      <svg viewBox="0 0 56 34" className="h-12 w-16" role="img" aria-hidden="true">
        <rect x="6" y="8" width="14" height="18" rx="3" fill="currentColor" opacity={enabled ? "0.18" : "0.11"} />
        <rect x="36" y="8" width="14" height="18" rx="3" fill="currentColor" opacity={enabled ? "0.18" : "0.11"} />
        <rect x="22" y="4" width="12" height="26" rx="3" fill="currentColor" opacity={enabled ? "0.28" : "0.16"} />
        <path
          d={enabled ? "M12 17 C20 8 29 26 44 12" : "M12 18 C22 18 32 18 44 18"}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {enabled ? (
          <>
            <circle cx="12" cy="17" r="2.4" fill="currentColor" />
            <circle cx="44" cy="12" r="2.4" fill="currentColor" />
          </>
        ) : null}
      </svg>
    </div>
  );
}

function DashboardProductCard({
  product,
  labels,
  locale,
  onStartRent,
}: {
  product: ProductResponse;
  labels: ProductCardLabels;
  locale: string;
  onStartRent: (product: ProductResponse) => void;
}) {
  const isSoldOut = (product.availableStock ?? 0) <= 0;
  const isLowStock =
    !isSoldOut && product.totalStock > 0 && product.availableStock <= Math.max(2, Math.ceil(product.totalStock * 0.35));
  const statusLabel = isSoldOut ? labels.outOfStock : isLowStock ? labels.lowStock : labels.available;
  const machineLabel = getMachineLabel(product);
  const totalDiskGb = (product.systemDiskGb ?? 0) + (product.dataDiskGb ?? 0);
  const signalBars = isSoldOut ? 1 : isLowStock ? 2 : 3;
  const hasCacheOptimization = Number(product.hasCacheOptimization) === 1;
  const mainSpecs = [
    { label: labels.specs.vram, value: `${formatNumber(product.gpuMemoryGb, locale)}GB` },
    { label: labels.specs.compute, value: `${formatNumber(product.gpuPowerTops, locale)} TOPS` },
    { label: labels.specs.cpu, value: formatGpuCores(product.cpuCores, locale) },
    { label: labels.specs.memory, value: `${formatNumber(product.memoryGb, locale)}GB` },
    { label: labels.specs.disk, value: `${formatNumber(totalDiskGb, locale)}GB` },
  ];
  const runtimeSpecs = [
    `${labels.specs.cuda} ${product.cudaVersion || "-"}`,
    `${labels.specs.driver} ${product.driverVersion || "-"}`,
  ];

  return (
    <BentoCard
      className="group relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      contentClassName="relative overflow-hidden p-0"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute right-4 top-4 h-9 w-14 border-r border-t border-foreground" />
        <div className="absolute bottom-4 left-4 h-7 w-12 border-b border-l border-foreground" />
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-foreground bg-foreground px-2 py-1 text-[11px] font-bold leading-none text-background">
                {product.regionName}
              </span>
              <span className="max-w-[150px] truncate rounded-md border border-border bg-background px-2 py-1 text-[11px] font-semibold leading-none text-muted-foreground">
                {machineLabel}
              </span>
              <StatusBadge
                status={isSoldOut ? "DISABLED" : "ACTIVE"}
                label={statusLabel}
                className={cn(
                  isSoldOut
                    ? "border-border bg-muted text-muted-foreground"
                    : isLowStock
                      ? "border-amber-300/40 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300"
                      : "border-emerald-300/40 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
                )}
              />
            </div>
            <h3 className="mt-4 truncate text-2xl font-black leading-none tracking-tight text-foreground">
              {product.gpuModelName}
            </h3>
            <p className="mt-2 truncate text-sm text-muted-foreground">{product.productName}</p>
            <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground/60">{product.productCode}</p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors group-hover:border-foreground/30">
            <Server className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 flex items-stretch gap-3">
          <div className="min-w-0 flex-1">
            <ProductTechLine productId={product.id} signalBars={signalBars} />
          </div>
          <CacheOptimizationMark
            enabled={hasCacheOptimization}
            label={hasCacheOptimization ? labels.specs.cacheOptimized : labels.specs.cacheStandard}
          />
        </div>

        <div className="mt-4 rounded-xl border border-border bg-muted/25 p-3.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {mainSpecs.map((spec) => (
              <div key={spec.label} className="min-w-[86px]">
                <span className="whitespace-nowrap text-sm font-black tabular-nums text-foreground">{spec.value}</span>
                <span className="ml-1 text-[11px] font-semibold text-muted-foreground">{spec.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/70 pt-3 text-[11px] font-semibold text-muted-foreground">
            {runtimeSpecs.map((spec) => (
              <span key={spec} className="whitespace-nowrap">{spec}</span>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-border/70 pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              {labels.currentPrice}
            </div>
            <MoneyText value={product.rentPrice} className="text-2xl font-black text-foreground" />
          </div>
          <Button
            onClick={() => onStartRent(product)}
            disabled={isSoldOut}
            className="h-11 rounded-xl px-6 text-xs font-bold transition-all hover:shadow-lg hover:shadow-primary/30 sm:min-w-[120px]"
          >
            {labels.startRent}
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </BentoCard>
  );
}

export default function UserProductsPage() {
  const t = useTranslations("DashboardProducts");
  const locale = normalizeLocale(useLocale());
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
  const [wallet, setWallet] = useState<WalletMeResponse | null>(null);
  // Granular loading states — filter panel is NEVER hidden
  const [initLoading, setInitLoading] = useState(true);      // first page load only
  const [gpuLoading, setGpuLoading] = useState(false);       // GPU matrix row only
  const [productsLoading, setProductsLoading] = useState(false); // product grid only
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
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
  const virtualItems = virtualizer.getVirtualItems();
  const productCardLabels = useMemo(() => getProductCardLabels(locale), [locale]);

  /* ─── Effect 1: Init — load regions + static data (runs once) ─── */
  useEffect(() => {
    const init = async () => {
      setInitLoading(true);
      try {
        const [regionRes, aiRes, cycleRes] = await Promise.all([
          getRegions({ language: locale }),
          getAiModels({ language: locale }),
          getRentalCycleRules({ language: locale }),
        ]);
        setRegions(regionRes.data);
        setAiModels(aiRes.data);
        setCycleRules(cycleRes.data);
        // Prefer the Beijing A region when it is available.
        const def = regionRes.data.find(r => r.regionName.includes("\u5317\u4eacA")) ?? regionRes.data[0];
        if (def) setSelectedRegionId(def.id);
      } catch (err) {
        setError(toErrorMessage(err));
      } finally {
        setInitLoading(false);
      }
    };
    void init();
  }, [locale]);

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
        const res = await getGpuModels(rId, { language: locale });
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
  }, [selectedRegionId, locale]);

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
          language: locale,
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
  }, [selectedRegionId, selectedGpuModelId, locale]);

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
        language: locale,
      });
      setProducts(prev => [...prev, ...res.data.records]);
      setHasMore(res.data.records.length === PAGE_SIZE);
      setPageNo(nextPage);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsFetchingMore(false);
    }
  }, [selectedRegionId, selectedGpuModelId, hasMore, isFetchingMore, productsLoading, pageNo, locale]);

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

  const loadWallet = useCallback(async () => {
    setWalletLoading(true);
    try {
      const res = await getWalletInfo();
      setWallet(res.data);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setWalletLoading(false);
    }
  }, []);

  useEffect(() => {
    if (step !== 1 || configStep !== 2) return;
    void loadWallet();
  }, [step, configStep, loadWallet]);

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
      }, { language: locale });
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
      setMessage(t("messages.orderCreated", { orderNo: orderRes.data.orderNo }));
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
    if (virtualItems.length === 0) return;
    const last = virtualItems[virtualItems.length - 1];
    if (last && last.index >= rows.length && hasMore && !isFetchingMore && !productsLoading) {
      void loadMore();
    }
  }, [virtualItems, rows.length, hasMore, isFetchingMore, productsLoading, loadMore]);

  /* ─── Render List ─── */
  const renderList = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Matrix Filters */}
      <div className="space-y-6 rounded-2xl border border-border bg-card p-8 text-card-foreground">
        {/* Region Matrix */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {t("filters.region")}</div>
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
                    ? "shadow-lg shadow-primary/20"
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
            {t("filters.gpu")}</div>
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
                        ? "shadow-lg shadow-primary/20"
                        : "hover:bg-muted/50"
                    )}
                  >
                    {g.modelName}
                  </Button>
                ))}
                {gpuModels.length === 0 && selectedRegionId !== null && (
                  <div className="flex items-center gap-2 py-2 text-xs italic text-muted-foreground opacity-60">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {t("filters.noGpu")}</div>
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
            <div key={i} className="h-[420px] w-full animate-pulse rounded-2xl border border-border bg-muted" />
          ))}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualItems.map((virtualRow) => {
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
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {rowItems.map((p) => (
                        <DashboardProductCard
                          key={p.productCode}
                          product={p}
                          labels={productCardLabels}
                          locale={locale}
                          onStartRent={handleStartRent}
                        />
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
              <h3 className="text-lg font-medium text-muted-foreground">{t("card.emptyTitle")}</h3>
              <p className="mt-1 text-sm text-muted-foreground/60">{t("card.emptyDescription")}</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );

  /* ─── Render Config ─── */
  const renderConfig = () => {
    if (!selectedProduct) return null;
    const rentalCost = estimate?.rentPrice ?? selectedProduct.rentPrice;
    const hasInsufficientBalance = wallet ? wallet.availableBalance < rentalCost : false;

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
              <h2 className="text-lg font-bold">{t("config.title")}</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      "h-1.5 w-8 rounded-full transition-all duration-300",
                      configStep === s ? "w-12 bg-primary" : "bg-muted"
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
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">{t("config.confirmCompute")}</h3>
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
                        <div className="text-sm text-muted-foreground">{t("config.basePrice")}</div>
                        <MoneyText value={selectedProduct.rentPrice} className="text-2xl font-bold" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setConfigStep(1)} className="group h-12 px-8">
                      {t("config.chooseAiModel")}<ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                    <h3 className="text-lg font-bold">{t("config.choosePreinstalledModel")}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiModels.map((m) => (
                      <Button
                        type="button"
                        variant={aiModelId === m.id ? "default" : "outline"}
                        key={m.id}
                        onClick={() => setAiModelId(m.id)}
                        className={cn(
                          "h-auto justify-between rounded-xl p-4 text-left transition-all",
                          aiModelId !== m.id && "bg-background hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", aiModelId === m.id ? "bg-primary-foreground/15 text-primary-foreground" : "bg-muted text-muted-foreground")}>
                            <Cpu className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-bold">{m.modelName}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{m.modelCode}</div>
                          </div>
                        </div>
                        {aiModelId === m.id && <CheckCircle2 className="h-5 w-5" />}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-6">
                    <Button variant="ghost" onClick={() => setConfigStep(0)} className="text-muted-foreground"><ChevronLeft className="mr-2 h-4 w-4" /> {t("config.previous")}</Button>
                    <Button onClick={() => setConfigStep(2)} disabled={!aiModelId} className="group h-12 px-8">{t("config.nextCycle")}<ChevronRight className="ml-2 h-4 w-4" /></Button>
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
                    <h3 className="text-lg font-bold">{t("config.cycleOptions")}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {cycleRules.map((rule) => (
                        <Button
                          type="button"
                          variant={cycleRuleId === rule.id ? "default" : "outline"}
                          key={rule.id}
                          onClick={() => void handleEstimate(rule.id)}
                          className={cn("h-auto rounded-xl p-4 text-center transition-all", cycleRuleId !== rule.id && "bg-background hover:bg-muted/50")}
                        >
                          <div className="text-sm font-bold">{rule.cycleName}</div>
                          <div className="text-xs text-muted-foreground mt-1">{t("config.days", { days: rule.cycleDays })}</div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex min-h-[140px] flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
                    {estimate ? (
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-2">
                        <div className="text-sm font-medium text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-widest">{t("config.estimatedTotalProfit")}</div>
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="text-4xl font-black text-emerald-500 tabular-nums flex items-center justify-center gap-2">
                          <MoneyText value={estimate.expectedTotalProfit} className="text-emerald-500" />
                        </motion.div>
                        <div className="text-xs text-emerald-600/60 dark:text-emerald-400/60">{t("config.estimatedDailyProfit")}: <MoneyText value={estimate.expectedDailyProfit} /> | {t("config.multiplier")}: {(estimate.yieldMultiplier * 100).toFixed(0)}%</div>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-muted-foreground"><AlertCircle className="h-8 w-8 opacity-20" /><p className="text-sm">{t("config.chooseCycleHint")}</p></div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="ghost" onClick={() => setConfigStep(1)} className="text-muted-foreground"><ChevronLeft className="mr-2 h-4 w-4" /> {t("config.previous")}</Button>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/25 p-3 text-xs sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{t("config.walletBalance")}</span>
                          {walletLoading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                          ) : (
                            <MoneyText value={wallet?.availableBalance ?? 0} currency="$" className={cn("font-bold", hasInsufficientBalance && "text-destructive")} />
                          )}
                        </div>
                        <div className="hidden h-4 w-px bg-border sm:block" />
                        <div className="flex items-center gap-2">
                          <ReceiptText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{t("config.rentalCost")}</span>
                          <MoneyText value={rentalCost} currency="$" className="font-bold text-foreground" />
                        </div>
                        {hasInsufficientBalance && (
                          <Button asChild variant="outline" size="sm" className="h-8 px-3 text-xs">
                            <Link href={`/${locale}/dashboard/recharge`}>{t("config.recharge")}</Link>
                          </Button>
                        )}
                      </div>
                      <Button onClick={() => void handleFinalSubmit()} disabled={!cycleRuleId || submitting} className="group h-12 px-10 shadow-lg shadow-primary/20">
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                        {t("config.submit")}</Button>
                    </div>
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
        eyebrow={t("header.eyebrow")}
        title={step === 0 ? t("header.listTitle") : t("header.configTitle")}
        description={step === 0 ? t("header.listDescription") : t("header.configDescription")}
      />

      {message && <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-500">{message}</div>}
      <ErrorAlert message={error} />

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
            {t("messages.loading")}</motion.div>
        ) : step === 0 ? (
          <div key="list">{renderList()}</div>
        ) : (
          <div key="config">{renderConfig()}</div>
        )}
      </AnimatePresence>
    </div>
  );
}
