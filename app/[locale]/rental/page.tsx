"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { getGpuModels, getProducts, getRegions } from "@/api/product";
import type { GpuModelResponse, ProductResponse, RegionResponse } from "@/api/types";
import { formatMoney, formatNumber, toErrorMessage } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  ArrowUpRight,
  Cpu,
  MapPin,
  Server,
} from "lucide-react";
import { toast } from "sonner";
import { normalizeLocale } from "@/i18n/locales";

const PAGE_SIZE = 100;

const accentPalette = [
  {
    stroke: "#ff4b00",
    fill: "rgba(255, 75, 0, 0.12)",
    chip: "border-[#ff4b00]/30 bg-[#ff4b00]/10 text-[#ffb199]",
  },
  {
    stroke: "#10b981",
    fill: "rgba(16, 185, 129, 0.12)",
    chip: "border-[#10b981]/30 bg-[#10b981]/10 text-[#a7f3d0]",
  },
  {
    stroke: "#7170ff",
    fill: "rgba(113, 112, 255, 0.12)",
    chip: "border-[#7170ff]/30 bg-[#7170ff]/10 text-[#c4c3ff]",
  },
];

function getAccent(productId: number) {
  return accentPalette[productId % accentPalette.length];
}

function buildDashboardHref(
  item: ProductResponse,
  selectedRegionId: number | null,
  selectedGpuModelId: number | null,
) {
  const params = new URLSearchParams({
    source: "rental",
    productId: String(item.id),
    productCode: item.productCode,
  });

  if (selectedRegionId) params.set("regionId", String(selectedRegionId));
  if (selectedGpuModelId) params.set("gpuModelId", String(selectedGpuModelId));

  return `/dashboard/products?${params.toString()}`;
}

function getAvailability(item: ProductResponse, labels: { soldOut: string; available: string }) {
  if (item.availableStock <= 0) {
    return { label: labels.soldOut, tone: "border-white/10 bg-white/[0.04] text-[#62666d]" };
  }

  return { label: labels.available, tone: "border-[#10b981]/30 bg-[#10b981]/10 text-[#a7f3d0]" };
}

function TechLine({
  productId,
  signalBars,
}: {
  productId: number;
  signalBars: number;
}) {
  const accent = getAccent(productId);
  const points = Array.from({ length: 17 }, (_, index) => {
    const x = index * 20;
    const wave = Math.sin((productId + 3) * (index + 1) * 0.31) * 12;
    const step = Math.cos((productId + index) * 0.47) * 7;
    const y = Math.max(12, Math.min(56, 34 + wave + step));
    return { x, y: Number(y.toFixed(1)) };
  });
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  const area = `${line} L320 72 L0 72 Z`;

  return (
    <div className="relative h-[86px] overflow-hidden rounded-[8px] border border-white/[0.06] bg-black/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:32px_22px]" />
      <svg
        className="absolute inset-x-0 bottom-0 h-[82px] w-full overflow-visible"
        viewBox="0 0 320 76"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={area} fill={accent.fill} />
        <path d={line} fill="none" stroke={accent.stroke} strokeWidth="2" strokeLinecap="round" />
        {points.filter((_, index) => index % 4 === 0).map((point) => (
          <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r="2.4" fill={accent.stroke} />
        ))}
      </svg>
      <div className="absolute right-3 top-3 flex items-center gap-1.5">
        {Array.from({ length: signalBars }).map((_, bar) => (
          <span
            key={bar}
            className="h-1.5 w-5 rounded-full"
            style={{ backgroundColor: accent.stroke }}
          />
        ))}
      </div>
    </div>
  );
}

