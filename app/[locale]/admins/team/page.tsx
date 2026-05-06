"use client";

import { useCallback, useState } from "react";
import { GitBranch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getAdminTeamRelations } from "@/api/admin";
import type { AdminTeamRelationQuery, UserTeamRelation } from "@/api/types";
import { formatEmpty } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface TeamFilters {
  ancestorUserId: string;
  descendantUserId: string;
  levelDepth: string;
}

const initialFilters: TeamFilters = { ancestorUserId: "", descendantUserId: "", levelDepth: "" };
const initialQuery: AdminTeamRelationQuery = { pageNo: 1, pageSize: 10 };

export default function AdminTeamPage() {
  const [filters, setFilters] = useState<TeamFilters>(initialFilters);
  const loader = useCallback(async (params: AdminTeamRelationQuery) => (await getAdminTeamRelations(params)).data, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: TeamFilters): AdminTeamRelationQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    ancestor_user_id: nextFilters.ancestorUserId ? Number(nextFilters.ancestorUserId) : undefined,
    descendant_user_id: nextFilters.descendantUserId ? Number(nextFilters.descendantUserId) : undefined,
    level_depth: nextFilters.levelDepth ? Number(nextFilters.levelDepth) : undefined,
  });

  const columns: DataTableColumn<UserTeamRelation>[] = [
    { key: "id", title: "关系 ID", render: (row) => formatEmpty(row.id) },
    { key: "ancestorUserId", title: "上级用户", render: (row) => formatEmpty(row.ancestorUserId) },
    { key: "descendantUserId", title: "下级用户", render: (row) => formatEmpty(row.descendantUserId) },
    { key: "levelDepth", title: "层级", render: (row) => <StatusBadge status={`L${row.levelDepth}`} label={`L${row.levelDepth}`} /> },
    { key: "createdAt", title: "建立时间", render: (row) => <DateTimeText value={row.createdAt} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="TEAM OPS"
        title="团队关系管理"
        description="按上级、下级和层级查看邀请分销关系，用于排查佣金链路。"
        actions={<GitBranch className="h-5 w-5 text-[#9aa2ff]" />}
      />
      <ErrorAlert message={error} />
      <SearchPanel
        onSearch={() => updateParams(buildQuery(filters))}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="ancestor">上级用户 ID</Label>
          <Input id="ancestor" placeholder="输入 ID" value={filters.ancestorUserId} onChange={(event) => setFilters((current) => ({ ...current, ancestorUserId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descendant">下级用户 ID</Label>
          <Input id="descendant" placeholder="输入 ID" value={filters.descendantUserId} onChange={(event) => setFilters((current) => ({ ...current, descendantUserId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>层级关系</Label>
          <Select value={filters.levelDepth} onValueChange={(val) => setFilters((current) => ({ ...current, levelDepth: val }))}>
            <SelectTrigger className="h-9 w-[120px] bg-background text-foreground">
              <SelectValue placeholder="全部层级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部层级</SelectItem>
              <SelectItem value="1">1级 (直接)</SelectItem>
              <SelectItem value="2">2级 (间接)</SelectItem>
              <SelectItem value="3">3级 (间接)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SearchPanel>
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.id} loading={loading} emptyText="暂无团队关系" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
    </div>
  );
}
