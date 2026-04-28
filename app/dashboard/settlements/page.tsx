"use client";

import { useCallback, useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getSettlementOrderDetail, getSettlementOrders } from "@/api/settlement";
import type { PageResult, SettlementOrderQueryRequest, SettlementOrderResponse } from "@/api/types";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { settlementTypeLabel } from "@/lib/status";
import { toErrorMessage } from "@/lib/format";

const initialParams: SettlementOrderQueryRequest = { pageNo: 1, pageSize: 10 };

export default function SettlementsPage() {
  const loader = useCallback(async (params: SettlementOrderQueryRequest): Promise<PageResult<SettlementOrderResponse>> => {
    const res = await getSettlementOrders(params);
    return res.data;
  }, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialParams);
  const [filters, setFilters] = useState<SettlementOrderQueryRequest>(initialParams);
  const [detail, setDetail] = useState<SettlementOrderResponse | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const openDetail = async (settlementNo: string) => {
    setActionError(null);
    try {
      const res = await getSettlementOrderDetail(settlementNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<SettlementOrderResponse>[] = [
    { key: "settlementNo", title: "结算编号", render: (row) => <span className="font-mono text-xs">{row.settlementNo}</span> },
    { key: "settlementType", title: "结算类型", render: (row) => settlementTypeLabel(row.settlementType) },
    { key: "orderNo", title: "关联订单", render: (row) => <span className="font-mono text-xs">{row.orderNo}</span> },
    { key: "actualSettleAmount", title: "结算金额", render: (row) => <MoneyText value={row.actualSettleAmount} signed /> },
    { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: "时间", render: (row) => <DateTimeText value={row.createdAt} /> },
    { key: "actions", title: "操作", className: "text-right", render: (row) => <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDetail(row.settlementNo)}><Eye className="h-3.5 w-3.5" />详情</Button> },
  ];

  const sections: DetailSectionDef<any>[] = [
    {
      title: "结算信息",
      fields: [
        { label: "结算编号", render: (detail) => <span className="font-mono">{detail.settlementNo}</span> },
        { label: "关联订单", render: (detail) => <span className="font-mono">{detail.orderNo}</span> },
        { label: "结算类型", render: (detail) => settlementTypeLabel(detail.settlementType) },
        { label: "状态", render: (detail) => <StatusBadge status={detail.status} /> },
        { label: "本金", render: (detail) => <MoneyText value={detail.principalAmount} /> },
        { label: "收益", render: (detail) => <MoneyText value={detail.profitAmount} signed /> },
        { label: "违约金", render: (detail) => <MoneyText value={detail.penaltyAmount} /> },
        { label: "实际结算", render: (detail) => <MoneyText value={detail.actualSettleAmount} signed /> },
        { label: "钱包流水", render: (detail) => detail.walletTxNo || "-" },
        { label: "备注", render: (detail) => detail.remark || "-" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="结算记录" title="结算订单" description="查看到期、提前和人工结算记录，跟踪结算金额、状态和关联订单。" />
      <SearchPanel
        onSearch={() => updateParams({ ...filters, pageNo: 1 })}
        onReset={() => {
          setFilters(initialParams);
          updateParams(initialParams);
        }}
      >
        <div className="space-y-2">
          <Label>结算类型</Label>
          <Select value={filters.settlementType} onValueChange={(val) => setFilters((current) => ({ ...current, settlementType: val === " " ? undefined : val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder="全部类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部类型</SelectItem>
              <SelectItem value="EXPIRE">到期结算</SelectItem>
              <SelectItem value="EARLY">提前结算</SelectItem>
              <SelectItem value="MANUAL">人工结算</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>结算状态</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val === " " ? undefined : val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
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
      </SearchPanel>
      {error || actionError ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error ?? actionError}</div> : null}
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.settlementNo} loading={loading} emptyText="暂无结算记录。" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={Boolean(detail)} title="结算详情" subtitle={(data) => data.settlementNo} sections={sections} onClose={() => setDetail(null)} />
    </div>
  );
}
