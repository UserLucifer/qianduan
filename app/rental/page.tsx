"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "./rental.css";
import { getAiModels, getProducts, getRentalCycleRules } from "@/api/product";
import { createRentalOrder, estimateRental, payRentalOrder } from "@/api/rental";
import type { AiModelResponse, ProductResponse, RentalCycleRuleResponse } from "@/api/types";
import { formatMoney, toErrorMessage } from "@/lib/format";

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
  const [error, setError] = useState<string | null>(null);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
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
      setError(toErrorMessage(err));
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
    if (!selectedAiModelId || !selectedCycleRuleId) return;
    try {
      const res = await estimateRental({ productId, aiModelId: selectedAiModelId, cycleRuleId: selectedCycleRuleId });
      setDailyProfit((current) => ({ ...current, [productId]: res.data.expectedDailyProfit }));
    } catch (err) {
      setError(toErrorMessage(err));
    }
  };

  const handleRent = async (productId: number) => {
    if (!selectedAiModelId || !selectedCycleRuleId) {
      setError("请先选择 AI 模型和租赁周期。");
      return;
    }
    setIsProcessing(productId);
    setError(null);
    try {
      const orderRes = await createRentalOrder({ productId, aiModelId: selectedAiModelId, cycleRuleId: selectedCycleRuleId });
      await payRentalOrder(orderRes.data.orderNo);
      await fetchInitialData();
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <main className="rental-page">
      <section className="rental-hero">
        <h1 className="rental-hero__title">GPU 算力市场</h1>
        <p className="rental-hero__desc">
          浏览可租赁 GPU 节点，选择 AI 模型和租赁周期后可直接创建租赁订单。
          <Link href="/dashboard/products" className="ml-2 underline">进入用户后台市场</Link>
        </p>
      </section>

      {error ? <div className="error-message">{error}</div> : null}

      <section className="rental-filters">
        <div className="filter-group">
          <label className="filter-group__label">AI 模型</label>
          <select className="filter-select" value={selectedAiModelId ?? ""} onChange={(event) => setSelectedAiModelId(Number(event.target.value))}>
            {aiModels.map((model) => <option key={model.id} value={model.id}>{model.modelName}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-group__label">租赁周期</label>
          <select className="filter-select" value={selectedCycleRuleId ?? ""} onChange={(event) => setSelectedCycleRuleId(Number(event.target.value))}>
            {cycleRules.map((rule) => <option key={rule.id} value={rule.id}>{rule.cycleName}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-group__label">GPU 搜索</label>
          <input className="filter-select" placeholder="搜索型号、产品或地区" value={filterModel} onChange={(event) => setFilterModel(event.target.value)} />
        </div>
      </section>

      <section className="rental-market">
        <div className="market-table-container">
          {isLoading ? (
            <div className="loading-state">加载中...</div>
          ) : (
            <table className="market-table">
              <thead>
                <tr>
                  <th>GPU 型号</th>
                  <th>配置详情</th>
                  <th>地区</th>
                  <th>预计日收益</th>
                  <th>价格</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="gpu-name">{item.gpuModelName}</div>
                      <div className="gpu-sub">{item.productName}</div>
                    </td>
                    <td>{item.gpuMemoryGb}GB 显存 / {item.memoryGb}GB 内存 / {item.cpuCores} 核 CPU</td>
                    <td>{item.regionName}</td>
                    <td>
                      {dailyProfit[item.id] === undefined ? (
                        <button className="text-button" onClick={() => void handleEstimate(item.id)}>点击预估</button>
                      ) : (
                        formatMoney(dailyProfit[item.id])
                      )}
                    </td>
                    <td>{formatMoney(item.rentPrice)}</td>
                    <td>
                      <button className="action-button" disabled={item.availableStock === 0 || isProcessing === item.id} onClick={() => void handleRent(item.id)}>
                        {isProcessing === item.id ? "处理中..." : "立即租赁"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}
