"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
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
import { ErrorAlert } from "@/components/shared/ErrorAlert";

const initialParams: TeamMemberQueryRequest = { pageNo: 1, pageSize: 10 };


export default function TeamPage() {
  const t = useTranslations("DashboardTeam");
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
  const columns: DataTableColumn<TeamMemberResponse>[] = [
    { key: "userId", title: t("columns.userId"), render: (row) => <span className="font-mono text-xs">{row.userId}</span> },
    { key: "email", title: t("columns.email") },
    { key: "userName", title: t("columns.userName"), render: (row) => row.userName || "-" },
    { key: "levelDepth", title: t("columns.level"), render: (row) => t("columns.levelValue", { level: row.levelDepth }) },
    { key: "status", title: t("columns.status"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: t("columns.joinedAt"), render: (row) => <DateTimeText value={row.createdAt} /> },
  ];

  const copyInviteLink = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} description={t("header.description")} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <StatsCard title={t("stats.total")} value={summary.data?.totalTeamCount ?? 0} description={t("stats.totalDesc")} icon={Users} loading={summary.loading} />
        <StatsCard title={t("stats.direct")} value={summary.data?.directTeamCount ?? 0} description={t("stats.directDesc")} icon={Users} loading={summary.loading} />
        <StatsCard title={t("stats.level2")} value={summary.data?.level2TeamCount ?? 0} description={t("stats.level2Desc")} icon={Users} loading={summary.loading} />
        <StatsCard title={t("stats.level3")} value={summary.data?.level3TeamCount ?? 0} description={t("stats.level3Desc")} icon={Users} loading={summary.loading} />
        <StatsCard title={t("stats.deeper")} value={summary.data?.deeperTeamCount ?? 0} description={t("stats.deeperDesc")} icon={Users} loading={summary.loading} />
      </div>
      <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
        <div className="mb-2 text-sm font-medium text-foreground">{t("invite.title")}</div>
        <div className="flex gap-2">
          <Input readOnly value={inviteLink || t("invite.loading")} />
          <Button onClick={() => void copyInviteLink()} disabled={!inviteLink}>
            <Copy className="h-4 w-4" />
            {t("invite.copy")}</Button>
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
          <Label>{t("filters.depth")}</Label>
          <Select value={filters.levelDepth?.toString()} onValueChange={(val) => setFilters((current) => ({ ...current, levelDepth: val === " " ? undefined : Number(val) }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder={t("filters.allLevels")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("filters.allLevels")}</SelectItem>
              <SelectItem value="1">{t("filters.level1")}</SelectItem>
              <SelectItem value="2">{t("filters.level2")}</SelectItem>
              <SelectItem value="3">{t("filters.level3")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SearchPanel>
      <ErrorAlert message={members.error} />
      <DataTable columns={columns} data={members.page.records} rowKey={(row) => row.userId} loading={members.loading} emptyText={t("empty")} pageNo={members.page.pageNo} pageSize={members.page.pageSize} total={members.page.total} onPageChange={members.changePage} />
    </div>
  );
}
