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
import { getAdminCommissionRecordDetail, getAdminCommissionRecords } from "@/api/admin";
import type { AdminCommissionRecordQuery, CommissionRecordResponse } from "@/api/types";
import { formatEmpty, formatPercent, toErrorMessage } from "@/lib/format";

interface CommissionFilters {
  userId: string;
  orderNo: string;
  levelNo: string;
  status: string;
  startTime: string;
  endTime: string;
}

const initialFilters: CommissionFilters = { userId: "", orderNo: "", levelNo: "", status: "", startTime: "", endTime: "" };
const initialQuery: AdminCommissionRecordQuery = { pageNo: 1, pageSize: 10 };

export default function AdminCommissionsPage() {
  const [filters, setFilters] = useState<CommissionFilters>(initialFilters);
  const [detail, setDetail] = useState<CommissionRecordResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loader = useCallback(async (params: AdminCommissionRecordQuery) => (await getAdminCommissionRecords(params)).data, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: CommissionFilters): AdminCommissionRecordQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    user_id: nextFilters.userId ? Number(nextFilters.userId) : undefined,
    order_no: nextFilters.orderNo || undefined,
    level_no: nextFilters.levelNo ? Number(nextFilters.levelNo) : undefined,
    status: nextFilters.status || undefined,
    start_time: nextFilters.startTime || undefined,
    end_time: nextFilters.endTime || undefined,
  });

  const openDetail = async (commissionNo: string) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminCommissionRecordDetail(commissionNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<CommissionRecordResponse>[] = [
    { key: "commissionNo", title: "佣金编号", render: (row) => <CopyableSecret value={row.commissionNo} maskedValue={row.commissionNo} canReveal={false} /> },
    { key: "sourceUserId", title: "来源用户", render: (row) => formatEmpty(row.sourceUserId) },
    { key: "levelNo", title: "层级", render: (row) => `L${row.levelNo}` },
    { key: "sourceProfitAmount", title: "来源收益", render: (row) => <MoneyText value={row.sourceProfitAmount} /> },
    { key: "commissionRateSnapshot", title: "佣金比例", render: (row) => formatPercent(row.commissionRateSnapshot) },
    { key: "commissionAmount", title: "佣金金额", render: (row) => <MoneyText value={row.commissionAmount} /> },
    { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: "创建时间", render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDetail(row.commissionNo)}>
          <Eye className="h-4 w-4" />
          详情
        </Button>
      ),
    },
  ];

  const detailSections: DetailSectionDef<CommissionRecordResponse>[] = [
        {
          title: "佣金信息",
          fields: [
            { label: "佣金编号", render: (detail) => <CopyableSecret value={detail.commissionNo} maskedValue={detail.commissionNo} canReveal={false} /> },
            { label: "状态", render: (detail) => <StatusBadge status={detail.status} /> },
            { label: "层级", render: (detail) => `L${detail.levelNo}` },
            { label: "佣金金额", render: (detail) => <MoneyText value={detail.commissionAmount} /> },
          ],
        },
        {
          title: "来源信息",
          fields: [
            { label: "来源用户", render: (detail) => detail.sourceUserId },
            { label: "来源订单 ID", render: (detail) => detail.sourceOrderId },
            { label: "来源收益 ID", render: (detail) => detail.sourceProfitId },
            { label: "来源收益", render: (detail) => <MoneyText value={detail.sourceProfitAmount} /> },
          ],
        },
        {
          title: "结算信息",
          fields: [
            { label: "佣金比例", render: (detail) => formatPercent(detail.commissionRateSnapshot) },
            { label: "钱包流水", render: (detail) => <CopyableSecret value={detail.walletTxNo} maskedValue={detail.walletTxNo ?? "-"} canReveal={false} /> },
            { label: "结算时间", render: (detail) => <DateTimeText value={detail.settledAt} /> },
            { label: "创建时间", render: (detail) => <DateTimeText value={detail.createdAt} /> },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="COMMISSION OPS" title="佣金记录管理" description="按用户、订单、层级和状态审计分销佣金。" />
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
          <Input id="orderNo" placeholder="输入单号" value={filters.orderNo} onChange={(event) => setFilters((current) => ({ ...current, orderNo: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>佣金层级</Label>
          <Select value={filters.levelNo} onValueChange={(val) => setFilters((current) => ({ ...current, levelNo: val }))}>
            <SelectTrigger className="h-9 w-[120px] bg-background text-foreground">
              <SelectValue placeholder="全部层级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部层级</SelectItem>
              <SelectItem value="1">1级</SelectItem>
              <SelectItem value="2">2级</SelectItem>
              <SelectItem value="3">3级</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>结算状态</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[120px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value="PENDING">待结算</SelectItem>
              <SelectItem value="SETTLED">已结算</SelectItem>
              <SelectItem value="CANCELLED">已取消</SelectItem>
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
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.commissionNo} loading={loading} emptyText="暂无佣金记录" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title="佣金记录详情" subtitle={(data) => data.commissionNo} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
