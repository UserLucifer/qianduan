"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createAdminDocsArticle,
  createAdminDocsCategory,
  updateAdminDocsArticle,
  updateAdminDocsCategory,
} from "@/api/admin";
import type {
  DocsArticle,
  DocsArticleRequest,
  DocsCategory,
  DocsCategoryRequest,
  DocsLanguage,
  DocsSection,
} from "@/api/types";
import { DOCS_LANGUAGE_ITEMS, DOCS_SECTION_ITEMS, docsSectionLabel } from "@/components/docs/sections";
import { toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

const ROOT_CATEGORY_VALUE = "root";
const languageValues = ["zh-CN", "en-US"] as const;
const sectionValues = ["guide", "integration", "faq", "support"] as const;

function createCategorySchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
  language: z.enum(languageValues).default("zh-CN"),
  section: z.enum(sectionValues).default("guide"),
  parentId: z.string().default(ROOT_CATEGORY_VALUE),
  categoryCode: z.string().min(1, t("categoryCodeRequired")),
  categoryName: z.string().min(1, t("categoryNameRequired")),
  icon: z.string().optional(),
  sortNo: z.coerce.number().default(0),
  status: z.string().default("1"),
  });
}

function createArticleSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
  language: z.enum(languageValues).default("zh-CN"),
  section: z.enum(sectionValues).default("guide"),
  categoryId: z.string().min(1, t("categoryRequired")),
  title: z.string().min(1, t("titleRequired")),
  slug: z.string().min(1, t("slugRequired")),
  summary: z.string().optional(),
  contentMarkdown: z.string().min(1, t("markdownRequired")),
  publishStatus: z.string().default("0"),
  isSectionHome: z.boolean().default(false),
  sortNo: z.coerce.number().default(0),
  });
}

type CategoryFormValues = z.infer<ReturnType<typeof createCategorySchema>>;
type ArticleFormValues = z.infer<ReturnType<typeof createArticleSchema>>;

function flattenCategories(categories: DocsCategory[]): DocsCategory[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children ?? []),
  ]);
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sectionLabel(section: DocsSection, locale: DocsLanguage) {
  return docsSectionLabel(section, locale);
}

