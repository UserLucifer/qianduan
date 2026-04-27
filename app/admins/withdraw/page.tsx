"use client";

import { useCallback, useState } from "react";
import { Check, Eye, Send, X } from "lucide-react";
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
import { approveWithdraw, getAdminWithdrawOrderDetail, getAdminWithdrawOrders, markWithdrawPaid, rejectWithdraw } from "@/api/admin";
import type { WithdrawOrderQueryRequest, WithdrawOrderResponse } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";

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

  const approve = async (row: WithdrawOrderResponse) => {
    const reviewRemark = window.prompt("审核备注（可选）") ?? undefined;
    try {
      await approveWithdraw(row.withdrawNo, { reviewRemark });
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const reject = async (row: WithdrawOrderResponse) => {
    const reviewRemark = window.prompt("请输入拒绝原因");
    if (!reviewRemark || !reviewRemark.trim()) {
      setActionError("拒绝提现必须填写原因。");
      return;
    }
    try {
      await rejectWithdraw(row.withdrawNo, { reviewRemark });
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const paid = async (row: WithdrawOrderResponse) => {
    const payProofNo = window.prompt("请输入打款凭证号");
    if (!payProofNo || !payProofNo.trim()) {
      setActionError("标记已打款必须填写打款凭证号。");
      return;
    }
    try {
      await markWithdrawPaid(row.withdrawNo, { payProofNo });
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<WithdrawOrderResponse>[] = [
    { key: "withdrawNo", title: "提现订单号", render: (row) => <CopyableSecret value={row.withdrawNo} maskedValue={row.withdrawNo} canReveal={false} /> },
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
          <Button variant="ghost" size="sm" className="text-zinc-300 hover:bg-white/5" onClick={() => void openDetail(row.withdrawNo)}>
            <Eye className="h-4 w-4" />
            详情
          </Button>
          {row.status === "SUBMITTED" || row.status === "PENDING_REVIEW" ? (
            <>
              <ConfirmActionButton title="通过提现审核" description="通过后提现金额将进入待打款流程。" onConfirm={() => approve(row)}>
                <Check className="h-4 w-4" />
                通过
              </ConfirmActionButton>
              <ConfirmActionButton title="拒绝提现审核" description="拒绝会解冻用户资金，必须填写原因。" onConfirm={() => reject(row)}>
                <X className="h-4 w-4" />
                拒绝
              </ConfirmActionButton>
            </>
          ) : null}
          {row.status === "APPROVED" ? (
            <ConfirmActionButton title="标记已打款" description="确认链上或线下打款已完成后再执行。" onConfirm={() => paid(row)}>
              <Send className="h-4 w-4" />
              已打款
            </ConfirmActionButton>
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
            { label: "提现订单号", value: <CopyableSecret value={detail.withdrawNo} maskedValue={detail.withdrawNo} canReveal={false} /> },
            { label: "状态", value: <StatusBadge status={detail.status} /> },
            { label: "提现金额", value: <MoneyText value={detail.applyAmount} currency={detail.currency} /> },
            { label: "到账金额", value: <MoneyText value={detail.actualAmount} currency={detail.currency} /> },
          ],
        },
        {
          title: "收款信息",
          fields: [
            { label: "提现方式", value: formatEmpty(detail.withdrawMethod) },
            { label: "网络", value: formatEmpty(detail.network) },
            { label: "收款人", value: formatEmpty(detail.accountName) },
            { label: "收款账户", value: <CopyableSecret value={detail.accountNo} /> },
          ],
        },
        {
          title: "审核与打款",
          fields: [
            { label: "手续费", value: <MoneyText value={detail.feeAmount} currency={detail.currency} /> },
            { label: "审核备注", value: formatEmpty(detail.reviewRemark) },
            { label: "打款凭证", value: <CopyableSecret value={detail.payProofNo} maskedValue={detail.payProofNo ?? "-"} canReveal={false} /> },
            { label: "打款时间", value: <DateTimeText value={detail.paidAt} /> },
          ],
        },
        {
          title: "流水信息",
          fields: [
            { label: "冻结流水", value: <CopyableSecret value={detail.freezeTxNo} maskedValue={detail.freezeTxNo ?? "-"} canReveal={false} /> },
            { label: "解冻流水", value: <CopyableSecret value={detail.unfreezeTxNo} maskedValue={detail.unfreezeTxNo ?? "-"} canReveal={false} /> },
            { label: "打款流水", value: <CopyableSecret value={detail.paidTxNo} maskedValue={detail.paidTxNo ?? "-"} canReveal={false} /> },
            { label: "创建时间", value: <DateTimeText value={detail.createdAt} /> },
          ],
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="FINANCE REVIEW" title="提现审核" description="审核提现申请、查看收款信息，并标记实际打款结果。" />
      {(error || actionError) ? (
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
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
      <DetailDrawer open={detailOpen} title="提现订单详情" subtitle={detail?.withdrawNo} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
