"use client";

import { useCallback, useState } from "react";
import { Power, PowerOff, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteAdminRechargeChannel, getAdminRechargeChannels, updateAdminRechargeChannel } from "@/api/admin";
import type { AdminRechargeChannelQuery, AdminRechargeChannelResponse, UpdateRechargeChannelRequest } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { RechargeChannelForm } from "@/components/admin/RechargeForms";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface Filters {
  status: string;
}

const initialFilters: Filters = { status: "" };
const initialQuery: AdminRechargeChannelQuery = { pageNo: 1, pageSize: 10 };

export default function RechargeChannelsPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<AdminRechargeChannelResponse | null>(null);

  const loader = useCallback(async (params: AdminRechargeChannelQuery) => (await getAdminRechargeChannels(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: Filters): AdminRechargeChannelQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    status: nextFilters.status ? Number(nextFilters.status) : undefined,
  });

  const openEdit = (row: AdminRechargeChannelResponse) => {
    setEditingRow(row);
    setFormOpen(true);
  };

  const toggleStatus = async (row: AdminRechargeChannelResponse, enabled: boolean) => {
    setActionError(null);
    try {
      const data: UpdateRechargeChannelRequest = {
        channelCode: row.channelCode,
        channelName: row.channelName,
        network: row.network,
        displayUrl: row.displayUrl,
        accountName: row.accountName,
        accountNo: row.accountNo,
        minAmount: row.minAmount,
        maxAmount: row.maxAmount,
        feeRate: row.feeRate,
        sortNo: row.sortNo,
        status: enabled ? 1 : 0,
      };
      await updateAdminRechargeChannel(row.channelId, data);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const handleDelete = async (row: AdminRechargeChannelResponse) => {
    setActionError(null);
    try {
      await deleteAdminRechargeChannel(row.channelId);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<AdminRechargeChannelResponse>[] = [
    { key: "channelCode", title: "渠道编码", render: (row) => formatEmpty(row.channelCode) },
    { key: "channelName", title: "渠道名称", render: (row) => formatEmpty(row.channelName) },
    { key: "network", title: "网络", render: (row) => formatEmpty(row.network) },
    { key: "accountNo", title: "收款账号/地址", render: (row) => <div className="max-w-[200px] truncate font-mono text-xs">{formatEmpty(row.accountNo)}</div> },
    { key: "feeRate", title: "手续费率", render: (row) => `${(row.feeRate * 100).toFixed(2)}%` },
    { key: "sortNo", title: "排序", render: (row) => row.sortNo },
    { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
    { key: "updatedAt", title: "更新时间", render: (row) => <DateTimeText value={row.updatedAt} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="font-medium text-blue-500 hover:bg-blue-500/10" onClick={() => openEdit(row)}>
            <Edit2 className="h-3.5 w-3.5 mr-1" />
            编辑
          </Button>
          {row.status === 0 ? (
            <ConfirmActionButton title="启用渠道" description="启用后用户可在充值页面看到该渠道。" onConfirm={() => toggleStatus(row, true)}>
              <Power className="h-3.5 w-3.5 mr-1" />
              启用
            </ConfirmActionButton>
          ) : (
            <ConfirmActionButton title="禁用渠道" description="禁用后用户将无法通过该渠道充值。" onConfirm={() => toggleStatus(row, false)}>
              <PowerOff className="h-3.5 w-3.5 mr-1" />
              禁用
            </ConfirmActionButton>
          )}
          <ConfirmActionButton title="删除渠道" description="确定要删除该充值渠道吗？此操作不可撤销。" variant="destructive" onConfirm={() => handleDelete(row)}>
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            删除
          </ConfirmActionButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="FINANCE OPS"
        title="充值渠道管理"
        description="维护系统支持的支付渠道及收币账户信息。"
        actions={
          <Button onClick={() => { setEditingRow(null); setFormOpen(true); }} className="bg-[#5e6ad2] font-semibold text-white hover:bg-[#7170ff]">
            <Plus className="mr-2 h-4 w-4" />
            新增渠道
          </Button>
        }
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
          <Label>状态</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value="1">已启用</SelectItem>
              <SelectItem value="0">已禁用</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SearchPanel>

      <DataTable 
        columns={columns} 
        data={page.records} 
        rowKey={(row) => row.channelId} 
        loading={loading} 
        emptyText="暂无充值渠道" 
        pageNo={page.pageNo} 
        pageSize={page.pageSize} 
        total={page.total} 
        onPageChange={changePage} 
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="flex max-w-2xl flex-col items-stretch">
          <DialogTitle className="text-xl font-semibold mb-2">
            {editingRow ? "编辑充值渠道" : "新增充值渠道"}
          </DialogTitle>
          <RechargeChannelForm
            initialData={editingRow}
            onSuccess={() => { setFormOpen(false); reload(); }}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
