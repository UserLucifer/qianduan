"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, ShieldAlert, ShieldCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { toErrorMessage } from "@/lib/format";
import {
  createAdminUser,
  getAdminList,
} from "@/api/admin";
import type { SysAdminQuery, SysAdminRow } from "@/api/types";
import { formatEmpty } from "@/lib/format";
import { AdminRole, CommonStatus } from "@/types/enums";

const formSchema = z.object({
  userName: z.string().min(3, "账号名至少3个字符"),
  password: z.string().min(6, "密码至少6个字符"),
  role: z.string().min(1, "请选择角色"),
});

function CreateAdminDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
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
    } catch (err) {
      alert(toErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold">
          <Plus className="mr-2 h-4 w-4" />
          新增管理员
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-stretch sm:max-w-[425px]">
        <DialogHeader className="pt-2">
          <DialogTitle className="text-xl font-semibold">新增系统管理员</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>账号名</FormLabel>
                  <FormControl>
                    <Input placeholder="输入登录账号" className="bg-background border-input" {...field} />
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
                    <Input type="password" placeholder="输入密码" className="bg-background border-input" {...field} />
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
                      <SelectTrigger className="bg-background border-input">
                        <SelectValue placeholder="选择权限角色" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={AdminRole.SUPER_ADMIN}>超级管理员</SelectItem>
                      <SelectItem value={AdminRole.ADMIN}>普通管理员</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-6">
              <Button type="submit" disabled={submitting} className="w-full bg-[#5e6ad2] font-semibold text-white hover:bg-[#7170ff]">
                {submitting ? "提交中..." : "确认创建管理员"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface AdminFilters {
  userName: string;
  role: string;
  status: string;
}

const initialFilters: AdminFilters = {
  userName: "",
  role: "",
  status: "",
};

const initialQuery: SysAdminQuery = { pageNo: 1, pageSize: 10 };

export default function AdminManagementPage() {
  const [filters, setFilters] = useState<AdminFilters>(initialFilters);

  const loader = useCallback(async (params: SysAdminQuery) => {
    const res = await getAdminList(params);
    return res.data;
  }, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: AdminFilters, pageNo = 1): SysAdminQuery => ({
    pageNo,
    pageSize: page.pageSize,
    userName: nextFilters.userName || undefined,
    role: nextFilters.role || undefined,
    status: nextFilters.status ? Number(nextFilters.status) : undefined,
  });

  const columns: DataTableColumn<SysAdminRow>[] = [
    { key: "adminId", title: "管理员 ID", render: (row) => formatEmpty(row.adminId) },
    { key: "userName", title: "登录账号", render: (row) => formatEmpty(row.userName) },
    { 
      key: "role", 
      title: "系统角色", 
      render: (row) => {
        const role = row.role;
        let icon = <Shield className="mr-2 h-3.5 w-3.5 text-blue-400" />;
        if (role === AdminRole.SUPER_ADMIN) icon = <ShieldAlert className="mr-2 h-3.5 w-3.5 text-rose-400" />;
        
        const roleLabel = role === AdminRole.SUPER_ADMIN ? "超级管理员" : "普通管理员";
        
        return (
          <div className="flex items-center text-[13px] font-medium">
            {icon}
            {roleLabel}
          </div>
        );
      } 
    },
    { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
    { key: "lastLoginAt", title: "最后登录", render: (row) => <DateTimeText value={row.lastLoginAt} /> },
    { key: "createdAt", title: "创建时间", render: (row) => <DateTimeText value={row.createdAt} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="SYSTEM AUTH"
        title="管理员设置"
        description="管理系统后台操作人员及其权限角色，确保平台运营安全性。"
        actions={<CreateAdminDialog onSuccess={reload} />}
      />

      {error ? (
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-500">
          {error}
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
          <Label htmlFor="userName">账号名</Label>
          <Input id="userName" placeholder="搜索账号" value={filters.userName} onChange={(event) => setFilters((current) => ({ ...current, userName: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>权限角色</Label>
          <Select value={filters.role} onValueChange={(val) => setFilters((current) => ({ ...current, role: val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder="全部角色" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部角色</SelectItem>
              <SelectItem value={AdminRole.SUPER_ADMIN}>超级管理员</SelectItem>
              <SelectItem value={AdminRole.ADMIN}>普通管理员</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>状态</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[120px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value={CommonStatus.ENABLED.toString()}>已启用</SelectItem>
              <SelectItem value={CommonStatus.DISABLED.toString()}>已禁用</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SearchPanel>

      <DataTable
        columns={columns}
        data={page.records}
        rowKey={(row) => row.adminId}
        loading={loading}
        emptyText="暂无匹配管理员"
        pageNo={page.pageNo}
        pageSize={page.pageSize}
        total={page.total}
        onPageChange={changePage}
      />
    </div>
  );
}