function RentalCard({
  item,
  selectedRegionId,
  selectedGpuModelId,
  locale,
}: {
  item: ProductResponse;
  selectedRegionId: number | null;
  selectedGpuModelId: number | null;
  locale: string;
}) {
  const t = useTranslations("Rental");
  const accent = getAccent(item.id);
  const availability = getAvailability(item, {
    soldOut: t("availability.soldOut"),
    available: t("availability.available"),
  });
  const isSoldOut = item.availableStock <= 0;
  const dashboardHref = buildDashboardHref(item, selectedRegionId, selectedGpuModelId);
  const machineLabel = item.machineAlias || item.machineCode || item.productCode;
  const signalBars = isSoldOut
    ? 3
    : item.availableStock >= Math.max(3, Math.ceil(item.totalStock * 0.5))
      ? 2
      : 1;
  const techSpecs = [
    { label: t("specs.vram"), value: `${item.gpuMemoryGb}GB` },
    { label: t("specs.compute"), value: `${formatNumber(item.gpuPowerTops, locale)} TOPS` },
    { label: "CPU", value: t("specs.cpuCores", { count: item.cpuCores }) },
    { label: t("specs.memory"), value: `${item.memoryGb}GB` },
    { label: t("specs.disk"), value: `${item.systemDiskGb + item.dataDiskGb}GB` },
  ];
  const runtimeSpecs = [
    `CUDA ${item.cudaVersion || "-"}`,
    `Driver ${item.driverVersion || "-"}`,
    t("runtime.stock", { available: item.availableStock, total: item.totalStock }),
  ];

  return (
    <Card className="group relative overflow-hidden rounded-[10px] border border-white/[0.08] bg-[#101113] text-[#f7f8f8] shadow-none transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#141518]">
      <div className="pointer-events-none absolute -right-20 -top-24 h-44 w-44 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: accent.stroke }} />

      <CardHeader className="space-y-0 p-5 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`rounded-[4px] border px-2 py-0.5 text-[11px] font-[510] shadow-none ${accent.chip}`}>
                {item.regionName}
              </Badge>
              <Badge
                variant="outline"
                className="max-w-[150px] rounded-[4px] border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] font-[510] text-[#d0d6e0]"
              >
                <span className="truncate">{machineLabel}</span>
              </Badge>
              <Badge
                variant="outline"
                className={`rounded-[4px] px-2 py-0.5 text-[11px] font-[510] ${availability.tone}`}
              >
                {availability.label}
              </Badge>
            </div>
            <CardTitle className="mt-4 truncate text-2xl font-[590] leading-none tracking-normal text-[#f7f8f8]">
              {item.gpuModelName}
            </CardTitle>
            <p className="mt-2 truncate text-sm text-[#8a8f98]">{item.productName}</p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.04] text-[#d0d6e0] transition-colors group-hover:text-[#f7f8f8]">
            <Server className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        <TechLine productId={item.id} signalBars={signalBars} />

        <div className="mt-3 rounded-[8px] border border-white/[0.06] bg-black/25 px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            {techSpecs.map((spec, index) => (
              <div key={spec.label} className="flex items-center gap-2">
                <div className="whitespace-nowrap text-[12px] font-[590] text-[#f7f8f8]">
                  <span className="tabular-nums">{spec.value}</span>
                  <span className="ml-1 text-[11px] font-[510] text-[#62666d]">{spec.label}</span>
                </div>
                {index < techSpecs.length - 1 ? <span className="h-3 w-px bg-white/[0.08]" /> : null}
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-[510] text-[#62666d]">
            {runtimeSpecs.map((spec, index) => (
              <div key={spec} className="flex items-center gap-2">
                <span className="whitespace-nowrap">{spec}</span>
                {index < runtimeSpecs.length - 1 ? <span className="h-2.5 w-px bg-white/[0.07]" /> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-white/[0.08] pt-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-[510] uppercase tracking-[0.18em] text-[#62666d]">
                {t("card.currentPrice")}
              </div>
              <div className="mt-2 text-2xl font-[590] leading-none tracking-normal text-[#f7f8f8]">
                {formatMoney(item.rentPrice, { locale })}
              </div>
            </div>
            {isSoldOut ? (
              <Button
                className="h-10 w-[112px] shrink-0 rounded-[6px] bg-white/[0.05] px-3 text-sm font-[510] text-[#62666d]"
                disabled
              >
                {t("card.noStock")}
              </Button>
            ) : (
              <Button
                asChild
                className="h-10 w-[112px] shrink-0 rounded-[6px] bg-[#2751E1] px-3 text-sm font-[590] text-white shadow-none hover:bg-[#3f66f0]"
              >
                <Link href={dashboardHref}>
                  {t("card.rent")}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RentalCardSkeleton() {
  return (
    <Card className="rounded-[10px] border border-white/[0.08] bg-[#101113] shadow-none">
      <CardContent className="space-y-4 p-5">
        <div className="flex justify-between">
          <div className="space-y-3">
            <Skeleton className="h-5 w-28 bg-white/[0.08]" />
            <Skeleton className="h-7 w-40 bg-white/[0.08]" />
          </div>
          <Skeleton className="h-11 w-11 rounded-[8px] bg-white/[0.08]" />
        </div>
        <Skeleton className="h-[86px] rounded-[8px] bg-white/[0.08]" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[66px] rounded-[8px] bg-white/[0.08]" />
          ))}
        </div>
        <Skeleton className="h-20 rounded-[8px] bg-white/[0.08]" />
      </CardContent>
    </Card>
  );
}

export default function RentalPage() {
  const locale = normalizeLocale(useLocale());
  const t = useTranslations("Rental");
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [regions, setRegions] = useState<RegionResponse[]>([]);
  const [gpuModels, setGpuModels] = useState<GpuModelResponse[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedGpuModelId, setSelectedGpuModelId] = useState<number | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [gpuLoading, setGpuLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    const init = async () => {
      setInitLoading(true);
      try {
        const regionRes = await getRegions({ language: locale });
        if (ignore) return;
        setRegions(regionRes.data);
        const defaultRegion = regionRes.data[0];
        if (defaultRegion) {
          setSelectedRegionId(defaultRegion.id);
        }
      } catch (err) {
        if (!ignore) {
          toast.error(toErrorMessage(err, locale));
        }
      } finally {
        if (!ignore) {
          setInitLoading(false);
        }
      }
    };

    void init();

    return () => {
      ignore = true;
    };
  }, [locale]);

  useEffect(() => {
    if (selectedRegionId === null) return;

    let ignore = false;
    const regionId = selectedRegionId;

    setSelectedGpuModelId(null);
    setGpuModels([]);
    setProducts([]);
    setProductsLoading(true);

    const fetchGpuModels = async () => {
      setGpuLoading(true);
      try {
        const gpuRes = await getGpuModels(regionId, { language: locale });
        if (ignore) return;
        setGpuModels(gpuRes.data);
        if (gpuRes.data.length > 0) {
          setSelectedGpuModelId(gpuRes.data[0].id);
        } else {
          setProductsLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          toast.error(toErrorMessage(err, locale));
          setProductsLoading(false);
        }
      } finally {
        if (!ignore) {
          setGpuLoading(false);
        }
      }
    };

    void fetchGpuModels();

    return () => {
      ignore = true;
    };
  }, [selectedRegionId, locale]);

  useEffect(() => {
    if (selectedRegionId === null || selectedGpuModelId === null) return;

    let ignore = false;
    const regionId = selectedRegionId;
    const gpuModelId = selectedGpuModelId;

    const fetchProducts = async () => {
      setProducts([]);
      setProductsLoading(true);
      try {
        const productRes = await getProducts({
          pageNo: 1,
          pageSize: PAGE_SIZE,
          regionId,
          gpuModelId,
          language: locale,
        });
        if (ignore) return;
        setProducts(productRes.data.records);
      } catch (err) {
        if (!ignore) {
          toast.error(toErrorMessage(err, locale));
        }
      } finally {
        if (!ignore) {
          setProductsLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      ignore = true;
    };
  }, [selectedRegionId, selectedGpuModelId, locale]);

  const marketStats = useMemo(() => {
    const availableCount = products.reduce((count, item) => count + item.availableStock, 0);
    const averagePrice =
      products.length === 0
        ? 0
        : products.reduce((sum, item) => sum + item.rentPrice, 0) / products.length;
    const maxGpuMemory = products.reduce((max, item) => Math.max(max, item.gpuMemoryGb), 0);

    return {
      total: products.length,
      availableCount,
      averagePrice,
      maxGpuMemory,
    };
  }, [products]);

  const isGridLoading = initLoading || productsLoading;

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8] font-sans [font-feature-settings:'cv01','ss03'] selection:bg-[#5e6ad2]/30 selection:text-white">
      <Header />
      <main className="relative overflow-hidden pb-24">
        <section className="relative overflow-hidden bg-[url('/images/products.avif')] bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-[#08090a]/72" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(113,112,255,0.22),transparent_34%),linear-gradient(180deg,rgba(8,9,10,0.28)_0%,#08090a_100%)]" />
          <div className="relative mx-auto max-w-[1280px] px-4 pb-14 pt-24 sm:px-6 lg:px-8 lg:pb-16 lg:pt-28">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-[44px] font-[510] leading-none tracking-normal text-[#f7f8f8] md:text-[68px]">
                {t("hero.titleLine1")}
                <br className="hidden sm:block" />
                {t("hero.titleLine2")}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#8a8f98] md:text-lg">
                {t("hero.description")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[10px] border border-white/[0.08] bg-white/[0.035] p-4">
                <div className="text-3xl font-[590] leading-none text-[#f7f8f8]">{marketStats.total}</div>
                <div className="mt-2 text-xs text-[#8a8f98]">{t("stats.currentList")}</div>
              </div>
              <div className="rounded-[10px] border border-white/[0.08] bg-white/[0.035] p-4">
                <div className="text-3xl font-[590] leading-none text-[#f7f8f8]">{marketStats.availableCount}</div>
                <div className="mt-2 text-xs text-[#8a8f98]">{t("stats.availableStock")}</div>
              </div>
              <div className="rounded-[10px] border border-white/[0.08] bg-white/[0.035] p-4">
                <div className="text-2xl font-[590] leading-none text-[#f7f8f8]">
                  {formatMoney(marketStats.averagePrice, { locale })}
                </div>
                <div className="mt-2 text-xs text-[#8a8f98]">{t("stats.averagePrice")}</div>
              </div>
              <div className="rounded-[10px] border border-white/[0.08] bg-white/[0.035] p-4">
                <div className="text-3xl font-[590] leading-none text-[#f7f8f8]">{marketStats.maxGpuMemory}GB</div>
                <div className="mt-2 text-xs text-[#8a8f98]">{t("stats.maxVram")}</div>
              </div>
            </div>
            </div>
          </div>
        </section>

        <section id="market" className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 rounded-[12px] border border-white/[0.08] bg-[#0f1011]/95 p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.2)] backdrop-blur-md sm:p-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 pl-1 text-[12px] font-[510] uppercase tracking-[0.18em] text-[#8a8f98]">
                <MapPin className="h-3.5 w-3.5" />
                {t("filters.region")}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {initLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-9 w-24 rounded-full bg-white/[0.08]" />
                    ))
                  : regions.map((region) => (
                      <Button
                        key={region.id}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRegionId(region.id);
                          setSelectedGpuModelId(null);
                          setGpuModels([]);
                          setProducts([]);
                          setProductsLoading(true);
                        }}
                        className={
                          selectedRegionId === region.id
                            ? "h-9 rounded-full border-[#2B55E8] bg-[#2B55E8] px-5 text-xs font-[590] text-white shadow-none hover:bg-[#4168f0] hover:text-white"
                            : "h-9 rounded-full border-white/10 bg-white/[0.02] px-5 text-xs font-[510] text-[#d0d6e0] shadow-none hover:bg-white/[0.06] hover:text-[#f7f8f8]"
                        }
                      >
                        {region.regionName}
                      </Button>
                    ))}
                {!initLoading && regions.length === 0 ? (
                  <div className="flex items-center gap-2 py-2 text-sm text-[#8a8f98]">
                    <AlertCircle className="h-4 w-4" />
                    {t("filters.noRegions")}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="h-px w-full bg-white/[0.08]" />

            <div className="grid gap-5">
              <div className="flex min-w-0 flex-col gap-4">
                <div className="flex items-center gap-2 pl-1 text-[12px] font-[510] uppercase tracking-[0.18em] text-[#8a8f98]">
                  <Cpu className="h-3.5 w-3.5" />
                  {t("filters.gpuModel")}
                </div>
                <div className="flex min-w-0 flex-nowrap gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {gpuLoading
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-9 w-28 shrink-0 rounded-full bg-white/[0.08]" />
                      ))
                    : gpuModels.map((gpuModel) => (
                        <Button
                          key={gpuModel.id}
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedGpuModelId(gpuModel.id)}
                          className={
                            selectedGpuModelId === gpuModel.id
                              ? "h-9 shrink-0 rounded-full border-[#2B55E8] bg-[#2B55E8] px-5 text-xs font-[590] text-white shadow-none hover:bg-[#4168f0] hover:text-white"
                              : "h-9 shrink-0 rounded-full border-white/10 bg-white/[0.02] px-5 text-xs font-[510] text-[#d0d6e0] shadow-none hover:bg-white/[0.06] hover:text-[#f7f8f8]"
                          }
                        >
                          {gpuModel.modelName}
                        </Button>
                      ))}
                  {!gpuLoading && selectedRegionId !== null && gpuModels.length === 0 ? (
                    <div className="flex items-center gap-2 py-2 text-sm text-[#8a8f98]">
                      <AlertCircle className="h-4 w-4" />
                      {t("filters.noGpuModels")}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7">
            {isGridLoading ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <RentalCardSkeleton key={index} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex min-h-[360px] items-center justify-center rounded-[12px] border border-white/[0.08] bg-[#0f1011] text-center">
                <div>
                  <AlertCircle className="mx-auto h-10 w-10 text-[#3e3e44]" />
                  <p className="mt-4 text-base font-[590] text-[#d0d6e0]">{t("empty.title")}</p>
                  <p className="mt-2 text-sm text-[#8a8f98]">{t("empty.description")}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {products.map((item) => (
                  <RentalCard
                    key={item.id}
                    item={item}
                    selectedRegionId={selectedRegionId}
                    selectedGpuModelId={selectedGpuModelId}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
