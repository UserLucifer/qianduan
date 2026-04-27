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
  hasCacheOptimization: z.boolean().transform(v => v ? 1 : 0),
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

export function ProductForm({ initialData, onSuccess, onCancel }: BaseFormProps<any>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
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
      gpuMemoryGb: 0,
      gpuPowerTops: 0,
      rentPrice: 0,
      totalStock: 0,
      availableStock: 0,
      rentedStock: 0,
      cpuModel: "",
      cpuCores: 1,
      memoryGb: 1,
      systemDiskGb: 1,
      dataDiskGb: 1,
      maxExpandDiskGb: 0,
      driverVersion: "",
      cudaVersion: "",
      hasCacheOptimization: false,
      status: 1,
      rentableUntil: new Date().toISOString(),
      tokenOutputPerMinute: 0,
      tokenOutputPerDay: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    setLoading(true);
    setError(null);
    try {
      const { createAdminProduct, updateAdminProduct } = await import("@/api/admin");
      if (initialData) {
        await updateAdminProduct(initialData.productCode, values as any);
      } else {
        await createAdminProduct(values as any);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <div className="text-sm font-medium text-destructive">{error}</div>}
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="productCode" render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>产品编码</FormLabel>
              <FormControl><Input {...field} disabled={!!initialData} placeholder="P-GPU-001" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="productName" render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>产品名称</FormLabel>
              <FormControl><Input {...field} placeholder="RTX 4090 高级算力" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="machineCode" render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>机器编码</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="machineAlias" render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>机器别名</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="rentPrice" render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>租赁价格 (USDT/H)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="status" render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>状态</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="选择状态" /></SelectTrigger>
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
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>取消</Button>
          <Button type="submit" className="bg-[#5e6ad2] text-white" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "更新" : "创建"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function AiModelForm({ initialData, onSuccess, onCancel }: BaseFormProps<any>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
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

  const onSubmit = async (values: z.infer<typeof aiModelSchema>) => {
    setLoading(true);
    try {
      const { createAdminAiModel, updateAdminAiModel } = await import("@/api/admin");
      if (initialData) {
        await updateAdminAiModel(initialData.modelCode, values as any);
      } else {
        await createAdminAiModel(values as any);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <div className="text-sm font-medium text-destructive">{error}</div>}
        <FormField control={form.control} name="modelCode" render={({ field }: { field: any }) => (
          <FormItem>
            <FormLabel>模型编码</FormLabel>
            <FormControl><Input {...field} disabled={!!initialData} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="modelName" render={({ field }: { field: any }) => (
          <FormItem>
            <FormLabel>模型名称</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="vendorName" render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>厂商</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="tokenUnitPrice" render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Token 单价</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
          <Button type="submit" className="bg-[#5e6ad2] text-white" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function GpuModelForm({ initialData, onSuccess, onCancel }: BaseFormProps<any>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(gpuModelSchema),
    defaultValues: initialData || { modelCode: "", modelName: "", status: 1, sortNo: 0 },
  });

  const onSubmit = async (values: z.infer<typeof gpuModelSchema>) => {
    setLoading(true);
    try {
      const { createAdminGpuModel, updateAdminGpuModel } = await import("@/api/admin");
      if (initialData) {
        await updateAdminGpuModel(initialData.id, values as any);
      } else {
        await createAdminGpuModel(values as any);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <div className="text-sm font-medium text-destructive">{error}</div>}
        <FormField control={form.control} name="modelCode" render={({ field }: { field: any }) => (
          <FormItem>
            <FormLabel>型号编码</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="modelName" render={({ field }: { field: any }) => (
          <FormItem>
            <FormLabel>型号名称</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
          <Button type="submit" className="bg-[#5e6ad2] text-white" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function RegionForm({ initialData, onSuccess, onCancel }: BaseFormProps<any>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(regionSchema),
    defaultValues: initialData || { regionCode: "", regionName: "", status: 1, sortNo: 0 },
  });

  const onSubmit = async (values: z.infer<typeof regionSchema>) => {
    setLoading(true);
    try {
      const { createAdminRegion, updateAdminRegion } = await import("@/api/admin");
      if (initialData) {
        await updateAdminRegion(initialData.id, values as any);
      } else {
        await createAdminRegion(values as any);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <div className="text-sm font-medium text-destructive">{error}</div>}
        <FormField control={form.control} name="regionCode" render={({ field }: { field: any }) => (
          <FormItem>
            <FormLabel>地区编码</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="regionName" render={({ field }: { field: any }) => (
          <FormItem>
            <FormLabel>地区名称</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
          <Button type="submit" className="bg-[#5e6ad2] text-white" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function CycleRuleForm({ initialData, onSuccess, onCancel }: BaseFormProps<any>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
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

  const onSubmit = async (values: z.infer<typeof cycleRuleSchema>) => {
    setLoading(true);
    try {
      const { createAdminCycleRule, updateAdminCycleRule } = await import("@/api/admin");
      if (initialData) {
        await updateAdminCycleRule(initialData.cycleCode, values as any);
      } else {
        await createAdminCycleRule(values as any);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <div className="text-sm font-medium text-destructive">{error}</div>}
        <FormField control={form.control} name="cycleCode" render={({ field }: { field: any }) => (
          <FormItem>
            <FormLabel>周期编码</FormLabel>
            <FormControl><Input {...field} disabled={!!initialData} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="cycleName" render={({ field }: { field: any }) => (
          <FormItem>
            <FormLabel>周期名称</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="cycleDays" render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>天数</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="yieldMultiplier" render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>收益倍率</FormLabel>
              <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
          <Button type="submit" className="bg-[#5e6ad2] text-white" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存
          </Button>
        </div>
      </form>
    </Form>
  );
}
