"use client";

import { useCallback, useState } from "react";
import { Copy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getTeamMembers, getTeamSummary } from "@/api/team";
import { getCurrentUser } from "@/api/user";
import type { PageResult, TeamMemberQueryRequest, TeamMemberResponse, TeamSummaryResponse, UserMeResponse } from "@/api/types";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";

const initialParams: TeamMemberQueryRequest = { pageNo: 1, pageSize: 10 };

const columns: DataTableColumn<TeamMemberResponse>[] = [
  { key: "userId", title: "用户 ID", render: (row) => <span className="font-mono text-xs">{row.userId}</span> },
  { key: "email", title: "邮箱" },
  { key: "userName", title: "用户名", render: (row) => row.userName || "-" },
  { key: "levelDepth", title: "层级", render: (row) => `${row.levelDepth} 级` },
  { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
  { key: "createdAt", title: "加入时间", render: (row) => <DateTimeText value={row.createdAt} /> },
];

export default function TeamPage() {
  const summaryLoader = useCallback(async (): Promise<TeamSummaryResponse> => {
    const res = await getTeamSummary();
    return res.data;
  }, []);
  const userLoader = useCallback(async (): Promise<UserMeResponse> => {
    const res = await getCurrentUser();
    return res.data;
  }, []);
  const loader = useCallback(async (params: TeamMemberQueryRequest): Promise<PageResult<TeamMemberResponse>> => {
    const res = await getTeamMembers(params);
    return res.data;
  }, []);
  const summary = useAsyncResource(summaryLoader);
  const user = useAsyncResource(userLoader);
  const members = usePaginatedResource(loader, initialParams);
  const [filters, setFilters] = useState<TeamMemberQueryRequest>(initialParams);
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const inviteLink = user.data?.userId && origin ? `${origin}/signup?inviteCode=${user.data.userId}` : "";

  const copyInviteLink = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="我的团队" title="团队关系与邀请" description="查看直属成员、下级成员、团队人数和层级关系。邀请链接基于当前用户编号生成。" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <StatsCard title="团队总人数" value={summary.data?.totalTeamCount ?? 0} description="全部层级" icon={Users} loading={summary.loading} />
        <StatsCard title="直属成员" value={summary.data?.directTeamCount ?? 0} description="1 级成员" icon={Users} loading={summary.loading} />
        <StatsCard title="二级成员" value={summary.data?.level2TeamCount ?? 0} description="2 级成员" icon={Users} loading={summary.loading} />
        <StatsCard title="三级成员" value={summary.data?.level3TeamCount ?? 0} description="3 级成员" icon={Users} loading={summary.loading} />
        <StatsCard title="更深层级" value={summary.data?.deeperTeamCount ?? 0} description="接口返回统计" icon={Users} loading={summary.loading} />
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-2 text-sm font-medium text-zinc-100">邀请链接</div>
        <div className="flex gap-2">
          <Input readOnly value={inviteLink || "当前用户信息加载后显示"} className="border-white/10 bg-white/[0.03] text-zinc-100" />
          <Button onClick={() => void copyInviteLink()} disabled={!inviteLink} className="bg-[#5e6ad2] text-white hover:bg-[#7170ff]">
            <Copy className="h-4 w-4" />
            复制
          </Button>
        </div>
      </div>
      <SearchPanel
        onSearch={() => members.updateParams({ ...filters, pageNo: 1 })}
        onReset={() => {
          setFilters(initialParams);
          members.updateParams(initialParams);
        }}
      >
        <div className="space-y-2">
          <Label>层级深度</Label>
          <Select value={filters.levelDepth?.toString()} onValueChange={(val) => setFilters((current) => ({ ...current, levelDepth: val === " " ? undefined : Number(val) }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
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
      </SearchPanel>
      {members.error ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{members.error}</div> : null}
      <DataTable columns={columns} data={members.page.records} rowKey={(row) => row.userId} loading={members.loading} emptyText="暂无团队成员。" pageNo={members.page.pageNo} pageSize={members.page.pageSize} total={members.page.total} onPageChange={members.changePage} />
    </div>
  );
}