function LanguageSelect({
  value,
  onValueChange,
}: {
  value: DocsLanguage;
  onValueChange: (value: DocsLanguage) => void;
}) {
  const t = useTranslations("AdminComponentForms.docsForms");
  return (
    <Select value={value} onValueChange={(nextValue) => onValueChange(nextValue as DocsLanguage)}>
      <SelectTrigger className="bg-background">
        <SelectValue placeholder={t("selectLanguage")} />
      </SelectTrigger>
      <SelectContent>
        {DOCS_LANGUAGE_ITEMS.map((item) => (
          <SelectItem key={item.language} value={item.language}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SectionSelect({
  value,
  onValueChange,
}: {
  value: DocsSection;
  onValueChange: (value: DocsSection) => void;
}) {
  const t = useTranslations("AdminComponentForms.docsForms");
  const locale = useLocale() as DocsLanguage;
  return (
    <Select value={value} onValueChange={(nextValue) => onValueChange(nextValue as DocsSection)}>
      <SelectTrigger className="bg-background">
        <SelectValue placeholder={t("selectSection")} />
      </SelectTrigger>
      <SelectContent>
        {DOCS_SECTION_ITEMS.map((item) => (
          <SelectItem key={item.section} value={item.section}>
            {docsSectionLabel(item.section, locale)}
          </SelectItem>
        ))}
        <SelectItem value="support">{docsSectionLabel("support", locale)}</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function DocsCategoryForm({
  initialData,
  categories,
  onSuccess,
  onCancel,
}: {
  initialData?: DocsCategory | null;
  categories: DocsCategory[];
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("AdminComponentForms.docsForms");
  const categorySchema = createCategorySchema(t);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      language: initialData?.language ?? "zh-CN",
      section: initialData?.section ?? "guide",
      parentId: initialData?.parentId ? String(initialData.parentId) : ROOT_CATEGORY_VALUE,
      categoryCode: initialData?.categoryCode ?? "",
      categoryName: initialData?.categoryName ?? "",
      icon: initialData?.icon ?? "",
      sortNo: initialData?.sortNo ?? 0,
      status: String(initialData?.status ?? 1),
    },
  });
  const language = useWatch({ control: form.control, name: "language" });
  const section = useWatch({ control: form.control, name: "section" });
  const parentId = useWatch({ control: form.control, name: "parentId" });
  const status = useWatch({ control: form.control, name: "status" });
  const [error, setError] = useState<string | null>(null);

  const parentOptions = flattenCategories(categories).filter(
    (category) =>
      category.id !== initialData?.id &&
      category.language === language &&
      category.section === section,
  );

  useEffect(() => {
    if (parentId === ROOT_CATEGORY_VALUE) return;
    if (!parentOptions.some((category) => String(category.id) === parentId)) {
      form.setValue("parentId", ROOT_CATEGORY_VALUE);
    }
  }, [form, parentId, parentOptions]);

  const onSubmit = async (values: CategoryFormValues) => {
    setError(null);
    try {
      const payload: DocsCategoryRequest = {
        language: values.language,
        section: values.section,
        parentId: values.parentId === ROOT_CATEGORY_VALUE ? null : Number(values.parentId),
        categoryCode: values.categoryCode,
        categoryName: values.categoryName,
        icon: values.icon?.trim() || null,
        sortNo: values.sortNo,
        status: Number(values.status),
      };

      if (initialData?.id) {
        await updateAdminDocsCategory(initialData.id, payload);
      } else {
        await createAdminDocsCategory(payload);
      }
      onSuccess();
    } catch (err) {
      setError(toErrorMessage(err));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
      <ErrorAlert message={error} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("language")}</Label>
          <LanguageSelect value={language} onValueChange={(value) => form.setValue("language", value)} />
        </div>
        <div className="space-y-2">
          <Label>{t("section")}</Label>
          <SectionSelect value={section} onValueChange={(value) => form.setValue("section", value)} />
        </div>
        <div className="space-y-2">
          <Label>{t("parentCategory")}</Label>
          <Select value={parentId} onValueChange={(value) => form.setValue("parentId", value)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={t("selectParentCategory")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ROOT_CATEGORY_VALUE}>{t("rootCategory")}</SelectItem>
              {parentOptions.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("categoryCode")}</Label>
          <Input {...form.register("categoryCode")} placeholder="quick-start" className="bg-background" />
          {form.formState.errors.categoryCode ? (
            <p className="text-xs text-red-500">{form.formState.errors.categoryCode.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label>{t("categoryName")}</Label>
          <Input {...form.register("categoryName")} placeholder={t("categoryNamePlaceholder")} className="bg-background" />
          {form.formState.errors.categoryName ? (
            <p className="text-xs text-red-500">{form.formState.errors.categoryName.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label>{t("icon")}</Label>
          <Input {...form.register("icon")} placeholder="book" className="bg-background" />
        </div>
        <div className="space-y-2">
          <Label>{t("sort")}</Label>
          <Input type="number" {...form.register("sortNo")} className="bg-background" />
        </div>
        <div className="space-y-2">
          <Label>{t("status")}</Label>
          <Select value={status} onValueChange={(value) => form.setValue("status", value)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">{t("enabled")}</SelectItem>
              <SelectItem value="0">{t("disabled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="submit">{t("saveCategory")}</Button>
      </div>
    </form>
  );
}

export function DocsArticleForm({
  initialData,
  categories,
  onSuccess,
  onCancel,
}: {
  initialData?: DocsArticle | null;
  categories: DocsCategory[];
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("AdminComponentForms.docsForms");
  const locale = useLocale() as DocsLanguage;
  const articleSchema = createArticleSchema(t);
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      language: initialData?.language ?? "zh-CN",
      section: initialData?.section ?? "guide",
      categoryId: initialData?.categoryId ? String(initialData.categoryId) : "",
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      summary: initialData?.summary ?? "",
      contentMarkdown: initialData?.contentMarkdown ?? "",
      publishStatus: String(initialData?.publishStatus ?? 0),
      isSectionHome: Number(initialData?.isSectionHome ?? 0) === 1,
      sortNo: initialData?.sortNo ?? 0,
    },
  });
  const language = useWatch({ control: form.control, name: "language" });
  const section = useWatch({ control: form.control, name: "section" });
  const categoryId = useWatch({ control: form.control, name: "categoryId" });
  const publishStatus = useWatch({ control: form.control, name: "publishStatus" });
  const isSectionHome = useWatch({ control: form.control, name: "isSectionHome" });
  const titleRegister = form.register("title");
  const [error, setError] = useState<string | null>(null);

  const categoryOptions = flattenCategories(categories).filter(
    (category) => category.language === language && category.section === section,
  );

  useEffect(() => {
    if (!categoryId) return;
    if (!categoryOptions.some((category) => String(category.id) === categoryId)) {
      form.setValue("categoryId", "");
    }
  }, [categoryId, categoryOptions, form]);

  const onSubmit = async (values: ArticleFormValues) => {
    setError(null);
    try {
      const payload: DocsArticleRequest = {
        language: values.language,
        section: values.section,
        categoryId: Number(values.categoryId),
        title: values.title,
        slug: values.slug,
        summary: values.summary,
        contentMarkdown: values.contentMarkdown,
        publishStatus: Number(values.publishStatus),
        isSectionHome: values.isSectionHome ? 1 : 0,
        sortNo: values.sortNo,
      };

      if (initialData?.id) {
        await updateAdminDocsArticle(initialData.id, payload);
      } else {
        await createAdminDocsArticle(payload);
      }
      onSuccess();
    } catch (err) {
      setError(toErrorMessage(err));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
      <ErrorAlert message={error} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("language")}</Label>
          <LanguageSelect value={language} onValueChange={(value) => form.setValue("language", value)} />
        </div>
        <div className="space-y-2">
          <Label>{t("section")}</Label>
          <SectionSelect value={section} onValueChange={(value) => form.setValue("section", value)} />
        </div>
        <div className="space-y-2">
          <Label>{t("category")}</Label>
          <Select value={categoryId} onValueChange={(value) => form.setValue("categoryId", value)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={t("selectSectionCategory", { section: sectionLabel(section, locale) })} />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.categoryId ? (
            <p className="text-xs text-red-500">{form.formState.errors.categoryId.message}</p>
          ) : null}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>{t("title")}</Label>
          <Input
            {...titleRegister}
            placeholder={t("titlePlaceholder")}
            className="bg-background"
            onChange={(event) => {
              titleRegister.onChange(event);
              if (!form.getValues("slug")) {
                form.setValue("slug", slugify(event.target.value));
              }
            }}
          />
          {form.formState.errors.title ? (
            <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input {...form.register("slug")} placeholder="docs-overview" className="bg-background" />
          {form.formState.errors.slug ? (
            <p className="text-xs text-red-500">{form.formState.errors.slug.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label>{t("publishStatus")}</Label>
          <Select value={publishStatus} onValueChange={(value) => form.setValue("publishStatus", value)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">{t("draft")}</SelectItem>
              <SelectItem value="1">{t("published")}</SelectItem>
              <SelectItem value="2">{t("offline")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("sort")}</Label>
          <Input type="number" {...form.register("sortNo")} className="bg-background" />
        </div>
        <div className="flex items-center justify-between rounded-lg border bg-card p-3 text-card-foreground">
          <div className="space-y-0.5">
            <Label>{t("setAsSectionHome")}</Label>
            <p className="text-[10px] text-muted-foreground">
              {t("sectionHomeDescription")}
            </p>
          </div>
          <Switch
            checked={isSectionHome}
            onCheckedChange={(checked) => form.setValue("isSectionHome", checked)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>{t("summary")}</Label>
          <Textarea {...form.register("summary")} placeholder={t("summaryPlaceholder")} className="h-20 resize-none bg-background" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>{t("markdownBody")}</Label>
          <Textarea
            {...form.register("contentMarkdown")}
            placeholder={t("markdownPlaceholder")}
            className="min-h-[320px] bg-background font-mono"
          />
          {form.formState.errors.contentMarkdown ? (
            <p className="text-xs text-red-500">{form.formState.errors.contentMarkdown.message}</p>
          ) : null}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="submit">{t("saveArticle")}</Button>
      </div>
    </form>
  );
}
