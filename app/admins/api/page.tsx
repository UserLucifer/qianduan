"use client";

import { useCallback, useState } from "react";
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
    { key: "credentialNo", title: "凭证编号", render: (row) => <CopyableSecret value={row.credentialNo} maskedValue={row.credentialNo} canReveal={false} /> },
    { key: "userId", title: "用户 ID", render: (row) => formatEmpty(row.userId) },
    { key: "apiName", title: "API 名称", render: (row) => formatEmpty(row.apiName) },
    { key: "apiBaseUrl", title: "API 地址", render: (row) => formatEmpty(row.apiBaseUrl) },
    { key: "tokenMasked", title: "Token", render: (row) => <CopyableSecret value={row.tokenMasked} maskedValue={row.tokenMasked} /> },
    { key: "tokenStatus", title: "Token 状态", render: (row) => <StatusBadge status={row.tokenStatus} /> },
    { key: "generatedAt", title: "生成时间", render: (row) => <DateTimeText value={typeof row.generatedAt === "string" ? row.generatedAt : null} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openCredentialDetail(row.credentialNo || "")}>
          <Eye className="h-4 w-4" />
          详情
        </Button>
      ),
    },
  ];

  const deployColumns: DataTableColumn<ApiDeployOrderResponse>[] = [
    { key: "deployNo", title: "部署订单号", render: (row) => <CopyableSecret value={row.deployNo} maskedValue={row.deployNo} canReveal={false} /> },
    { key: "orderNo", title: "租赁订单", render: (row) => <CopyableSecret value={row.orderNo} maskedValue={row.orderNo} canReveal={false} /> },
    { key: "credentialNo", title: "凭证编号", render: (row) => <CopyableSecret value={row.credentialNo} maskedValue={row.credentialNo} canReveal={false} /> },
    { key: "modelNameSnapshot", title: "AI 模型", render: (row) => formatEmpty(row.modelNameSnapshot) },
    { key: "deployFeeAmount", title: "部署费用", render: (row) => <MoneyText value={row.deployFeeAmount} /> },
    { key: "status", title: "部署状态", render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: "创建时间", render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDeployDetail(row.deployNo)}>
          <Eye className="h-4 w-4" />
          详情
        </Button>
      ),
    },
  ];

  const credentialSections: DetailSectionDef<AdminApiCredentialRow>[] = [
        {
          title: "凭证信息",
          fields: [
            { label: "凭证编号", render: (credentialDetail) => <CopyableSecret value={credentialDetail.credentialNo} maskedValue={credentialDetail.credentialNo} canReveal={false} /> },
            { label: "用户 ID", render: (credentialDetail) => credentialDetail.userId },
            { label: "API 名称", render: (credentialDetail) => credentialDetail.apiName },
            { label: "Token 状态", render: (credentialDetail) => <StatusBadge status={credentialDetail.tokenStatus} /> },
            { label: "API 地址", render: (credentialDetail) => credentialDetail.apiBaseUrl },
            { label: "Token", render: (credentialDetail) => <CopyableSecret value={credentialDetail.tokenMasked} maskedValue={credentialDetail.tokenMasked} /> },
          ],
        },
        {
          title: "关联业务",
          fields: [
            { label: "租赁订单", render: (credentialDetail) => <CopyableSecret value={credentialDetail.orderNo} maskedValue={credentialDetail.orderNo} canReveal={false} /> },
            { label: "模型", render: (credentialDetail) => credentialDetail.modelNameSnapshot },
            { label: "部署费用", render: (credentialDetail) => credentialDetail.deployFeeSnapshot },
            { label: "生成时间", render: (credentialDetail) => <DateTimeText value={typeof credentialDetail.generatedAt === "string" ? credentialDetail.generatedAt : null} /> },
          ],
        },
      ];

  const deploySections: DetailSectionDef<ApiDeployOrderResponse>[] = [
        {
          title: "部署订单",
          fields: [
            { label: "部署订单号", render: (deployDetail) => <CopyableSecret value={deployDetail.deployNo} maskedValue={deployDetail.deployNo} canReveal={false} /> },
            { label: "租赁订单", render: (deployDetail) => <CopyableSecret value={deployDetail.orderNo} maskedValue={deployDetail.orderNo} canReveal={false} /> },
            { label: "凭证编号", render: (deployDetail) => <CopyableSecret value={deployDetail.credentialNo} maskedValue={deployDetail.credentialNo} canReveal={false} /> },
            { label: "状态", render: (deployDetail) => <StatusBadge status={deployDetail.status} /> },
          ],
        },
        {
          title: "费用与时间",
          fields: [
            { label: "AI 模型", render: (deployDetail) => deployDetail.modelNameSnapshot },
            { label: "部署费用", render: (deployDetail) => <MoneyText value={deployDetail.deployFeeAmount} /> },
            { label: "钱包流水", render: (deployDetail) => <CopyableSecret value={deployDetail.walletTxNo} maskedValue={deployDetail.walletTxNo} canReveal={false} /> },
            { label: "支付时间", render: (deployDetail) => <DateTimeText value={deployDetail.paidAt} /> },
            { label: "创建时间", render: (deployDetail) => <DateTimeText value={deployDetail.createdAt} /> },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="API OPS" title="API 凭证管理" description="查看平台 API 凭证、Token 状态和 API 部署订单。" />
      {(credentials.error || deployOrders.error || actionError) ? (
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
          {actionError ?? credentials.error ?? deployOrders.error}
        </div>
      ) : null}

      <Tabs defaultValue="credentials" className="space-y-4">
        <TabsList className="border border-white/10 bg-white/[0.03]">
          <TabsTrigger value="credentials">API 凭证</TabsTrigger>
          <TabsTrigger value="deploy">部署订单</TabsTrigger>
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
              <Label htmlFor="c_userId">用户 ID</Label>
              <Input id="c_userId" placeholder="输入 ID" value={credentialFilters.userId} onChange={(event) => setCredentialFilters((current) => ({ ...current, userId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credentialNo">凭证编号</Label>
              <Input id="credentialNo" placeholder="输入编号" value={credentialFilters.credentialNo} onChange={(event) => setCredentialFilters((current) => ({ ...current, credentialNo: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label>Token 状态</Label>
              <Select value={credentialFilters.tokenStatus} onValueChange={(val) => setCredentialFilters((current) => ({ ...current, tokenStatus: val }))}>
                <SelectTrigger className="h-9 w-[140px] bg-background text-foreground">
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">全部状态</SelectItem>
                  <SelectItem value="NORMAL">正常</SelectItem>
                  <SelectItem value="ABNORMAL">异常</SelectItem>
                  <SelectItem value="EXPIRED">已过期</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>开始日期</Label>
              <Input type="date" value={credentialFilters.startTime} onChange={(event) => setCredentialFilters((current) => ({ ...current, startTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label>结束日期</Label>
              <Input type="date" value={credentialFilters.endTime} onChange={(event) => setCredentialFilters((current) => ({ ...current, endTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
          </SearchPanel>
          <DataTable columns={credentialColumns} data={credentials.page.records} rowKey={(row) => row.credentialNo || ""} loading={credentials.loading} emptyText="暂无 API 凭证" pageNo={credentials.page.pageNo} pageSize={credentials.page.pageSize} total={credentials.page.total} onPageChange={credentials.changePage} />
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
              <Label htmlFor="d_userId">用户 ID</Label>
              <Input id="d_userId" placeholder="输入 ID" value={deployFilters.userId} onChange={(event) => setDeployFilters((current) => ({ ...current, userId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deployNo">部署订单号</Label>
              <Input id="deployNo" placeholder="输入编号" value={deployFilters.deployNo} onChange={(event) => setDeployFilters((current) => ({ ...current, deployNo: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label>部署状态</Label>
              <Select value={deployFilters.status} onValueChange={(val) => setDeployFilters((current) => ({ ...current, status: val }))}>
                <SelectTrigger className="h-9 w-[140px] bg-background text-foreground">
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">全部状态</SelectItem>
                  <SelectItem value="DEPLOYING">部署中</SelectItem>
                  <SelectItem value="COMPLETED">已完成</SelectItem>
                  <SelectItem value="FAILED">失败</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>开始日期</Label>
              <Input type="date" value={deployFilters.startTime} onChange={(event) => setDeployFilters((current) => ({ ...current, startTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label>结束日期</Label>
              <Input type="date" value={deployFilters.endTime} onChange={(event) => setDeployFilters((current) => ({ ...current, endTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
          </SearchPanel>
          <DataTable columns={deployColumns} data={deployOrders.page.records} rowKey={(row) => row.deployNo} loading={deployOrders.loading} emptyText="暂无部署订单" pageNo={deployOrders.page.pageNo} pageSize={deployOrders.page.pageSize} total={deployOrders.page.total} onPageChange={deployOrders.changePage} />
        </TabsContent>
      </Tabs>

      <DetailDrawer data={credentialDetail} open={drawer === "credential"}
        title="API 凭证详情"
        subtitle={(data) => data?.credentialNo}
        sections={credentialSections}
        onClose={() => setDrawer(null)}
      />
      <DetailDrawer data={deployDetail} open={drawer === "deploy"}
        title="部署订单详情"
        subtitle={(data) => data?.deployNo}
        sections={deploySections}
        onClose={() => setDrawer(null)}
      />
    </div>
  );
}
