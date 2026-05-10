"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, ChevronDown, ExternalLink, Loader2, Search, Users, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Link, useRouter } from "@/i18n/navigation";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import {
  getAdminTeamChildren,
  getAdminTeamMembers,
  getAdminTeamUserSummary,
} from "@/api/admin";
import type {
  AdminTeamMemberRow,
  AdminTeamTreeNode,
  PageResult,
} from "@/api/types";
import { cn } from "@/lib/utils";
import { formatEmpty, formatNumber, toErrorMessage } from "@/lib/format";

const CHILD_PAGE_SIZE = 50;
const MEMBER_PAGE_SIZE = 10;
const ALL_VALUE = "ALL";

const emptyMemberPage: PageResult<AdminTeamMemberRow> = {
  records: [],
  total: 0,
  pageNo: 1,
  pageSize: MEMBER_PAGE_SIZE,
};

interface ChildPageState {
  total: number;
  pageNo: number;
  pageSize: number;
}

export default function AdminTeamDetailPage() {
  const t = useTranslations("AdminPages.team");
  const router = useRouter();
  const params = useParams<{ userId?: string }>();
  const rootUserId = Number(params.userId);
  const validRootUserId = Number.isFinite(rootUserId) && rootUserId > 0;
  const [selectedUserId, setSelectedUserId] = useState<number | null>(validRootUserId ? rootUserId : null);
  const [childrenByParent, setChildrenByParent] = useState<Record<number, AdminTeamTreeNode[]>>({});
  const [childPages, setChildPages] = useState<Record<number, ChildPageState>>({});
  const [loadingChildren, setLoadingChildren] = useState<Record<number, boolean>>({});
  const [treeError, setTreeError] = useState<string | null>(null);
  const [memberKeywordInput, setMemberKeywordInput] = useState("");
  const [memberKeyword, setMemberKeyword] = useState("");
  const [memberLevel, setMemberLevel] = useState(ALL_VALUE);
  const [memberPage, setMemberPage] = useState<PageResult<AdminTeamMemberRow>>(emptyMemberPage);
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);

  const summaryLoader = useCallback(async () => {
    if (!validRootUserId) throw new Error(t("invalidUserId"));
    const res = await getAdminTeamUserSummary(rootUserId);
    return res.data;
  }, [rootUserId, t, validRootUserId]);
  const summary = useAsyncResource(summaryLoader);

  const loadChildren = useCallback(async (parentUserId: number, pageNo = 1) => {
    if (!validRootUserId) return null;

    setLoadingChildren((prev) => ({ ...prev, [parentUserId]: true }));
    setTreeError(null);
    try {
      const res = await getAdminTeamChildren({
        root_user_id: rootUserId,
        parent_user_id: parentUserId,
        pageNo,
        pageSize: CHILD_PAGE_SIZE,
      });
      const nextPage = res.data;
      setChildrenByParent((prev) => {
        const previousRecords = pageNo === 1 ? [] : prev[parentUserId] ?? [];
        return {
          ...prev,
          [parentUserId]: [...previousRecords, ...nextPage.records],
        };
      });
      setChildPages((prev) => ({
        ...prev,
        [parentUserId]: {
          total: nextPage.total,
          pageNo: nextPage.pageNo,
          pageSize: nextPage.pageSize,
        },
      }));
      return nextPage;
    } catch (err) {
      setTreeError(toErrorMessage(err));
      return null;
    } finally {
      setLoadingChildren((prev) => ({ ...prev, [parentUserId]: false }));
    }
  }, [rootUserId, validRootUserId]);

  useEffect(() => {
    if (!validRootUserId) return;

    setSelectedUserId(rootUserId);
    setChildrenByParent({});
    setChildPages({});
    setLoadingChildren({});
    setTreeError(null);
    void loadChildren(rootUserId, 1);
  }, [loadChildren, rootUserId, validRootUserId]);

  const rootNode = useMemo<AdminTeamTreeNode | null>(() => {
    if (!summary.data) return null;

    return {
      userId: summary.data.userId,
      userName: summary.data.userName,
      avatarKey: summary.data.avatarKey,
      userStatus: summary.data.userStatus,
      levelDepth: 0,
      parentUserId: 0,
      directCount: summary.data.directCount,
      indirectCount: summary.data.indirectCount,
      hasChildren: summary.data.directCount > 0,
      childrenCount: summary.data.directCount,
      totalContributionAmount: summary.data.totalCommission,
      yesterdayContributionAmount: summary.data.yesterdayCommission,
      currency: summary.data.currency,
    };
  }, [summary.data]);

  const loadMembers = useCallback(async (pageNo = 1) => {
    if (!selectedUserId) return;

    setMemberLoading(true);
    setMemberError(null);
    try {
      const res = await getAdminTeamMembers({
        ancestor_user_id: selectedUserId,
        pageNo,
        pageSize: MEMBER_PAGE_SIZE,
        level_depth: memberLevel === ALL_VALUE ? undefined : Number(memberLevel),
        keyword: memberKeyword || undefined,
      });
      setMemberPage(res.data);
    } catch (err) {
      setMemberError(toErrorMessage(err));
    } finally {
      setMemberLoading(false);
    }
  }, [memberKeyword, memberLevel, selectedUserId]);

  useEffect(() => {
    void loadMembers(1);
  }, [loadMembers]);

  const applyMemberFilters = () => {
    const nextKeyword = memberKeywordInput.trim();
    setMemberKeyword(nextKeyword);
    if (nextKeyword === memberKeyword) {
      void loadMembers(1);
    }
  };

  const memberColumns = useMemo<DataTableColumn<AdminTeamMemberRow>[]>(() => [
    {
      key: "userName",
      title: t("colUser"),
      render: (row) => (
        <div className="flex min-w-[200px] items-center gap-3">
          <UserAvatar src={row.avatarKey} name={row.userName} className="h-9 w-9" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">{formatEmpty(row.userName)}</div>
            <div className="text-xs text-muted-foreground">ID: {formatEmpty(row.userId)}</div>
          </div>
        </div>
      ),
    },
    {
      key: "levelDepth",
      title: t("colLevel"),
      render: (row) => <Badge variant="outline">L{formatNumber(row.levelDepth)}</Badge>,
    },
    {
      key: "orderStatus",
      title: t("colOrderStatus"),
      render: (row) => (
        <StatusBadge
          status={row.orderStatus ?? "NONE"}
          label={row.orderStatus === "NONE" || !row.orderStatus ? t("noOrder") : undefined}
        />
      ),
    },
    {
      key: "yesterdayContributionAmount",
      title: t("colYesterdayCommission"),
      render: (row) => <MoneyText value={row.yesterdayContributionAmount} currency={row.currency ?? undefined} />,
    },
    {
      key: "totalContributionAmount",
      title: t("colTotalCommission"),
      render: (row) => <MoneyText value={row.totalContributionAmount} currency={row.currency ?? undefined} />,
    },
    {
      key: "relationshipCreatedAt",
      title: t("relationshipCreatedAt"),
      render: (row) => <DateTimeText value={row.relationshipCreatedAt} />,
    },
    {
      key: "actions",
      title: t("colActions"),
      render: (row) => (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="font-medium"
            onClick={() => router.push(row.latestOrderNo ? `/admins/orders?order_no=${encodeURIComponent(row.latestOrderNo)}` : `/admins/orders?user_id=${row.userId}`)}
          >
            <ExternalLink className="h-4 w-4" />
            {t("orderDetail")}
          </Button>
          <Button variant="ghost" size="sm" className="font-medium" onClick={() => router.push(`/admins/wallets?user_id=${row.userId}`)}>
            <Wallet className="h-4 w-4" />
            {t("walletFlow")}
          </Button>
        </div>
      ),
    },
  ], [router, t]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("teamOps")}
        title={t("teamDetailTitle", { userId: validRootUserId ? rootUserId : "-" })}
        description={t("teamDetailDescription")}
        actions={
          <Button asChild variant="outline">
            <Link href="/admins/team">
              <ArrowLeft className="h-4 w-4" />
              {t("backToTeamList")}
            </Link>
          </Button>
        }
      />

      <ErrorAlert message={summary.error ?? treeError ?? memberError} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title={t("directCount")} value={summary.data ? formatNumber(summary.data.directCount) : "-"} />
        <SummaryCard title={t("indirectCount")} value={summary.data ? formatNumber(summary.data.indirectCount) : "-"} />
        <SummaryCard title={t("activeOrders")} value={summary.data ? formatNumber(summary.data.activeOrderCount) : "-"} />
        <SummaryCard
          title={t("totalCommission")}
          value={summary.data ? <MoneyText value={summary.data.totalCommission} currency={summary.data.currency ?? undefined} /> : "-"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="border bg-card shadow-sm">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">{t("teamTree")}</CardTitle>
              <Badge variant="outline">{t("levelLimit")}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{t("treeHint")}</p>
          </CardHeader>
          <CardContent className="max-h-[680px] overflow-y-auto p-4">
            {summary.loading && !rootNode ? (
              <div className="flex h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("loading")}
              </div>
            ) : rootNode ? (
              <TeamTreeNodeItem
                node={rootNode}
                defaultOpen
                selectedUserId={selectedUserId}
                childrenByParent={childrenByParent}
                childPages={childPages}
                loadingChildren={loadingChildren}
                onSelect={setSelectedUserId}
                onLoadChildren={loadChildren}
              />
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                {t("noTeamData")}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0 border bg-card shadow-sm">
          <CardHeader className="border-b border-border">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-base">
                  {selectedUserId ? t("auditTitle", { userId: selectedUserId }) : t("commissionAudit")}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{t("auditHint")}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={memberKeywordInput}
                    onChange={(event) => setMemberKeywordInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") applyMemberFilters();
                    }}
                    placeholder={t("searchMemberKeyword")}
                    className="h-10 pl-9 sm:w-[220px]"
                  />
                </div>
                <Select value={memberLevel} onValueChange={setMemberLevel}>
                  <SelectTrigger className="h-10 bg-card sm:w-[132px]">
                    <SelectValue placeholder={t("allLevels")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_VALUE}>{t("allLevels")}</SelectItem>
                    <SelectItem value="1">{t("level1Direct")}</SelectItem>
                    <SelectItem value="2">{t("level2Indirect")}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={applyMemberFilters}>
                  <Search className="h-4 w-4" />
                  {t("search")}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <DataTable
              columns={memberColumns}
              data={memberPage.records}
              rowKey={(row) => row.relationId}
              loading={memberLoading}
              emptyText={t("noSYet")}
              pageNo={memberPage.pageNo}
              pageSize={memberPage.pageSize}
              total={memberPage.total}
              onPageChange={(pageNo) => void loadMembers(pageNo)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: ReactNode }) {
  return (
    <Card className="border bg-card shadow-sm">
      <CardContent className="flex min-h-[96px] items-center justify-between gap-4 p-5">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          <div className="text-2xl font-semibold tabular-nums text-foreground">{value}</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Users className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function TeamTreeNodeItem({
  node,
  defaultOpen = false,
  selectedUserId,
  childrenByParent,
  childPages,
  loadingChildren,
  onSelect,
  onLoadChildren,
}: {
  node: AdminTeamTreeNode;
  defaultOpen?: boolean;
  selectedUserId: number | null;
  childrenByParent: Record<number, AdminTeamTreeNode[]>;
  childPages: Record<number, ChildPageState>;
  loadingChildren: Record<number, boolean>;
  onSelect: (userId: number) => void;
  onLoadChildren: (parentUserId: number, pageNo?: number) => Promise<PageResult<AdminTeamTreeNode> | null>;
}) {
  const t = useTranslations("AdminPages.team");
  const [open, setOpen] = useState(defaultOpen);
  const children = childrenByParent[node.userId] ?? [];
  const page = childPages[node.userId];
  const loading = Boolean(loadingChildren[node.userId]);
  const selected = selectedUserId === node.userId;
  const canExpand = node.hasChildren && node.levelDepth < 2;
  const hasMore = Boolean(page && children.length < page.total);

  const toggleOpen = () => {
    if (!canExpand) return;
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && children.length === 0 && !loading) {
      void onLoadChildren(node.userId, 1);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "group flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-3 transition-colors",
          selected ? "border-primary/40 bg-primary/10" : "border-transparent hover:bg-muted/50",
          node.levelDepth > 0 && "ml-5",
        )}
        onClick={() => onSelect(node.userId)}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={!canExpand}
            className="h-7 w-7 shrink-0"
            onClick={(event) => {
              event.stopPropagation();
              toggleOpen();
            }}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ChevronDown className={cn("h-4 w-4 transition-transform", !open && "-rotate-90")} />
            )}
          </Button>
          <UserAvatar src={node.avatarKey} name={node.userName} className="h-9 w-9" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">{formatEmpty(node.userName)}</div>
            <div className="text-xs text-muted-foreground">
              ID: {formatEmpty(node.userId)} · L{formatNumber(node.levelDepth)}
            </div>
          </div>
        </div>
        <div className="hidden shrink-0 text-right md:block">
          <MoneyText value={node.totalContributionAmount} currency={node.currency ?? undefined} className="text-sm" />
          <div className="text-xs text-muted-foreground">
            {t("directCount")}: {formatNumber(node.directCount)} · {t("indirectCount")}: {formatNumber(node.indirectCount)}
          </div>
        </div>
      </div>

      {open && canExpand ? (
        <div className="space-y-2 border-l border-border pl-3">
          {children.map((child) => (
            <TeamTreeNodeItem
              key={`${child.parentUserId}-${child.userId}`}
              node={child}
              selectedUserId={selectedUserId}
              childrenByParent={childrenByParent}
              childPages={childPages}
              loadingChildren={loadingChildren}
              onSelect={onSelect}
              onLoadChildren={onLoadChildren}
            />
          ))}
          {hasMore ? (
            <Button
              variant="outline"
              size="sm"
              className="ml-5"
              disabled={loading}
              onClick={() => void onLoadChildren(node.userId, (page?.pageNo ?? 1) + 1)}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t("loadMore")}
            </Button>
          ) : null}
          {!loading && children.length === 0 ? (
            <div className="ml-5 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
              {t("noDirectUsers")}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
