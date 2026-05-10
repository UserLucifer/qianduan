"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, Lock, Search, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import {
  disableAdminUser,
  enableAdminUser,
  getAdminUserDetail,
  getAdminUsers,
  getAdminWalletByUser,
  getAdminUserTeam,
  getAdminRentalOrders,
} from "@/api/admin";
import type { AdminUserQuery, AdminUserRow } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { CommonStatus } from "@/types/enums";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface UserFilters {
  keyword: string;
  status: string;
  dateRange: string;
  specificDate: string;
}

const initialFilters: UserFilters = {
  keyword: "",
  status: "ALL",
  dateRange: "ALL",
  specificDate: "",
};

const initialQuery: AdminUserQuery = { pageNo: 1, pageSize: 10 };

const getStatusQueryValue = (status: string) => {
  if (status === "ALL") return undefined;

  const value = Number(status);
  return Number.isFinite(value) ? value : undefined;
};

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getStartTimeByDateRange = (dateRange: string) => {
  if (dateRange === "ALL") return undefined;

  const days = Number(dateRange);
  if (!Number.isFinite(days)) return undefined;

  const d = new Date();
  d.setDate(d.getDate() - days);
  return `${formatLocalDate(d)} 00:00:00`;
};

const getStartTimeBySpecificDate = (date: string) => {
  if (!date) return undefined;
  return `${date} 00:00:00`;
};

const getEndTimeBySpecificDate = (date: string) => {
  if (!date) return undefined;
  return `${date} 23:59:59`;
};

