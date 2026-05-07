"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MoneyText } from "@/components/shared/MoneyText";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { CopyableSecret } from "@/components/shared/CopyableSecret";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getAdminApiCredentialDetail, getAdminApiCredentials, getAdminApiDeployOrderDetail, getAdminApiDeployOrders } from "@/api/admin";
import type { AdminApiCredentialQuery, AdminApiCredentialRow, AdminApiDeployOrderQuery, ApiDeployOrderResponse } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface CredentialFilters {
  userId: string;
  credentialNo: string;
  tokenStatus: string;
  startTime: string;
  endTime: string;
}

interface DeployFilters {
  userId: string;
  deployNo: string;
  status: string;
  startTime: string;
  endTime: string;
}

const credentialInitial: AdminApiCredentialQuery = { pageNo: 1, pageSize: 10 };
const deployInitial: AdminApiDeployOrderQuery = { pageNo: 1, pageSize: 10 };
const credentialFiltersInitial: CredentialFilters = { userId: "", credentialNo: "", tokenStatus: "", startTime: "", endTime: "" };
const deployFiltersInitial: DeployFilters = { userId: "", deployNo: "", status: "", startTime: "", endTime: "" };

export default function AdminApiPage() {
  const t = useTranslations("AdminPages.api");
  const [credentialFilters, setCredentialFilters] = useState<CredentialFilters>(credentialFiltersInitial);
  const [deployFilters, setDeployFilters] = useState<DeployFilters>(deployFiltersInitial);
  const [credentialDetail, setCredentialDetail] = useState<AdminApiCredentialRow | null>(null);
  const [deployDetail, setDeployDetail] = useState<ApiDeployOrderResponse | null>(null);
  const [drawer, setDrawer] = useState<"credential" | "deploy" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const credentialLoader = useCallback(async (params: AdminApiCredentialQuery) => (await getAdminApiCredentials(params)).data, []);
  const deployLoader = useCallback(async (params: AdminApiDeployOrderQuery) => (await getAdminApiDeployOrders(params)).data, []);
  const credentials = usePaginatedResource(credentialLoader, credentialInitial);
  const deployOrders = usePaginatedResource(deployLoader, deployInitial);

  const credentialQuery = (filters: CredentialFilters): AdminApiCredentialQuery => ({
    pageNo: 1,
    pageSize: credentials.page.pageSize,
    user_id: filters.userId ? Number(filters.userId) : undefined,
    credential_no: filters.credentialNo || undefined,
    token_status: filters.tokenStatus || undefined,
    start_time: filters.startTime || undefined,
    end_time: filters.endTime || undefined,
  });
  const deployQuery = (filters: DeployFilters): AdminApiDeployOrderQuery => ({
    pageNo: 1,
    pageSize: deployOrders.page.pageSize,
    user_id: filters.userId ? Number(filters.userId) : undefined,
    deploy_no: filters.deployNo || undefined,
    status: filters.status || undefined,
    start_time: filters.startTime || undefined,
    end_time: filters.endTime || undefined,
  });

  const openCredentialDetail = async (credentialNo: string) => {
    setActionError(null);
    setDrawer("credential");
    try {
      const res = await getAdminApiCredentialDetail(credentialNo);
      setCredentialDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const openDeployDetail = async (deployNo: string) => {
    setActionError(null);
    setDrawer("deploy");
    try {
      const res = await getAdminApiDeployOrderDetail(deployNo);
      setDeployDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const credentialColumns: DataTableColumn<AdminApiCredentialRow>[] = [
    { key: "credentialNo", title: t("credentialNo"), render: (row) => <CopyableSecret value={row.credentialNo} maskedValue={row.credentialNo} canReveal={false} /> },
    { key: "userId", title: t("userID"), render: (row) => formatEmpty(row.userId) },
    { key: "apiName", title: t("apiName"), render: (row) => formatEmpty(row.apiName) },
    { key: "apiBaseUrl", title: t("apiURL"), render: (row) => formatEmpty(row.apiBaseUrl) },
    { key: "tokenMasked", title: "Token", render: (row) => <CopyableSecret value={row.tokenMasked} maskedValue={row.tokenMasked} /> },
    { key: "tokenStatus", title: t("tokenStatus"), render: (row) => <StatusBadge status={row.tokenStatus} /> },
    { key: "generatedAt", title: t("generatedAt"), render: (row) => <DateTimeText value={typeof row.generatedAt === "string" ? row.generatedAt : null} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openCredentialDetail(row.credentialNo || "")}>
          <Eye className="h-4 w-4" />
          {t("details")}</Button>
      ),
    },
  ];

  const deployColumns: DataTableColumn<ApiDeployOrderResponse>[] = [
    { key: "deployNo", title: t("deploymentOrderNo"), render: (row) => <CopyableSecret value={row.deployNo} maskedValue={row.deployNo} canReveal={false} /> },
    { key: "orderNo", title: t("rentalOrder"), render: (row) => <CopyableSecret value={row.orderNo} maskedValue={row.orderNo} canReveal={false} /> },
    { key: "credentialNo", title: t("credentialNo"), render: (row) => <CopyableSecret value={row.credentialNo} maskedValue={row.credentialNo} canReveal={false} /> },
    { key: "modelNameSnapshot", title: t("aIModel"), render: (row) => formatEmpty(row.modelNameSnapshot) },
    { key: "deployFeeAmount", title: t("deploymentFee"), render: (row) => <MoneyText value={row.deployFeeAmount} /> },
    { key: "status", title: t("deploymentStatus"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: t("createdAt"), render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDeployDetail(row.deployNo)}>
          <Eye className="h-4 w-4" />
          {t("details")}</Button>
      ),
    },
  ];

  const credentialSections: DetailSectionDef<AdminApiCredentialRow>[] = [
        {
          title: t("credentialInformation"),
          fields: [
            { label: t("credentialNo"), render: (credentialDetail) => <CopyableSecret value={credentialDetail.credentialNo} maskedValue={credentialDetail.credentialNo} canReveal={false} /> },
            { label: t("userID"), render: (credentialDetail) => credentialDetail.userId },
            { label: t("apiName"), render: (credentialDetail) => credentialDetail.apiName },
            { label: t("tokenStatus"), render: (credentialDetail) => <StatusBadge status={credentialDetail.tokenStatus} /> },
            { label: t("apiURL"), render: (credentialDetail) => credentialDetail.apiBaseUrl },
            { label: "Token", render: (credentialDetail) => <CopyableSecret value={credentialDetail.tokenMasked} maskedValue={credentialDetail.tokenMasked} /> },
          ],
        },
        {
          title: t("linkedBusiness"),
          fields: [
            { label: t("rentalOrder"), render: (credentialDetail) => <CopyableSecret value={credentialDetail.orderNo} maskedValue={credentialDetail.orderNo} canReveal={false} /> },
            { label: t("model"), render: (credentialDetail) => credentialDetail.modelNameSnapshot },
            { label: t("deploymentFee"), render: (credentialDetail) => credentialDetail.deployFeeSnapshot },
            { label: t("generatedAt"), render: (credentialDetail) => <DateTimeText value={typeof credentialDetail.generatedAt === "string" ? credentialDetail.generatedAt : null} /> },
          ],
        },
      ];

  const deploySections: DetailSectionDef<ApiDeployOrderResponse>[] = [
        {
          title: t("deploymentOrder"),
          fields: [
            { label: t("deploymentOrderNo"), render: (deployDetail) => <CopyableSecret value={deployDetail.deployNo} maskedValue={deployDetail.deployNo} canReveal={false} /> },
            { label: t("rentalOrder"), render: (deployDetail) => <CopyableSecret value={deployDetail.orderNo} maskedValue={deployDetail.orderNo} canReveal={false} /> },
            { label: t("credentialNo"), render: (deployDetail) => <CopyableSecret value={deployDetail.credentialNo} maskedValue={deployDetail.credentialNo} canReveal={false} /> },
            { label: t("status"), render: (deployDetail) => <StatusBadge status={deployDetail.status} /> },
          ],
        },
        {
          title: t("feesAndTiming"),
          fields: [
            { label: t("aIModel"), render: (deployDetail) => deployDetail.modelNameSnapshot },
            { label: t("deploymentFee"), render: (deployDetail) => <MoneyText value={deployDetail.deployFeeAmount} /> },
            { label: t("walletTransaction"), render: (deployDetail) => <CopyableSecret value={deployDetail.walletTxNo} maskedValue={deployDetail.walletTxNo} canReveal={false} /> },
            { label: t("paidAt"), render: (deployDetail) => <DateTimeText value={deployDetail.paidAt} /> },
            { label: t("createdAt"), render: (deployDetail) => <DateTimeText value={deployDetail.createdAt} /> },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="API OPS" title={t("apiCredentialManagement")} description={t("reviewPlatformApiCredentialsTokenStatusAndApiDeploymentOrders")} />
      <ErrorAlert message={actionError ?? credentials.error ?? deployOrders.error} />

      <Tabs defaultValue="credentials" className="space-y-4">
        <TabsList className="border border-white/10 bg-white/[0.03]">
          <TabsTrigger value="credentials">{t("apiCredentials")}</TabsTrigger>
          <TabsTrigger value="deploy">{t("deploymentOrder")}</TabsTrigger>
        </TabsList>
        <TabsContent value="credentials" className="space-y-4">
          <SearchPanel
            onSearch={() => credentials.updateParams(credentialQuery(credentialFilters))}
            onReset={() => {
              setCredentialFilters(credentialFiltersInitial);
              credentials.updateParams(credentialInitial);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="c_userId">{t("userID")}</Label>
              <Input id="c_userId" placeholder={t("enterID")} value={credentialFilters.userId} onChange={(event) => setCredentialFilters((current) => ({ ...current, userId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credentialNo">{t("credentialNo")}</Label>
              <Input id="credentialNo" placeholder={t("enterNumber")} value={credentialFilters.credentialNo} onChange={(event) => setCredentialFilters((current) => ({ ...current, credentialNo: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label>{t("tokenStatus")}</Label>
              <Select value={credentialFilters.tokenStatus} onValueChange={(val) => setCredentialFilters((current) => ({ ...current, tokenStatus: val }))}>
                <SelectTrigger className="h-9 w-[140px] bg-background text-foreground">
                  <SelectValue placeholder={t("allStatuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">{t("allStatuses")}</SelectItem>
                  <SelectItem value="NORMAL">{t("normal")}</SelectItem>
                  <SelectItem value="ABNORMAL">{t("abnormal")}</SelectItem>
                  <SelectItem value="EXPIRED">{t("expired")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("startDate")}</Label>
              <Input type="date" value={credentialFilters.startTime} onChange={(event) => setCredentialFilters((current) => ({ ...current, startTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label>{t("endDate")}</Label>
              <Input type="date" value={credentialFilters.endTime} onChange={(event) => setCredentialFilters((current) => ({ ...current, endTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
          </SearchPanel>
          <DataTable columns={credentialColumns} data={credentials.page.records} rowKey={(row) => row.credentialNo || ""} loading={credentials.loading} emptyText={t("noApiSYet")} pageNo={credentials.page.pageNo} pageSize={credentials.page.pageSize} total={credentials.page.total} onPageChange={credentials.changePage} />
        </TabsContent>

        <TabsContent value="deploy" className="space-y-4">
          <SearchPanel
            onSearch={() => deployOrders.updateParams(deployQuery(deployFilters))}
            onReset={() => {
              setDeployFilters(deployFiltersInitial);
              deployOrders.updateParams(deployInitial);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="d_userId">{t("userID")}</Label>
              <Input id="d_userId" placeholder={t("enterID")} value={deployFilters.userId} onChange={(event) => setDeployFilters((current) => ({ ...current, userId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deployNo">{t("deploymentOrderNo")}</Label>
              <Input id="deployNo" placeholder={t("enterNumber")} value={deployFilters.deployNo} onChange={(event) => setDeployFilters((current) => ({ ...current, deployNo: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label>{t("deploymentStatus")}</Label>
              <Select value={deployFilters.status} onValueChange={(val) => setDeployFilters((current) => ({ ...current, status: val }))}>
                <SelectTrigger className="h-9 w-[140px] bg-background text-foreground">
                  <SelectValue placeholder={t("allStatuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">{t("allStatuses")}</SelectItem>
                  <SelectItem value="DEPLOYING">{t("deploying")}</SelectItem>
                  <SelectItem value="COMPLETED">{t("completed")}</SelectItem>
                  <SelectItem value="FAILED">{t("failed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("startDate")}</Label>
              <Input type="date" value={deployFilters.startTime} onChange={(event) => setDeployFilters((current) => ({ ...current, startTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label>{t("endDate")}</Label>
              <Input type="date" value={deployFilters.endTime} onChange={(event) => setDeployFilters((current) => ({ ...current, endTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
          </SearchPanel>
          <DataTable columns={deployColumns} data={deployOrders.page.records} rowKey={(row) => row.deployNo} loading={deployOrders.loading} emptyText={t("noDeploymentOrdersYet")} pageNo={deployOrders.page.pageNo} pageSize={deployOrders.page.pageSize} total={deployOrders.page.total} onPageChange={deployOrders.changePage} />
        </TabsContent>
      </Tabs>

      <DetailDrawer data={credentialDetail} open={drawer === "credential"}
        title={t("apiCredentialDetails")}
        subtitle={(data) => data?.credentialNo}
        sections={credentialSections}
        onClose={() => setDrawer(null)}
      />
      <DetailDrawer data={deployDetail} open={drawer === "deploy"}
        title={t("deploymentOrderDetails")}
        subtitle={(data) => data?.deployNo}
        sections={deploySections}
        onClose={() => setDrawer(null)}
      />
    </div>
  );
}
