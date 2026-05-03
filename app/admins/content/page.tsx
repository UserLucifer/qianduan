"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, Send, XCircle, Plus, Tags, Layers, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  getAdminBlogPosts,
  getAdminBlogTags,
  publishAdminBlogPost,
  unpublishAdminBlogPost,
  updateAdminBlogPost,
  deleteAdminBlogPost
} from "@/api/admin";
import type { AdminCatalogQuery, AdminBlogPost, BlogCategory, BlogTag } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { CategoryManager, TagManager } from "@/components/admin/BlogManagers";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { BlogPublishStatus } from "@/types/enums";

interface Filters {
  status: string;
}

const initialFilters: Filters = { status: "" };
const initialQuery: AdminCatalogQuery = { pageNo: 1, pageSize: 10 };

export default function AdminContentPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [detail, setDetail] = useState<AdminBlogPost | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminBlogPost | null>(null);
  const [categoryMgrOpen, setCategoryMgrOpen] = useState(false);
  const [tagMgrOpen, setTagMgrOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loader = useCallback(async (params: AdminCatalogQuery) => (await getAdminBlogPosts(params)).data, []);
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
    { key: "id", title: "ID", render: (row) => <span className="font-mono text-xs text-[var(--admin-muted)]">{formatEmpty(row.id)}</span> },
    {
      key: "title", title: "标题", render: (row) => (
        <div className="flex items-center gap-2">
          {Number(row.isTop) === 1 && <ArrowUpCircle className="h-4 w-4 text-amber-500 shrink-0" />}
          <span className="line-clamp-1 max-w-[300px] font-medium text-[var(--admin-text)]">{((row.title) || "-").toString()}</span>
        </div>
      )
    },
    { key: "categoryName", title: "分类", render: (row) => <Badge variant="outline" className="font-normal text-[var(--admin-muted)] border-[var(--admin-border)]">{((row.categoryName) || "-").toString()}</Badge> },
    {
      key: "isTop", title: "置顶", render: (row) => (
        <Switch
          checked={Number(row.isTop) === 1}
          onCheckedChange={(checked) => toggleTop(row, checked)}
          className="scale-75 origin-left"
        />
      )
    },
    {
      key: "status", title: "发布状态", render: (row) => (
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
    { key: "createdAt", title: "创建时间", render: (row) => <DateTimeText value={typeof row.createdAt === "string" ? row.createdAt : null} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-[var(--admin-text)] hover:bg-[var(--admin-hover)]" onClick={() => { setEditingPost(row); setFormOpen(true); }}>
            编辑
          </Button>
          <Button variant="ghost" size="sm" className="text-[var(--admin-text)] hover:bg-[var(--admin-hover)]" onClick={() => { setDetail(row); setDetailOpen(true); }}>
            详情
          </Button>
          <ConfirmActionButton title="删除文章" description="确定要删除这篇文章吗？此操作不可撤销。" onConfirm={() => handleDelete(Number(row.id)!)}>
            <span className="text-red-500">删除</span>
          </ConfirmActionButton>
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<AdminBlogPost>[] = [
      {
        title: "文章基本信息",
        fields: [
          { label: "文章 ID", render: (detail) => ((detail.id) || "-").toString() },
          { label: "标题", render: (detail) => ((detail.title) || "-").toString() },
          { label: "摘要", render: (detail) => ((detail.summary) || "-").toString() || "无" },
          { label: "分类", render: (detail) => ((detail.categoryName) || "-").toString() },
          { label: "标签", render: (detail) => Array.isArray(detail.tagNames) ? detail.tagNames.join(", ") : "无" },
          { label: "发布状态", render: (detail) => <StatusBadge status={detail.status} /> },
          { label: "是否置顶", render: (detail) => Number(detail.isTop) === 1 ? "是" : "否" },
          { label: "封面图", render: (detail) => detail.coverImageUrl ? <img src={detail.coverImageUrl as string} className="h-20 w-32 object-cover rounded border" /> : "无" },
          { label: "创建时间", render: (detail) => <DateTimeText value={typeof detail.createdAt === "string" ? detail.createdAt : null} /> },
          { label: "更新时间", render: (detail) => <DateTimeText value={typeof detail.updatedAt === "string" ? detail.updatedAt : null} /> },
        ],
      },
    ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CONTENT OPS"
        title="内容管理"
        description="管理帮助中心、公告、博客或规则说明文档。支持分类与标签的灵活组织。"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCategoryMgrOpen(true)} className="border-[var(--admin-border)] text-[var(--admin-text)]">
              <Layers className="mr-2 h-4 w-4" /> 分类管理
            </Button>
            <Button variant="outline" size="sm" onClick={() => setTagMgrOpen(true)} className="border-[var(--admin-border)] text-[var(--admin-text)]">
              <Tags className="mr-2 h-4 w-4" /> 标签管理
            </Button>
            <Button size="sm" onClick={() => { setEditingPost(null); setFormOpen(true); }} className="bg-[#5e6ad2] text-white hover:bg-[#7170ff]">
              <Plus className="mr-2 h-4 w-4" /> 新建文章
            </Button>
          </div>
        }
      />

      {(error || actionError) ? (
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-500 font-medium">
          {actionError ?? error}
        </div>
      ) : null}

      <SearchPanel
        onSearch={() => updateParams({ pageNo: 1, pageSize: page.pageSize, status: filters.status ? Number(filters.status) : undefined })}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label>发布状态</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters({ status: val })}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value={BlogPublishStatus.PUBLISHED.toString()}>已发布</SelectItem>
              <SelectItem value={BlogPublishStatus.DRAFT.toString()}>草稿/下架</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SearchPanel>

      <DataTable
        columns={columns}
        data={page.records}
        rowKey={(row) => ((row.id) || "-").toString() || "unknown"}
        loading={loading}
        emptyText="暂无内容数据"
        pageNo={page.pageNo}
        pageSize={page.pageSize}
        total={page.total}
        onPageChange={changePage}
      />

      {/* Detail Drawer */}
      <DetailDrawer data={detail} open={detailOpen} title="文章详情" subtitle={(data) => ((data.title) || "-").toString()} sections={detailSections} onClose={() => setDetailOpen(false)} />

      {/* Post Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-4xl border-[var(--admin-border)] bg-[var(--admin-panel-strong)] text-[var(--admin-text)] overflow-y-auto max-h-[90vh] flex flex-col items-stretch">
          <DialogTitle className="sr-only">编辑文章</DialogTitle>
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
        <DialogContent className="sm:max-w-[400px] border-[var(--admin-border)] bg-[var(--admin-panel-strong)] text-[var(--admin-text)] flex flex-col items-stretch">
          <DialogTitle className="sr-only">分类管理</DialogTitle>
          <CategoryManager items={categories} onRefresh={() => { refreshDictionaries(); reload(); }} />
        </DialogContent>
      </Dialog>

      {/* Tag Manager Dialog */}
      <Dialog open={tagMgrOpen} onOpenChange={setTagMgrOpen}>
        <DialogContent className="sm:max-w-[400px] border-[var(--admin-border)] bg-[var(--admin-panel-strong)] text-[var(--admin-text)] flex flex-col items-stretch">
          <DialogTitle className="sr-only">标签管理</DialogTitle>
          <TagManager items={tags} onRefresh={() => { refreshDictionaries(); reload(); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
