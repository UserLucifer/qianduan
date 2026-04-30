"use client";

import { useCallback, useState } from "react";
import { Eye, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { CopyableSecret } from "@/components/shared/CopyableSecret";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getRentalApiManagement, getRentalDeployInfo, payDeployFee } from "@/api/rental";
import type { ApiDeployInfoResponse, PageResult, RentalOrderQueryRequest } from "@/api/types";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { formatEmpty, toErrorMessage } from "@/lib/format";

const initialParams: RentalOrderQueryRequest = { pageNo: 1, pageSize: 10 };

export default function DashboardApiPage() {
  const loader = useCallback(async (params: RentalOrderQueryRequest): Promise<PageResult<ApiDeployInfoResponse>> => {
    const res = await getRentalApiManagement(params);
    return res.data;
  }, []);
  const { page, loading, error, changePage, reload } = usePaginatedResource(loader, initialParams);
  const [detail, setDetail] = useState<ApiDeployInfoResponse | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const openDeployInfo = async (orderNo: string) => {
    setActionError(null);
    try {
      const res = await getRentalDeployInfo(orderNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const payDeploy = async (orderNo: string) => {
    setActionError(null);
    try {
      await payDeployFee(orderNo);
      await reload();
      if (detail?.orderNo === orderNo) {
        const next = await getRentalDeployInfo(orderNo);
        setDetail(next.data);
      }
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<ApiDeployInfoResponse>[] = [
    { key: "orderNo", title: "关联订单", render: (row) => <span className="font-mono text-xs">{row.orderNo}</span> },
    {
      key: "productNameSnapshot",
      title: "产品 / 模型",
      render: (row) => (
        <div>
          <div className="font-medium text-zinc-100">{row.productNameSnapshot}</div>
          <div className="text-xs text-zinc-500">{row.aiModelNameSnapshot}</div>
        </div>
      ),
    },
    { key: "orderStatus", title: "订单状态", render: (row) => <StatusBadge status={row.orderStatus} /> },
    { key: "apiGeneratedAt", title: "凭证生成", render: (row) => <DateTimeText value={row.apiGeneratedAt} /> },
    { key: "deployFeePaidAt", title: "部署支付", render: (row) => <DateTimeText value={row.deployFeePaidAt} /> },
    {
      key: "actions",
      title: "操作",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDeployInfo(row.orderNo)}>
            <Eye className="h-3.5 w-3.5" />
            查看
          </Button>
          {!row.deployFeePaidAt ? (
            <ConfirmActionButton title="支付 API 部署费" description="支付后后端会继续部署并生成访问凭证。" confirmText="确认支付" onConfirm={() => payDeploy(row.orderNo)}>
              <ReceiptText className="h-3.5 w-3.5" />支付部署费
            </ConfirmActionButton>
          ) : null}
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<any>[] = [
    {
      title: "凭证信息",
      fields: [
        { label: "凭证编号", render: (detail) => <span className="font-mono">{formatEmpty(detail.credentialNo)}</span> },
        { label: "Token 状态", render: (detail) => <StatusBadge status={detail.tokenStatus} /> },
        { label: "API 名称", render: (detail) => formatEmpty(detail.apiName) },
        { label: "API Base URL", render: (detail) => <CopyableSecret value={detail.apiBaseUrl} canReveal={false} /> },
        { label: "Token", render: (detail) => <CopyableSecret value={detail.tokenMasked} maskedValue={detail.tokenMasked} canReveal={false} /> },
        { label: "模型", render: (detail) => formatEmpty(detail.modelNameSnapshot) },
      ],
    },
    {
      title: "部署信息",
      fields: [
        { label: "关联订单", render: (detail) => <span className="font-mono">{detail.orderNo}</span> },
        { label: "订单状态", render: (detail) => <StatusBadge status={detail.orderStatus} /> },
        { label: "部署状态", render: (detail) => <StatusBadge status={detail.deployOrderStatus} /> },
        { label: "部署费用", render: (detail) => <MoneyText value={detail.deployFeeSnapshot} /> },
        { label: "支付时间", render: (detail) => <DateTimeText value={detail.paidAt} /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="API 管理" title="API 凭证与部署" description="从租赁订单进入 API 凭证、部署状态和部署费用支付。敏感字段默认脱敏。" />
      {error || actionError ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error ?? actionError}</div> : null}
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.orderNo} loading={loading} emptyText="暂无可关联的租赁订单。" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-zinc-400">
        API 调用说明由后端凭证详情返回的 API Base URL 和 Token 组成。前端不明文暴露未脱敏 Token，复制操作仅对后端已返回字段生效。
      </div>
      <DetailDrawer data={detail} open={Boolean(detail)} title="API 部署详情" subtitle={(data) => data.orderNo} sections={detailSections} onClose={() => setDetail(null)} />
    </div>
  );
}
