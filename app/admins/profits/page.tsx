"use client";

import { useCallback, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MoneyText } from "@/components/shared/MoneyText";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { CopyableSecret } from "@/components/shared/CopyableSecret";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getAdminProfitRecordDetail, getAdminProfitRecords } from "@/api/admin";
import type { AdminProfitRecordQuery, ProfitRecordResponse } from "@/api/types";
import { formatDate, formatEmpty, toErrorMessage } from "@/lib/format";

interface ProfitFilters {
  userId: string;
  orderNo: string;
  status: string;
  profitDate: string;
  startTime: string;
  endTime: string;
}

const initialFilters: ProfitFilters = { userId: "", orderNo: "", status: "", profitDate: "", startTime: "", endTime: "" };
const initialQuery: AdminProfitRecordQuery = { pageNo: 1, pageSize: 10 };

export default function AdminProfitsPage() {
  const [filters, setFilters] = useState<ProfitFilters>(initialFilters);
  const [detail, setDetail] = useState<ProfitRecordResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loader = useCallback(async (params: AdminProfitRecordQuery) => (await getAdminProfitRecords(params)).data, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: ProfitFilters): AdminProfitRecordQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    user_id: nextFilters.userId ? Number(nextFilters.userId) : undefined,
    order_no: nextFilters.orderNo || undefined,
    status: nextFilters.status || undefined,
    profit_date: nextFilters.profitDate || undefined,
    start_time: nextFilters.startTime || undefined,
    end_time: nextFilters.endTime || undefined,
  });

  const trendData = useMemo(() => {
    const bucket = new Map<string, number>();
    page.records.forEach((record) => {
      const key = formatDate(record.profitDate);
      bucket.set(key, (bucket.get(key) ?? 0) + record.finalProfitAmount);
    });
    // 后端暂无管理端收益趋势接口，这里仅基于当前列表页数据按收益日期轻量聚合。
    return Array.from(bucket.entries()).map(([date, amount]) => ({ date, amount }));
  }, [page.records]);

  const openDetail = async (profitNo: string) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminProfitRecordDetail(profitNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<ProfitRecordResponse>[] = [
    { key: "profitNo", title: "收益编号", render: (row) => <CopyableSecret value={row.profitNo} maskedValue={row.profitNo} canReveal={false} /> },
    { key: "orderNo", title: "租赁订单", render: (row) => <CopyableSecret value={row.orderNo} maskedValue={row.orderNo} canReveal={false} /> },
    { key: "productNameSnapshot", title: "算力产品", render: (row) => formatEmpty(row.productNameSnapshot) },
    { key: "aiModelNameSnapshot", title: "AI 模型", render: (row) => formatEmpty(row.aiModelNameSnapshot) },
    { key: "profitDate", title: "收益日期", render: (row) => formatDate(row.profitDate) },
    { key: "finalProfitAmount", title: "最终收益", render: (row) => <MoneyText value={row.finalProfitAmount} /> },
    { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDetail(row.profitNo)}>
          <Eye className="h-4 w-4" />
          详情
        </Button>
      ),
    },
  ];

  const detailSections: DetailSectionDef<any>[] = [
        {
          title: "收益信息",
          fields: [
            { label: "收益编号", render: (detail) => <CopyableSecret value={detail.profitNo} maskedValue={detail.profitNo} canReveal={false} /> },
            { label: "订单号", render: (detail) => <CopyableSecret value={detail.orderNo} maskedValue={detail.orderNo} canReveal={false} /> },
            { label: "状态", render: (detail) => <StatusBadge status={detail.status} /> },
            { label: "收益日期", render: (detail) => formatDate(detail.profitDate) },
          ],
        },
        {
          title: "计算快照",
          fields: [
            { label: "基础收益", render: (detail) => <MoneyText value={detail.baseProfitAmount} /> },
            { label: "最终收益", render: (detail) => <MoneyText value={detail.finalProfitAmount} /> },
            { label: "Token 单价", render: (detail) => formatEmpty(detail.tokenPriceSnapshot) },
            { label: "收益倍率", render: (detail) => formatEmpty(detail.yieldMultiplierSnapshot) },
          ],
        },
        {
          title: "关联信息",
          fields: [
            { label: "产品", render: (detail) => detail.productNameSnapshot },
            { label: "AI 模型", render: (detail) => detail.aiModelNameSnapshot },
            { label: "钱包流水", render: (detail) => <CopyableSecret value={detail.walletTxNo} maskedValue={detail.walletTxNo ?? "-"} canReveal={false} /> },
            { label: "结算时间", render: (detail) => <DateTimeText value={detail.settledAt} /> },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="PROFIT OPS" title="收益记录管理" description="查看用户租赁收益明细、收益状态和结算关联流水。" />
      {(error || actionError) ? (
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
          {actionError ?? error}
        </div>
      ) : null}
      <Card className="border-[var(--admin-border)] bg-[var(--admin-panel-strong)] text-[var(--admin-text)]">
        <CardHeader>
          <CardTitle className="text-sm font-medium">收益分布</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#0f1011", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="amount" stroke="#5e6ad2" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <SearchPanel
        onSearch={() => updateParams(buildQuery(filters))}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="userId">用户 ID</Label>
          <Input id="userId" placeholder="输入 ID" value={filters.userId} onChange={(event) => setFilters((current) => ({ ...current, userId: event.target.value }))} className="h-9 w-[100px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="orderNo">订单号</Label>
          <Input id="orderNo" placeholder="输入订单号" value={filters.orderNo} onChange={(event) => setFilters((current) => ({ ...current, orderNo: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>收益状态</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[130px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value="PENDING">待处理</SelectItem>
              <SelectItem value="SETTLING">结算中</SelectItem>
              <SelectItem value="SETTLED">已结算</SelectItem>
              <SelectItem value="FAILED">已失效</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>收益日期</Label>
          <Input type="date" value={filters.profitDate} onChange={(event) => setFilters((current) => ({ ...current, profitDate: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>开始时间</Label>
          <Input type="date" value={filters.startTime} onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>结束时间</Label>
          <Input type="date" value={filters.endTime} onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
      </SearchPanel>
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.profitNo} loading={loading} emptyText="暂无收益记录" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title="收益记录详情" subtitle={(data) => data.profitNo} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