export default function CustomersPage() {
  const t = useTranslations("AdminPages.users");
  const [filters, setFilters] = useState<UserFilters>(initialFilters);
  const [detail, setDetail] = useState<AdminUserRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const queryTimer = useRef<number | null>(null);

  const loader = useCallback(async (params: AdminUserQuery) => {
    const res = await getAdminUsers(params);
    return res.data;
  }, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const buildQuery = useCallback((nextFilters: UserFilters, pageNo = 1): AdminUserQuery => ({
    pageNo,
    pageSize: page.pageSize,
    keyword: nextFilters.keyword.trim() || undefined,
    status: getStatusQueryValue(nextFilters.status),
    start_time: getStartTimeBySpecificDate(nextFilters.specificDate) ?? getStartTimeByDateRange(nextFilters.dateRange),
    end_time: getEndTimeBySpecificDate(nextFilters.specificDate),
  }), [page.pageSize]);

  const applyFilters = useCallback((nextFilters: UserFilters, delay = 0) => {
    if (queryTimer.current) {
      window.clearTimeout(queryTimer.current);
      queryTimer.current = null;
    }

    if (delay <= 0) {
      updateParams(buildQuery(nextFilters));
      return;
    }

    queryTimer.current = window.setTimeout(() => {
      updateParams(buildQuery(nextFilters));
      queryTimer.current = null;
    }, delay);
  }, [buildQuery, updateParams]);

  useEffect(() => {
    return () => {
      if (queryTimer.current) {
        window.clearTimeout(queryTimer.current);
      }
    };
  }, []);

  const showDetail = async (row: AdminUserRow) => {
    const id = resolveUserId(row);
    if (id === null) {
      setActionError(t("thisRowIsMissingAUserIDSoDetailsCannotBeOpened"));
      return;
    }
    setDetailOpen(true);
    setDetailLoading(true);
    setActionError(null);
    try {
      const [resDetail, resWallet, resTeam, resOrders] = await Promise.allSettled([
        getAdminUserDetail(id),
        getAdminWalletByUser(id),
        getAdminUserTeam(id),
        getAdminRentalOrders({ user_id: id, pageNo: 1, pageSize: 1 })
      ]);

      const detailData = resDetail.status === "fulfilled" && (resDetail.value.code === 200 || resDetail.value.code === 0) ? resDetail.value.data : row;
      const walletData = resWallet.status === "fulfilled" && (resWallet.value.code === 200 || resWallet.value.code === 0) ? resWallet.value.data : undefined;
      const teamData = resTeam.status === "fulfilled" && (resTeam.value.code === 200 || resTeam.value.code === 0) ? resTeam.value.data : undefined;
      const orderData = resOrders.status === "fulfilled" && (resOrders.value.code === 200 || resOrders.value.code === 0) ? resOrders.value.data : undefined;

      setDetail({
        ...detailData,
        walletData,
        teamData,
        orderData,
      });
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setDetailLoading(false);
    }
  };

  const toggleUser = async (row: AdminUserRow, enabled: boolean) => {
    const id = resolveUserId(row);
    if (id === null) {
      setActionError(t("thisRowIsMissingAUserIDSoTheActionCannotBePerformed"));
      return;
    }
    setActionError(null);
    try {
      if (enabled) {
        await enableAdminUser(id);
      } else {
        await disableAdminUser(id);
      }
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<AdminUserRow>[] = [
    { key: "userId", title: t("userID"), render: (row) => formatEmpty(row.userId) },
    { key: "email", title: t("email"), render: (row) => formatEmpty(row.email) },
    { key: "userName", title: t("username"), render: (row) => formatEmpty(row.userName) },
    { key: "status", title: t("status"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: t("registeredAt"), render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="font-medium" onClick={() => void showDetail(row)}>
            <Eye className="h-4 w-4" />
            {t("details")}</Button>
          {row.status === 0 ? (
            <ConfirmActionButton
              title={t("enableUser")}
              description={t("afterEnablingThisUserCanContinueSigningInAndUsingThePlatform")}
              onConfirm={() => toggleUser(row, true)}
            >
              <Unlock className="h-4 w-4" />
              {t("enable")}</ConfirmActionButton>
          ) : (
            <ConfirmActionButton
              title={t("disableUser")}
              description={t("afterDisablingThisUserCanNoLongerUsePlatformCapabilities")}
              onConfirm={() => toggleUser(row, false)}
            >
              <Lock className="h-4 w-4" />
              {t("disabled")}</ConfirmActionButton>
          )}
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<AdminUserRow>[] = [
    {
      title: t("basicInformation"),
      fields: [
        { label: t("userID"), render: (detail) => formatEmpty(detail.userId) },
        { label: t("email"), render: (detail) => formatEmpty(detail.email) },
        { label: t("username"), render: (detail) => formatEmpty(detail.userName) },
        { label: t("status"), render: (detail) => <StatusBadge status={detail.status} /> },
      ],
    },
    {
      title: t("businessInformation"),
      fields: [
        { label: t("walletBalance"), render: (detail) => formatEmpty(detail.walletData?.availableBalance ?? detail.availableBalance) },
        { label: t("frozenAmount"), render: (detail) => formatEmpty(detail.walletData?.frozenBalance ?? detail.frozenBalance) },
        { label: t("teamSize"), render: (detail) => formatEmpty(detail.teamData?.totalTeamCount ?? detail.teamCount) },
        { label: t("orderCount"), render: (detail) => formatEmpty(detail.orderData?.total ?? detail.orderCount) },
      ],
    },
    {
      title: t("timeInformation"),
      fields: [
        { label: t("registeredAt"), render: (detail) => <DateTimeText value={detail.createdAt} /> },
        { label: t("updatedAt"), render: (detail) => <DateTimeText value={detail.updatedAt} /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="USER MANAGEMENT"
        title={t("customerList")}
        description={t("manageRegisteredCustomerAccountsViewDetailsAndControlAccountStatus")}
      />

      <ErrorAlert message={actionError ?? error} />

      <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full sm:w-[240px]">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="userKeyword"
            placeholder={t("searchEmailOrUsername")}
            value={filters.keyword}
            onChange={(event) => {
              const nextFilters = { ...filters, keyword: event.target.value };
              setFilters(nextFilters);
              applyFilters(nextFilters, 300);
            }}
            className="h-10 pl-9 border-border bg-card text-xs font-medium focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.status}
            onValueChange={(val) => {
              const nextFilters = { ...filters, status: val };
              setFilters(nextFilters);
              applyFilters(nextFilters);
            }}
          >
            <SelectTrigger className="h-10 w-[120px] bg-card border-border text-xs font-medium">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("allStatuses")}</SelectItem>
              <SelectItem value={CommonStatus.ENABLED.toString()}>{t("enabled")}</SelectItem>
              <SelectItem value={CommonStatus.DISABLED.toString()}>{t("disabled2")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.dateRange}
            onValueChange={(val) => {
              const nextFilters = { ...filters, dateRange: val, specificDate: "" };
              setFilters(nextFilters);
              applyFilters(nextFilters);
            }}
          >
            <SelectTrigger className="h-10 w-[120px] bg-card border-border text-xs font-medium">
              <SelectValue placeholder={t("allTime")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("allTime")}</SelectItem>
              <SelectItem value="3">{t("last3Days")}</SelectItem>
              <SelectItem value="7">{t("last7Days")}</SelectItem>
              <SelectItem value="30">{t("last30Days")}</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={filters.specificDate}
            onChange={(event) => {
              const nextFilters = { ...filters, specificDate: event.target.value, dateRange: "ALL" };
              setFilters(nextFilters);
              applyFilters(nextFilters);
            }}
            className="h-10 w-full border-border bg-card text-xs font-medium focus-visible:ring-1 focus-visible:ring-primary sm:w-[150px]"
            aria-label={t("registeredAt")}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={page.records}
        rowKey={(row) => `${formatEmpty(row.id)}-${formatEmpty(row.userId)}`}
        loading={loading}
        emptyText={t("noSYet")}
        pageNo={page.pageNo}
        pageSize={page.pageSize}
        total={page.total}
        onPageChange={changePage}
      />

      <DetailDrawer data={detail}
        open={detailOpen}
        title={t("userDetails")}
        subtitle={(data) => detailLoading ? t("loading") : ((data.email) || "-").toString()}
        sections={detailSections}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}

function resolveUserId(row: AdminUserRow): number | null {
  if (typeof row.id === "number" && Number.isFinite(row.id)) return row.id;
  return null;
}
