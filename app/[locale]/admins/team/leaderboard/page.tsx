"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Eye, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Link, useRouter } from "@/i18n/navigation";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getAdminTeamLeaderboard } from "@/api/admin";
import type { AdminTeamLeaderboardQuery, AdminTeamLeaderboardRow } from "@/api/types";
import { formatEmpty, formatNumber } from "@/lib/format";

const initialQuery: AdminTeamLeaderboardQuery = {
  pageNo: 1,
  pageSize: 10,
  sortBy: "activeOrderCount",
};

export default function AdminTeamLeaderboardPage() {
  const t = useTranslations("AdminPages.team");
  const router = useRouter();
  const [sortBy, setSortBy] = useState(initialQuery.sortBy ?? "activeOrderCount");

  const loader = useCallback(async (params: AdminTeamLeaderboardQuery) => {
    const res = await getAdminTeamLeaderboard(params);
    return res.data;
  }, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialQuery);

  const columns = useMemo<DataTableColumn<AdminTeamLeaderboardRow>[]>(() => [
    {
      key: "rankNo",
      title: t("rank"),
      render: (row) => (
        <div className="flex items-center gap-2 font-semibold tabular-nums text-foreground">
          <Trophy className="h-4 w-4 text-primary" />
          {formatNumber(row.rankNo)}
        </div>
      ),
    },
    {
      key: "userName",
      title: t("teamOwner"),
      render: (row) => (
        <div className="flex min-w-[220px] items-center gap-3">
          <UserAvatar src={row.avatarKey} name={row.userName} className="h-9 w-9" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">{formatEmpty(row.userName)}</div>
            <div className="text-xs text-muted-foreground">ID: {formatEmpty(row.userId)}</div>
          </div>
        </div>
      ),
    },
    { key: "userStatus", title: t("status"), render: (row) => <StatusBadge status={row.userStatus} /> },
    {
      key: "teamSize",
      title: t("teamSize"),
      render: (row) => (
        <div className="space-y-1 text-sm">
          <div className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Users className="h-4 w-4 text-muted-foreground" />
            {t("teamMembers")}
          </div>
          <div className="text-xs text-muted-foreground">
            {t("directCount")}: {formatNumber(row.directCount)} · {t("indirectCount")}: {formatNumber(row.indirectCount)}
          </div>
        </div>
      ),
    },
    { key: "activeOrderCount", title: t("activeOrders"), render: (row) => formatNumber(row.activeOrderCount) },
    {
      key: "yesterdayCommission",
      title: t("yesterdayCommission"),
      render: (row) => <MoneyText value={row.yesterdayCommission} currency={row.currency ?? undefined} />,
    },
    {
      key: "totalCommission",
      title: t("totalCommission"),
      render: (row) => <MoneyText value={row.totalCommission} currency={row.currency ?? undefined} />,
    },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <Button variant="ghost" size="sm" className="font-medium" onClick={() => router.push(`/admins/team/${row.userId}`)}>
          <Eye className="h-4 w-4" />
          {t("viewTeam")}
        </Button>
      ),
    },
  ], [router, t]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("teamOps")}
        title={t("leaderboardTitle")}
        description={t("leaderboardDescription")}
        actions={
          <Button asChild variant="outline">
            <Link href="/admins/team">
              <ArrowLeft className="h-4 w-4" />
              {t("backToTeamList")}
            </Link>
          </Button>
        }
      />

      <ErrorAlert message={error} />

      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">{t("leaderboardHint")}</div>
        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value);
            updateParams({ pageNo: 1, pageSize: page.pageSize, sortBy: value });
          }}
        >
          <SelectTrigger className="h-10 w-full bg-card sm:w-[210px]">
            <SelectValue placeholder={t("sortActiveOrders")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activeOrderCount">{t("sortActiveOrders")}</SelectItem>
            <SelectItem value="totalCommission">{t("sortTotalCommission")}</SelectItem>
            <SelectItem value="yesterdayCommission">{t("sortYesterdayCommission")}</SelectItem>
            <SelectItem value="directCount">{t("sortDirectCount")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={page.records}
        rowKey={(row) => `${row.rankNo}-${row.userId}`}
        loading={loading}
        emptyText={t("noTeamData")}
        pageNo={page.pageNo}
        pageSize={page.pageSize}
        total={page.total}
        onPageChange={changePage}
      />
    </div>
  );
}
