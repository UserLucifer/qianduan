"use client";

import { HasPermission } from "@/components/shared/HasPermission";
import { AdminRole } from "@/types/enums";

import { useCallback, useState } from "react";
import { Check, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MoneyText } from "@/components/shared/MoneyText";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
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

  // Approval Dialog States
  const [actionRow, setActionRow] = useState<RechargeOrderResponse | null>(null);
  const [dialogType, setDialogType] = useState<"approve" | "reject" | null>(null);
  const [actualAmountInput, setActualAmountInput] = useState<string>("");
  const [reviewRemark, setReviewRemark] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const openApprove = (row: RechargeOrderResponse) => {
    setActionRow(row);
    setDialogType("approve");
    setActualAmountInput(String(row.actualAmount || row.applyAmount));
    setReviewRemark("");
    setActionError(null);
  };

  const openReject = (row: RechargeOrderResponse) => {
    setActionRow(row);
    setDialogType("reject");
    setReviewRemark("");
    setActionError(null);
  };

  const handleApprove = async () => {
    if (!actionRow) return;
    const actualAmount = Number(actualAmountInput);
    if (!Number.isFinite(actualAmount) || actualAmount <= 0) {
      setActionError("实际到账金额必须是大于 0 的数字。");
      return;
    }
    try {
      setIsSubmitting(true);
      await approveRecharge(actionRow.rechargeNo, { actualAmount, reviewRemark });
      setDialogType(null);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!actionRow) return;
    if (!reviewRemark || !reviewRemark.trim()) {
      setActionError("拒绝充值必须填写原因。");
      return;
    }
    try {
      setIsSubmitting(true);
      await rejectRecharge(actionRow.rechargeNo, { reviewRemark });
      setDialogType(null);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: DataTableColumn<RechargeOrderResponse>[] = [
    { key: "rechargeNo", title: "充值订单号", render: (row) => <CopyableSecret value={row.rechargeNo} maskedValue={row.rechargeNo} canReveal={false} /> },
    { key: "userName", title: "用户名称", render: (row) => formatEmpty(row.userName) },
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
          <Button variant="ghost" size="sm" className="font-medium" onClick={() => void openDetail(row.rechargeNo)}>
            <Eye className="h-4 w-4" />
            详情
          </Button>
          {row.status === "SUBMITTED" || row.status === "PENDING_REVIEW" ? (
            <>
              <HasPermission role={[AdminRole.SUPER_ADMIN, AdminRole.ADMIN]}>
                <Button variant="ghost" size="sm" className="font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10" onClick={() => openApprove(row)}>
                  <Check className="h-4 w-4 mr-1" />
                  通过
                </Button>
                <Button variant="ghost" size="sm" className="font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10" onClick={() => openReject(row)}>
                  <X className="h-4 w-4 mr-1" />
                  拒绝
                </Button>
              </HasPermission>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<RechargeOrderResponse>[] = [
        {
          title: "订单信息",
          fields: [
            { label: "充值订单号", render: (detail) => <CopyableSecret value={detail.rechargeNo} maskedValue={detail.rechargeNo} canReveal={false} /> },
            { label: "用户名称", render: (detail) => detail.userName },
            { label: "状态", render: (detail) => <StatusBadge status={detail.status} /> },
            { label: "申请金额", render: (detail) => <MoneyText value={detail.applyAmount} currency={detail.currency} /> },
            { label: "实际到账", render: (detail) => <MoneyText value={detail.actualAmount} currency={detail.currency} /> },
          ],
        },
        {
          title: "收款信息",
          fields: [
            { label: "支付方式", render: (detail) => detail.channelName },
            { label: "网络", render: (detail) => detail.network },
            { label: "收款账户", render: (detail) => <CopyableSecret value={detail.accountNo} /> },
            { label: "外部交易号", render: (detail) => <CopyableSecret value={detail.externalTxNo} /> },
          ],
        },
        {
          title: "审核信息",
          fields: [
            { label: "审核人", render: (detail) => formatEmpty(detail.reviewedBy) },
            { label: "审核时间", render: (detail) => <DateTimeText value={detail.reviewedAt} /> },
            { label: "审核备注", render: (detail) => formatEmpty(detail.reviewRemark) },
            { label: "钱包流水", render: (detail) => <CopyableSecret value={detail.walletTxNo} maskedValue={detail.walletTxNo ?? "-"} canReveal={false} /> },
          ],
        },
        {
          title: "时间信息",
          fields: [
            { label: "创建时间", render: (detail) => <DateTimeText value={detail.createdAt} /> },
            { label: "到账时间", render: (detail) => <DateTimeText value={detail.creditedAt} /> },
          ],
        },
      ];

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
      <DetailDrawer data={detail} open={detailOpen} title="充值订单详情" subtitle={(data) => data.rechargeNo} sections={detailSections} onClose={() => setDetailOpen(false)} />

      {/* Approve Dialog */}
      <Dialog open={dialogType === "approve"} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>通过充值审核</DialogTitle>
            <DialogDescription>
              请确认实际到账金额，确认后将直接入账至用户钱包。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">订单号</Label>
              <span className="col-span-3 text-sm font-mono text-muted-foreground">{actionRow?.rechargeNo}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">申请金额</Label>
              <span className="col-span-3 text-sm font-semibold">{actionRow?.applyAmount} {actionRow?.currency}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="actualAmount" className="text-right">实际到账</Label>
              <Input
                id="actualAmount"
                type="number"
                value={actualAmountInput}
                onChange={(e) => setActualAmountInput(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="approveRemark" className="text-right">审核备注</Label>
              <Input
                id="approveRemark"
                placeholder="可选填写备注"
                value={reviewRemark}
                onChange={(e) => setReviewRemark(e.target.value)}
                className="col-span-3"
              />
            </div>
            {actionError && (
              <div className="text-sm text-rose-500 col-span-4 mt-2">
                {actionError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)} disabled={isSubmitting}>取消</Button>
            <Button onClick={handleApprove} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              确认通过
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={dialogType === "reject"} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>拒绝充值审核</DialogTitle>
            <DialogDescription>
              拒绝后订单将被标记为已拒绝。请填写拒绝原因，此原因可能展示给用户。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">订单号</Label>
              <span className="col-span-3 text-sm font-mono text-muted-foreground">{actionRow?.rechargeNo}</span>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="rejectRemark" className="text-right mt-2">拒绝原因</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {["支付凭证不清晰", "未查询到实际到账", "金额不匹配"].map((reason) => (
                    <Button
                      key={reason}
                      variant="outline"
                      size="sm"
                      onClick={() => setReviewRemark(reason)}
                      className="text-xs h-7"
                    >
                      {reason}
                    </Button>
                  ))}
                </div>
                <Textarea
                  id="rejectRemark"
                  className="min-h-[80px]"
                  placeholder="必填，输入拒绝原因..."
                  value={reviewRemark}
                  onChange={(e) => setReviewRemark(e.target.value)}
                />
              </div>
            </div>
            {actionError && (
              <div className="text-sm text-rose-500 col-span-4 mt-2">
                {actionError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)} disabled={isSubmitting}>取消</Button>
            <Button variant="destructive" onClick={handleReject} disabled={isSubmitting}>
              确认拒绝
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
