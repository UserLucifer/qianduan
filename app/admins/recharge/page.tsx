"use client";

import { useCallback, useState } from "react";
import { Check, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSection } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MoneyText } from "@/components/shared/MoneyText";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { CopyableSecret } from "@/components/shared/CopyableSecret";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { approveRecharge, getAdminRechargeOrderDetail, getAdminRechargeOrders, rejectRecharge } from "@/api/admin";
import type { RechargeOrderQueryRequest, RechargeOrderResponse } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";

interface RechargeFilters {
  status: string;
  startTime: string;
  endTime: string;
}

const initialFilters: RechargeFilters = { status: "", startTime: "", endTime: "" };
const initialQuery: RechargeOrderQueryRequest = { pageNo: 1, pageSize: 10 };

export default function AdminRechargePage() {
  const [filters, setFilters] = useState<RechargeFilters>(initialFilters);
  const [detail, setDetail] = useState<RechargeOrderResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loader = useCallback(async (params: RechargeOrderQueryRequest) => (await getAdminRechargeOrders(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: RechargeFilters): RechargeOrderQueryRequest => ({
    pageNo: 1,
    pageSize: page.pageSize,
    status: nextFilters.status || undefined,
    startTime: nextFilters.startTime || undefined,
    endTime: nextFilters.endTime || undefined,
  });

  const openDetail = async (rechargeNo: string) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminRechargeOrderDetail(rechargeNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const approve = async (row: RechargeOrderResponse) => {
    const value = window.prompt("请输入实际到账金额", String(row.actualAmount || row.applyAmount));
    if (value === null) return;
    const actualAmount = Number(value);
    if (!Number.isFinite(actualAmount) || actualAmount <= 0) {
      setActionError("实际到账金额必须是大于 0 的数字。");
      return;
    }
    const reviewRemark = window.prompt("审核备注（可选）") ?? undefined;
    try {
      await approveRecharge(row.rechargeNo, { actualAmount, reviewRemark });
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const reject = async (row: RechargeOrderResponse) => {
    const reviewRemark = window.prompt("请输入拒绝原因");
    if (!reviewRemark || !reviewRemark.trim()) {
      setActionError("拒绝充值必须填写原因。");
      return;
    }
    try {
      await rejectRecharge(row.rechargeNo, { reviewRemark });
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<RechargeOrderResponse>[] = [
    { key: "rechargeNo", title: "充值订单号", render: (row) => <CopyableSecret value={row.rechargeNo} maskedValue={row.rechargeNo} canReveal={false} /> },
    { key: "channelName", title: "支付方式", render: (row) => `${formatEmpty(row.channelName)} / ${formatEmpty(row.network)}` },
    { key: "applyAmount", title: "申请金额", render: (row) => <MoneyText value={row.applyAmount} currency={row.currency} /> },
    { key: "actualAmount", title: "到账金额", render: (row) => <MoneyText value={row.actualAmount} currency={row.currency} /> },
    { key: "status", title: "审核状态", render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: "创建时间", render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="font-medium text-[var(--admin-text)] hover:bg-[var(--admin-hover)]" onClick={() => void openDetail(row.rechargeNo)}>
            <Eye className="h-4 w-4" />
            详情
          </Button>
          {row.status === "SUBMITTED" || row.status === "PENDING_REVIEW" ? (
            <>
              <ConfirmActionButton title="通过充值审核" description="通过后将按实际到账金额为用户钱包入账。" onConfirm={() => approve(row)}>
                <Check className="h-4 w-4" />
                通过
              </ConfirmActionButton>
              <ConfirmActionButton title="拒绝充值审核" description="拒绝必须填写原因，用户可在充值记录中查看。" onConfirm={() => reject(row)}>
                <X className="h-4 w-4" />
                拒绝
              </ConfirmActionButton>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  const detailSections: DetailSection[] = detail
    ? [
        {
          title: "订单信息",
          fields: [
            { label: "充值订单号", value: <CopyableSecret value={detail.rechargeNo} maskedValue={detail.rechargeNo} canReveal={false} /> },
            { label: "状态", value: <StatusBadge status={detail.status} /> },
            { label: "申请金额", value: <MoneyText value={detail.applyAmount} currency={detail.currency} /> },
            { label: "实际到账", value: <MoneyText value={detail.actualAmount} currency={detail.currency} /> },
          ],
        },
        {
          title: "收款信息",
          fields: [
            { label: "支付方式", value: detail.channelName },
            { label: "网络", value: detail.network },
            { label: "收款账户", value: <CopyableSecret value={detail.accountNo} /> },
            { label: "外部交易号", value: <CopyableSecret value={detail.externalTxNo} /> },
          ],
        },
        {
          title: "审核信息",
          fields: [
            { label: "审核人", value: formatEmpty(detail.reviewedBy) },
            { label: "审核时间", value: <DateTimeText value={detail.reviewedAt} /> },
            { label: "审核备注", value: formatEmpty(detail.reviewRemark) },
            { label: "钱包流水", value: <CopyableSecret value={detail.walletTxNo} maskedValue={detail.walletTxNo ?? "-"} canReveal={false} /> },
          ],
        },
        {
          title: "时间信息",
          fields: [
            { label: "创建时间", value: <DateTimeText value={detail.createdAt} /> },
            { label: "到账时间", value: <DateTimeText value={detail.creditedAt} /> },
          ],
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="FINANCE REVIEW" title="充值审核" description="审核用户充值订单，待审核订单支持通过或拒绝。" />
      {(error || actionError) ? (
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-500 font-medium">
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
          <Label>充值状态</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value="SUBMITTED">待审核</SelectItem>
              <SelectItem value="APPROVED">已通过</SelectItem>
              <SelectItem value="REJECTED">已拒绝</SelectItem>
              <SelectItem value="CANCELLED">已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>开始日期</Label>
          <Input type="date" value={filters.startTime} onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>结束日期</Label>
          <Input type="date" value={filters.endTime} onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
      </SearchPanel>
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.rechargeNo} loading={loading} emptyText="暂无充值订单" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer open={detailOpen} title="充值订单详情" subtitle={detail?.rechargeNo} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
