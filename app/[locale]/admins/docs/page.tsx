"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Edit2, Eye, FileText, FolderTree, Plus, Power, PowerOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { DocsArticleForm, DocsCategoryForm } from "@/components/admin/DocsForms";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import {
  deleteAdminDocsArticle,
  deleteAdminDocsCategory,
  disableAdminDocsCategory,
  enableAdminDocsCategory,
  getAdminDocsArticleDetail,
  getAdminDocsArticles,
  getAdminDocsCategories,
  publishAdminDocsArticle,
  unpublishAdminDocsArticle,
} from "@/api/admin";
import type {
  AdminDocsArticleQuery,
  AdminDocsCategoryQuery,
  DocsArticle,
  DocsCategory,
  DocsLanguage,
  DocsSection,
} from "@/api/types";
import {
  DOCS_DEFAULT_LANGUAGE,
  DOCS_LANGUAGE_ITEMS,
  DOCS_SECTION_ITEMS,
  docsLanguageLabel,
  docsSectionLabel,
} from "@/components/docs/sections";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

const ALL_VALUE = "all";
const DOCS_ADMIN_SECTION_ITEMS: Array<{ section: DocsSection }> = [
  ...DOCS_SECTION_ITEMS.map(({ section }) => ({ section })),
  { section: "support" },
];

interface CategoryFilters {
  language: string;
  section: string;
  parentId: string;
  status: string;
}

interface ArticleFilters {
  language: string;
  section: string;
  categoryId: string;
  publishStatus: string;
  isSectionHome: string;
  keyword: string;
  startTime: string;
  endTime: string;
}

const initialCategoryFilters: CategoryFilters = {
  language: ALL_VALUE,
  section: ALL_VALUE,
  parentId: ALL_VALUE,
  status: ALL_VALUE,
};

const initialArticleFilters: ArticleFilters = {
  language: ALL_VALUE,
  section: ALL_VALUE,
  categoryId: ALL_VALUE,
  publishStatus: ALL_VALUE,
  isSectionHome: ALL_VALUE,
  keyword: "",
  startTime: "",
  endTime: "",
};

const initialCategoryQuery: AdminDocsCategoryQuery = { pageNo: 1, pageSize: 10 };
const initialArticleQuery: AdminDocsArticleQuery = { pageNo: 1, pageSize: 10 };

function flattenCategories(categories: DocsCategory[]): DocsCategory[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children ?? []),
  ]);
}

function publishLabel(status: number | null | undefined, t: (key: "published" | "offline" | "draft") => string) {
  if (status === 1) return t("published");
  if (status === 2) return t("offline");
  return t("draft");
}

function publishBadgeClassName(status: number | null | undefined) {
  if (status === 1) return "border-emerald-400/20 bg-emerald-400/10 text-emerald-500";
  if (status === 2) return "border-amber-400/20 bg-amber-400/10 text-amber-500";
  return "border-border bg-muted text-muted-foreground";
}

function languageLabel(language: DocsLanguage | null | undefined) {
  return docsLanguageLabel(language ?? DOCS_DEFAULT_LANGUAGE);
}

