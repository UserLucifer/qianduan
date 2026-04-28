"use client";

import { useCallback, useState } from "react";
import { CheckCheck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getNotificationDetail, getUserNotifications, markAllAsRead, markAsRead } from "@/api/notification";
import type { NotificationQueryRequest, PageResult, SysNotification } from "@/api/types";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { notificationTypeLabel } from "@/lib/status";
import { toErrorMessage } from "@/lib/format";

const initialParams: NotificationQueryRequest = { pageNo: 1, pageSize: 10 };

export default function NotificationsPage() {
  const loader = useCallback(async (params: NotificationQueryRequest): Promise<PageResult<SysNotification>> => {
    const res = await getUserNotifications(params);
    return res.data;
  }, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialParams);
  const [filters, setFilters] = useState<NotificationQueryRequest>(initialParams);
  const [detail, setDetail] = useState<SysNotification | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const openDetail = async (id: number) => {
    setActionError(null);
    try {
      const res = await getNotificationDetail(id);
      setDetail(res.data);
      if (res.data.readStatus === 0) {
        await markAsRead(id);
        await reload();
      }
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const readAll = async () => {
    setActionError(null);
    try {
      await markAllAsRead();
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<SysNotification>[] = [
    { key: "title", title: "标题", render: (row) => <span className="font-medium text-foreground">{row.title}</span> },
    { key: "type", title: "通知类型", render: (row) => notificationTypeLabel(row.type) },
    { key: "bizType", title: "业务类型", render: (row) => row.bizType || "-" },
    { key: "readStatus", title: "已读状态", render: (row) => <StatusBadge status={row.readStatus === 1 ? "SETTLED" : "PENDING"} label={row.readStatus === 1 ? "已读" : "未读"} /> },
    { key: "createdAt", title: "时间", render: (row) => <DateTimeText value={row.createdAt} /> },
    { key: "actions", title: "操作", className: "text-right", render: (row) => <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-foreground/5" onClick={() => void openDetail(row.id)}><Eye className="h-3.5 w-3.5" />详情</Button> },
  ];

  const sections: DetailSectionDef<any>[] = [
    {
      title: "通知内容",
      fields: [
        { label: "标题", render: (detail) => detail.title },
        { label: "类型", render: (detail) => notificationTypeLabel(detail.type) },
        { label: "业务类型", render: (detail) => detail.bizType || "-" },
        { label: "业务 ID", render: (detail) => detail.bizId ?? "-" },
        { label: "内容", render: (detail) => <p className="whitespace-pre-wrap leading-6">{detail.content}</p> },
        { label: "时间", render: (detail) => <DateTimeText value={detail.createdAt} /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="消息通知"
        title="系统通知"
        description="查看系统、订单、财务、收益相关通知，支持标记已读。"
        actions={<Button onClick={() => void readAll()} className="bg-[#5e6ad2] text-white hover:bg-[#7170ff]"><CheckCheck className="h-4 w-4" />全部已读</Button>}
      />
      <SearchPanel
        onSearch={() => updateParams({ ...filters, pageNo: 1 })}
        onReset={() => {
          setFilters(initialParams);
          updateParams(initialParams);
        }}
      >
        <div className="space-y-2">
          <Label>已读状态</Label>
          <Select value={filters.read_status?.toString()} onValueChange={(val) => setFilters((current) => ({ ...current, read_status: val === " " ? undefined : Number(val) }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value="1">已读</SelectItem>
              <SelectItem value="0">未读</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>通知类型</Label>
          <Select value={filters.notification_type} onValueChange={(val) => setFilters((current) => ({ ...current, notification_type: val === " " ? undefined : val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder="全部类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部类型</SelectItem>
              <SelectItem value="SYSTEM">系统通知</SelectItem>
              <SelectItem value="ORDER">订单通知</SelectItem>
              <SelectItem value="WALLET">资金通知</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SearchPanel>
      {error || actionError ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-500">{error ?? actionError}</div> : null}
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.id} loading={loading} emptyText="暂无通知。" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={Boolean(detail)} title="通知详情" subtitle={(data) => data.title} sections={sections} onClose={() => setDetail(null)} />
    </div>
  );
}
