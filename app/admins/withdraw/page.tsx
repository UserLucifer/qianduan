"use client";

import { HasPermission } from "@/components/shared/HasPermission";
import { AdminRole } from "@/types/enums";

import { useCallback, useState } from "react";
import { Check, Eye, Send, X } from "lucide-react";
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
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { approveWithdraw, getAdminWithdrawOrderDetail, getAdminWithdrawOrders, markWithdrawPaid, rejectWithdraw } from "@/api/admin";
import type { WithdrawOrderQueryRequest, WithdrawOrderResponse } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface WithdrawFilters {
  status: string;
  startTime: string;
  endTime: string;
}

const initialFilters: WithdrawFilters = { status: "", startTime: "", endTime: "" };
const initialQuery: WithdrawOrderQueryRequest = { pageNo: 1, pageSize: 10 };

export default function AdminWithdrawPage() {
  const [filters, setFilters] = useState<WithdrawFilters>(initialFilters);
  const [detail, setDetail] = useState<WithdrawOrderResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Approval Dialog States
  const [actionRow, setActionRow] = useState<WithdrawOrderResponse | null>(null);
  const [dialogType, setDialogType] = useState<"approve" | "reject" | "paid" | null>(null);
  const [reviewRemark, setReviewRemark] = useState<string>("");
  const [payProofNo, setPayProofNo] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loader = useCallback(async (params: WithdrawOrderQueryRequest) => (await getAdminWithdrawOrders(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: WithdrawFilters): WithdrawOrderQueryRequest => ({
    pageNo: 1,
    pageSize: page.pageSize,
    status: nextFilters.status || undefined,
    startTime: nextFilters.startTime || undefined,
    endTime: nextFilters.endTime || undefined,
  });

  const openDetail = async (withdrawNo: string) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminWithdrawOrderDetail(withdrawNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const openApprove = (row: WithdrawOrderResponse) => {
    setActionRow(row);
    setDialogType("approve");
    setReviewRemark("");
    setActionError(null);
  };

  const openReject = (row: WithdrawOrderResponse) => {
    setActionRow(row);
    setDialogType("reject");
    setReviewRemark("");
    setActionError(null);
  };

  const openPaid = (row: WithdrawOrderResponse) => {
    setActionRow(row);
    setDialogType("paid");
    setPayProofNo("");
    setActionError(null);
  };

  const handleApprove = async () => {
    if (!actionRow) return;
    try {
      setIsSubmitting(true);
      await approveWithdraw(actionRow.withdrawNo, { reviewRemark });
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
      setActionError("拒绝提现必须填写原因。");
      return;
    }
    try {
      setIsSubmitting(true);
      await rejectWithdraw(actionRow.withdrawNo, { reviewRemark });
      setDialogType(null);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaid = async () => {
    if (!actionRow) return;
    if (!payProofNo || !payProofNo.trim()) {
      setActionError("标记已打款必须填写打款凭证号。");
      return;
    }
    try {
      setIsSubmitting(true);
      await markWithdrawPaid(actionRow.withdrawNo, { payProofNo });
      setDialogType(null);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: DataTableColumn<WithdrawOrderResponse>[] = [
    { key: "withdrawNo", title: "提现订单号", render: (row) => <CopyableSecret value={row.withdrawNo} maskedValue={row.withdrawNo} canReveal={false} /> },
    { key: "userName", title: "用户名称", render: (row) => formatEmpty(row.userName) },
    { key: "applyAmount", title: "提现金额", render: (row) => <MoneyText value={row.applyAmount} currency={row.currency} /> },
    { key: "feeAmount", title: "手续费", render: (row) => <MoneyText value={row.feeAmount} currency={row.currency} /> },
    { key: "actualAmount", title: "到账金额", render: (row) => <MoneyText value={row.actualAmount} currency={row.currency} /> },
    { key: "network", title: "收款网络", render: (row) => formatEmpty(row.network) },
    { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: "创建时间", render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDetail(row.withdrawNo)}>
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
          {row.status === "APPROVED" ? (
            <HasPermission role={[AdminRole.SUPER_ADMIN, AdminRole.ADMIN]}>
              <Button variant="ghost" size="sm" className="font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10" onClick={() => openPaid(row)}>
                <Send className="h-4 w-4 mr-1" />
                已打款
              </Button>
            </HasPermission>
          ) : null}
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<WithdrawOrderResponse>[] = [
        {
          title: "订单信息",
          fields: [
            { label: "提现订单号", render: (detail) => <CopyableSecret value={detail.withdrawNo} maskedValue={detail.withdrawNo} canReveal={false} /> },
            { label: "用户名称", render: (detail) => detail.userName },
            { label: "状态", render: (detail) => <StatusBadge status={detail.status} /> },
            { label: "提现金额", render: (detail) => <MoneyText value={detail.applyAmount} currency={detail.currency} /> },
            { label: "到账金额", render: (detail) => <MoneyText value={detail.actualAmount} currency={detail.currency} /> },
          ],
        },
        {
          title: "收款信息",
          fields: [
            { label: "提现方式", render: (detail) => formatEmpty(detail.withdrawMethod) },
            { label: "网络", render: (detail) => formatEmpty(detail.network) },
            { label: "收款人", render: (detail) => formatEmpty(detail.accountName) },
            { label: "收款账户", render: (detail) => <CopyableSecret value={detail.accountNo} /> },
          ],
        },
        {
          title: "审核与打款",
          fields: [
            { label: "手续费", render: (detail) => <MoneyText value={detail.feeAmount} currency={detail.currency} /> },
            { label: "审核备注", render: (detail) => formatEmpty(detail.reviewRemark) },
            { label: "打款凭证", render: (detail) => <CopyableSecret value={detail.payProofNo} maskedValue={detail.payProofNo ?? "-"} canReveal={false} /> },
            { label: "打款时间", render: (detail) => <DateTimeText value={detail.paidAt} /> },
          ],
        },
        {
          title: "流水信息",
          fields: [
            { label: "冻结流水", render: (detail) => <CopyableSecret value={detail.freezeTxNo} maskedValue={detail.freezeTxNo ?? "-"} canReveal={false} /> },
            { label: "解冻流水", render: (detail) => <CopyableSecret value={detail.unfreezeTxNo} maskedValue={detail.unfreezeTxNo ?? "-"} canReveal={false} /> },
            { label: "打款流水", render: (detail) => <CopyableSecret value={detail.paidTxNo} maskedValue={detail.paidTxNo ?? "-"} canReveal={false} /> },
            { label: "创建时间", render: (detail) => <DateTimeText value={detail.createdAt} /> },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="FINANCE REVIEW" title="提现审核" description="审核提现申请、查看收款信息，并标记实际打款结果。" />
      <ErrorAlert message={actionError ?? error} />
      <SearchPanel
        onSearch={() => updateParams(buildQuery(filters))}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label>提现状态</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value="SUBMITTED">待审核</SelectItem>
              <SelectItem value="APPROVED">待打款</SelectItem>
              <SelectItem value="REJECTED">已拒绝</SelectItem>
              <SelectItem value="PAID">已打款</SelectItem>
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
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.withdrawNo} loading={loading} emptyText="暂无提现订单" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title="提现订单详情" subtitle={(data) => data.withdrawNo} sections={detailSections} onClose={() => setDetailOpen(false)} />

      {/* Approve Dialog */}
      <Dialog open={dialogType === "approve"} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>通过提现审核</DialogTitle>
            <DialogDescription>
              确认通过后，订单将进入待打款状态，请仔细核对用户收款信息。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">订单号</Label>
              <span className="col-span-3 text-sm font-mono text-muted-foreground">{actionRow?.withdrawNo}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">提现金额</Label>
              <span className="col-span-3 text-sm font-semibold">{actionRow?.applyAmount} {actionRow?.currency}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">应打款</Label>
              <span className="col-span-3 text-sm font-bold text-emerald-600 dark:text-emerald-400">{actionRow?.actualAmount} {actionRow?.currency}</span>
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
            <DialogTitle>拒绝提现审核</DialogTitle>
            <DialogDescription>
              拒绝后订单将被取消，且冻结的用户资金将被解冻。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">订单号</Label>
              <span className="col-span-3 text-sm font-mono text-muted-foreground">{actionRow?.withdrawNo}</span>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="rejectRemark" className="text-right mt-2">拒绝原因</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {["收款账户信息错误", "涉嫌违规交易", "不符合提现规则", "系统检测到异常风险"].map((reason) => (
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

      {/* Paid Dialog */}
      <Dialog open={dialogType === "paid"} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>标记为已打款</DialogTitle>
            <DialogDescription>
              确认链上或线下打款已完成后再执行此操作。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">应打款</Label>
              <span className="col-span-3 text-sm font-bold text-emerald-600 dark:text-emerald-400">{actionRow?.actualAmount} {actionRow?.currency}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payProofNo" className="text-right">打款凭证</Label>
              <Input
                id="payProofNo"
                placeholder="必填，链上 TxID 或线下流水号"
                value={payProofNo}
                onChange={(e) => setPayProofNo(e.target.value)}
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
            <Button onClick={handlePaid} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              确认打款
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
