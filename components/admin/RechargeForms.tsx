"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAdminRechargeChannel, updateAdminRechargeChannel } from "@/api/admin";
import type { AdminRechargeChannelResponse, CreateRechargeChannelRequest } from "@/api/types";
import { useState } from "react";
import { toErrorMessage } from "@/lib/format";

const channelSchema = z.object({
  channelCode: z.string().min(1, "请输入渠道编码").max(64),
  channelName: z.string().min(1, "请输入渠道名称").max(64),
  network: z.string().max(64).optional(),
  displayUrl: z.string().max(255).optional(),
  accountName: z.string().max(128).optional(),
  accountNo: z.string().max(255).optional(),
  minAmount: z.coerce.number().min(0),
  maxAmount: z.coerce.number().min(0),
  feeRate: z.coerce.number().min(0, "请输入手续费率"),
  sortNo: z.number().int().default(0),
  status: z.number().int().min(0).max(1).default(1),
});

type ChannelFormValues = z.infer<typeof channelSchema>;

interface RechargeChannelFormProps {
  initialData?: AdminRechargeChannelResponse | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RechargeChannelForm({ initialData, onSuccess, onCancel }: RechargeChannelFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ChannelFormValues>({
    resolver: zodResolver(channelSchema),
    defaultValues: initialData
      ? {
          channelCode: initialData.channelCode,
          channelName: initialData.channelName,
          network: initialData.network || "",
          displayUrl: initialData.displayUrl || "",
          accountName: initialData.accountName || "",
          accountNo: initialData.accountNo || "",
          minAmount: initialData.minAmount,
          maxAmount: initialData.maxAmount,
          feeRate: initialData.feeRate,
          sortNo: initialData.sortNo,
          status: initialData.status,
        }
      : {
          channelCode: "",
          channelName: "",
          network: "",
          displayUrl: "",
          accountName: "",
          accountNo: "",
          minAmount: 0,
          maxAmount: 0,
          feeRate: 0,
          sortNo: 0,
          status: 1,
        },
  });

  const onSubmit = async (values: ChannelFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const data: CreateRechargeChannelRequest = {
        ...values,
        minAmount: Number(values.minAmount),
        maxAmount: Number(values.maxAmount),
        feeRate: Number(values.feeRate),
      };

      if (initialData) {
        await updateAdminRechargeChannel(initialData.channelId, data);
      } else {
        await createAdminRechargeChannel(data);
      }
      onSuccess();
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const status = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>渠道编码</Label>
          <Input
            {...register("channelCode")}
            placeholder="如: USDT_TRC20"
            className="h-10"
          />
          {errors.channelCode && <p className="text-xs text-rose-500">{errors.channelCode.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>渠道名称</Label>
          <Input
            {...register("channelName")}
            placeholder="如: USDT (TRC20)"
            className="h-10"
          />
          {errors.channelName && <p className="text-xs text-rose-500">{errors.channelName.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>网络类型</Label>
          <Input
            {...register("network")}
            placeholder="如: TRC20, ERC20"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label>显示图标 URL</Label>
          <Input
            {...register("displayUrl")}
            placeholder="图标链接"
            className="h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>账户/钱包名称</Label>
          <Input
            {...register("accountName")}
            placeholder="显示给用户的账户名"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label>账户/钱包地址</Label>
          <Input
            {...register("accountNo")}
            placeholder="收币地址"
            className="h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>最小金额</Label>
          <Input
            type="number"
            step="0.01"
            {...register("minAmount", { valueAsNumber: true })}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label>最大金额</Label>
          <Input
            type="number"
            step="0.01"
            {...register("maxAmount", { valueAsNumber: true })}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label>手续费率 (如 0.01)</Label>
          <Input
            type="number"
            step="0.0001"
            {...register("feeRate", { valueAsNumber: true })}
            className="h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>排序号</Label>
          <Input
            type="number"
            {...register("sortNo", { valueAsNumber: true })}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label>状态</Label>
          <Select
            value={String(status)}
            onValueChange={(val) => setValue("status", Number(val))}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">启用</SelectItem>
              <SelectItem value="0">禁用</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <div className="text-sm font-medium text-rose-500">{error}</div>}

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          取消
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-[80px]"
        >
          {isLoading ? "保存中..." : "保存"}
        </Button>
      </div>
    </form>
  );
}
