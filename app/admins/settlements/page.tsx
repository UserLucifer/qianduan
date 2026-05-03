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
import { getAdminSettlementOrderDetail, getAdminSettlementOrders } from "@/api/admin";
import type { AdminSettlementOrderQuery, SettlementOrderResponse } from "@/api/types";
import { settlementTypeLabel } from "@/lib/status";
import { formatEmpty, toErrorMessage } from "@/lib/format";

interface SettlementFilters {
  userId: string;
  orderNo: string;
  settlementType: string;
  status: string;
  startTime: string;
  endTime: string;
}

const initialFilters: SettlementFilters = { userId: "", orderNo: "", settlementType: "", status: "", startTime: "", endTime: "" };
const initialQuery: AdminSettlementOrderQuery = { pageNo: 1, pageSize: 10 };

export default function AdminSettlementsPage() {
  const [filters, setFilters] = useState<SettlementFilters>(initialFilters);
  const [detail, setDetail] = useState<SettlementOrderResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loader = useCallback(async (params: AdminSettlementOrderQuery) => (await getAdminSettlementOrders(params)).data, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: SettlementFilters): AdminSettlementOrderQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    user_id: nextFilters.userId ? Number(nextFilters.userId) : undefined,
    order_no: nextFilters.orderNo || undefined,
    settlement_type: nextFilters.settlementType || undefined,
    status: nextFilters.status || undefined,
    start_time: nextFilters.startTime || undefined,
    end_time: nextFilters.endTime || undefined,
  });

  const openDetail = async (settlementNo: string) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminSettlementOrderDetail(settlementNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<SettlementOrderResponse>[] = [
    { key: "settlementNo", title: "结算编号", render: (row) => <CopyableSecret value={row.settlementNo} maskedValue={row.settlementNo} canReveal={false} /> },
    { key: "orderNo", title: "租赁订单", render: (row) => <CopyableSecret value={row.orderNo} maskedValue={row.orderNo} canReveal={false} /> },
    { key: "settlementType", title: "结算类型", render: (row) => settlementTypeLabel(row.settlementType) },
    { key: "actualSettleAmount", title: "实结金额", render: (row) => <MoneyText value={row.actualSettleAmount} currency={row.currency} /> },
    { key: "profitAmount", title: "收益金额", render: (row) => <MoneyText value={row.profitAmount} currency={row.currency} /> },
    { key: "penaltyAmount", title: "违约金", render: (row) => <MoneyText value={row.penaltyAmount} currency={row.currency} /> },
    { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: "创建时间", render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDetail(row.settlementNo)}>
          <Eye className="h-4 w-4" />
          详情
        </Button>
      ),
    },
  ];

  const detailSections: DetailSectionDef<SettlementOrderResponse>[] = [
        {
          title: "结算信息",
          fields: [
            { label: "结算编号", render: (detail) => <CopyableSecret value={detail.settlementNo} maskedValue={detail.settlementNo} canReveal={false} /> },
            { label: "租赁订单", render: (detail) => <CopyableSecret value={detail.orderNo} maskedValue={detail.orderNo} canReveal={false} /> },
            { label: "结算类型", render: (detail) => settlementTypeLabel(detail.settlementType) },
            { label: "状态", render: (detail) => <StatusBadge status={detail.status} /> },
          ],
        },
        {
          title: "金额信息",
          fields: [
            { label: "本金", render: (detail) => <MoneyText value={detail.principalAmount} currency={detail.currency} /> },
            { label: "收益", render: (detail) => <MoneyText value={detail.profitAmount} currency={detail.currency} /> },
            { label: "违约金", render: (detail) => <MoneyText value={detail.penaltyAmount} currency={detail.currency} /> },
            { label: "实际结算", render: (detail) => <MoneyText value={detail.actualSettleAmount} currency={detail.currency} /> },
          ],
        },
        {
          title: "审核与流水",
          fields: [
            { label: "审核人", render: (detail) => formatEmpty(detail.reviewedBy) },
            { label: "审核时间", render: (detail) => <DateTimeText value={detail.reviewedAt} /> },
            { label: "钱包流水", render: (detail) => <CopyableSecret value={detail.walletTxNo} maskedValue={detail.walletTxNo ?? "-"} canReveal={false} /> },
            { label: "备注", render: (detail) => formatEmpty(detail.remark) },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="SETTLEMENT OPS" title="结算订单管理" description="查看到期结算、提前结算和人工结算记录。" />
      {(error || actionError) ? (
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
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
          <Label>结算类型</Label>
          <Select value={filters.settlementType} onValueChange={(val) => setFilters((current) => ({ ...current, settlementType: val }))}>
            <SelectTrigger className="h-9 w-[130px] bg-background text-foreground">
              <SelectValue placeholder="全部类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部类型</SelectItem>
              <SelectItem value="EXPIRE">到期结算</SelectItem>
              <SelectItem value="EARLY_TERMINATE">提前结算</SelectItem>
              <SelectItem value="MANUAL">人工结算</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>结算状态</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[130px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value="PENDING">待结算</SelectItem>
              <SelectItem value="SETTLING">结算中</SelectItem>
              <SelectItem value="SETTLED">已结算</SelectItem>
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
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.settlementNo} loading={loading} emptyText="暂无结算订单" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title="结算订单详情" subtitle={(data) => data.settlementNo} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
