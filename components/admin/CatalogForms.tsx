"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import type { AdminProductRequest, AiModelResponse, GpuModelResponse, ProductResponse, RegionResponse, RentalCycleRuleResponse } from "@/api/types";

// --- Schemas ---

const LOCAL_LOGO_PATH_PATTERN = /^\/images\/logo\/[A-Za-z0-9@._-]+\.svg$/;

function isValidLogoPath(value: string) {
  if (!value) {
    return true;
  }
  if (LOCAL_LOGO_PATH_PATTERN.test(value)) {
    return true;
  }
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function createProductSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
  productCode: z.string().min(1, t("productCodeRequired")),
  productName: z.string().min(1, t("productNameRequired")),
  machineCode: z.string().min(1, t("machineCodeRequired")),
  machineAlias: z.string().min(1, t("machineAliasRequired")),
  regionId: z.coerce.number().min(1, t("regionRequired")),
  gpuModelId: z.coerce.number().min(1, t("gpuModelRequired")),
  gpuMemoryGb: z.coerce.number().min(0),
  gpuPowerTops: z.coerce.number().min(0),
  rentPrice: z.coerce.number().min(0),
  totalStock: z.coerce.number().min(0),
  availableStock: z.coerce.number().min(0),
  rentedStock: z.coerce.number().min(0),
  cpuModel: z.string().min(1, t("cpuModelRequired")),
  cpuCores: z.coerce.number().min(1),
  memoryGb: z.coerce.number().min(1),
  systemDiskGb: z.coerce.number().min(1),
  dataDiskGb: z.coerce.number().min(1),
  maxExpandDiskGb: z.coerce.number().min(0),
  driverVersion: z.string(),
  cudaVersion: z.string(),
  hasCacheOptimization: z.boolean(),
  status: z.coerce.number(),
  rentableUntil: z.string(),
  tokenOutputPerMinute: z.coerce.number().min(0),
  tokenOutputPerDay: z.coerce.number().min(0),
  });
}

function createAiModelSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
  modelCode: z.string().min(1, t("modelCodeRequired")),
  modelName: z.string().min(1, t("modelNameRequired")),
  vendorName: z.string().min(1, t("vendorNameRequired")),
  logoUrl: z.string().trim().refine(isValidLogoPath, t("validImageUrlRequired")),
  monthlyTokenConsumptionTrillion: z.coerce.number().min(0),
  tokenUnitPrice: z.coerce.number().min(0),
  deployTechFee: z.coerce.number().min(0),
  status: z.coerce.number(),
  sortNo: z.coerce.number().optional(),
  });
}

function createGpuModelSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
  modelCode: z.string().min(1, t("gpuModelCodeRequired")),
  modelName: z.string().min(1, t("gpuModelNameRequired")),
  status: z.coerce.number(),
  sortNo: z.coerce.number().optional(),
  });
}

function createRegionSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
  regionCode: z.string().min(1, t("regionCodeRequired")),
  regionName: z.string().min(1, t("regionNameRequired")),
  status: z.coerce.number(),
  sortNo: z.coerce.number().optional(),
  });
}

function createCycleRuleSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
  cycleCode: z.string().min(1, t("cycleCodeRequired")),
  cycleName: z.string().min(1, t("cycleNameRequired")),
  cycleDays: z.coerce.number().min(1),
  yieldMultiplier: z.coerce.number().min(0),
  earlyPenaltyRate: z.coerce.number().min(0).max(1),
  status: z.coerce.number(),
  sortNo: z.coerce.number().optional(),
  });
}

// --- Components ---