export default function AdminDocsPage() {
  const t = useTranslations("AdminPages.docs");
  const locale = useLocale() as DocsLanguage;
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilters>(initialCategoryFilters);
  const [articleFilters, setArticleFilters] = useState<ArticleFilters>(initialArticleFilters);
  const [categories, setCategories] = useState<DocsCategory[]>([]);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [articleFormOpen, setArticleFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DocsCategory | null>(null);
  const [editingArticle, setEditingArticle] = useState<DocsArticle | null>(null);
  const [articleDetail, setArticleDetail] = useState<DocsArticle | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const categoryLoader = useCallback(async (params: AdminDocsCategoryQuery) => (await getAdminDocsCategories(params)).data, []);
  const articleLoader = useCallback(async (params: AdminDocsArticleQuery) => (await getAdminDocsArticles(params)).data, []);

  const categoryResource = usePaginatedResource(categoryLoader, initialCategoryQuery);
  const articleResource = usePaginatedResource(articleLoader, initialArticleQuery);

  const refreshCategories = useCallback(async () => {
    try {
      const response = await getAdminDocsCategories({ pageNo: 1, pageSize: 100 });
      setCategories(response.data.records ?? []);
    } catch (error) {
      setActionError(toErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    void refreshCategories();
  }, [refreshCategories]);

  const buildCategoryQuery = (filters: CategoryFilters): AdminDocsCategoryQuery => ({
    pageNo: 1,
    pageSize: categoryResource.page.pageSize,
    language: filters.language !== ALL_VALUE ? (filters.language as DocsLanguage) : undefined,
    section: filters.section !== ALL_VALUE ? (filters.section as DocsSection) : undefined,
    parent_id:
      filters.parentId !== ALL_VALUE && Number.isFinite(Number(filters.parentId))
        ? Number(filters.parentId)
        : undefined,
    status: filters.status !== ALL_VALUE ? Number(filters.status) : undefined,
  });

  const buildArticleQuery = (filters: ArticleFilters): AdminDocsArticleQuery => ({
    pageNo: 1,
    pageSize: articleResource.page.pageSize,
    language: filters.language !== ALL_VALUE ? (filters.language as DocsLanguage) : undefined,
    section: filters.section !== ALL_VALUE ? (filters.section as DocsSection) : undefined,
    category_id: filters.categoryId !== ALL_VALUE ? Number(filters.categoryId) : undefined,
    publish_status: filters.publishStatus !== ALL_VALUE ? Number(filters.publishStatus) : undefined,
    is_section_home: filters.isSectionHome !== ALL_VALUE ? Number(filters.isSectionHome) : undefined,
    keyword: filters.keyword.trim() || undefined,
    start_time: filters.startTime.trim() || undefined,
    end_time: filters.endTime.trim() || undefined,
  });

  const reloadAfterCategoryChange = async () => {
    await Promise.all([
      categoryResource.reload(),
      articleResource.reload(),
      refreshCategories(),
    ]);
  };

  const openCategoryForm = (category: DocsCategory | null = null) => {
    setEditingCategory(category);
    setCategoryFormOpen(true);
  };

  const openArticleForm = async (article: DocsArticle | null = null) => {
    setActionError(null);
    if (!article?.id) {
      setEditingArticle(null);
      setArticleFormOpen(true);
      return;
    }

    try {
      const response = await getAdminDocsArticleDetail(article.id);
      setEditingArticle(response.data);
      setArticleFormOpen(true);
    } catch (error) {
      setActionError(toErrorMessage(error));
    }
  };

  const openArticleDetail = async (article: DocsArticle) => {
    setActionError(null);
    try {
      const response = await getAdminDocsArticleDetail(article.id);
      setArticleDetail(response.data);
      setDetailOpen(true);
    } catch (error) {
      setActionError(toErrorMessage(error));
    }
  };

  const toggleCategory = async (category: DocsCategory, enabled: boolean) => {
    setActionError(null);
    try {
      if (enabled) {
        await enableAdminDocsCategory(category.id);
      } else {
        await disableAdminDocsCategory(category.id);
      }
      await reloadAfterCategoryChange();
    } catch (error) {
      setActionError(toErrorMessage(error));
    }
  };

  const removeCategory = async (category: DocsCategory) => {
    setActionError(null);
    try {
      await deleteAdminDocsCategory(category.id);
      await reloadAfterCategoryChange();
    } catch (error) {
      setActionError(toErrorMessage(error));
    }
  };

  const toggleArticlePublish = async (article: DocsArticle) => {
    setActionError(null);
    try {
      if (article.publishStatus === 1) {
        await unpublishAdminDocsArticle(article.id);
      } else {
        await publishAdminDocsArticle(article.id);
      }
      await articleResource.reload();
    } catch (error) {
      setActionError(toErrorMessage(error));
    }
  };

  const removeArticle = async (article: DocsArticle) => {
    setActionError(null);
    try {
      await deleteAdminDocsArticle(article.id);
      await articleResource.reload();
    } catch (error) {
      setActionError(toErrorMessage(error));
    }
  };

  const categoryColumns: DataTableColumn<DocsCategory>[] = [
    { key: "id", title: "ID", render: (row) => <span className="font-mono text-xs text-muted-foreground">{row.id}</span> },
    { key: "language", title: t("language"), render: (row) => <Badge variant="outline">{languageLabel(row.language)}</Badge> },
    { key: "section", title: t("section"), render: (row) => <Badge variant="outline">{docsSectionLabel(row.section, locale)}</Badge> },
    { key: "categoryName", title: t("categoryName"), render: (row) => <span className="font-medium text-foreground">{row.categoryName}</span> },
    { key: "categoryCode", title: t("code"), render: (row) => <span className="font-mono text-xs text-muted-foreground">{row.categoryCode}</span> },
    { key: "parentId", title: t("parent"), render: (row) => formatEmpty(row.parentId) },
    { key: "sortNo", title: t("sort"), render: (row) => formatEmpty(row.sortNo) },
    { key: "status", title: t("status"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "updatedAt", title: t("updatedAt"), render: (row) => <DateTimeText value={row.updatedAt} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => openCategoryForm(row)}>
            <Edit2 className="h-4 w-4" />
            {t("edit")}</Button>
          {row.status === 1 ? (
            <ConfirmActionButton title={t("disableCategory")} description={t("afterDisablingThisCategoryWillNoLongerAppearInThePublicDocumentationTree")} onConfirm={() => toggleCategory(row, false)}>
              <PowerOff className="h-4 w-4" />
              {t("disable")}</ConfirmActionButton>
          ) : (
            <ConfirmActionButton title={t("enableCategory")} description={t("afterEnablingThisCategoryCanAppearInThePublicDocumentationTree")} onConfirm={() => toggleCategory(row, true)}>
              <Power className="h-4 w-4" />
              {t("enable")}</ConfirmActionButton>
          )}
          <ConfirmActionButton title={t("deleteCategory")} description={t("thisCallsTheBackendSoftDeleteApiConfirmThereIsNoContentUnderThisCategoryThatMustBeKept")} onConfirm={() => removeCategory(row)}>
            <span className="inline-flex items-center gap-2 text-red-500">
              <Trash2 className="h-4 w-4" />
              {t("delete")}</span>
          </ConfirmActionButton>
        </div>
      ),
    },
  ];

  const articleColumns: DataTableColumn<DocsArticle>[] = [
    { key: "id", title: "ID", render: (row) => <span className="font-mono text-xs text-muted-foreground">{row.id}</span> },
    { key: "language", title: t("language"), render: (row) => <Badge variant="outline">{languageLabel(row.language)}</Badge> },
    { key: "section", title: t("section"), render: (row) => <Badge variant="outline">{docsSectionLabel(row.section, locale)}</Badge> },
    {
      key: "title",
      title: t("title"),
      render: (row) => (
        <div className="min-w-0">
          <div className="line-clamp-1 font-medium text-foreground">{row.title}</div>
          <div className="mt-1 line-clamp-1 font-mono text-xs text-muted-foreground">{row.slug}</div>
        </div>
      ),
    },
    { key: "categoryName", title: t("category"), render: (row) => <Badge variant="outline">{row.categoryName ?? "-"}</Badge> },
    {
      key: "isSectionHome",
      title: t("home"),
      render: (row) =>
        row.isSectionHome === 1 ? (
          <Badge variant="outline" className="border-emerald-400/20 bg-emerald-400/10 text-emerald-500">
            {t("sectionHome")}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: "publishStatus",
      title: t("publishingStatus"),
      render: (row) => (
        <StatusBadge
          status={String(row.publishStatus)}
          label={publishLabel(row.publishStatus, t)}
          className={publishBadgeClassName(row.publishStatus)}
        />
      ),
    },
    { key: "sortNo", title: t("sort"), render: (row) => formatEmpty(row.sortNo) },
    { key: "viewCount", title: t("views"), render: (row) => formatEmpty(row.viewCount) },
    { key: "updatedAt", title: t("updatedAt"), render: (row) => <DateTimeText value={row.updatedAt} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => openArticleForm(row)}>
            <Edit2 className="h-4 w-4" />
            {t("edit")}</Button>
          <Button variant="ghost" size="sm" onClick={() => openArticleDetail(row)}>
            <Eye className="h-4 w-4" />
            {t("details")}</Button>
          <ConfirmActionButton
            title={row.publishStatus === 1 ? t("unpublishDocument") : t("publishDocument")}
            description={row.publishStatus === 1 ? t("afterUnpublishingThisArticleWillNoLongerAppearOnPublicDocumentationPages") : t("afterPublishingThisArticleWillBeAccessibleOnPublicDocumentationPages")}
            onConfirm={() => toggleArticlePublish(row)}
          >
            {row.publishStatus === 1 ? t("unpublish") : t("publish")}
          </ConfirmActionButton>
          <ConfirmActionButton title={t("deleteDocument")} description={t("thisCallsTheBackendSoftDeleteApiAfterDeletionItCanNoLongerBeManagedFromTheList")} onConfirm={() => removeArticle(row)}>
            <span className="text-red-500">{t("delete")}</span>
          </ConfirmActionButton>
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<DocsArticle>[] = [
    {
      title: t("documentInformation"),
      fields: [
        { label: "ID", render: (detail) => detail.id },
        { label: t("language"), render: (detail) => languageLabel(detail.language) },
        { label: t("section"), render: (detail) => docsSectionLabel(detail.section, locale) },
        { label: t("title"), render: (detail) => detail.title },
        { label: "Slug", render: (detail) => detail.slug },
        { label: t("category"), render: (detail) => detail.categoryName ?? "-" },
        { label: t("sectionHome"), render: (detail) => (detail.isSectionHome === 1 ? t("yes") : t("no")) },
        { label: t("publishingStatus"), render: (detail) => publishLabel(detail.publishStatus, t) },
        { label: t("views"), render: (detail) => detail.viewCount ?? 0 },
        { label: t("publishedAt"), render: (detail) => <DateTimeText value={detail.publishedAt ?? undefined} /> },
        { label: t("updatedAt"), render: (detail) => <DateTimeText value={detail.updatedAt} /> },
        { label: t("summary"), fullWidth: true, render: (detail) => detail.summary || "-" },
      ],
    },
  ];

  const allCategoryOptions = flattenCategories(categories);
  const articleCategoryOptions = allCategoryOptions.filter((category) => {
    const matchesLanguage =
      articleFilters.language === ALL_VALUE || category.language === articleFilters.language;
    const matchesSection =
      articleFilters.section === ALL_VALUE || category.section === articleFilters.section;
    return matchesLanguage && matchesSection;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="DOCS OPS"
        title={t("documentationSystem")}
        description={t("maintainPublicHelpDocumentationCategoriesMarkdownContentPublishingStatusAndOrderingPublicPagesReadApiDocsWhileAdminPagesReadApiAdminDocs")}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => openCategoryForm()}>
              <FolderTree className="mr-2 h-4 w-4" />
              {t("newCategory")}</Button>
            <Button onClick={() => void openArticleForm()}>
              <Plus className="mr-2 h-4 w-4" />
              {t("newDocument")}</Button>
          </div>
        }
      />

      <ErrorAlert message={actionError ?? categoryResource.error ?? articleResource.error} />

      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList className="border border-border bg-card">
          <TabsTrigger value="articles">
            <FileText className="mr-2 h-4 w-4" />
            {t("documentArticles")}</TabsTrigger>
          <TabsTrigger value="categories">
            <FolderTree className="mr-2 h-4 w-4" />
            {t("categoryTree")}</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          <SearchPanel
            onSearch={() => articleResource.updateParams(buildArticleQuery(articleFilters))}
            onReset={() => {
              setArticleFilters(initialArticleFilters);
              articleResource.updateParams(initialArticleQuery);
            }}
          >
            <div className="space-y-2">
              <Label>{t("keyword")}</Label>
              <Input
                value={articleFilters.keyword}
                onChange={(event) => setArticleFilters((current) => ({ ...current, keyword: event.target.value }))}
                placeholder={t("titleSummaryOrBody")}
                className="h-9 w-[220px] bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("language")}</Label>
              <Select
                value={articleFilters.language}
                onValueChange={(value) =>
                  setArticleFilters((current) => ({ ...current, language: value, categoryId: ALL_VALUE }))
                }
              >
                <SelectTrigger className="h-9 w-[140px] bg-background">
                  <SelectValue placeholder={t("allLanguages")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>{t("allLanguages")}</SelectItem>
                  {DOCS_LANGUAGE_ITEMS.map((item) => (
                    <SelectItem key={item.language} value={item.language}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("section")}</Label>
              <Select
                value={articleFilters.section}
                onValueChange={(value) =>
                  setArticleFilters((current) => ({ ...current, section: value, categoryId: ALL_VALUE }))
                }
              >
                <SelectTrigger className="h-9 w-[160px] bg-background">
                  <SelectValue placeholder={t("allSections")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>{t("allSections")}</SelectItem>
                  {DOCS_ADMIN_SECTION_ITEMS.map((item) => (
                    <SelectItem key={item.section} value={item.section}>
                      {docsSectionLabel(item.section, locale)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("category")}</Label>
              <Select value={articleFilters.categoryId} onValueChange={(value) => setArticleFilters((current) => ({ ...current, categoryId: value }))}>
                <SelectTrigger className="h-9 w-[180px] bg-background">
                  <SelectValue placeholder={t("allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>{t("allCategories")}</SelectItem>
                  {articleCategoryOptions.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("sectionHome")}</Label>
              <Select value={articleFilters.isSectionHome} onValueChange={(value) => setArticleFilters((current) => ({ ...current, isSectionHome: value }))}>
                <SelectTrigger className="h-9 w-[160px] bg-background">
                  <SelectValue placeholder={t("all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>{t("all")}</SelectItem>
                  <SelectItem value="1">{t("yes")}</SelectItem>
                  <SelectItem value="0">{t("no")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("publishingStatus")}</Label>
              <Select value={articleFilters.publishStatus} onValueChange={(value) => setArticleFilters((current) => ({ ...current, publishStatus: value }))}>
                <SelectTrigger className="h-9 w-[160px] bg-background">
                  <SelectValue placeholder={t("allStatuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>{t("allStatuses")}</SelectItem>
                  <SelectItem value="0">{t("draft")}</SelectItem>
                  <SelectItem value="1">{t("published")}</SelectItem>
                  <SelectItem value="2">{t("offline")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("startTime")}</Label>
              <Input
                value={articleFilters.startTime}
                onChange={(event) => setArticleFilters((current) => ({ ...current, startTime: event.target.value }))}
                placeholder="2026-05-01 00:00:00"
                className="h-9 w-[190px] bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("endTime")}</Label>
              <Input
                value={articleFilters.endTime}
                onChange={(event) => setArticleFilters((current) => ({ ...current, endTime: event.target.value }))}
                placeholder="2026-05-31 23:59:59"
                className="h-9 w-[190px] bg-background"
              />
            </div>
          </SearchPanel>

          <DataTable
            columns={articleColumns}
            data={articleResource.page.records}
            rowKey={(row) => row.id}
            loading={articleResource.loading}
            emptyText={t("noDocumentArticlesYet")}
            pageNo={articleResource.page.pageNo}
            pageSize={articleResource.page.pageSize}
            total={articleResource.page.total}
            onPageChange={articleResource.changePage}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <SearchPanel
            onSearch={() => categoryResource.updateParams(buildCategoryQuery(categoryFilters))}
            onReset={() => {
              setCategoryFilters(initialCategoryFilters);
              categoryResource.updateParams(initialCategoryQuery);
            }}
          >
            <div className="space-y-2">
              <Label>{t("language")}</Label>
              <Select
                value={categoryFilters.language}
                onValueChange={(value) =>
                  setCategoryFilters((current) => ({ ...current, language: value, parentId: ALL_VALUE }))
                }
              >
                <SelectTrigger className="h-9 w-[140px] bg-background">
                  <SelectValue placeholder={t("allLanguages")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>{t("allLanguages")}</SelectItem>
                  {DOCS_LANGUAGE_ITEMS.map((item) => (
                    <SelectItem key={item.language} value={item.language}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("section")}</Label>
              <Select value={categoryFilters.section} onValueChange={(value) => setCategoryFilters((current) => ({ ...current, section: value }))}>
                <SelectTrigger className="h-9 w-[160px] bg-background">
                  <SelectValue placeholder={t("allSections")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>{t("allSections")}</SelectItem>
                  {DOCS_ADMIN_SECTION_ITEMS.map((item) => (
                    <SelectItem key={item.section} value={item.section}>
                      {docsSectionLabel(item.section, locale)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("parentID")}</Label>
              <Input
                value={categoryFilters.parentId === ALL_VALUE ? "" : categoryFilters.parentId}
                onChange={(event) => setCategoryFilters((current) => ({ ...current, parentId: event.target.value || ALL_VALUE }))}
                placeholder={t("all")}
                className="h-9 w-[160px] bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("status")}</Label>
              <Select value={categoryFilters.status} onValueChange={(value) => setCategoryFilters((current) => ({ ...current, status: value }))}>
                <SelectTrigger className="h-9 w-[160px] bg-background">
                  <SelectValue placeholder={t("allStatuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>{t("allStatuses")}</SelectItem>
                  <SelectItem value="1">{t("enable")}</SelectItem>
                  <SelectItem value="0">{t("disable")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SearchPanel>

          <DataTable
            columns={categoryColumns}
            data={categoryResource.page.records}
            rowKey={(row) => row.id}
            loading={categoryResource.loading}
            emptyText={t("noSYet")}
            pageNo={categoryResource.page.pageNo}
            pageSize={categoryResource.page.pageSize}
            total={categoryResource.page.total}
            onPageChange={categoryResource.changePage}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={categoryFormOpen} onOpenChange={setCategoryFormOpen}>
        <DialogContent className="flex max-w-2xl flex-col items-stretch">
          <DialogTitle className="sr-only">{t("editDocumentCategory")}</DialogTitle>
          <DocsCategoryForm
            initialData={editingCategory}
            categories={categories}
            onSuccess={() => {
              setCategoryFormOpen(false);
              void reloadAfterCategoryChange();
            }}
            onCancel={() => setCategoryFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={articleFormOpen} onOpenChange={setArticleFormOpen}>
        <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col items-stretch overflow-y-auto">
          <DialogTitle className="sr-only">{t("editDocumentArticle")}</DialogTitle>
          <DocsArticleForm
            initialData={editingArticle}
            categories={categories}
            onSuccess={() => {
              setArticleFormOpen(false);
              void articleResource.reload();
            }}
            onCancel={() => setArticleFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DetailDrawer
        data={articleDetail}
        open={detailOpen}
        title={t("documentDetails")}
        subtitle={(detail) => detail.title}
        sections={detailSections}
        onClose={() => setDetailOpen(false)}
      >
        {(detail) =>
          detail.contentMarkdown ? (
            <section className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-foreground">{t("bodyPreview")}</h3>
              <div className="max-h-[420px] overflow-y-auto">
                <MarkdownContent content={detail.contentMarkdown} />
              </div>
            </section>
          ) : null
        }
      </DetailDrawer>
    </div>
  );
}
