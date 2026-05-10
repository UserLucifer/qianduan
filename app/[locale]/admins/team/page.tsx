"use client";

import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Activity, Coins, Eye, Search, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Link, useRouter } from "@/i18n/navigation";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getAdminTeamList, getAdminTeamOverview } from "@/api/admin";
import type { AdminTeamListQuery, AdminTeamListRow } from "@/api/types";
import { CommonStatus } from "@/types/enums";
import { formatEmpty, formatNumber, formatPercent } from "@/lib/format";

const initialQuery: AdminTeamListQuery = { pageNo: 1, pageSize: 10 };
const ALL_VALUE = "ALL";

interface TeamFilters {
  keyword: string;
  status: string;
  sortBy: string;
}

const initialFilters: TeamFilters = {
  keyword: "",
  status: ALL_VALUE,
  sortBy: ALL_VALUE,
};

export default function AdminTeamPage() {
  const t = useTranslations("AdminPages.team");
  const router = useRouter();
  const [filters, setFilters] = useState<TeamFilters>(initialFilters);

  const overviewLoader = useCallback(async () => {
    const res = await getAdminTeamOverview();
    return res.data;
  }, []);
  const overview = useAsyncResource(overviewLoader);

  const loader = useCallback(async (params: AdminTeamListQuery) => {
    const res = await getAdminTeamList(params);
    return res.data;
  }, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialQuery);

  const buildQuery = useCallback((nextFilters: TeamFilters, pageNo = 1): AdminTeamListQuery => ({
    pageNo,
    pageSize: page.pageSize,
    keyword: nextFilters.keyword.trim() || undefined,
    status: nextFilters.status === ALL_VALUE ? undefined : Number(nextFilters.status),
    sortBy: nextFilters.sortBy === ALL_VALUE ? undefined : nextFilters.sortBy,
  }), [page.pageSize]);

  const applyFilters = useCallback((nextFilters: TeamFilters) => {
    updateParams(buildQuery(nextFilters));
  }, [buildQuery, updateParams]);

  const columns = useMemo<DataTableColumn<AdminTeamListRow>[]>(() => [
    {
      key: "userName",
      title: t("teamOwner"),
      render: (row) => (
        <div className="flex min-w-[220px] items-center gap-3">
          <UserAvatar src={row.avatarKey} name={row.userName} className="h-9 w-9" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">{formatEmpty(row.userName)}</div>
            <div className="truncate text-xs text-muted-foreground">
              ID: {formatEmpty(row.userId)}
              {row.email ? ` · ${row.email}` : ""}
            </div>
          </div>
        </div>
      ),
    },
    { key: "userStatus", title: t("status"), render: (row) => <StatusBadge status={row.userStatus} /> },
    {
      key: "totalTeamCount",
      title: t("teamSize"),
      render: (row) => (
        <div className="space-y-1 text-sm">
          <div className="font-semibold tabular-nums text-foreground">{formatNumber(row.totalTeamCount)}</div>
          <div className="text-xs text-muted-foreground">
            {t("directCount")}: {formatNumber(row.directCount)} · {t("indirectCount")}: {formatNumber(row.indirectCount)}
          </div>
        </div>
      ),
    },
    {
      key: "activeOrderCount",
      title: t("activeOrders"),
      render: (row) => (
        <div className="space-y-1 text-sm">
          <div className="font-semibold tabular-nums text-foreground">{formatNumber(row.activeOrderCount)}</div>
          <div className="text-xs text-muted-foreground">{t("runningOrders")}: {formatNumber(row.runningOrderCount)}</div>
        </div>
      ),
    },
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
      key: "lastCommissionAt",
      title: t("lastCommissionAt"),
      render: (row) => <DateTimeText value={row.lastCommissionAt} />,
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

  const overviewData = overview.data;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("teamOps")}
        title={t("teamRelationshipManagement")}
        description={t("teamListDescription")}
      />

      <ErrorAlert message={overview.error ?? error} />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title={t("activeTeams")}
          icon={<Users className="h-5 w-5" />}
          value={overviewData ? formatNumber(overviewData.activeTeamCount) : "-"}
          subValue={overviewData?.activeTeamGrowthRate == null ? undefined : formatPercent(overviewData.activeTeamGrowthRate)}
          loading={overview.loading}
        />
        <MetricCard
          title={t("todayEstCommission")}
          icon={<Coins className="h-5 w-5" />}
          value={overviewData ? <MoneyText value={overviewData.todayEstimatedCommission} currency={overviewData.currency ?? undefined} /> : "-"}
          subValue={overviewData?.commissionGrowthRate == null ? undefined : formatPercent(overviewData.commissionGrowthRate)}
          loading={overview.loading}
        />
        <MetricCard
          title={t("teamListTotal")}
          icon={<Activity className="h-5 w-5" />}
          value={formatNumber(page.total)}
          loading={loading}
        />
      </div>

      <div className="flex flex-col gap-4 border-b border-border pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex w-full flex-col gap-2 sm:flex-row xl:max-w-[520px]">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.keyword}
              placeholder={t("searchUserKeyword")}
              onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))}
              onKeyDown={(event) => {
                if (event.key === "Enter") applyFilters(filters);
              }}
              className="h-10 pl-9"
            />
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/admins/team/leaderboard">
              <Trophy className="h-4 w-4" />
              {t("viewLeaderboard")}
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <Select
            value={filters.status}
            onValueChange={(value) => {
              const next = { ...filters, status: value };
              setFilters(next);
              applyFilters(next);
            }}
          >
            <SelectTrigger className="h-10 w-full bg-card sm:w-[132px]">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t("allStatuses")}</SelectItem>
              <SelectItem value={CommonStatus.ENABLED.toString()}>{t("enabled")}</SelectItem>
              <SelectItem value={CommonStatus.DISABLED.toString()}>{t("disabled")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy}
            onValueChange={(value) => {
              const next = { ...filters, sortBy: value };
              setFilters(next);
              applyFilters(next);
            }}
          >
            <SelectTrigger className="h-10 w-full bg-card sm:w-[180px]">
              <SelectValue placeholder={t("defaultSort")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t("defaultSort")}</SelectItem>
              <SelectItem value="totalCommission">{t("sortTotalCommission")}</SelectItem>
              <SelectItem value="yesterdayCommission">{t("sortYesterdayCommission")}</SelectItem>
              <SelectItem value="activeOrderCount">{t("sortActiveOrders")}</SelectItem>
              <SelectItem value="totalTeamCount">{t("sortTeamSize")}</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => applyFilters(filters)}>
            <Search className="h-4 w-4" />
            {t("search")}
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={page.records}
        rowKey={(row) => row.userId}
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

function MetricCard({
  title,
  value,
  subValue,
  icon,
  loading,
}: {
  title: string;
  value: ReactNode;
  subValue?: string;
  icon: ReactNode;
  loading?: boolean;
}) {
  return (
    <Card className="border bg-card shadow-sm">
      <CardContent className="flex min-h-[112px] items-center justify-between gap-4 p-5">
        <div className="min-w-0 space-y-2">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          <div className="truncate text-2xl font-semibold tabular-nums text-foreground">
            {loading ? "-" : value}
          </div>
          {subValue ? <div className="text-xs font-medium text-emerald-500">{subValue}</div> : null}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
