"use client";

import { useCallback, useEffect, useState } from "react";
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
const DOCS_ADMIN_SECTION_ITEMS: Array<{ section: DocsSection; label: string }> = [
  ...DOCS_SECTION_ITEMS.map(({ section, label }) => ({ section, label })),
  { section: "support", label: "支持" },
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

function publishLabel(status: number | null | undefined) {
  if (status === 1) return "已发布";
  if (status === 2) return "已下线";
  return "草稿";
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
    { key: "language", title: "语言", render: (row) => <Badge variant="outline">{languageLabel(row.language)}</Badge> },
    { key: "section", title: "分区", render: (row) => <Badge variant="outline">{docsSectionLabel(row.section)}</Badge> },
    { key: "categoryName", title: "分类名称", render: (row) => <span className="font-medium text-foreground">{row.categoryName}</span> },
    { key: "categoryCode", title: "编码", render: (row) => <span className="font-mono text-xs text-muted-foreground">{row.categoryCode}</span> },
    { key: "parentId", title: "父级", render: (row) => formatEmpty(row.parentId) },
    { key: "sortNo", title: "排序", render: (row) => formatEmpty(row.sortNo) },
    { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
    { key: "updatedAt", title: "更新时间", render: (row) => <DateTimeText value={row.updatedAt} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => openCategoryForm(row)}>
            <Edit2 className="h-4 w-4" />
            编辑
          </Button>
          {row.status === 1 ? (
            <ConfirmActionButton title="停用分类" description="停用后公开文档分类树不再展示该分类。" onConfirm={() => toggleCategory(row, false)}>
              <PowerOff className="h-4 w-4" />
              停用
            </ConfirmActionButton>
          ) : (
            <ConfirmActionButton title="启用分类" description="启用后该分类可在公开文档树展示。" onConfirm={() => toggleCategory(row, true)}>
              <Power className="h-4 w-4" />
              启用
            </ConfirmActionButton>
          )}
          <ConfirmActionButton title="删除分类" description="该操作会调用后端软删除接口，请确认分类下没有需要保留的内容。" onConfirm={() => removeCategory(row)}>
            <span className="inline-flex items-center gap-2 text-red-500">
              <Trash2 className="h-4 w-4" />
              删除
            </span>
          </ConfirmActionButton>
        </div>
      ),
    },
  ];

  const articleColumns: DataTableColumn<DocsArticle>[] = [
    { key: "id", title: "ID", render: (row) => <span className="font-mono text-xs text-muted-foreground">{row.id}</span> },
    { key: "language", title: "语言", render: (row) => <Badge variant="outline">{languageLabel(row.language)}</Badge> },
    { key: "section", title: "分区", render: (row) => <Badge variant="outline">{docsSectionLabel(row.section)}</Badge> },
    {
      key: "title",
      title: "标题",
      render: (row) => (
        <div className="min-w-0">
          <div className="line-clamp-1 font-medium text-foreground">{row.title}</div>
          <div className="mt-1 line-clamp-1 font-mono text-xs text-muted-foreground">{row.slug}</div>
        </div>
      ),
    },
    { key: "categoryName", title: "分类", render: (row) => <Badge variant="outline">{row.categoryName ?? "-"}</Badge> },
    {
      key: "isSectionHome",
      title: "首页",
      render: (row) =>
        row.isSectionHome === 1 ? (
          <Badge variant="outline" className="border-emerald-400/20 bg-emerald-400/10 text-emerald-500">
            分区首页
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: "publishStatus",
      title: "发布状态",
      render: (row) => (
        <StatusBadge
          status={String(row.publishStatus)}
          label={publishLabel(row.publishStatus)}
          className={publishBadgeClassName(row.publishStatus)}
        />
      ),
    },
    { key: "sortNo", title: "排序", render: (row) => formatEmpty(row.sortNo) },
    { key: "viewCount", title: "浏览量", render: (row) => formatEmpty(row.viewCount) },
    { key: "updatedAt", title: "更新时间", render: (row) => <DateTimeText value={row.updatedAt} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => openArticleForm(row)}>
            <Edit2 className="h-4 w-4" />
            编辑
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openArticleDetail(row)}>
            <Eye className="h-4 w-4" />
            详情
          </Button>
          <ConfirmActionButton
            title={row.publishStatus === 1 ? "下线文档" : "发布文档"}
            description={row.publishStatus === 1 ? "下线后公开文档页不再展示该文章。" : "发布后公开文档页可访问该文章。"}
            onConfirm={() => toggleArticlePublish(row)}
          >
            {row.publishStatus === 1 ? "下线" : "发布"}
          </ConfirmActionButton>
          <ConfirmActionButton title="删除文档" description="该操作会调用后端软删除接口，删除后不可在列表继续管理。" onConfirm={() => removeArticle(row)}>
            <span className="text-red-500">删除</span>
          </ConfirmActionButton>
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<DocsArticle>[] = [
    {
      title: "文档信息",
      fields: [
        { label: "ID", render: (detail) => detail.id },
        { label: "语言", render: (detail) => languageLabel(detail.language) },
        { label: "分区", render: (detail) => docsSectionLabel(detail.section) },
        { label: "标题", render: (detail) => detail.title },
        { label: "Slug", render: (detail) => detail.slug },
        { label: "分类", render: (detail) => detail.categoryName ?? "-" },
        { label: "分区首页", render: (detail) => (detail.isSectionHome === 1 ? "是" : "否") },
        { label: "发布状态", render: (detail) => publishLabel(detail.publishStatus) },
        { label: "浏览量", render: (detail) => detail.viewCount ?? 0 },
        { label: "发布时间", render: (detail) => <DateTimeText value={detail.publishedAt ?? undefined} /> },
        { label: "更新时间", render: (detail) => <DateTimeText value={detail.updatedAt} /> },
        { label: "摘要", fullWidth: true, render: (detail) => detail.summary || "-" },
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
        title="文档系统"
        description="维护公开帮助文档的分类树、Markdown 正文、发布状态和排序。公开页读取 /api/docs/**，后台管理读取 /api/admin/docs/**。"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => openCategoryForm()}>
              <FolderTree className="mr-2 h-4 w-4" />
              新增分类
            </Button>
            <Button onClick={() => void openArticleForm()}>
              <Plus className="mr-2 h-4 w-4" />
              新增文档
            </Button>
          </div>
        }
      />

      <ErrorAlert message={actionError ?? categoryResource.error ?? articleResource.error} />

      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList className="border border-border bg-card">
          <TabsTrigger value="articles">
            <FileText className="mr-2 h-4 w-4" />
            文档文章
          </TabsTrigger>
          <TabsTrigger value="categories">
            <FolderTree className="mr-2 h-4 w-4" />
            分类树
          </TabsTrigger>
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
              <Label>关键词</Label>
              <Input
                value={articleFilters.keyword}
                onChange={(event) => setArticleFilters((current) => ({ ...current, keyword: event.target.value }))}
                placeholder="标题 / 摘要 / 正文"
                className="h-9 w-[220px] bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>语言</Label>
              <Select
                value={articleFilters.language}
                onValueChange={(value) =>
                  setArticleFilters((current) => ({ ...current, language: value, categoryId: ALL_VALUE }))
                }
              >
                <SelectTrigger className="h-9 w-[140px] bg-background">
                  <SelectValue placeholder="全部语言" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>全部语言</SelectItem>
                  {DOCS_LANGUAGE_ITEMS.map((item) => (
                    <SelectItem key={item.language} value={item.language}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>分区</Label>
              <Select
                value={articleFilters.section}
                onValueChange={(value) =>
                  setArticleFilters((current) => ({ ...current, section: value, categoryId: ALL_VALUE }))
                }
              >
                <SelectTrigger className="h-9 w-[160px] bg-background">
                  <SelectValue placeholder="全部分区" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>全部分区</SelectItem>
                  {DOCS_ADMIN_SECTION_ITEMS.map((item) => (
                    <SelectItem key={item.section} value={item.section}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>分类</Label>
              <Select value={articleFilters.categoryId} onValueChange={(value) => setArticleFilters((current) => ({ ...current, categoryId: value }))}>
                <SelectTrigger className="h-9 w-[180px] bg-background">
                  <SelectValue placeholder="全部分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>全部分类</SelectItem>
                  {articleCategoryOptions.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>分区首页</Label>
              <Select value={articleFilters.isSectionHome} onValueChange={(value) => setArticleFilters((current) => ({ ...current, isSectionHome: value }))}>
                <SelectTrigger className="h-9 w-[160px] bg-background">
                  <SelectValue placeholder="全部" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>全部</SelectItem>
                  <SelectItem value="1">是</SelectItem>
                  <SelectItem value="0">否</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>发布状态</Label>
              <Select value={articleFilters.publishStatus} onValueChange={(value) => setArticleFilters((current) => ({ ...current, publishStatus: value }))}>
                <SelectTrigger className="h-9 w-[160px] bg-background">
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>全部状态</SelectItem>
                  <SelectItem value="0">草稿</SelectItem>
                  <SelectItem value="1">已发布</SelectItem>
                  <SelectItem value="2">已下线</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>开始时间</Label>
              <Input
                value={articleFilters.startTime}
                onChange={(event) => setArticleFilters((current) => ({ ...current, startTime: event.target.value }))}
                placeholder="2026-05-01 00:00:00"
                className="h-9 w-[190px] bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>结束时间</Label>
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
            emptyText="暂无文档文章"
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
              <Label>语言</Label>
              <Select
                value={categoryFilters.language}
                onValueChange={(value) =>
                  setCategoryFilters((current) => ({ ...current, language: value, parentId: ALL_VALUE }))
                }
              >
                <SelectTrigger className="h-9 w-[140px] bg-background">
                  <SelectValue placeholder="全部语言" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>全部语言</SelectItem>
                  {DOCS_LANGUAGE_ITEMS.map((item) => (
                    <SelectItem key={item.language} value={item.language}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>分区</Label>
              <Select value={categoryFilters.section} onValueChange={(value) => setCategoryFilters((current) => ({ ...current, section: value }))}>
                <SelectTrigger className="h-9 w-[160px] bg-background">
                  <SelectValue placeholder="全部分区" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>全部分区</SelectItem>
                  {DOCS_ADMIN_SECTION_ITEMS.map((item) => (
                    <SelectItem key={item.section} value={item.section}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>父级 ID</Label>
              <Input
                value={categoryFilters.parentId === ALL_VALUE ? "" : categoryFilters.parentId}
                onChange={(event) => setCategoryFilters((current) => ({ ...current, parentId: event.target.value || ALL_VALUE }))}
                placeholder="全部"
                className="h-9 w-[160px] bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <Select value={categoryFilters.status} onValueChange={(value) => setCategoryFilters((current) => ({ ...current, status: value }))}>
                <SelectTrigger className="h-9 w-[160px] bg-background">
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>全部状态</SelectItem>
                  <SelectItem value="1">启用</SelectItem>
                  <SelectItem value="0">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SearchPanel>

          <DataTable
            columns={categoryColumns}
            data={categoryResource.page.records}
            rowKey={(row) => row.id}
            loading={categoryResource.loading}
            emptyText="暂无文档分类"
            pageNo={categoryResource.page.pageNo}
            pageSize={categoryResource.page.pageSize}
            total={categoryResource.page.total}
            onPageChange={categoryResource.changePage}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={categoryFormOpen} onOpenChange={setCategoryFormOpen}>
        <DialogContent className="flex max-w-2xl flex-col items-stretch">
          <DialogTitle className="sr-only">编辑文档分类</DialogTitle>
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
          <DialogTitle className="sr-only">编辑文档文章</DialogTitle>
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
        title="文档详情"
        subtitle={(detail) => detail.title}
        sections={detailSections}
        onClose={() => setDetailOpen(false)}
      >
        {(detail) =>
          detail.contentMarkdown ? (
            <section className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-foreground">正文预览</h3>
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
