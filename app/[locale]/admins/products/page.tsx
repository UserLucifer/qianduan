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
  const t = useTranslations("AdminPages.products");
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
    { key: "productCode", title: t("productCode"), render: (row) => <CopyableSecret value={row.productCode} maskedValue={row.productCode} canReveal={false} /> },
    { key: "productName", title: t("computeProduct"), render: (row) => formatEmpty(row.productName) },
    { key: "gpuModelName", title: t("gpuModel"), render: (row) => formatEmpty(row.gpuModelName) },
    { key: "regionName", title: t("region"), render: (row) => formatEmpty(row.regionName) },
    { key: "rentPrice", title: t("rentalPrice"), render: (row) => <MoneyText value={row.rentPrice} /> },
    { key: "availableStock", title: t("availableInventory"), render: (row) => `${formatNumber(row.availableStock)} / ${formatNumber(row.totalStock)}` },
    { key: "status", title: t("status"), render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="font-medium" onClick={() => void openDetail(row.productCode)}>
            <Eye className="h-4 w-4" />
            {t("details")}</Button>
          <Button variant="ghost" size="sm" className="font-medium text-blue-500 hover:bg-blue-500/10" onClick={() => openEdit(row)}>
            <Edit2 className="h-4 w-4" />
            {t("edit")}</Button>
          <Button variant="ghost" size="sm" className="font-medium text-blue-500 hover:bg-blue-500/10" onClick={() => setTranslationRow(row)}>
            <Languages className="h-4 w-4" />
            {tTranslations("button")}
          </Button>
          {row.status === 0 ? (
            <ConfirmActionButton title={t("enableComputeProduct")} description={t("afterEnablingThisProductAppearsInTheRentalCatalog")} onConfirm={() => toggle(row, true)}>
              <Power className="h-4 w-4" />
              {t("enable")}</ConfirmActionButton>
          ) : (
            <ConfirmActionButton title={t("disableComputeProduct")} description={t("afterDisablingUsersCannotStartNewRentalsForThisProduct")} onConfirm={() => toggle(row, false)}>
              <PowerOff className="h-4 w-4" />
              {t("disabled")}</ConfirmActionButton>
          )}
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<ProductResponse>[] = [
      {
        title: t("basicInformation"),
        fields: [
          { label: t("productCode"), render: (detail) => <CopyableSecret value={detail.productCode} maskedValue={detail.productCode} canReveal={false} /> },
          { label: t("productName"), render: (detail) => detail.productName },
          { label: t("machineCode"), render: (detail) => detail.machineCode },
          { label: t("machineAlias"), render: (detail) => detail.machineAlias },
          { label: t("status"), render: (detail) => <StatusBadge status={detail.status} /> },
          { label: t("rentableUntil"), render: (detail) => <DateTimeText value={detail.rentableUntil} /> },
        ],
      },
      {
        title: t("gpuSpecs"),
        fields: [
          { label: t("gpuModel"), render: (detail) => detail.gpuModelName },
          { label: t("vRAM"), render: (detail) => `${formatNumber(detail.gpuMemoryGb)} GB` },
          { label: t("compute"), render: (detail) => `${formatNumber(detail.gpuPowerTops)} TOPS` },
          { label: "CUDA", render: (detail) => detail.cudaVersion },
          { label: t("driverVersion"), render: (detail) => detail.driverVersion },
          { label: t("cacheOptimization"), render: (detail) => detail.hasCacheOptimization === 1 ? t("supported") : t("notSupported") },
        ],
      },
      {
        title: t("rentalAndInventory"),
        fields: [
          { label: t("region"), render: (detail) => detail.regionName },
          { label: t("rentalPrice"), render: (detail) => <MoneyText value={detail.rentPrice} /> },
          { label: t("totalInventory"), render: (detail) => formatNumber(detail.totalStock) },
          { label: t("availableInventory"), render: (detail) => formatNumber(detail.availableStock) },
          { label: t("rentedInventory"), render: (detail) => formatNumber(detail.rentedStock) },
          { label: t("dailyTokenOutput"), render: (detail) => formatNumber(detail.tokenOutputPerDay) },
        ],
      },
      {
        title: t("machineSpecs"),
        fields: [
          { label: "CPU", render: (detail) => detail.cpuModel },
          { label: t("cpuCores"), render: (detail) => formatNumber(detail.cpuCores) },
          { label: t("memory"), render: (detail) => `${formatNumber(detail.memoryGb)} GB` },
          { label: t("systemDisk"), render: (detail) => `${formatNumber(detail.systemDiskGb)} GB` },
          { label: t("dataDisk"), render: (detail) => `${formatNumber(detail.dataDiskGb)} GB` },
          { label: t("maxExpansionDisk"), render: (detail) => `${formatNumber(detail.maxExpandDiskGb)} GB` },
        ],
      },
    ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CATALOG OPS"
        title={t("productCatalogManagement")}
        description={t("manageGpuComputeProductsMachineSpecsRegionsPricingAndInventoryStatus")}
        actions={
          <Button onClick={() => { setEditingRow(null); setFormOpen(true); }} className="bg-[#5e6ad2] font-semibold text-white hover:bg-[#7170ff]">
            <Plus className="mr-2 h-4 w-4" />
            {t("newProduct")}</Button>
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
          <Label htmlFor="productCode">{t("productCode")}</Label>
          <Input id="productCode" placeholder={t("enterCode")} value={filters.productCode} onChange={(event) => setFilters((current) => ({ ...current, productCode: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>{t("enabledStatus")}</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[140px] bg-background text-foreground">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allStatuses")}</SelectItem>
              <SelectItem value="1">{t("enabled")}</SelectItem>
              <SelectItem value="0">{t("disabled2")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="regionId">{t("regionID")}</Label>
          <Input id="regionId" placeholder={t("enterID")} value={filters.regionId} onChange={(event) => setFilters((current) => ({ ...current, regionId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gpuModelId">{t("gpuModelID")}</Label>
          <Input id="gpuModelId" placeholder={t("enterID")} value={filters.gpuModelId} onChange={(event) => setFilters((current) => ({ ...current, gpuModelId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
        </div>
      </SearchPanel>
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.productCode} loading={loading} emptyText={t("noComputeProductsYet")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title={t("computeProductDetails")} subtitle={(data) => data.productCode} sections={detailSections} onClose={() => setDetailOpen(false)} />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="flex max-w-xl flex-col items-stretch">
          <DialogTitle className="sr-only">{t("editComputeProduct")}</DialogTitle>
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
