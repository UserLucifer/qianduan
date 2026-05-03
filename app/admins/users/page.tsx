"use client";

import { useCallback, useState } from "react";
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
      setActionError("当前行缺少用户 ID，无法查看详情。");
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
      setActionError("当前行缺少用户 ID，无法执行操作。");
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
    { key: "userId", title: "用户 ID", render: (row) => formatEmpty(row.userId) },
    { key: "email", title: "邮箱", render: (row) => formatEmpty(row.email) },
    { key: "userName", title: "用户名", render: (row) => formatEmpty(row.userName) },
    { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: "注册时间", render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="font-medium text-[var(--admin-text)] hover:bg-[var(--admin-hover)]" onClick={() => void showDetail(row)}>
            <Eye className="h-4 w-4" />
            详情
          </Button>
          {row.status === 0 ? (
            <ConfirmActionButton
              title="启用用户"
              description="启用后该用户可继续登录和操作平台。"
              onConfirm={() => toggleUser(row, true)}
            >
              <Unlock className="h-4 w-4" />
              启用
            </ConfirmActionButton>
          ) : (
            <ConfirmActionButton
              title="禁用用户"
              description="禁用后该用户将无法继续使用平台能力。"
              onConfirm={() => toggleUser(row, false)}
            >
              <Lock className="h-4 w-4" />
              禁用
            </ConfirmActionButton>
          )}
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<AdminUserRow>[] = [
    {
      title: "基础信息",
      fields: [
        { label: "用户 ID", render: (detail) => formatEmpty(detail.userId) },
        { label: "邮箱", render: (detail) => formatEmpty(detail.email) },
        { label: "用户名", render: (detail) => formatEmpty(detail.userName) },
        { label: "状态", render: (detail) => <StatusBadge status={detail.status} /> },
      ],
    },
    {
      title: "业务信息",
      fields: [
        { label: "钱包余额", render: (detail) => formatEmpty(detail.walletData?.availableBalance ?? detail.availableBalance) },
        { label: "冻结金额", render: (detail) => formatEmpty(detail.walletData?.frozenBalance ?? detail.frozenBalance) },
        { label: "团队人数", render: (detail) => formatEmpty(detail.teamData?.totalTeamCount ?? detail.teamCount) },
        { label: "订单数量", render: (detail) => formatEmpty(detail.orderData?.total ?? detail.orderCount) },
      ],
    },
    {
      title: "时间信息",
      fields: [
        { label: "注册时间", render: (detail) => <DateTimeText value={detail.createdAt} /> },
        { label: "更新时间", render: (detail) => <DateTimeText value={detail.updatedAt} /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="USER MANAGEMENT"
        title="客户列表"
        description="管理平台 C 端注册用户，查询详情并执行状态控制。"
      />

      {(error || actionError) ? (
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-500">
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
          <Label htmlFor="email">邮箱</Label>
          <Input id="email" placeholder="输入邮箱" value={filters.email} onChange={(event) => setFilters((current) => ({ ...current, email: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>启用状态</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value={CommonStatus.ENABLED.toString()}>已启用</SelectItem>
              <SelectItem value={CommonStatus.DISABLED.toString()}>已禁用</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>注册开始</Label>
          <Input type="date" value={filters.startTime} onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>注册结束</Label>
          <Input type="date" value={filters.endTime} onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
      </SearchPanel>

      <DataTable
        columns={columns}
        data={page.records}
        rowKey={(row) => `${formatEmpty(row.id)}-${formatEmpty(row.userId)}`}
        loading={loading}
        emptyText="暂无匹配客户"
        pageNo={page.pageNo}
        pageSize={page.pageSize}
        total={page.total}
        onPageChange={changePage}
      />

      <DetailDrawer data={detail}
        open={detailOpen}
        title="用户详情"
        subtitle={(data) => detailLoading ? "加载中" : ((data.email) || "-").toString()}
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
