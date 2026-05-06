"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  createAdminRechargeChannel,
  getAdminRechargeChannelTranslations,
  updateAdminRechargeChannel,
  updateAdminRechargeChannelTranslation,
} from "@/api/admin";
import type {
  AdminRechargeChannelResponse,
  CreateRechargeChannelRequest,
  SupportedLocale,
} from "@/api/types";
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

type RechargeChannelTranslationDraft = {
  channelName: string;
  accountName: string;
  configured?: boolean;
};

const supportedLocales: SupportedLocale[] = ["zh-CN", "en-US"];

const emptyTranslations: Record<SupportedLocale, RechargeChannelTranslationDraft> = {
  "zh-CN": { channelName: "", accountName: "", configured: false },
  "en-US": { channelName: "", accountName: "", configured: false },
};

interface RechargeChannelTranslationFormProps {
  channelId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RechargeChannelTranslationForm({
  channelId,
  onSuccess,
  onCancel,
}: RechargeChannelTranslationFormProps) {
  const t = useTranslations("AdminTranslations");
  const [translations, setTranslations] = useState<Record<SupportedLocale, RechargeChannelTranslationDraft>>(emptyTranslations);
  const [loading, setLoading] = useState(true);
  const [savingLocale, setSavingLocale] = useState<SupportedLocale | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getAdminRechargeChannelTranslations(channelId)
      .then((res) => {
        if (!mounted) return;
        const next: Record<SupportedLocale, RechargeChannelTranslationDraft> = {
          "zh-CN": { ...emptyTranslations["zh-CN"] },
          "en-US": { ...emptyTranslations["en-US"] },
        };
        for (const item of res.data) {
          next[item.locale] = {
            channelName: item.channelName ?? "",
            accountName: item.accountName ?? "",
            configured: item.configured,
          };
        }
        setTranslations(next);
      })
      .catch((err) => {
        if (mounted) setError(toErrorMessage(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [channelId]);

  const updateDraft = (
    locale: SupportedLocale,
    key: "channelName" | "accountName",
    value: string,
  ) => {
    setTranslations((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        [key]: value,
      },
    }));
  };

  const saveLocale = async (locale: SupportedLocale) => {
    setSavingLocale(locale);
    setError(null);
    try {
      const draft = translations[locale];
      await updateAdminRechargeChannelTranslation(channelId, {
        locale,
        channelName: draft.channelName,
        accountName: draft.accountName,
      });
      onSuccess();
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setSavingLocale(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t("rechargeChannelTitle")}</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("description")}</p>
      </div>

      {error ? (
        <div className="rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-medium text-rose-500">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 rounded-lg border border-border p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("loading")}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {supportedLocales.map((locale) => {
            const draft = translations[locale];
            const label = locale === "zh-CN" ? t("chinese") : t("english");
            return (
              <section key={locale} className="rounded-xl border border-border bg-card p-4 text-card-foreground">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">{label}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {draft.configured ? t("configured") : t("notConfigured")}
                    </p>
                  </div>
                  {!draft.configured ? (
                    <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-600">
                      {t("emptyHint")}
                    </span>
                  ) : null}
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>{t("channelName")}</Label>
                    <Input
                      value={draft.channelName}
                      onChange={(event) => updateDraft(locale, "channelName", event.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("accountName")}</Label>
                    <Input
                      value={draft.accountName}
                      onChange={(event) => updateDraft(locale, "accountName", event.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    disabled={savingLocale !== null}
                    onClick={() => void saveLocale(locale)}
                  >
                    {savingLocale === locale ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("saving")}
                      </>
                    ) : (
                      t("save", { language: label })
                    )}
                  </Button>
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div className="flex justify-end border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t("cancel")}
        </Button>
      </div>
    </div>
  );
}
