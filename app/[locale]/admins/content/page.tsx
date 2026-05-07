"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Tags, Layers, ArrowUpCircle, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";

import {
  getAdminBlogCategories,
  getAdminBlogCategoryTranslations,
  getAdminBlogPosts,
  getAdminBlogPostTranslations,
  getAdminBlogTags,
  getAdminBlogTagTranslations,
  publishAdminBlogPost,
  unpublishAdminBlogPost,
  updateAdminBlogCategoryTranslation,
  updateAdminBlogPost,
  updateAdminBlogPostTranslation,
  updateAdminBlogTagTranslation,
  deleteAdminBlogPost
} from "@/api/admin";
import type { AdminBlogPost, BlogCategory, BlogPostQueryRequest, BlogTag } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { CategoryManager, TagManager } from "@/components/admin/BlogManagers";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { AdminTranslationEditor } from "@/components/admin/AdminTranslationEditor";
import { BlogPublishStatus } from "@/types/enums";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface Filters {
  status: string;
}

const initialFilters: Filters = { status: "" };
const initialQuery: BlogPostQueryRequest = { pageNo: 1, pageSize: 10 };

export default function AdminContentPage() {
  const t = useTranslations("AdminPages.content");
  const tTranslations = useTranslations("AdminTranslations");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [detail, setDetail] = useState<AdminBlogPost | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminBlogPost | null>(null);
  const [postTranslation, setPostTranslation] = useState<AdminBlogPost | null>(null);
  const [categoryTranslation, setCategoryTranslation] = useState<BlogCategory | null>(null);
  const [tagTranslation, setTagTranslation] = useState<BlogTag | null>(null);
  const [categoryMgrOpen, setCategoryMgrOpen] = useState(false);
  const [tagMgrOpen, setTagMgrOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loader = useCallback(async (params: BlogPostQueryRequest) => (await getAdminBlogPosts(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const refreshDictionaries = useCallback(async () => {
    try {
      const [categoryRes, tagRes] = await Promise.all([
        getAdminBlogCategories({ pageSize: 100 }),
        getAdminBlogTags({ pageSize: 100 })
      ]);
      setCategories(categoryRes.data.records || []);
      setTags(tagRes.data.records || []);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    refreshDictionaries();
  }, [refreshDictionaries]);

  const togglePublish = async (row: AdminBlogPost, enabled: boolean) => {
    const id = Number(row.id);
    if (!id) return;
    try {
      if (enabled) {
        await publishAdminBlogPost(id);
      } else {
        await unpublishAdminBlogPost(id);
      }
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const toggleTop = async (row: AdminBlogPost, isTop: boolean) => {
    const id = Number(row.id);
    if (!id) return;
    try {
      await updateAdminBlogPost(id, { isTop: isTop ? 1 : 0 });
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAdminBlogPost(id);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<AdminBlogPost>[] = [
    { key: "id", title: "ID", render: (row) => <span className="font-mono text-xs text-muted-foreground">{formatEmpty(row.id)}</span> },
    {
      key: "title", title: t("title"), render: (row) => (
        <div className="flex items-center gap-2">
          {Number(row.isTop) === 1 && <ArrowUpCircle className="h-4 w-4 text-amber-500 shrink-0" />}
          <span className="line-clamp-1 max-w-[300px] font-medium text-foreground">{((row.title) || "-").toString()}</span>
        </div>
      )
    },
    { key: "categoryName", title: t("category"), render: (row) => <Badge variant="outline" className="font-normal text-muted-foreground">{((row.categoryName) || "-").toString()}</Badge> },
    {
      key: "isTop", title: t("pinned"), render: (row) => (
        <Switch
          checked={Number(row.isTop) === 1}
          onCheckedChange={(checked) => toggleTop(row, checked)}
          className="scale-75 origin-left"
        />
      )
    },
    {
      key: "status", title: t("publishingStatus"), render: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={Number(row.status) === 1}
            onCheckedChange={(checked) => togglePublish(row, checked)}
            className="scale-75 origin-left"
          />
          <StatusBadge status={row.status} />
        </div>
      )
    },
    { key: "createdAt", title: t("createdAt"), render: (row) => <DateTimeText value={typeof row.createdAt === "string" ? row.createdAt : null} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => { setEditingPost(row); setFormOpen(true); }}>
            {t("edit")}</Button>
          <Button variant="ghost" size="sm" className="font-medium text-blue-500 hover:bg-blue-500/10" onClick={() => setPostTranslation(row)}>
            <Languages className="mr-1 h-3.5 w-3.5" />
            {tTranslations("button")}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setDetail(row); setDetailOpen(true); }}>
            {t("details")}</Button>
          <ConfirmActionButton title={t("delete")} description={t("deleteThisArticleThisActionCannotBeUndone")} onConfirm={() => handleDelete(Number(row.id)!)}>
            <span className="text-red-500">{t("delete2")}</span>
          </ConfirmActionButton>
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<AdminBlogPost>[] = [
      {
        title: t("articleBasics"),
        fields: [
          { label: t("articleID"), render: (detail) => ((detail.id) || "-").toString() },
          { label: t("title"), render: (detail) => ((detail.title) || "-").toString() },
          { label: t("summary"), render: (detail) => ((detail.summary) || "-").toString() || t("none") },
          { label: t("category"), render: (detail) => ((detail.categoryName) || "-").toString() },
          { label: t("tags"), render: (detail) => Array.isArray(detail.tagNames) ? detail.tagNames.join(", ") : t("none") },
          { label: t("publishingStatus"), render: (detail) => <StatusBadge status={detail.status} /> },
          { label: t("pinned2"), render: (detail) => Number(detail.isTop) === 1 ? t("yes") : t("no") },
          { label: t("coverImage"), render: (detail) => detail.coverImageUrl ? <img src={detail.coverImageUrl as string} className="h-20 w-32 object-cover rounded border" /> : t("none") },
          { label: t("createdAt"), render: (detail) => <DateTimeText value={typeof detail.createdAt === "string" ? detail.createdAt : null} /> },
          { label: t("updatedAt"), render: (detail) => <DateTimeText value={typeof detail.updatedAt === "string" ? detail.updatedAt : null} /> },
        ],
      },
    ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CONTENT OPS"
        title={t("contentManagement")}
        description={t("manageHelpCenterAnnouncementsBlogPostsAndRuleDocumentsWithFlexibleCategoriesAndTags")}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCategoryMgrOpen(true)}>
              <Layers className="mr-2 h-4 w-4" /> {t("categoryManagement")}</Button>
            <Button variant="outline" size="sm" onClick={() => setTagMgrOpen(true)}>
              <Tags className="mr-2 h-4 w-4" /> {t("tagManagement")}</Button>
            <Button size="sm" onClick={() => { setEditingPost(null); setFormOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> {t("newArticle")}</Button>
          </div>
        }
      />

      <ErrorAlert message={actionError ?? error} />

      <SearchPanel
        onSearch={() => updateParams({
          pageNo: 1,
          pageSize: page.pageSize,
          publish_status: filters.status ? Number(filters.status) : undefined,
        })}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label>{t("publishingStatus")}</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters({ status: val })}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allStatuses")}</SelectItem>
              <SelectItem value={BlogPublishStatus.PUBLISHED.toString()}>{t("published")}</SelectItem>
              <SelectItem value={BlogPublishStatus.DRAFT.toString()}>{t("draftUnpublished")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SearchPanel>

      <DataTable
        columns={columns}
        data={page.records}
        rowKey={(row) => ((row.id) || "-").toString() || "unknown"}
        loading={loading}
        emptyText={t("noSYet")}
        pageNo={page.pageNo}
        pageSize={page.pageSize}
        total={page.total}
        onPageChange={changePage}
      />

      {/* Detail Drawer */}
      <DetailDrawer data={detail} open={detailOpen} title={t("articleDetails")} subtitle={(data) => ((data.title) || "-").toString()} sections={detailSections} onClose={() => setDetailOpen(false)} />

      {/* Post Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col items-stretch overflow-y-auto">
          <DialogTitle className="sr-only">{t("editArticle")}</DialogTitle>
          <BlogPostForm
            initialData={editingPost}
            categories={categories}
            tags={tags}
            onSuccess={() => { setFormOpen(false); reload(); }}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Category Manager Dialog */}
      <Dialog open={categoryMgrOpen} onOpenChange={setCategoryMgrOpen}>
        <DialogContent className="flex flex-col items-stretch sm:max-w-[400px]">
          <DialogTitle className="sr-only">{t("categoryManagement")}</DialogTitle>
          <CategoryManager
            items={categories}
            onRefresh={() => { refreshDictionaries(); reload(); }}
            onTranslate={(item) => {
              setCategoryMgrOpen(false);
              setCategoryTranslation(item);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Tag Manager Dialog */}
      <Dialog open={tagMgrOpen} onOpenChange={setTagMgrOpen}>
        <DialogContent className="flex flex-col items-stretch sm:max-w-[400px]">
          <DialogTitle className="sr-only">{t("tagManagement")}</DialogTitle>
          <TagManager
            items={tags}
            onRefresh={() => { refreshDictionaries(); reload(); }}
            onTranslate={(item) => {
              setTagMgrOpen(false);
              setTagTranslation(item);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(categoryTranslation)} onOpenChange={(open) => !open && setCategoryTranslation(null)}>
        <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col items-stretch overflow-y-auto">
          <DialogTitle className="sr-only">{tTranslations("blogCategoryTitle")}</DialogTitle>
          {categoryTranslation ? (
            <AdminTranslationEditor
              title={tTranslations("blogCategoryTitle")}
              resourceKey={categoryTranslation.id}
              fields={[{ key: "categoryName", label: tTranslations("categoryName") }]}
              load={() => getAdminBlogCategoryTranslations(categoryTranslation.id)}
              save={(locale, values) => updateAdminBlogCategoryTranslation(categoryTranslation.id, { locale, categoryName: values.categoryName })}
              onSuccess={() => { void refreshDictionaries(); void reload(); }}
              onCancel={() => setCategoryTranslation(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(tagTranslation)} onOpenChange={(open) => !open && setTagTranslation(null)}>
        <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col items-stretch overflow-y-auto">
          <DialogTitle className="sr-only">{tTranslations("blogTagTitle")}</DialogTitle>
          {tagTranslation ? (
            <AdminTranslationEditor
              title={tTranslations("blogTagTitle")}
              resourceKey={tagTranslation.id}
              fields={[{ key: "tagName", label: tTranslations("tagName") }]}
              load={() => getAdminBlogTagTranslations(tagTranslation.id)}
              save={(locale, values) => updateAdminBlogTagTranslation(tagTranslation.id, { locale, tagName: values.tagName })}
              onSuccess={() => { void refreshDictionaries(); void reload(); }}
              onCancel={() => setTagTranslation(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(postTranslation)} onOpenChange={(open) => !open && setPostTranslation(null)}>
        <DialogContent className="flex max-h-[85vh] max-w-5xl flex-col items-stretch overflow-y-auto">
          <DialogTitle className="sr-only">{tTranslations("blogPostTitle")}</DialogTitle>
          {postTranslation?.id ? (
            <AdminTranslationEditor
              title={tTranslations("blogPostTitle")}
              resourceKey={Number(postTranslation.id)}
              fields={[
                { key: "title", label: tTranslations("blogTitle") },
                { key: "summary", label: tTranslations("blogSummary"), multiline: true, className: "min-h-[90px] bg-background" },
                { key: "contentMarkdown", label: tTranslations("blogContent"), multiline: true, className: "min-h-[260px] bg-background font-mono text-xs" },
              ]}
              load={() => getAdminBlogPostTranslations(Number(postTranslation.id))}
              save={(locale, values) => updateAdminBlogPostTranslation(Number(postTranslation.id), {
                locale,
                title: values.title,
                summary: values.summary,
                contentMarkdown: values.contentMarkdown,
              })}
              onSuccess={() => void reload()}
              onCancel={() => setPostTranslation(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
