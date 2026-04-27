"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, Send, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSection } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";

import { getAdminBlogCategories, getAdminBlogPosts, getAdminBlogTags, publishAdminBlogPost, unpublishAdminBlogPost } from "@/api/admin";
import type { AdminCatalogQuery, ApiMapObject, BlogCategory, BlogTag } from "@/api/types";
import { formatEmpty, pickNumber, pickString, toErrorMessage } from "@/lib/format";

interface Filters {
  status: string;
}

const initialFilters: Filters = { status: "" };
const initialQuery: AdminCatalogQuery = { pageNo: 1, pageSize: 10 };

export default function AdminContentPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [detail, setDetail] = useState<ApiMapObject | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loader = useCallback(async (params: AdminCatalogQuery) => (await getAdminBlogPosts(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  useEffect(() => {
    let mounted = true;
    // Get all categories and tags (limited to first page for dictionary view)
    Promise.all([
      getAdminBlogCategories({ pageSize: 100 }), 
      getAdminBlogTags({ pageSize: 100 })
    ])
      .then(([categoryRes, tagRes]) => {
        if (!mounted) return;
        setCategories(categoryRes.data.records || []);
        setTags(tagRes.data.records || []);
      })
      .catch((err) => {
        if (mounted) setActionError(toErrorMessage(err));
      });
    return () => {
      mounted = false;
    };
  }, []);

  const publish = async (row: ApiMapObject, enabled: boolean) => {
    const id = pickNumber(row.id);
    if (!id) {
      setActionError("当前文章缺少 ID，无法执行发布操作。");
      return;
    }
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

  const columns: DataTableColumn<ApiMapObject>[] = [
    { key: "id", title: "文章 ID", render: (row) => formatEmpty(row.id) },
    { key: "title", title: "标题", render: (row) => <span className="line-clamp-1 max-w-[360px] text-[var(--admin-text)]">{pickString(row.title)}</span> },
    { key: "categoryName", title: "分类", render: (row) => <span className="text-[var(--admin-muted)]">{pickString(row.categoryName)}</span> },
    { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: "创建时间", render: (row) => <DateTimeText value={typeof row.createdAt === "string" ? row.createdAt : null} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-[var(--admin-text)] hover:bg-[var(--admin-hover)]" onClick={() => { setDetail(row); setDetailOpen(true); }}>
            <Eye className="h-4 w-4" />
            详情
          </Button>
          {pickNumber(row.status) === 1 ? (
            <ConfirmActionButton title="下架内容" description="下架后前台将不再展示该内容。" onConfirm={() => publish(row, false)}>
              <XCircle className="h-4 w-4" />
              下架
            </ConfirmActionButton>
          ) : (
            <ConfirmActionButton title="发布内容" description="发布后内容会进入前台展示范围。" onConfirm={() => publish(row, true)}>
              <Send className="h-4 w-4" />
              发布
            </ConfirmActionButton>
          )}
        </div>
      ),
    },
  ];

  const detailSections: DetailSection[] = detail
    ? [
        {
          title: "文章信息",
          fields: [
            { label: "文章 ID", value: pickString(detail.id) },
            { label: "标题", value: pickString(detail.title) },
            { label: "分类", value: pickString(detail.categoryName) },
            { label: "状态", value: <StatusBadge status={detail.status} /> },
            { label: "创建时间", value: <DateTimeText value={typeof detail.createdAt === "string" ? detail.createdAt : null} /> },
            { label: "更新时间", value: <DateTimeText value={typeof detail.updatedAt === "string" ? detail.updatedAt : null} /> },
          ],
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="CONTENT OPS" title="内容管理" description="管理帮助、公告或博客内容，并查看分类与标签基础字典。" />
      {(error || actionError) ? (
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-500 font-medium">
          {actionError ?? error}
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-[var(--admin-border)] bg-[var(--admin-panel-soft)] text-[var(--admin-text)] shadow-sm">
          <CardHeader><CardTitle className="text-sm font-semibold tracking-tight">分类字典</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {categories.map((item) => <StatusBadge key={item.id} status={item.status} label={item.categoryName} />)}
            {categories.length === 0 ? <span className="text-sm text-[var(--admin-muted)] italic">暂无分类数据</span> : null}
          </CardContent>
        </Card>
        <Card className="border-[var(--admin-border)] bg-[var(--admin-panel-soft)] text-[var(--admin-text)] shadow-sm">
          <CardHeader><CardTitle className="text-sm font-semibold tracking-tight">标签字典</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {tags.map((item) => <StatusBadge key={item.id} status={item.status} label={item.tagName} />)}
            {tags.length === 0 ? <span className="text-sm text-[var(--admin-muted)] italic">暂无标签数据</span> : null}
          </CardContent>
        </Card>
      </div>
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
              <SelectItem value="1">已发布</SelectItem>
              <SelectItem value="0">草稿/下架</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SearchPanel>
      <DataTable columns={columns} data={page.records} rowKey={(row) => pickString(row.id) || "unknown"} loading={loading} emptyText="暂无内容" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer open={detailOpen} title="内容详情" subtitle={pickString(detail?.title)} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
