"use client";

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
import type { AdminProductRequest, AiModelResponse, GpuModelResponse, ProductResponse, RegionResponse, RentalCycleRuleResponse } from "@/api/types";

// --- Schemas ---

const productSchema = z.object({
  productCode: z.string().min(1, "产品编码不能为空"),
  productName: z.string().min(1, "产品名称不能为空"),
  machineCode: z.string().min(1, "机器编码不能为空"),
  machineAlias: z.string().min(1, "机器别名不能为空"),
  regionId: z.coerce.number().min(1, "请选择地区"),
  gpuModelId: z.coerce.number().min(1, "请选择 GPU 型号"),
  gpuMemoryGb: z.coerce.number().min(0),
  gpuPowerTops: z.coerce.number().min(0),
  rentPrice: z.coerce.number().min(0),
  totalStock: z.coerce.number().min(0),
  availableStock: z.coerce.number().min(0),
  rentedStock: z.coerce.number().min(0),
  cpuModel: z.string().min(1, "CPU 型号不能为空"),
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

const aiModelSchema = z.object({
  modelCode: z.string().min(1, "模型编码不能为空"),
  modelName: z.string().min(1, "模型名称不能为空"),
  vendorName: z.string().min(1, "厂商名称不能为空"),
  logoUrl: z.string().url("请输入有效的图片 URL").or(z.string().length(0)),
  monthlyTokenConsumptionTrillion: z.coerce.number().min(0),
  tokenUnitPrice: z.coerce.number().min(0),
  deployTechFee: z.coerce.number().min(0),
  status: z.coerce.number(),
  sortNo: z.coerce.number().optional(),
});

const gpuModelSchema = z.object({
  modelCode: z.string().min(1, "型号编码不能为空"),
  modelName: z.string().min(1, "型号名称不能为空"),
  status: z.coerce.number(),
  sortNo: z.coerce.number().optional(),
});

const regionSchema = z.object({
  regionCode: z.string().min(1, "地区编码不能为空"),
  regionName: z.string().min(1, "地区名称不能为空"),
  status: z.coerce.number(),
  sortNo: z.coerce.number().optional(),
});

const cycleRuleSchema = z.object({
  cycleCode: z.string().min(1, "周期编码不能为空"),
  cycleName: z.string().min(1, "周期名称不能为空"),
  cycleDays: z.coerce.number().min(1),
  yieldMultiplier: z.coerce.number().min(0),
  earlyPenaltyRate: z.coerce.number().min(0).max(1),
  status: z.coerce.number(),
  sortNo: z.coerce.number().optional(),
});

// --- Components ---

interface BaseFormProps<T> {
  initialData?: T | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type ProductFormValues = z.input<typeof productSchema>;
type AiModelFormValues = z.infer<typeof aiModelSchema>;
type GpuModelFormValues = z.infer<typeof gpuModelSchema>;
type RegionFormValues = z.infer<typeof regionSchema>;
type CycleRuleFormValues = z.infer<typeof cycleRuleSchema>;

interface ProductFormProps extends BaseFormProps<ProductResponse> {
  regions: RegionResponse[];
  gpuModels: GpuModelResponse[];
}

export function ProductForm({ initialData, regions, gpuModels, onSuccess, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defaultRentableUntil] = useState(() => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString());

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      ...initialData,
      hasCacheOptimization: initialData.hasCacheOptimization === 1
    } : {
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
      rentableUntil: defaultRentableUntil,
      tokenOutputPerMinute: 0,
      tokenOutputPerDay: 0,
    },
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
        {error && <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium">{error}</div>}
        
        <div className="max-h-[60vh] overflow-y-auto px-1 space-y-8 custom-scrollbar">
          {/* 基础信息 */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <span className="h-3 w-1 rounded-full bg-primary"></span>
              基础信息
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="productCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>产品编码</FormLabel>
                  <FormControl><Input {...field} disabled={!!initialData} placeholder="P-GPU-001" className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="productName" render={({ field }) => (
                <FormItem>
                  <FormLabel>产品名称</FormLabel>
                  <FormControl><Input {...field} placeholder="RTX 4090 高级算力" className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="machineCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>机器编码</FormLabel>
                  <FormControl><Input {...field} placeholder="M-001" className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="machineAlias" render={({ field }) => (
                <FormItem>
                  <FormLabel>机器别名</FormLabel>
                  <FormControl><Input {...field} placeholder="Alpha-1" className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="regionId" render={({ field }) => (
                <FormItem>
                  <FormLabel>所属地区</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value ? String(field.value) : undefined}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="选择地区" />
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
                  <FormLabel>租赁价格 (USDT/H)</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </section>

          {/* GPU 与 硬件规格 */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <span className="h-3 w-1 rounded-full bg-primary"></span>
              硬件规格
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="gpuModelId" render={({ field }) => (
                <FormItem>
                  <FormLabel>GPU 型号</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value ? String(field.value) : undefined}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="选择 GPU" />
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
                  <FormLabel>显存 (GB)</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="gpuPowerTops" render={({ field }) => (
                <FormItem>
                  <FormLabel>算力 (TOPS)</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="cpuModel" render={({ field }) => (
                <FormItem>
                  <FormLabel>CPU 型号</FormLabel>
                  <FormControl><Input {...field} placeholder="Intel Xeon Gold" className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="cpuCores" render={({ field }) => (
                <FormItem>
                  <FormLabel>CPU 核心数</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="memoryGb" render={({ field }) => (
                <FormItem>
                  <FormLabel>内存 (GB)</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </section>

          {/* 存储与软件 */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <span className="h-3 w-1 rounded-full bg-primary"></span>
              存储与环境
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="systemDiskGb" render={({ field }) => (
                <FormItem>
                  <FormLabel>系统盘 (GB)</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="dataDiskGb" render={({ field }) => (
                <FormItem>
                  <FormLabel>数据盘 (GB)</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="driverVersion" render={({ field }) => (
                <FormItem>
                  <FormLabel>驱动版本</FormLabel>
                  <FormControl><Input {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="cudaVersion" render={({ field }) => (
                <FormItem>
                  <FormLabel>CUDA 版本</FormLabel>
                  <FormControl><Input {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="hasCacheOptimization" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                  <div className="space-y-0.5">
                    <FormLabel>缓存优化</FormLabel>
                    <FormDescription className="text-xs">启用后可提升大模型加载速度</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>状态</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">启用</SelectItem>
                      <SelectItem value="0">禁用</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </section>

          {/* 库存与能力 */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <span className="h-3 w-1 rounded-full bg-primary"></span>
              库存与处理能力
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="totalStock" render={({ field }) => (
                <FormItem>
                  <FormLabel>总库存</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="availableStock" render={({ field }) => (
                <FormItem>
                  <FormLabel>可用库存</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="tokenOutputPerMinute" render={({ field }) => (
                <FormItem>
                  <FormLabel>每分钟 Token 输出</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="tokenOutputPerDay" render={({ field }) => (
                <FormItem>
                  <FormLabel>每日 Token 输出</FormLabel>
                  <FormControl><Input type="number" {...field} className="bg-background" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            取消
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="min-w-[120px] font-semibold"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "更新产品" : "创建产品"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function AiModelForm({ initialData, onSuccess, onCancel }: BaseFormProps<AiModelResponse>) {
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
        {error && <div className="mb-4 text-sm font-medium text-destructive">{error}</div>}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 w-full">
          <FormField control={form.control} name="modelCode" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>模型编码</FormLabel>
              <FormControl><Input {...field} disabled={!!initialData} placeholder="gpt-4o" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="modelName" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>模型名称</FormLabel>
              <FormControl><Input {...field} placeholder="GPT-4 Omni" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="vendorName" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>厂商</FormLabel>
              <FormControl><Input {...field} placeholder="OpenAI" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="tokenUnitPrice" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Token 单价 (USDT/M)</FormLabel>
              <FormControl><Input type="number" step="0.0001" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="logoUrl" render={({ field }) => (
            <FormItem className="">
              <FormLabel>Logo URL</FormLabel>
              <FormControl><Input {...field} placeholder="https://example.com/logo.png" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="flex justify-center gap-3 pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={onCancel} >取消</Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存模型
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function GpuModelForm({ initialData, onSuccess, onCancel }: BaseFormProps<GpuModelResponse>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<GpuModelFormValues>({
    resolver: zodResolver(gpuModelSchema),
    defaultValues: initialData || { modelCode: "", modelName: "", status: 1, sortNo: 0 },
  });

  const onSubmit = async (values: GpuModelFormValues) => {
    setLoading(true);
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
        {error && <div className="mb-4 text-sm font-medium text-destructive">{error}</div>}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 w-full">
          <FormField control={form.control} name="modelCode" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>型号编码</FormLabel>
              <FormControl><Input {...field} placeholder="H100-NVLINK" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="modelName" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>型号名称</FormLabel>
              <FormControl><Input {...field} placeholder="NVIDIA H100 (80GB)" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="flex justify-center gap-3 pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={onCancel} >取消</Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存型号
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function RegionForm({ initialData, onSuccess, onCancel }: BaseFormProps<RegionResponse>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegionFormValues>({
    resolver: zodResolver(regionSchema),
    defaultValues: initialData || { regionCode: "", regionName: "", status: 1, sortNo: 0 },
  });

  const onSubmit = async (values: RegionFormValues) => {
    setLoading(true);
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
        {error && <div className="mb-4 text-sm font-medium text-destructive">{error}</div>}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 w-full">
          <FormField control={form.control} name="regionCode" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>地区编码</FormLabel>
              <FormControl><Input {...field} placeholder="us-east-1" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="regionName" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>地区名称</FormLabel>
              <FormControl><Input {...field} placeholder="弗吉尼亚 (美国东部)" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="flex justify-center gap-3 pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={onCancel} >取消</Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存地区
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function CycleRuleForm({ initialData, onSuccess, onCancel }: BaseFormProps<RentalCycleRuleResponse>) {
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
        {error && <div className="mb-4 text-sm font-medium text-destructive">{error}</div>}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 w-full">
          <FormField control={form.control} name="cycleCode" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>周期编码</FormLabel>
              <FormControl><Input {...field} disabled={!!initialData} placeholder="daily-01" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="cycleName" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>周期名称</FormLabel>
              <FormControl><Input {...field} placeholder="按日结算 (低费率)" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="cycleDays" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>天数</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="yieldMultiplier" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>收益倍率</FormLabel>
              <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="flex justify-center gap-3 pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={onCancel} >取消</Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存规则
          </Button>
        </div>
      </form>
    </Form>
  );
}
