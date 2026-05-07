"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
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
  userId: string;
  email: string;
  status: string;
  startTime: string;
  endTime: string;
}

const initialFilters: UserFilters = {
  userId: "",
  email: "",
  status: "",
  startTime: "",
  endTime: "",
};

const initialQuery: AdminUserQuery = { pageNo: 1, pageSize: 10 };

export default function CustomersPage() {
  const t = useTranslations("AdminPages.users");
  const [filters, setFilters] = useState<UserFilters>(initialFilters);
  const [detail, setDetail] = useState<AdminUserRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loader = useCallback(async (params: AdminUserQuery) => {
    const res = await getAdminUsers(params);
    return res.data;
  }, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: UserFilters, pageNo = 1): AdminUserQuery => ({
    pageNo,
    pageSize: page.pageSize,
    user_id: nextFilters.userId || undefined,
    email: nextFilters.email || undefined,
    status: nextFilters.status ? Number(nextFilters.status) : undefined,
    start_time: nextFilters.startTime || undefined,
    end_time: nextFilters.endTime || undefined,
  });

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

      <SearchPanel
        onSearch={() => updateParams(buildQuery(filters))}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="userId">{t("userID")}</Label>
          <Input id="userId" placeholder={t("enterID")} value={filters.userId} onChange={(event) => setFilters((current) => ({ ...current, userId: event.target.value }))} className="h-9 w-[100px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" placeholder={t("enterEmail")} value={filters.email} onChange={(event) => setFilters((current) => ({ ...current, email: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>{t("enabledStatus")}</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allStatuses")}</SelectItem>
              <SelectItem value={CommonStatus.ENABLED.toString()}>{t("enabled")}</SelectItem>
              <SelectItem value={CommonStatus.DISABLED.toString()}>{t("disabled2")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("registrationStart")}</Label>
          <Input type="date" value={filters.startTime} onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>{t("registrationEnd")}</Label>
          <Input type="date" value={filters.endTime} onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
      </SearchPanel>

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
