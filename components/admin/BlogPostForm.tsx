"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Switch } from "@/components/ui/switch";
import { createAdminBlogPost, updateAdminBlogPost } from "@/api/admin";
import type { AdminBlogPost, BlogCategory, BlogTag } from "@/api/types";
import { toErrorMessage } from "@/lib/format";

function createFormSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
  title: z.string().min(1, t("titleRequired")),
  summary: z.string().optional(),
  categoryId: z.string().min(1, t("categoryRequired")),
  tagIds: z.array(z.string()).default([]),
  contentMarkdown: z.string().min(1, t("contentRequired")),
  coverImageUrl: z.string().optional(),
  publishStatus: z.number().default(0),
  isTop: z.number().default(0),
  sortNo: z.number().default(0),
  });
}

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface BlogPostFormProps {
  initialData?: AdminBlogPost | null;
  categories: BlogCategory[];
  tags: BlogTag[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function BlogPostForm({ initialData, categories, tags, onSuccess, onCancel }: BlogPostFormProps) {
  const t = useTranslations("AdminComponentForms.blogPostForm");
  const formSchema = createFormSchema(t);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: (initialData?.title as string) || "",
      summary: (initialData?.summary as string) || "",
      categoryId: initialData?.categoryId?.toString() || "",
      tagIds: Array.isArray(initialData?.tagIds) ? initialData.tagIds.map(String) : [],
      contentMarkdown: (initialData?.contentMarkdown as string) || "",
      coverImageUrl: (initialData?.coverImageUrl as string) || "",
      publishStatus: Number(initialData?.publishStatus ?? 0),
      isTop: Number(initialData?.isTop ?? 0),
      sortNo: Number(initialData?.sortNo ?? 0),
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const payload: Partial<AdminBlogPost> = {
        ...values,
        categoryId: Number(values.categoryId),
        tagIds: values.tagIds.map(Number),
      };

      if (initialData?.id) {
        await updateAdminBlogPost(Number(initialData.id), payload);
      } else {
        await createAdminBlogPost(payload);
      }
      onSuccess();
    } catch (err) {
      alert(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const tagOptions = tags.map((t) => ({ label: t.tagName, value: t.id.toString() }));

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 w-full">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-full">
        <div className="space-y-2 col-span-2">
          <Label>{t("articleTitle")}</Label>
          <Input {...form.register("title")} placeholder={t("articleTitlePlaceholder")} className="bg-background" />
          {form.formState.errors.title && <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>{t("category")}</Label>
          <Select
            value={form.watch("categoryId")}
            onValueChange={(val) => form.setValue("categoryId", val)}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={t("selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.categoryName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("tags")}</Label>
          <MultiSelect
            options={tagOptions}
            selected={form.watch("tagIds")}
            onChange={(selected) => form.setValue("tagIds", selected)}
            placeholder={t("selectTags")}
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label>{t("coverImageUrl")}</Label>
          <Input {...form.register("coverImageUrl")} placeholder="https://example.com/image.png" className="bg-background" />
        </div>

        <div className="space-y-2 col-span-2">
          <Label>{t("summary")}</Label>
          <Textarea {...form.register("summary")} placeholder={t("summaryPlaceholder")} className="bg-background resize-none h-20" />
        </div>

        <div className="space-y-2 col-span-2">
          <Label>{t("markdownContent")}</Label>
          <Textarea {...form.register("contentMarkdown")} placeholder={t("markdownPlaceholder")} className="bg-background font-mono min-h-[300px]" />
          {form.formState.errors.contentMarkdown && <p className="text-xs text-red-500">{form.formState.errors.contentMarkdown.message}</p>}
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-card p-3 text-card-foreground">
          <div className="space-y-0.5">
            <Label>{t("publishNow")}</Label>
            <p className="text-[10px] text-muted-foreground">{t("publishNowDescription")}</p>
          </div>
          <Switch
            checked={form.watch("publishStatus") === 1}
            onCheckedChange={(checked) => form.setValue("publishStatus", checked ? 1 : 0)}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-card p-3 text-card-foreground">
          <div className="space-y-0.5">
            <Label>{t("pinArticle")}</Label>
            <p className="text-[10px] text-muted-foreground">{t("pinArticleDescription")}</p>
          </div>
          <Switch
            checked={form.watch("isTop") === 1}
            onCheckedChange={(checked) => form.setValue("isTop", checked ? 1 : 0)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>{t("cancel")}</Button>
        <Button type="submit" disabled={loading}>
          {loading ? t("saving") : t("saveArticle")}
        </Button>
      </div>
    </form>
  );
}
