"use client";

import { useCallback, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { createAdminUser } from "@/api/admin";
import { AdminRole } from "@/types/enums";

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


const formSchema = z.object({
  username: z.string().min(3, "账号名至少3个字符"),
  password: z.string().min(6, "密码至少6个字符"),
  role: z.string().min(1, "请选择角色"),
});

function CreateAdminDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmitting(true);
      await createAdminUser(values);
      setOpen(false);
      form.reset();
      onSuccess();
    } catch (err: any) {
      alert(err.message || "创建失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5e6ad2] text-white hover:bg-[#7170ff]">
          <Plus className="mr-2 h-4 w-4" />
          新增管理员
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0f1011] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>新增系统管理员</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>账号名</FormLabel>
                  <FormControl>
                    <Input placeholder="输入登录账号" className="bg-white/5 border-white/10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>初始密码</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="输入密码" className="bg-white/5 border-white/10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>系统角色</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="选择权限角色" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={AdminRole.SUPER_ADMIN}>超级管理员 (SUPER_ADMIN)</SelectItem>
                      <SelectItem value={AdminRole.FINANCE}>财务专员 (FINANCE)</SelectItem>
                      <SelectItem value={AdminRole.MAINTAINER}>系统运维 (MAINTAINER)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={submitting} className="bg-[#5e6ad2] text-white hover:bg-[#7170ff]">
                {submitting ? "提交中..." : "确认创建"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminUsersPage() {
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

      const detailData = resDetail.status === "fulfilled" && (resDetail.value.code === 200 || resDetail.value.code === 0) ? resDetail.value.data : {};
      const walletData = resWallet.status === "fulfilled" && (resWallet.value.code === 200 || resWallet.value.code === 0) ? resWallet.value.data : null;
      const teamData = resTeam.status === "fulfilled" && (resTeam.value.code === 200 || resTeam.value.code === 0) ? resTeam.value.data : null;
      const orderData = resOrders.status === "fulfilled" && (resOrders.value.code === 200 || resOrders.value.code === 0) ? resOrders.value.data : null;

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
    { key: "userId", title: "用户 ID", render: (row) => formatEmpty(row.userId ?? row.id ?? row.id) },
    { key: "email", title: "邮箱", render: (row) => formatEmpty(row.email) },
    { key: "nickname", title: "昵称", render: (row) => formatEmpty(row.nickname) },
    { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: "注册时间", render: (row) => <DateTimeText value={typeof row.createdAt === "string" ? row.createdAt : (typeof row.createdAt === "string" ? row.createdAt : null)} /> },
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

  const detailSections: DetailSectionDef<any>[] = [
        {
          title: "基础信息",
          fields: [
            { label: "用户 ID", render: (detail) => ((detail.userId ?? detail.id ?? detail.id) || "-").toString() },
            { label: "邮箱", render: (detail) => ((detail.email) || "-").toString() },
            { label: "昵称", render: (detail) => ((detail.nickname) || "-").toString() },
            { label: "状态", render: (detail) => <StatusBadge status={detail.status} /> },
          ],
        },
        {
          title: "业务信息",
          fields: [
            { label: "钱包余额", render: (detail) => ((detail.walletData?.availableBalance ?? detail.walletData?.availableBalance ?? detail.availableBalance ?? detail.availableBalance) || "-").toString() },
            { label: "冻结金额", render: (detail) => ((detail.walletData?.frozenBalance ?? detail.walletData?.frozenBalance ?? detail.frozenBalance ?? detail.frozenBalance) || "-").toString() },
            { label: "团队人数", render: (detail) => ((detail.teamData?.totalTeamCount ?? detail.teamData?.teamCount ?? detail.teamCount) || "-").toString() },
            { label: "订单数量", render: (detail) => ((detail.orderData?.total ?? detail.orderCount ?? detail.orderCount) || "-").toString() },
          ],
        },
        {
          title: "时间信息",
          fields: [
            { label: "注册时间", render: (detail) => <DateTimeText value={typeof detail.createdAt === "string" ? detail.createdAt : (typeof detail.createdAt === "string" ? detail.createdAt : null)} /> },
            { label: "更新时间", render: (detail) => <DateTimeText value={typeof detail.updatedAt === "string" ? detail.updatedAt : (typeof detail.updatedAt === "string" ? detail.updatedAt : null)} /> },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="USER OPS"
        title="用户与管理员管理"
        description="查询用户、查看用户详情，并执行启用或禁用等高风险操作。"
        actions={<CreateAdminDialog onSuccess={reload} />}
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
        emptyText="暂无匹配用户"
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
  if (typeof row.userId === "number" && Number.isFinite(row.userId)) return row.userId;
  if (typeof row.userId === "string") {
    const parsed = Number(row.userId);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}
