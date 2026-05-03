"use client";

import { useCallback, useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { getAdminRentalOrderDetail, getAdminRentalOrders } from "@/api/admin";
import type { AdminRentalOrderQuery, RentalOrderDetailResponse } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { RentalOrderStatus } from "@/types/enums";

interface OrderFilters {
  userId: string;
  orderNo: string;
  orderStatus: string;
  profitStatus: string;
  settlementStatus: string;
  startTime: string;
  endTime: string;
}

const initialFilters: OrderFilters = {
  userId: "",
  orderNo: "",
  orderStatus: "",
  profitStatus: "",
  settlementStatus: "",
  startTime: "",
  endTime: "",
};
const initialQuery: AdminRentalOrderQuery = { pageNo: 1, pageSize: 10 };

export default function AdminOrdersPage() {
  const [filters, setFilters] = useState<OrderFilters>(initialFilters);
  const [detail, setDetail] = useState<RentalOrderDetailResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loader = useCallback(async (params: AdminRentalOrderQuery) => (await getAdminRentalOrders(params)).data, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: OrderFilters): AdminRentalOrderQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    user_id: nextFilters.userId ? Number(nextFilters.userId) : undefined,
    order_no: nextFilters.orderNo || undefined,
    order_status: nextFilters.orderStatus || undefined,
    profit_status: nextFilters.profitStatus || undefined,
    settlement_status: nextFilters.settlementStatus || undefined,
    start_time: nextFilters.startTime || undefined,
    end_time: nextFilters.endTime || undefined,
  });

  const openDetail = async (orderNo: string) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminRentalOrderDetail(orderNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };



  const columns: DataTableColumn<RentalOrderDetailResponse>[] = [
    { key: "orderNo", title: "租赁订单号", render: (row) => <CopyableSecret value={row.orderNo} maskedValue={row.orderNo} canReveal={false} /> },
    { key: "userName", title: "用户名称", render: (row) => formatEmpty(row.userName) },
    { key: "productNameSnapshot", title: "算力产品", render: (row) => formatEmpty(row.productNameSnapshot) },
    { key: "gpuModelSnapshot", title: "GPU 型号", render: (row) => formatEmpty(row.gpuModelSnapshot) },
    { key: "regionNameSnapshot", title: "地区", render: (row) => formatEmpty(row.regionNameSnapshot) },
    { key: "orderAmount", title: "订单金额", render: (row) => <MoneyText value={row.orderAmount} currency={row.currency} /> },
    { key: "orderStatus", title: "订单状态", render: (row) => <StatusBadge status={row.orderStatus} /> },
    { key: "profitStatus", title: "收益状态", render: (row) => <StatusBadge status={row.profitStatus} /> },
    { key: "settlementStatus", title: "结算状态", render: (row) => <StatusBadge status={row.settlementStatus} /> },
    { key: "createdAt", title: "创建时间", render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <Button variant="ghost" size="sm" className="font-medium text-[var(--admin-text)] hover:bg-[var(--admin-hover)]" onClick={() => void openDetail(row.orderNo)}>
          <Eye className="h-4 w-4" />
          详情
        </Button>
      ),
    },
  ];

  const detailSections: DetailSectionDef<RentalOrderDetailResponse>[] = [
    {
      title: "订单信息",
      fields: [
        { label: "订单号", render: (detail) => <CopyableSecret value={detail.orderNo} maskedValue={detail.orderNo} canReveal={false} /> },
        { label: "用户名称", render: (detail) => formatEmpty(detail.userName) },
        { label: "订单状态", render: (detail) => <StatusBadge status={detail.orderStatus} /> },
        { label: "支付金额", render: (detail) => <MoneyText value={detail.orderAmount} currency={detail.currency} /> },
      ],
    },
    {
      title: "产品信息",
      fields: [
        { label: "产品名称", render: (detail) => formatEmpty(detail.productNameSnapshot) },
        { label: "产品编码", render: (detail) => formatEmpty(detail.productCodeSnapshot) },
        { label: "GPU 型号", render: (detail) => formatEmpty(detail.gpuModelSnapshot) },
        { label: "地区", render: (detail) => formatEmpty(detail.regionNameSnapshot) },
      ],
    },
    {
      title: "收益与结算",
      fields: [
        { label: "预计日收益", render: (detail) => <MoneyText value={detail.expectedDailyProfit} currency={detail.currency} /> },
        { label: "预计总收益", render: (detail) => <MoneyText value={detail.expectedTotalProfit} currency={detail.currency} /> },
        { label: "收益状态", render: (detail) => <StatusBadge status={detail.profitStatus} /> },
        { label: "结算状态", render: (detail) => <StatusBadge status={detail.settlementStatus} /> },
      ],
    },
    {
      title: "API 信息",
      fields: [
        { label: "凭证编号", render: (detail) => <CopyableSecret value={detail.credentialNo} maskedValue={detail.credentialNo} canReveal={false} /> },
        { label: "API 状态", render: (detail) => <StatusBadge status={detail.tokenStatus} /> },
        { label: "部署状态", render: (detail) => <StatusBadge status={detail.deployOrderStatus} /> },
        { label: "API 地址", render: (detail) => formatEmpty(detail.apiBaseUrl) },
      ],
    },
    {
      title: "时间信息",
      fields: [
        { label: "创建时间", render: (detail) => <DateTimeText value={detail.createdAt} /> },
        { label: "支付时间", render: (detail) => <DateTimeText value={detail.paidAt} /> },
        { label: "激活时间", render: (detail) => <DateTimeText value={detail.activatedAt} /> },
        { label: "到期时间", render: (detail) => <DateTimeText value={detail.expiredAt} /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="RENTAL OPS" title="租赁订单管理" description="审计平台全部 GPU 算力租赁订单，追踪支付、收益、结算和 API 部署链路。" />
      {(error || actionError) ? (
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-500 font-medium">
          {actionError ?? error}
        </div>
      ) : null}
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
          <Label>订单状态</Label>
          <Select value={filters.orderStatus} onValueChange={(val) => setFilters((current) => ({ ...current, orderStatus: val }))}>
            <SelectTrigger className="h-9 w-[130px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value={RentalOrderStatus.PENDING_PAY}>待支付</SelectItem>
              <SelectItem value={RentalOrderStatus.RUNNING}>运行中</SelectItem>
              <SelectItem value={RentalOrderStatus.PAUSED}>已暂停</SelectItem>
              <SelectItem value={RentalOrderStatus.SETTLED}>已结算</SelectItem>
              <SelectItem value={RentalOrderStatus.CANCELED}>已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>收益状态</Label>
          <Select value={filters.profitStatus} onValueChange={(val) => setFilters((current) => ({ ...current, profitStatus: val }))}>
            <SelectTrigger className="h-9 w-[130px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value="PENDING">待处理</SelectItem>
              <SelectItem value={RentalOrderStatus.RUNNING}>进行中</SelectItem>
              <SelectItem value="SUCCESS">成功</SelectItem>
              <SelectItem value="FAILED">失败</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>结算状态</Label>
          <Select value={filters.settlementStatus} onValueChange={(val) => setFilters((current) => ({ ...current, settlementStatus: val }))}>
            <SelectTrigger className="h-9 w-[130px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value="PENDING">待结算</SelectItem>
              <SelectItem value={RentalOrderStatus.SETTLING}>结算中</SelectItem>
              <SelectItem value={RentalOrderStatus.SETTLED}>已结算</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>开始日期</Label>
          <Input type="date" value={filters.startTime} onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>结束日期</Label>
          <Input type="date" value={filters.endTime} onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
      </SearchPanel>
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.orderNo} loading={loading} emptyText="暂无租赁订单" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title="租赁订单详情" subtitle={(data) => data.orderNo} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
