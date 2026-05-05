"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { getAiModels, getProducts, getRentalCycleRules } from "@/api/product";
import { createRentalOrder, estimateRental, payRentalOrder } from "@/api/rental";
import type { AiModelResponse, ProductResponse, RentalCycleRuleResponse } from "@/api/types";
import { formatMoney, toErrorMessage } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Cpu, HardDrive, MapPin, Calculator, ArrowRight, Zap, Server } from "lucide-react";
import { toast } from "sonner";
import Prism from "@/components/ui/prism";

export default function RentalPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [aiModels, setAiModels] = useState<AiModelResponse[]>([]);
  const [cycleRules, setCycleRules] = useState<RentalCycleRuleResponse[]>([]);
  const [selectedAiModelId, setSelectedAiModelId] = useState<number | null>(null);
  const [selectedCycleRuleId, setSelectedCycleRuleId] = useState<number | null>(null);
  const [filterModel, setFilterModel] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [dailyProfit, setDailyProfit] = useState<Record<number, number>>({});

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [productRes, aiRes, cycleRes] = await Promise.all([
        getProducts({ pageSize: 100 }),
        getAiModels(),
        getRentalCycleRules(),
      ]);
      setProducts(productRes.data.records);
      setAiModels(aiRes.data);
      setCycleRules(cycleRes.data);
      setSelectedAiModelId(aiRes.data[0]?.id ?? null);
      setSelectedCycleRuleId(cycleRes.data[0]?.id ?? null);
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchInitialData();
  }, []);

  const filteredListings = useMemo(() => {
    const keyword = filterModel.trim().toLowerCase();
    if (!keyword) return products;
    return products.filter((item) =>
      `${item.gpuModelName} ${item.productName} ${item.regionName}`.toLowerCase().includes(keyword),
    );
  }, [products, filterModel]);

  const handleEstimate = async (productId: number) => {
    if (!selectedAiModelId || !selectedCycleRuleId) {
      toast.error("请先选择 AI 模型和租赁周期");
      return;
    }
    try {
      const res = await estimateRental({ productId, aiModelId: selectedAiModelId, cycleRuleId: selectedCycleRuleId });
      setDailyProfit((current) => ({ ...current, [productId]: res.data.expectedDailyProfit }));
    } catch (err) {
      toast.error(toErrorMessage(err));
    }
  };

  const handleRent = async (productId: number) => {
    if (!selectedAiModelId || !selectedCycleRuleId) {
      toast.error("请先选择 AI 模型和租赁周期");
      return;
    }
    setIsProcessing(productId);
    try {
      const orderRes = await createRentalOrder({ productId, aiModelId: selectedAiModelId, cycleRuleId: selectedCycleRuleId });
      await payRentalOrder(orderRes.data.orderNo);
      toast.success("租赁订单创建成功并支付");
      await fetchInitialData();
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#010102] text-[#f7f8f8] font-sans [font-feature-settings:'cv01','ss03'] selection:bg-[#5e6ad2]/30 selection:text-white">
      <Header />
      <main className="relative pb-24">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-24 pb-20 text-center">
          {/* Subtle aurora/glow at the top center */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] -z-10 pointer-events-none opacity-50 mix-blend-screen [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]">
            <Prism
              animationType="rotate"
              timeScale={0.5}
              height={3.5}
              baseWidth={5.5}
              scale={3.6}
              hueShift={0}
              colorFrequency={1}
              noise={0}
              glow={1}
            />
          </div>

          <Badge variant="outline" className="mb-8 rounded-full border-white/10 bg-white/[0.02] px-4 py-1.5 text-xs text-[#d0d6e0] backdrop-blur-md">
            <Zap className="mr-2 h-3.5 w-3.5 text-[#7170ff]" />
            Compute Marketplace
          </Badge>

          <h1 className="text-[48px] md:text-[72px] font-[510] leading-[1.0] tracking-[-1.584px] text-[#f7f8f8] mb-8">
            GPU 算力市场
          </h1>
          <p className="mx-auto max-w-2xl text-[18px] leading-[1.6] text-[#8a8f98] mb-12 font-normal tracking-[-0.165px]">
            浏览可租赁的高性能 GPU 节点。选择 AI 模型与租赁周期，快速部署您的计算资源，即刻开启大模型训练与推理。
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button asChild className="h-12 rounded-lg bg-[#5e6ad2] px-8 text-[15px] font-[510] text-white hover:bg-[#828fff] shadow-[0_0_24px_rgba(94,106,210,0.4)] transition-all border-none">
              <a href="#market">浏览算力节点</a>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-lg border-white/10 bg-white/[0.02] px-8 text-[15px] font-[510] text-[#d0d6e0] hover:bg-white/[0.05] hover:text-[#f7f8f8] transition-all">
              <Link href="/dashboard/products">
                进入控制台 <ArrowRight className="ml-2 h-4 w-4 text-[#8a8f98]" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Filters & Market Container */}
        <section id="market" className="mx-auto max-w-[1200px] px-6 lg:px-8">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-end gap-4 rounded-t-xl border border-white/[0.08] border-b-0 bg-[#0f1011] p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.2)]">
            <div className="flex-1 w-full space-y-2.5">
              <label className="text-[12px] font-[510] text-[#8a8f98] uppercase tracking-widest pl-1">AI 模型</label>
              <Select value={selectedAiModelId?.toString() ?? ""} onValueChange={(val) => setSelectedAiModelId(Number(val))}>
                <SelectTrigger className="h-11 w-full rounded-md border-white/10 bg-white/[0.02] text-[#d0d6e0] hover:bg-white/[0.04] transition-colors focus:ring-1 focus:ring-[#5e6ad2] focus:ring-offset-0">
                  <SelectValue placeholder="选择 AI 模型" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#191a1b] text-[#d0d6e0] shadow-xl">
                  {aiModels.map(model => (
                    <SelectItem key={model.id} value={model.id.toString()} className="focus:bg-[#5e6ad2]/20 focus:text-[#f7f8f8] cursor-pointer">
                      {model.modelName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 w-full space-y-2.5">
              <label className="text-[12px] font-[510] text-[#8a8f98] uppercase tracking-widest pl-1">租赁周期</label>
              <Select value={selectedCycleRuleId?.toString() ?? ""} onValueChange={(val) => setSelectedCycleRuleId(Number(val))}>
                <SelectTrigger className="h-11 w-full rounded-md border-white/10 bg-white/[0.02] text-[#d0d6e0] hover:bg-white/[0.04] transition-colors focus:ring-1 focus:ring-[#5e6ad2] focus:ring-offset-0">
                  <SelectValue placeholder="选择租赁周期" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#191a1b] text-[#d0d6e0] shadow-xl">
                  {cycleRules.map(rule => (
                    <SelectItem key={rule.id} value={rule.id.toString()} className="focus:bg-[#5e6ad2]/20 focus:text-[#f7f8f8] cursor-pointer">
                      {rule.cycleName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-[1.5] w-full space-y-2.5 relative">
              <label className="text-[12px] font-[510] text-[#8a8f98] uppercase tracking-widest pl-1">搜索节点</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#62666d]" />
                <Input
                  className="h-11 pl-10 rounded-md border-white/10 bg-white/[0.02] text-[#f7f8f8] placeholder:text-[#62666d] hover:bg-white/[0.04] transition-colors focus-visible:ring-1 focus-visible:ring-[#5e6ad2] focus-visible:ring-offset-0"
                  placeholder="搜索 GPU 型号、产品或地区..."
                  value={filterModel}
                  onChange={(e) => setFilterModel(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Market Table */}
          <div className="rounded-b-xl border border-white/[0.08] bg-[#0f1011] overflow-hidden shadow-[0_0_12px_rgba(0,0,0,0.2)_inset]">
            {isLoading ? (
              <div className="flex items-center justify-center py-32 text-[#8a8f98]">
                <div className="flex flex-col items-center gap-5">
                  <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#34343a] border-t-[#5e6ad2]" />
                  <p className="text-[14px] font-[510]">正在加载市场数据...</p>
                </div>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="flex items-center justify-center py-32 text-[#8a8f98]">
                <div className="flex flex-col items-center gap-3">
                  <Search className="h-8 w-8 text-[#3e3e44] mb-2" />
                  <p className="text-[15px] font-[510] text-[#d0d6e0]">未找到匹配的算力节点</p>
                  <p className="text-[13px]">请尝试调整搜索关键词</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="w-full text-left border-collapse">
                  <TableHeader className="border-b border-white/[0.08] bg-white/[0.02]">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="h-12 px-6 text-[12px] font-[510] text-[#8a8f98] uppercase tracking-widest">节点型号</TableHead>
                      <TableHead className="h-12 px-6 text-[12px] font-[510] text-[#8a8f98] uppercase tracking-widest">配置详情</TableHead>
                      <TableHead className="h-12 px-6 text-[12px] font-[510] text-[#8a8f98] uppercase tracking-widest">地区</TableHead>
                      <TableHead className="h-12 px-6 text-[12px] font-[510] text-[#8a8f98] uppercase tracking-widest text-right">预计收益</TableHead>
                      <TableHead className="h-12 px-6 text-[12px] font-[510] text-[#8a8f98] uppercase tracking-widest text-right">价格</TableHead>
                      <TableHead className="h-12 px-6 text-[12px] font-[510] text-[#8a8f98] uppercase tracking-widest text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredListings.map((item, idx) => (
                      <TableRow key={item.id} className={`border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors group ${idx === filteredListings.length - 1 ? 'border-none' : ''}`}>
                        <TableCell className="px-6 py-5">
                          <div className="flex items-center gap-3.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-[#8a8f98] group-hover:border-[#5e6ad2]/50 group-hover:text-[#7170ff] group-hover:bg-[#5e6ad2]/10 transition-all">
                              <Server className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="text-[15px] font-[590] tracking-[-0.165px] text-[#f7f8f8]">{item.gpuModelName}</div>
                              <div className="text-[13px] text-[#8a8f98] mt-1">{item.productName}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[13px] text-[#d0d6e0]">
                              <Cpu className="h-3.5 w-3.5 text-[#62666d]" />
                              <span>{item.cpuCores} 核 CPU / {item.memoryGb}GB 内存</span>
                            </div>
                            <div className="flex items-center gap-2 text-[13px] text-[#d0d6e0]">
                              <HardDrive className="h-3.5 w-3.5 text-[#62666d]" />
                              <span>{item.gpuMemoryGb}GB 显存</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <div className="inline-flex items-center gap-1.5 rounded-md border border-white/5 bg-white/[0.02] px-2.5 py-1 text-[13px] text-[#d0d6e0]">
                            <MapPin className="h-3.5 w-3.5 text-[#62666d]" />
                            {item.regionName}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5 text-right">
                          {dailyProfit[item.id] === undefined ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-3 text-[13px] font-[510] text-[#7170ff] hover:bg-[#7170ff]/10 hover:text-[#828fff] transition-colors"
                              onClick={() => handleEstimate(item.id)}
                            >
                              <Calculator className="mr-1.5 h-3.5 w-3.5" /> 预估收益
                            </Button>
                          ) : (
                            <div className="text-[15px] font-[510] text-[#10b981]">
                              +{formatMoney(dailyProfit[item.id])}
                              <span className="text-[12px] text-[#62666d] font-normal ml-1">/天</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-5 text-right">
                          <div className="text-[16px] font-[510] text-[#f7f8f8] tracking-[-0.165px]">
                            {formatMoney(item.rentPrice)}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5 text-center">
                          <Button
                            className="h-9 rounded-md bg-white/[0.05] border border-white/10 px-4 text-[13px] font-[510] text-[#f7f8f8] hover:bg-[#5e6ad2] hover:border-[#5e6ad2] transition-all w-[90px]"
                            disabled={item.availableStock === 0 || isProcessing === item.id}
                            onClick={() => handleRent(item.id)}
                          >
                            {isProcessing === item.id ? (
                              <div className="flex items-center justify-center h-full">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              </div>
                            ) : item.availableStock === 0 ? (
                              "售罄"
                            ) : (
                              "立即租赁"
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