interface BaseFormProps<T> {
  initialData?: T | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type ProductFormValues = z.input<ReturnType<typeof createProductSchema>>;
type AiModelFormValues = z.infer<ReturnType<typeof createAiModelSchema>>;
type GpuModelFormValues = z.infer<ReturnType<typeof createGpuModelSchema>>;
type RegionFormValues = z.infer<ReturnType<typeof createRegionSchema>>;
type CycleRuleFormValues = z.infer<ReturnType<typeof createCycleRuleSchema>>;
type ProductFormInitialData = ProductResponse & {
  regionId?: number | null;
  gpuModelId?: number | null;
};

const productFormDefaults = (rentableUntil: string): ProductFormValues => ({
  productCode: "",
  productName: "",
  machineCode: "",
  machineAlias: "",
  regionId: 0,
  gpuModelId: 0,
  gpuMemoryGb: 24,
  gpuPowerTops: 0,
  rentPrice: 0,
  totalStock: 1,
  availableStock: 1,
  rentedStock: 0,
  cpuModel: "",
  cpuCores: 8,
  memoryGb: 32,
  systemDiskGb: 50,
  dataDiskGb: 100,
  maxExpandDiskGb: 0,
  driverVersion: "535.104.05",
  cudaVersion: "12.2",
  hasCacheOptimization: false,
  status: 1,
  rentableUntil,
  tokenOutputPerMinute: 0,
  tokenOutputPerDay: 0,
});

function toProductFormValues(initialData: ProductResponse | null | undefined, rentableUntil: string): ProductFormValues {
  const defaults = productFormDefaults(rentableUntil);
  if (!initialData) return defaults;
  const product = initialData as ProductFormInitialData;

  return {
    productCode: product.productCode ?? defaults.productCode,
    productName: product.productName ?? defaults.productName,
    machineCode: product.machineCode ?? defaults.machineCode,
    machineAlias: product.machineAlias ?? defaults.machineAlias,
    regionId: product.regionId ?? defaults.regionId,
    gpuModelId: product.gpuModelId ?? defaults.gpuModelId,
    gpuMemoryGb: product.gpuMemoryGb ?? defaults.gpuMemoryGb,
    gpuPowerTops: product.gpuPowerTops ?? defaults.gpuPowerTops,
    rentPrice: product.rentPrice ?? defaults.rentPrice,
    totalStock: product.totalStock ?? defaults.totalStock,
    availableStock: product.availableStock ?? defaults.availableStock,
    rentedStock: product.rentedStock ?? defaults.rentedStock,
    cpuModel: product.cpuModel ?? defaults.cpuModel,
    cpuCores: product.cpuCores ?? defaults.cpuCores,
    memoryGb: product.memoryGb ?? defaults.memoryGb,
    systemDiskGb: product.systemDiskGb ?? defaults.systemDiskGb,
    dataDiskGb: product.dataDiskGb ?? defaults.dataDiskGb,
    maxExpandDiskGb: product.maxExpandDiskGb ?? defaults.maxExpandDiskGb,
    driverVersion: product.driverVersion ?? defaults.driverVersion,
    cudaVersion: product.cudaVersion ?? defaults.cudaVersion,
    hasCacheOptimization: product.hasCacheOptimization === 1,
    status: product.status ?? defaults.status,
    rentableUntil: product.rentableUntil ?? defaults.rentableUntil,
    tokenOutputPerMinute: product.tokenOutputPerMinute ?? defaults.tokenOutputPerMinute,
    tokenOutputPerDay: product.tokenOutputPerDay ?? defaults.tokenOutputPerDay,
  };
}

interface ProductFormProps extends BaseFormProps<ProductResponse> {
  regions: RegionResponse[];
  gpuModels: GpuModelResponse[];
}

export function ProductForm({ initialData, regions, gpuModels, onSuccess, onCancel }: ProductFormProps) {
  const t = useTranslations("AdminComponentForms.catalogForms");
  const productSchema = createProductSchema(t);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defaultRentableUntil] = useState(() => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString());

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: toProductFormValues(initialData, defaultRentableUntil),
  });

  const onSubmit = async (values: ProductFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const { createAdminProduct, updateAdminProduct } = await import("@/api/admin");
      const payload: AdminProductRequest = {
        ...values,
        hasCacheOptimization: values.hasCacheOptimization ? 1 : 0,
      };
      if (initialData) {
        await updateAdminProduct(initialData.productCode, payload);
      } else {
        await createAdminProduct(payload);
      }
      onSuccess();
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ErrorAlert message={error} />
        
        <div className="max-h-[60vh] overflow-y-auto px-1 space-y-8 custom-scrollbar">
          {/* Basic information */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <span className="h-3 w-1 rounded-full bg-primary"></span>
              {t("basicInformation")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="productCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("productCode")}</FormLabel>
                  <FormControl><Input {...field} disabled={!!initialData} placeholder="P-GPU-001" className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="productName" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("productName")}</FormLabel>
                  <FormControl><Input {...field} placeholder={t("productNamePlaceholder")} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="machineCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("machineCode")}</FormLabel>
                  <FormControl><Input {...field} placeholder="M-001" className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="machineAlias" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("machineAlias")}</FormLabel>
                  <FormControl><Input {...field} placeholder="Alpha-1" className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="regionId" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("region")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value ? String(field.value) : undefined}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={t("selectRegion")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regions.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.regionName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="rentPrice" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("rentalPrice")}</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </section>

          {/* GPU and hardware specs */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <span className="h-3 w-1 rounded-full bg-primary"></span>
              {t("hardwareSpecs")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="gpuModelId" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("gpuModel")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value ? String(field.value) : undefined}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={t("selectGpu")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gpuModels.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.modelName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="gpuMemoryGb" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("gpuMemory")}</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="gpuPowerTops" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("gpuPower")}</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="cpuModel" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("cpuModel")}</FormLabel>
                  <FormControl><Input {...field} placeholder="Intel Xeon Gold" className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="cpuCores" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("cpuCores")}</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="memoryGb" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("memory")}</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </section>

          {/* Storage and software */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <span className="h-3 w-1 rounded-full bg-primary"></span>
              {t("storageEnvironment")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="systemDiskGb" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("systemDisk")}</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="dataDiskGb" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dataDisk")}</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="driverVersion" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("driverVersion")}</FormLabel>
                  <FormControl><Input {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="cudaVersion" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("cudaVersion")}</FormLabel>
                  <FormControl><Input {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="hasCacheOptimization" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                  <div className="space-y-0.5">
                    <FormLabel>{t("cacheOptimization")}</FormLabel>
                    <FormDescription className="text-xs">{t("cacheOptimizationDescription")}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("status")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={t("selectStatus")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">{t("enabled")}</SelectItem>
                      <SelectItem value="0">{t("disabled")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </section>

          {/* Inventory and throughput */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <span className="h-3 w-1 rounded-full bg-primary"></span>
              {t("inventoryThroughput")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="totalStock" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("totalStock")}</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="availableStock" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("availableStock")}</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="tokenOutputPerMinute" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("tokenOutputPerMinute")}</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="tokenOutputPerDay" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("tokenOutputPerDay")}</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="min-w-[120px] font-semibold"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? t("updateProduct") : t("createProduct")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function AiModelForm({ initialData, onSuccess, onCancel }: BaseFormProps<AiModelResponse>) {
  const t = useTranslations("AdminComponentForms.catalogForms");
  const aiModelSchema = createAiModelSchema(t);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AiModelFormValues>({
    resolver: zodResolver(aiModelSchema),
    defaultValues: initialData || {
      modelCode: "",
      modelName: "",
      vendorName: "",
      logoUrl: "",
      monthlyTokenConsumptionTrillion: 0,
      tokenUnitPrice: 0,
      deployTechFee: 0,
      status: 1,
    },
  });

  const onSubmit = async (values: AiModelFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const { createAdminAiModel, updateAdminAiModel } = await import("@/api/admin");
      if (initialData) {
        await updateAdminAiModel(initialData.modelCode, values);
      } else {
        await createAdminAiModel(values);
      }
      onSuccess();
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ErrorAlert message={error} className="mb-4" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 w-full">
          <FormField control={form.control} name="modelCode" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("modelCode")}</FormLabel>
              <FormControl><Input {...field} disabled={!!initialData} placeholder="gpt-4o" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="modelName" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("modelName")}</FormLabel>
              <FormControl><Input {...field} placeholder="GPT-4 Omni" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="vendorName" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("vendor")}</FormLabel>
              <FormControl><Input {...field} placeholder="OpenAI" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="tokenUnitPrice" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("tokenUnitPrice")}</FormLabel>
              <FormControl><Input type="number" step="0.0001" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="logoUrl" render={({ field }) => (
            <FormItem className="">
              <FormLabel>Logo URL</FormLabel>
              <FormControl><Input {...field} placeholder="/images/logo/openai@logotyp.us.svg" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="flex justify-center gap-3 pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={onCancel} >{t("cancel")}</Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("saveModel")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function GpuModelForm({ initialData, onSuccess, onCancel }: BaseFormProps<GpuModelResponse>) {
  const t = useTranslations("AdminComponentForms.catalogForms");
  const gpuModelSchema = createGpuModelSchema(t);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<GpuModelFormValues>({
    resolver: zodResolver(gpuModelSchema),
    defaultValues: initialData || { modelCode: "", modelName: "", status: 1, sortNo: 0 },
  });

  const onSubmit = async (values: GpuModelFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const { createAdminGpuModel, updateAdminGpuModel } = await import("@/api/admin");
      if (initialData) {
        await updateAdminGpuModel(initialData.id, values);
      } else {
        await createAdminGpuModel(values);
      }
      onSuccess();
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ErrorAlert message={error} className="mb-4" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 w-full">
          <FormField control={form.control} name="modelCode" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("gpuModelCode")}</FormLabel>
              <FormControl><Input {...field} placeholder="H100-NVLINK" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="modelName" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("gpuModelName")}</FormLabel>
              <FormControl><Input {...field} placeholder="NVIDIA H100 (80GB)" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="flex justify-center gap-3 pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={onCancel} >{t("cancel")}</Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("saveGpuModel")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function RegionForm({ initialData, onSuccess, onCancel }: BaseFormProps<RegionResponse>) {
  const t = useTranslations("AdminComponentForms.catalogForms");
  const regionSchema = createRegionSchema(t);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegionFormValues>({
    resolver: zodResolver(regionSchema),
    defaultValues: initialData || { regionCode: "", regionName: "", status: 1, sortNo: 0 },
  });

  const onSubmit = async (values: RegionFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const { createAdminRegion, updateAdminRegion } = await import("@/api/admin");
      if (initialData) {
        await updateAdminRegion(initialData.id, values);
      } else {
        await createAdminRegion(values);
      }
      onSuccess();
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ErrorAlert message={error} className="mb-4" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 w-full">
          <FormField control={form.control} name="regionCode" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("regionCode")}</FormLabel>
              <FormControl><Input {...field} placeholder="us-east-1" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="regionName" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("regionName")}</FormLabel>
              <FormControl><Input {...field} placeholder={t("regionNamePlaceholder")} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="flex justify-center gap-3 pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={onCancel} >{t("cancel")}</Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("saveRegion")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function CycleRuleForm({ initialData, onSuccess, onCancel }: BaseFormProps<RentalCycleRuleResponse>) {
  const t = useTranslations("AdminComponentForms.catalogForms");
  const cycleRuleSchema = createCycleRuleSchema(t);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CycleRuleFormValues>({
    resolver: zodResolver(cycleRuleSchema),
    defaultValues: initialData || {
      cycleCode: "",
      cycleName: "",
      cycleDays: 1,
      yieldMultiplier: 1,
      earlyPenaltyRate: 0.1,
      status: 1,
      sortNo: 0
    },
  });

  const onSubmit = async (values: CycleRuleFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const { createAdminCycleRule, updateAdminCycleRule } = await import("@/api/admin");
      if (initialData) {
        await updateAdminCycleRule(initialData.cycleCode, values);
      } else {
        await createAdminCycleRule(values);
      }
      onSuccess();
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ErrorAlert message={error} className="mb-4" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 w-full">
          <FormField control={form.control} name="cycleCode" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("cycleCode")}</FormLabel>
              <FormControl><Input {...field} disabled={!!initialData} placeholder="daily-01" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="cycleName" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("cycleName")}</FormLabel>
              <FormControl><Input {...field} placeholder={t("cycleNamePlaceholder")} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="cycleDays" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("days")}</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="yieldMultiplier" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("yieldMultiplier")}</FormLabel>
              <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="flex justify-center gap-3 pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={onCancel} >{t("cancel")}</Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("saveRule")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
