"use client";

import { useCallback, useState } from "react";
import { CircleDollarSign, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getCommissionRecords, getCommissionSummary } from "@/api/commission";
import type { CommissionRecordQueryRequest, CommissionRecordResponse, CommissionSummaryResponse, PageResult } from "@/api/types";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";

const initialParams: CommissionRecordQueryRequest = { pageNo: 1, pageSize: 10 };

const columns: DataTableColumn<CommissionRecordResponse>[] = [
  { key: "commissionNo", title: "佣金编号", render: (row) => <span className="font-mono text-xs">{row.commissionNo}</span> },
  { key: "sourceUserId", title: "来源用户", render: (row) => `用户 ${row.sourceUserId}` },
  { key: "sourceOrderId", title: "关联订单", render: (row) => <span className="font-mono text-xs">{row.sourceOrderId}</span> },
  { key: "levelNo", title: "层级", render: (row) => `${row.levelNo} 级` },
  { key: "commissionRateSnapshot", title: "佣金比例", render: (row) => `${(row.commissionRateSnapshot * 100).toFixed(2)}%` },
  { key: "commissionAmount", title: "佣金金额", render: (row) => <MoneyText value={row.commissionAmount} signed /> },
  { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
  { key: "createdAt", title: "创建时间", render: (row) => <DateTimeText value={row.createdAt} /> },
];

export default function CommissionsPage() {
  const summaryLoader = useCallback(async (): Promise<CommissionSummaryResponse> => {
    const res = await getCommissionSummary();
    return res.data;
  }, []);
  const loader = useCallback(async (params: CommissionRecordQueryRequest): Promise<PageResult<CommissionRecordResponse>> => {
    const res = await getCommissionRecords(params);
    return res.data;
  }, []);
  const summary = useAsyncResource(summaryLoader);
  const records = usePaginatedResource(loader, initialParams);
  const [filters, setFilters] = useState<CommissionRecordQueryRequest>(initialParams);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="佣金中心" title="推广佣金记录" description="查看累计佣金、各层级贡献、来源用户、关联订单、佣金比例和结算状态。" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <StatsCard title="累计佣金" value={<MoneyText value={summary.data?.totalCommission} />} description="历史累计" icon={CircleDollarSign} loading={summary.loading} status="good" />
        <StatsCard title="今日佣金" value={<MoneyText value={summary.data?.todayCommission} />} description="当前自然日" icon={CircleDollarSign} loading={summary.loading} />
        <StatsCard title="一级佣金" value={<MoneyText value={summary.data?.level1Commission} />} description="直属成员贡献" icon={Users} loading={summary.loading} />
        <StatsCard title="二/三级佣金" value={<MoneyText value={(summary.data?.level2Commission ?? 0) + (summary.data?.level3Commission ?? 0)} />} description="下级团队贡献" icon={Users} loading={summary.loading} />
      </div>
      <SearchPanel
        onSearch={() => records.updateParams({ ...filters, pageNo: 1 })}
        onReset={() => {
          setFilters(initialParams);
          records.updateParams(initialParams);
        }}
      >
        <div className="space-y-2">
          <Label>分销层级</Label>
          <Select value={filters.levelNo?.toString()} onValueChange={(val) => setFilters((current) => ({ ...current, levelNo: val === " " ? undefined : Number(val) }))}>
            <SelectTrigger className="h-9 w-[150px] bg-background text-foreground">
              <SelectValue placeholder="全部层级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部层级</SelectItem>
              <SelectItem value="1">1级 (直接推广)</SelectItem>
              <SelectItem value="2">2级 (间接推广)</SelectItem>
              <SelectItem value="3">3级 (间接推广)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>结算状态</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val === " " ? undefined : val }))}>
            <SelectTrigger className="h-9 w-[150px] bg-background text-foreground">
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
          <Input type="date" value={filters.startTime ?? ""} onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value || undefined }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>结束日期</Label>
          <Input type="date" value={filters.endTime ?? ""} onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value || undefined }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
      </SearchPanel>
      {records.error ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{records.error}</div> : null}
      <DataTable columns={columns} data={records.page.records} rowKey={(row) => row.commissionNo} loading={records.loading} emptyText="暂无佣金记录。" pageNo={records.page.pageNo} pageSize={records.page.pageSize} total={records.page.total} onPageChange={records.changePage} />
    </div>
  );
}
