"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toErrorMessage } from "@/lib/format";
import type { ApiResponse, SupportedLocale } from "@/api/types";

type TranslationRecord = {
  locale: SupportedLocale;
  configured?: boolean;
};

type TranslationDraft = {
  configured?: boolean;
  values: Record<string, string>;
};

interface TranslationField {
  key: string;
  label: string;
  multiline?: boolean;
  className?: string;
}

interface AdminTranslationEditorProps<TRecord extends TranslationRecord> {
  title: string;
  fields: TranslationField[];
  resourceKey: string | number;
  load: () => Promise<ApiResponse<TRecord[]>>;
  save: (locale: SupportedLocale, values: Record<string, string>) => Promise<unknown>;
  onSuccess: () => void;
  onCancel: () => void;
}

const supportedLocales: SupportedLocale[] = ["zh-CN", "en-US"];

function isSupportedLocale(locale: unknown): locale is SupportedLocale {
  return locale === "zh-CN" || locale === "en-US";
}

function emptyDrafts(fields: TranslationField[]): Record<SupportedLocale, TranslationDraft> {
  const values = Object.fromEntries(fields.map((field) => [field.key, ""]));
  return {
    "zh-CN": { configured: false, values: { ...values } },
    "en-US": { configured: false, values: { ...values } },
  };
}

export function AdminTranslationEditor<TRecord extends TranslationRecord>({
  title,
  fields,
  resourceKey,
  load,
  save,
  onSuccess,
  onCancel,
}: AdminTranslationEditorProps<TRecord>) {
  const t = useTranslations("AdminTranslations");
  const [translations, setTranslations] = useState<Record<SupportedLocale, TranslationDraft>>(() => emptyDrafts(fields));
  const [loading, setLoading] = useState(true);
  const [savingLocale, setSavingLocale] = useState<SupportedLocale | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    load()
      .then((res) => {
        if (!mounted) return;
        const next = emptyDrafts(fields);
        for (const item of res.data) {
          if (!isSupportedLocale(item.locale)) continue;
          const record = item as TranslationRecord & Record<string, unknown>;
          next[item.locale] = {
            configured: item.configured,
            values: Object.fromEntries(
              fields.map((field) => {
                const value = record[field.key];
                return [field.key, value === null || value === undefined ? "" : String(value)];
              }),
            ),
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
  }, [resourceKey]);

  const updateDraft = (locale: SupportedLocale, key: string, value: string) => {
    setTranslations((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        values: {
          ...current[locale].values,
          [key]: value,
        },
      },
    }));
  };

  const saveLocale = async (locale: SupportedLocale) => {
    setSavingLocale(locale);
    setError(null);
    try {
      await save(locale, translations[locale].values);
      setTranslations((current) => ({
        ...current,
        [locale]: {
          ...current[locale],
          configured: true,
        },
      }));
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
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
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
        <div className="grid gap-4 lg:grid-cols-2">
          {supportedLocales.map((locale) => {
            const draft = translations[locale];
            const label = locale === "zh-CN" ? t("chinese") : t("english");
            return (
              <section key={locale} className="min-w-0 rounded-xl border border-border bg-card p-4 text-card-foreground">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">{label}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {draft.configured ? t("configured") : t("notConfigured")}
                    </p>
                  </div>
                  {!draft.configured ? (
                    <span className="max-w-[13rem] rounded-full bg-amber-500/10 px-2 py-1 text-right text-[11px] font-medium leading-4 text-amber-600">
                      {t("emptyHint")}
                    </span>
                  ) : null}
                </div>

                <div className="space-y-3">
                  {fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label>{field.label}</Label>
                      {field.multiline ? (
                        <Textarea
                          value={draft.values[field.key] ?? ""}
                          onChange={(event) => updateDraft(locale, field.key, event.target.value)}
                          className={field.className ?? "min-h-[120px] bg-background"}
                        />
                      ) : (
                        <Input
                          value={draft.values[field.key] ?? ""}
                          onChange={(event) => updateDraft(locale, field.key, event.target.value)}
                          className={field.className ?? "bg-background"}
                        />
                      )}
                    </div>
                  ))}

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
