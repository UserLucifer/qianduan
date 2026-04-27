"use client";

import { useCallback, useState } from "react";
import { Eye, Play, ReceiptText, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { DetailDrawer, type DetailSection } from "@/components/shared/DetailDrawer";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cancelRentalOrder, getRentalOrderDetail, getRentalOrders, payRentalOrder, startOrder } from "@/api/rental";
import type { PageResult, RentalOrderDetailResponse, RentalOrderQueryRequest, RentalOrderSummaryResponse } from "@/api/types";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { formatEmpty, toErrorMessage } from "@/lib/format";

const initialParams: RentalOrderQueryRequest = { pageNo: 1, pageSize: 10 };

export default function DashboardOrdersPage() {
  const loader = useCallback(async (params: RentalOrderQueryRequest): Promise<PageResult<RentalOrderSummaryResponse>> => {
    const res = await getRentalOrders(params);
    return res.data;
  }, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialParams);
  const [filters, setFilters] = useState<RentalOrderQueryRequest>(initialParams);
  const [detail, setDetail] = useState<RentalOrderDetailResponse | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const openDetail = async (orderNo: string) => {
    setActionError(null);
    try {
      const res = await getRentalOrderDetail(orderNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const runAction = async (action: () => Promise<Readonly<object>>) => {
    setActionError(null);
    try {
      await action();
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<RentalOrderSummaryResponse>[] = [
    { key: "orderNo", title: "订单号", render: (row) => <span className="font-mono text-xs">{row.orderNo}</span> },
    {
      key: "productNameSnapshot",
      title: "产品 / 模型",
      render: (row) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-zinc-100">{row.productNameSnapshot}</div>
          <div className="text-xs text-slate-500 dark:text-zinc-500">{row.aiModelNameSnapshot} · {row.cycleDaysSnapshot} 天</div>
        </div>
      ),
    },
    { key: "orderAmount", title: "金额", render: (row) => <MoneyText value={row.orderAmount} /> },
    { key: "orderStatus", title: "订单状态", render: (row) => <StatusBadge status={row.orderStatus} /> },
    { key: "profitStatus", title: "收益状态", render: (row) => <StatusBadge status={row.profitStatus} /> },
    { key: "settlementStatus", title: "结算状态", render: (row) => <StatusBadge status={row.settlementStatus} /> },
    { key: "createdAt", title: "创建时间", render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: "操作",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-white/5" onClick={() => void openDetail(row.orderNo)}>
            <Eye className="h-3.5 w-3.5" />
            详情
          </Button>
          {row.orderStatus === "PENDING_PAY" ? (
            <ConfirmActionButton title="支付租赁订单" description="将从钱包余额扣除订单金额。" confirmText="确认支付" onConfirm={() => runAction(() => payRentalOrder(row.orderNo))}>
              <ReceiptText className="h-3.5 w-3.5" />支付
            </ConfirmActionButton>
          ) : null}
          {row.orderStatus === "PAUSED" ? (
            <ConfirmActionButton title="启动暂停订单" description="订单启动后会继续消耗租赁周期。" confirmText="确认启动" onConfirm={() => runAction(() => startOrder(row.orderNo))}>
              <Play className="h-3.5 w-3.5" />启动
            </ConfirmActionButton>
          ) : null}
          {row.orderStatus === "PENDING_PAY" ? (
            <ConfirmActionButton title="取消租赁订单" description="取消后该订单不可继续支付。" confirmText="确认取消" onConfirm={() => runAction(() => cancelRentalOrder(row.orderNo))}>
              <XCircle className="h-3.5 w-3.5" />取消
            </ConfirmActionButton>
          ) : null}
        </div>
      ),
    },
  ];

  const detailSections: DetailSection[] = detail ? [
    {
      title: "订单信息",
      fields: [
        { label: "订单号", value: <span className="font-mono">{detail.orderNo}</span> },
        { label: "订单状态", value: <StatusBadge status={detail.orderStatus} /> },
        { label: "收益状态", value: <StatusBadge status={detail.profitStatus} /> },
        { label: "结算状态", value: <StatusBadge status={detail.settlementStatus} /> },
        { label: "订单金额", value: <MoneyText value={detail.orderAmount} /> },
        { label: "已付金额", value: <MoneyText value={detail.paidAmount} /> },
      ],
    },
    {
      title: "产品信息",
      fields: [
        { label: "产品名称", value: detail.productNameSnapshot },
        { label: "GPU 型号", value: detail.gpuModelSnapshot },
        { label: "地区", value: detail.regionNameSnapshot },
        { label: "机器", value: detail.machineAliasSnapshot || detail.machineCodeSnapshot },
        { label: "显存", value: `${detail.gpuMemorySnapshotGb} GB` },
        { label: "日 Token", value: detail.tokenOutputPerDaySnapshot.toLocaleString("zh-CN") },
      ],
    },
    {
      title: "API 信息",
      fields: [
        { label: "凭证编号", value: formatEmpty(detail.apiCredential?.credentialNo) },
        { label: "Token 状态", value: <StatusBadge status={detail.apiCredential?.tokenStatus} /> },
        { label: "API 名称", value: formatEmpty(detail.apiCredential?.apiName) },
        { label: "部署费", value: <MoneyText value={detail.deployFeeSnapshot} /> },
      ],
    },
    {
      title: "时间信息",
      fields: [
        { label: "创建时间", value: <DateTimeText value={detail.createdAt} /> },
        { label: "支付时间", value: <DateTimeText value={detail.paidAt} /> },
        { label: "激活时间", value: <DateTimeText value={detail.activatedAt} /> },
        { label: "收益开始", value: <DateTimeText value={detail.profitStartAt} /> },
        { label: "收益结束", value: <DateTimeText value={detail.profitEndAt} /> },
        { label: "到期时间", value: <DateTimeText value={detail.expiredAt} /> },
      ],
    },
  ] : [];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="租赁订单" title="我的租赁订单" description="查看租赁订单状态、收益状态、结算状态以及关联 API 部署信息。" />
      <SearchPanel
        onSearch={() => updateParams({ ...filters, pageNo: 1 })}
        onReset={() => {
          setFilters(initialParams);
          updateParams(initialParams);
        }}
      >
        <div className="space-y-2">
          <Label>订单状态</Label>
          <Select value={filters.orderStatus ?? "ALL"} onValueChange={(value) => setFilters((current) => ({ ...current, orderStatus: value === "ALL" ? undefined : value }))}>
            <SelectTrigger className="h-9 min-w-[140px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部状态</SelectItem>
              <SelectItem value="PENDING_PAY">待支付</SelectItem>
              <SelectItem value="RUNNING">运行中</SelectItem>
              <SelectItem value="PAUSED">已暂停</SelectItem>
              <SelectItem value="COMPLETED">已完成</SelectItem>
              <SelectItem value="CANCELLED">已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>开始日期</Label>
          <Input
            type="date"
            value={filters.startTime ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value || undefined }))}
            className="h-9 w-[160px] bg-background text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label>结束日期</Label>
          <Input
            type="date"
            value={filters.endTime ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value || undefined }))}
            className="h-9 w-[160px] bg-background text-foreground"
          />
        </div>
      </SearchPanel>
      {error || actionError ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error ?? actionError}</div> : null}
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.orderNo} loading={loading} emptyText="暂无租赁订单。" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer open={Boolean(detail)} title="租赁订单详情" subtitle={detail?.orderNo} sections={detailSections} onClose={() => setDetail(null)} />
    </div>
  );
}
