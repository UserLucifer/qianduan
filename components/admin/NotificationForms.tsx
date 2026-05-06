"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toErrorMessage } from "@/lib/format";
import {
  getAdminNotificationTranslations,
  updateAdminNotificationTranslation,
} from "@/api/admin";
import type { SupportedLocale } from "@/api/types";

const notificationSchema = z.object({
  userId: z.number().optional(),
  title: z.string().min(1, "请输入标题"),
  content: z.string().min(1, "请输入内容"),
  type: z.string().min(1, "请选择类型"),
});

interface NotificationFormProps {
  isBroadcast?: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export function NotificationForm({ isBroadcast = false, onSuccess, onCancel }: NotificationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      userId: undefined,
      title: "",
      content: "",
      type: "SYSTEM",
    },
  });

  const onSubmit = async (values: z.infer<typeof notificationSchema>) => {
    setLoading(true);
    setError(null);
    try {
      const { createAdminNotification, broadcastAdminNotification } = await import("@/api/admin");
      if (isBroadcast) {
        await broadcastAdminNotification({
          title: values.title,
          content: values.content,
          type: values.type,
        });
      } else {
        if (values.userId === undefined) {
          throw new Error("请输入接收用户 ID");
        }
        await createAdminNotification({
          userId: values.userId,
          title: values.title,
          content: values.content,
          type: values.type,
        });
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        {error && <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium">{error}</div>}
        
        <div className="space-y-4 w-full">
          {!isBroadcast && (
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>接收用户 ID</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="例如: 10001" 
                      className="bg-background"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid grid-cols-2 gap-4 w-full">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full col-span-2">
                  <FormLabel>通知标题</FormLabel>
                  <FormControl>
                    <Input placeholder="输入简明扼要的标题" className="bg-background" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>通知类型</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SYSTEM">系统通知</SelectItem>
                      <SelectItem value="ORDER">订单通知</SelectItem>
                      <SelectItem value="WALLET">资金通知</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>通知内容</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="请输入详细的通知内容..." 
                    className="bg-background min-h-[120px] resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 预览区域 */}
        <div className="mt-2 rounded-lg border border-border bg-muted/40 p-4">
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            实时预览 (模拟展示)
          </div>
          <div className="flex gap-3 items-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bell className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-foreground">
                  {form.watch("title") || "在此输入标题..."}
                </p>
                <span className="whitespace-nowrap text-[10px] text-muted-foreground">刚刚</span>
              </div>
              <p className="whitespace-pre-wrap break-words text-xs text-muted-foreground">
                {form.watch("content") || "通知内容将展示在这里。"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            取消
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="min-w-[100px] font-semibold"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isBroadcast ? "发布广播" : "发送通知"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

type NotificationTranslationDraft = {
  title: string;
  content: string;
  configured?: boolean;
};

const supportedLocales: SupportedLocale[] = ["zh-CN", "en-US"];

const emptyTranslations: Record<SupportedLocale, NotificationTranslationDraft> = {
  "zh-CN": { title: "", content: "", configured: false },
  "en-US": { title: "", content: "", configured: false },
};

interface NotificationTranslationFormProps {
  notificationId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function NotificationTranslationForm({
  notificationId,
  onSuccess,
  onCancel,
}: NotificationTranslationFormProps) {
  const t = useTranslations("AdminTranslations");
  const [translations, setTranslations] = useState<Record<SupportedLocale, NotificationTranslationDraft>>(emptyTranslations);
  const [loading, setLoading] = useState(true);
  const [savingLocale, setSavingLocale] = useState<SupportedLocale | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getAdminNotificationTranslations(notificationId)
      .then((res) => {
        if (!mounted) return;
        const next: Record<SupportedLocale, NotificationTranslationDraft> = {
          "zh-CN": { ...emptyTranslations["zh-CN"] },
          "en-US": { ...emptyTranslations["en-US"] },
        };
        for (const item of res.data) {
          next[item.locale] = {
            title: item.title ?? "",
            content: item.content ?? "",
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
  }, [notificationId]);

  const updateDraft = (locale: SupportedLocale, key: "title" | "content", value: string) => {
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
      await updateAdminNotificationTranslation(notificationId, {
        locale,
        title: draft.title,
        content: draft.content,
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
        <h2 className="text-lg font-semibold text-foreground">{t("notificationTitle")}</h2>
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
                    <Label>{t("notificationTitleField")}</Label>
                    <Input
                      value={draft.title}
                      onChange={(event) => updateDraft(locale, "title", event.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("notificationContentField")}</Label>
                    <Textarea
                      value={draft.content}
                      onChange={(event) => updateDraft(locale, "content", event.target.value)}
                      className="min-h-[160px] bg-background"
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
