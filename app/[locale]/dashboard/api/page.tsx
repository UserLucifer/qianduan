"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
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
import { formatEmpty } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

const initialParams: RentalOrderQueryRequest = { pageNo: 1, pageSize: 10 };

export default function DashboardApiPage() {
  const t = useTranslations("DashboardApi");
  const loader = useCallback(async (params: RentalOrderQueryRequest): Promise<PageResult<ApiDeployInfoResponse>> => {
    const res = await getRentalApiManagement(params);
    return res.data;
  }, []);
  const { page, loading, error, changePage, reload } = usePaginatedResource(loader, initialParams);
  const [detail, setDetail] = useState<ApiDeployInfoResponse | null>(null);

  const openDeployInfo = async (orderNo: string) => {
    try {
      const res = await getRentalDeployInfo(orderNo);
      setDetail(res.data);
    } catch {
      // API errors are surfaced by the request interceptor.
    }
  };

  const payDeploy = async (orderNo: string) => {
    try {
      await payDeployFee(orderNo);
      await reload();
      if (detail?.orderNo === orderNo) {
        const next = await getRentalDeployInfo(orderNo);
        setDetail(next.data);
      }
    } catch {
      // API errors are surfaced by the request interceptor.
    }
  };

  const columns: DataTableColumn<ApiDeployInfoResponse>[] = [
    { key: "orderNo", title: t("columns.order"), render: (row) => <span className="font-mono text-xs">{row.orderNo}</span> },
    {
      key: "apiName",
      title: t("columns.credential"),
      render: (row) => (
        <div>
          <div className="font-medium text-foreground">{formatEmpty(row.apiName)}</div>
          <div className="font-mono text-xs text-muted-foreground">{formatEmpty(row.credentialNo)}</div>
        </div>
      ),
    },
    { key: "modelNameSnapshot", title: t("columns.model"), render: (row) => formatEmpty(row.modelNameSnapshot) },
    { key: "orderStatus", title: t("columns.orderStatus"), render: (row) => <StatusBadge status={row.orderStatus} /> },
    { key: "tokenStatus", title: t("columns.tokenStatus"), render: (row) => <StatusBadge status={row.tokenStatus} /> },
    {
      key: "deployOrderStatus",
      title: t("columns.deployCost"),
      render: (row) => (
        <div className="space-y-1">
          <StatusBadge status={row.deployOrderStatus} />
          <MoneyText value={row.deployFeeSnapshot} className="block text-xs" />
        </div>
      ),
    },
    { key: "paidAt", title: t("columns.paidAt"), render: (row) => <DateTimeText value={row.paidAt} /> },
    {
      key: "actions",
      title: t("columns.actions"),
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted" onClick={() => void openDeployInfo(row.orderNo)}>
            <Eye className="h-3.5 w-3.5" />
            {t("actions.view")}</Button>
          {!row.paidAt ? (
            <ConfirmActionButton title={t("actions.payTitle")} description={t("actions.payDescription")} confirmText={t("actions.payConfirm")} onConfirm={() => payDeploy(row.orderNo)}>
              <ReceiptText className="h-3.5 w-3.5" />{t("actions.payButton")}</ConfirmActionButton>
          ) : null}
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<ApiDeployInfoResponse>[] = [
    {
      title: t("detail.credentialInfo"),
      fields: [
        { label: t("detail.credentialNo"), render: (detail) => <span className="font-mono">{formatEmpty(detail.credentialNo)}</span> },
        { label: t("detail.tokenStatus"), render: (detail) => <StatusBadge status={detail.tokenStatus} /> },
        { label: t("detail.apiName"), render: (detail) => formatEmpty(detail.apiName) },
        { label: "API Base URL", render: (detail) => <CopyableSecret value={detail.apiBaseUrl} canReveal={false} /> },
        { label: "Token", render: (detail) => <CopyableSecret value={detail.tokenMasked} maskedValue={detail.tokenMasked} canReveal={false} /> },
        { label: t("detail.model"), render: (detail) => formatEmpty(detail.modelNameSnapshot) },
      ],
    },
    {
      title: t("detail.deploymentInfo"),
      fields: [
        { label: t("detail.order"), render: (detail) => <span className="font-mono">{detail.orderNo}</span> },
        { label: t("detail.orderStatus"), render: (detail) => <StatusBadge status={detail.orderStatus} /> },
        { label: t("detail.deployStatus"), render: (detail) => <StatusBadge status={detail.deployOrderStatus} /> },
        { label: t("detail.deployFee"), render: (detail) => <MoneyText value={detail.deployFeeSnapshot} /> },
        { label: t("detail.paidAt"), render: (detail) => <DateTimeText value={detail.paidAt} /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} description={t("header.description")} />
      <ErrorAlert message={error} />
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.orderNo} loading={loading} emptyText={t("empty")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
        {t("info")}</div>
      <DetailDrawer data={detail} open={Boolean(detail)} title={t("drawerTitle")} subtitle={(data) => data.orderNo} sections={detailSections} onClose={() => setDetail(null)} />
    </div>
  );
}
