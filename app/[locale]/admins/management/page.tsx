"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, ShieldAlert, Shield } from "lucide-react";
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
import { ErrorAlert } from "@/components/shared/ErrorAlert";

type CreateAdminFormValues = {
  userName: string;
  password: string;
  role: string;
};

function createFormSchema(t: (key: "accountNameMin" | "passwordMin" | "roleRequired") => string) {
  return z.object({
    userName: z.string().min(3, t("accountNameMin")),
    password: z.string().min(6, t("passwordMin")),
    role: z.string().min(1, t("roleRequired")),
  });
}

function CreateAdminDialog({ onSuccess }: { onSuccess: () => void }) {
  const t = useTranslations("AdminPages.management");
  const formSchema = createFormSchema(t);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<CreateAdminFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      password: "",
      role: "",
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setError(null);
  };

  const onSubmit = async (values: CreateAdminFormValues) => {
    try {
      setSubmitting(true);
      setError(null);
      await createAdminUser(values);
      setOpen(false);
      form.reset();
      onSuccess();
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="font-semibold">
          <Plus className="mr-2 h-4 w-4" />
          {t("new")}</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-stretch sm:max-w-[425px]">
        <DialogHeader className="pt-2">
          <DialogTitle className="text-xl font-semibold">{t("newSystemAdmin")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <ErrorAlert message={error} />
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("accountName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterLoginAccount")} className="bg-background border-input" {...field} />
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
                  <FormLabel>{t("initialPassword")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t("enterPassword")} className="bg-background border-input" {...field} />
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
                  <FormLabel>{t("systemRole")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background border-input">
                        <SelectValue placeholder={t("selectPermissionRole")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={AdminRole.SUPER_ADMIN}>{t("superAdmin")}</SelectItem>
                      <SelectItem value={AdminRole.ADMIN}>{t("admin")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-6">
              <Button type="submit" disabled={submitting} className="w-full bg-[#5e6ad2] font-semibold text-white hover:bg-[#7170ff]">
                {submitting ? t("submitting") : t("createAdmin")}
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
  const t = useTranslations("AdminPages.management");
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
    { key: "adminId", title: t("adminID"), render: (row) => formatEmpty(row.adminId) },
    { key: "userName", title: t("loginAccount"), render: (row) => formatEmpty(row.userName) },
    {
      key: "role",
      title: t("systemRole"),
      render: (row) => {
        const role = row.role;
        let icon = <Shield className="mr-2 h-3.5 w-3.5 text-blue-400" />;
        if (role === AdminRole.SUPER_ADMIN) icon = <ShieldAlert className="mr-2 h-3.5 w-3.5 text-rose-400" />;
        
        const roleLabel = role === AdminRole.SUPER_ADMIN ? t("superAdmin") : t("admin");
        
        return (
          <div className="flex items-center text-[13px] font-medium">
            {icon}
            {roleLabel}
          </div>
        );
      } 
    },
    { key: "status", title: t("status"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "lastLoginAt", title: t("lastLogin"), render: (row) => <DateTimeText value={row.lastLoginAt} /> },
    { key: "createdAt", title: t("createdAt"), render: (row) => <DateTimeText value={row.createdAt} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="SYSTEM AUTH"
        title={t("adminSettings")}
        description={t("manageBackendOperatorsAndPermissionRolesToKeepPlatformOperationsSecure")}
        actions={<CreateAdminDialog onSuccess={reload} />}
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
          <Label htmlFor="userName">{t("accountName")}</Label>
          <Input id="userName" placeholder={t("searchAccount")} value={filters.userName} onChange={(event) => setFilters((current) => ({ ...current, userName: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>{t("permissionRole")}</Label>
          <Select value={filters.role} onValueChange={(val) => setFilters((current) => ({ ...current, role: val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder={t("allRoles")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allRoles")}</SelectItem>
              <SelectItem value={AdminRole.SUPER_ADMIN}>{t("superAdmin")}</SelectItem>
              <SelectItem value={AdminRole.ADMIN}>{t("admin")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("status")}</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[120px] bg-background text-foreground">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allStatuses")}</SelectItem>
              <SelectItem value={CommonStatus.ENABLED.toString()}>{t("enabled")}</SelectItem>
              <SelectItem value={CommonStatus.DISABLED.toString()}>{t("disabled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SearchPanel>

      <DataTable
        columns={columns}
        data={page.records}
        rowKey={(row) => row.adminId}
        loading={loading}
        emptyText={t("noSYet")}
        pageNo={page.pageNo}
        pageSize={page.pageSize}
        total={page.total}
        onPageChange={changePage}
      />
    </div>
  );
}
