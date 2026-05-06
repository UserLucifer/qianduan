"use client";

import { useCallback, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Edit2, Eye, Languages, Power, PowerOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MoneyText } from "@/components/shared/MoneyText";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { CopyableSecret } from "@/components/shared/CopyableSecret";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  disableAdminProduct,
  enableAdminProduct,
  getAdminProductDetail,
  getAdminProductTranslations,
  getAdminProducts,
  getAdminRegions,
  getAdminGpuModels,
  updateAdminProductTranslation,
} from "@/api/admin";
import type { AdminCatalogQuery, ProductResponse, RegionResponse, GpuModelResponse } from "@/api/types";
import { formatEmpty, formatNumber, toErrorMessage } from "@/lib/format";
import { ProductForm } from "@/components/admin/CatalogForms";
import { AdminTranslationEditor } from "@/components/admin/AdminTranslationEditor";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface ProductFilters {
  productCode: string;
  status: string;
  regionId: string;
  gpuModelId: string;
}

const initialFilters: ProductFilters = { productCode: "", status: " ", regionId: "", gpuModelId: "" };
const initialQuery: AdminCatalogQuery = { pageNo: 1, pageSize: 10 };

export default function AdminProductsPage() {
  const tTranslations = useTranslations("AdminTranslations");
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [detail, setDetail] = useState<ProductResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ProductResponse | null>(null);
  const [translationRow, setTranslationRow] = useState<ProductResponse | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [regions, setRegions] = useState<RegionResponse[]>([]);
  const [gpuModels, setGpuModels] = useState<GpuModelResponse[]>([]);

  const loader = useCallback(async (params: AdminCatalogQuery) => (await getAdminProducts(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [regRes, gpuRes] = await Promise.all([
          getAdminRegions({ pageSize: 1000 }),
          getAdminGpuModels({ pageSize: 1000 }),
        ]);
        setRegions(regRes.data.records);
        setGpuModels(gpuRes.data.records);
      } catch (err) {
        console.error("Failed to fetch catalogs", err);
      }
    };
    fetchCatalogs();
  }, []);

  const buildQuery = (nextFilters: ProductFilters): AdminCatalogQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    product_code: nextFilters.productCode || undefined,
    status: nextFilters.status?.trim() ? Number(nextFilters.status) : undefined,
    region_id: nextFilters.regionId ? Number(nextFilters.regionId) : undefined,
    gpu_model_id: nextFilters.gpuModelId ? Number(nextFilters.gpuModelId) : undefined,
  });

  const openDetail = async (productCode: string) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminProductDetail(productCode);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const openEdit = (row: ProductResponse) => {
    setEditingRow(row);
    setFormOpen(true);
  };

  const toggle = async (row: ProductResponse, enabled: boolean) => {
    setActionError(null);
    try {
      if (enabled) {
        await enableAdminProduct(row.productCode);
      } else {
        await disableAdminProduct(row.productCode);
      }
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<ProductResponse>[] = [
    { key: "productCode", title: "产品编码", render: (row) => <CopyableSecret value={row.productCode} maskedValue={row.productCode} canReveal={false} /> },
    { key: "productName", title: "算力产品", render: (row) => formatEmpty(row.productName) },
    { key: "gpuModelName", title: "GPU 型号", render: (row) => formatEmpty(row.gpuModelName) },
    { key: "regionName", title: "地区", render: (row) => formatEmpty(row.regionName) },
    { key: "rentPrice", title: "租赁价格", render: (row) => <MoneyText value={row.rentPrice} /> },
    { key: "availableStock", title: "可用库存", render: (row) => `${formatNumber(row.availableStock)} / ${formatNumber(row.totalStock)}` },
    { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="font-medium" onClick={() => void openDetail(row.productCode)}>
            <Eye className="h-4 w-4" />
            详情
          </Button>
          <Button variant="ghost" size="sm" className="font-medium text-blue-500 hover:bg-blue-500/10" onClick={() => openEdit(row)}>
            <Edit2 className="h-4 w-4" />
            编辑
          </Button>
          <Button variant="ghost" size="sm" className="font-medium text-blue-500 hover:bg-blue-500/10" onClick={() => setTranslationRow(row)}>
            <Languages className="h-4 w-4" />
            {tTranslations("button")}
          </Button>
          {row.status === 0 ? (
            <ConfirmActionButton title="启用算力产品" description="启用后该产品会进入可租赁目录。" onConfirm={() => toggle(row, true)}>
              <Power className="h-4 w-4" />
              启用
            </ConfirmActionButton>
          ) : (
            <ConfirmActionButton title="禁用算力产品" description="禁用后用户将无法发起新的租赁。" onConfirm={() => toggle(row, false)}>
              <PowerOff className="h-4 w-4" />
              禁用
            </ConfirmActionButton>
          )}
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<ProductResponse>[] = [
      {
        title: "基础信息",
        fields: [
          { label: "产品编码", render: (detail) => <CopyableSecret value={detail.productCode} maskedValue={detail.productCode} canReveal={false} /> },
          { label: "产品名称", render: (detail) => detail.productName },
          { label: "机器编码", render: (detail) => detail.machineCode },
          { label: "机器别名", render: (detail) => detail.machineAlias },
          { label: "状态", render: (detail) => <StatusBadge status={detail.status} /> },
          { label: "可租赁至", render: (detail) => <DateTimeText value={detail.rentableUntil} /> },
        ],
      },
      {
        title: "GPU 规格",
        fields: [
          { label: "GPU 型号", render: (detail) => detail.gpuModelName },
          { label: "显存", render: (detail) => `${formatNumber(detail.gpuMemoryGb)} GB` },
          { label: "算力", render: (detail) => `${formatNumber(detail.gpuPowerTops)} TOPS` },
          { label: "CUDA", render: (detail) => detail.cudaVersion },
          { label: "驱动版本", render: (detail) => detail.driverVersion },
          { label: "缓存优化", render: (detail) => detail.hasCacheOptimization === 1 ? "支持" : "不支持" },
        ],
      },
      {
        title: "租赁与库存",
        fields: [
          { label: "地区", render: (detail) => detail.regionName },
          { label: "租赁价格", render: (detail) => <MoneyText value={detail.rentPrice} /> },
          { label: "总库存", render: (detail) => formatNumber(detail.totalStock) },
          { label: "可用库存", render: (detail) => formatNumber(detail.availableStock) },
          { label: "已租库存", render: (detail) => formatNumber(detail.rentedStock) },
          { label: "日 Token 产出", render: (detail) => formatNumber(detail.tokenOutputPerDay) },
        ],
      },
      {
        title: "整机规格",
        fields: [
          { label: "CPU", render: (detail) => detail.cpuModel },
          { label: "CPU 核数", render: (detail) => formatNumber(detail.cpuCores) },
          { label: "内存", render: (detail) => `${formatNumber(detail.memoryGb)} GB` },
          { label: "系统盘", render: (detail) => `${formatNumber(detail.systemDiskGb)} GB` },
          { label: "数据盘", render: (detail) => `${formatNumber(detail.dataDiskGb)} GB` },
          { label: "最大扩展盘", render: (detail) => `${formatNumber(detail.maxExpandDiskGb)} GB` },
        ],
      },
    ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CATALOG OPS"
        title="产品目录管理"
        description="管理 GPU 算力产品、机器规格、地区、价格和库存状态。"
        actions={
          <Button onClick={() => { setEditingRow(null); setFormOpen(true); }} className="bg-[#5e6ad2] font-semibold text-white hover:bg-[#7170ff]">
            <Plus className="mr-2 h-4 w-4" />
            新增产品
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
          <Label htmlFor="productCode">产品编码</Label>
          <Input id="productCode" placeholder="输入编码" value={filters.productCode} onChange={(event) => setFilters((current) => ({ ...current, productCode: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>启用状态</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[140px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value="1">已启用</SelectItem>
              <SelectItem value="0">已禁用</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="regionId">地区 ID</Label>
          <Input id="regionId" placeholder="输入 ID" value={filters.regionId} onChange={(event) => setFilters((current) => ({ ...current, regionId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gpuModelId">GPU 型号 ID</Label>
          <Input id="gpuModelId" placeholder="输入 ID" value={filters.gpuModelId} onChange={(event) => setFilters((current) => ({ ...current, gpuModelId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
        </div>
      </SearchPanel>
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.productCode} loading={loading} emptyText="暂无算力产品" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title="算力产品详情" subtitle={(data) => data.productCode} sections={detailSections} onClose={() => setDetailOpen(false)} />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="flex max-w-xl flex-col items-stretch">
          <DialogTitle className="sr-only">编辑算力产品</DialogTitle>
          <ProductForm
            initialData={editingRow}
            regions={regions}
            gpuModels={gpuModels}
            onSuccess={() => { setFormOpen(false); reload(); }}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(translationRow)} onOpenChange={(open) => !open && setTranslationRow(null)}>
        <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col items-stretch overflow-y-auto">
          <DialogTitle className="sr-only">{tTranslations("productTitle")}</DialogTitle>
          {translationRow ? (
            <AdminTranslationEditor
              title={tTranslations("productTitle")}
              resourceKey={translationRow.productCode}
              fields={[{ key: "productName", label: tTranslations("productName") }]}
              load={() => getAdminProductTranslations(translationRow.productCode)}
              save={(locale, values) => updateAdminProductTranslation(translationRow.productCode, { locale, productName: values.productName })}
              onSuccess={() => void reload()}
              onCancel={() => setTranslationRow(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
