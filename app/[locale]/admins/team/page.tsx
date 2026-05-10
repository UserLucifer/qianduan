"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ChevronRight, GitBranch, Loader2, RotateCcw, Search, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { getAdminTeamRelations } from "@/api/admin";
import type { AdminTeamRelationQuery, UserTeamRelation } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { cn } from "@/lib/utils";

type TeamTranslator = ReturnType<typeof useTranslations>;

interface TeamFilters {
  rootUserId: string;
  descendantUserId: string;
}

interface TeamSection {
  rootUserId: number;
  directRelations: UserTeamRelation[];
  secondRelations: UserTeamRelation[];
}

interface TeamNavigationState {
  rootUserId: number | null;
  filters: TeamFilters;
}

const PAGE_SIZE = 100;
const initialFilters: TeamFilters = { rootUserId: "", descendantUserId: "" };

export default function AdminTeamPage() {
  const t = useTranslations("AdminPages.team");
  const dt = useTranslations("DataTable");
  const [filters, setFilters] = useState<TeamFilters>(initialFilters);
  const [activeRootUserId, setActiveRootUserId] = useState<number | null>(null);
  const [relations, setRelations] = useState<UserTeamRelation[]>([]);
  const [childRelationMap, setChildRelationMap] = useState<Record<number, UserTeamRelation[]>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navigationStack, setNavigationStack] = useState<TeamNavigationState[]>([]);
  const [expandedUserIds, setExpandedUserIds] = useState<Set<number>>(new Set());

  const loadRelations = useCallback(async (nextFilters: TeamFilters, nextRootUserId: number | null) => {
    setLoading(true);
    setError(null);

    try {
      const baseQuery: AdminTeamRelationQuery = {
        pageNo: 1,
        pageSize: PAGE_SIZE,
        ancestor_user_id: nextRootUserId ?? parseId(nextFilters.rootUserId),
        descendant_user_id: parseId(nextFilters.descendantUserId),
      };

      const res = await getAdminTeamRelations(baseQuery);
      const nextRelations = res.data.records.filter((relation) => relation.levelDepth <= 2);
      const directRelations = nextRelations.filter((relation) => relation.levelDepth === 1);

      const directChildResults = nextRootUserId !== null
        ? await Promise.allSettled(
            directRelations.map((relation) =>
              getAdminTeamRelations({
                pageNo: 1,
                pageSize: PAGE_SIZE,
                ancestor_user_id: relation.descendantUserId,
                level_depth: 1,
              }),
            ),
          )
        : [];

      const nextChildRelationMap = nextRootUserId !== null
        ? directChildResults.reduce<Record<number, UserTeamRelation[]>>((acc, result, index) => {
            if (result.status !== "fulfilled") return acc;

            const directUserId = directRelations[index]?.descendantUserId;
            if (directUserId == null) return acc;

            acc[directUserId] = result.value.data.records;
            return acc;
          }, {})
        : groupDirectRelationsByAncestor(nextRelations);

      setRelations(nextRelations);
      setChildRelationMap(nextChildRelationMap);
      setTotal(res.data.total);
    } catch (err) {
      setError(toErrorMessage(err));
      setRelations([]);
      setChildRelationMap({});
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRelations(initialFilters, null);
  }, [loadRelations]);

  const sections = useMemo(() => buildTeamSections(relations, activeRootUserId), [relations, activeRootUserId]);
  const activeSection = activeRootUserId !== null ? sections.find((section) => section.rootUserId === activeRootUserId) ?? null : null;
  const directCount = activeSection
    ? activeSection.directRelations.length
    : relations.filter((relation) => relation.levelDepth === 1).length;
  const secondCount = activeSection
    ? activeSection.secondRelations.length
    : relations.filter((relation) => relation.levelDepth === 2).length;

  const submitSearch = () => {
    const nextRootUserId = parseId(filters.rootUserId) ?? null;
    setActiveRootUserId(nextRootUserId);
    setNavigationStack([]);
    setExpandedUserIds(new Set());
    void loadRelations(filters, nextRootUserId);
  };

  const resetSearch = () => {
    setFilters(initialFilters);
    setActiveRootUserId(null);
    setNavigationStack([]);
    setExpandedUserIds(new Set());
    void loadRelations(initialFilters, null);
  };

  const goBackToParent = () => {
    const previous = navigationStack[navigationStack.length - 1];
    if (!previous) return;

    setNavigationStack((current) => current.slice(0, -1));
    setFilters(previous.filters);
    setActiveRootUserId(previous.rootUserId);
    setExpandedUserIds(new Set());

    void loadRelations(previous.filters, previous.rootUserId);
  };

  const openUserTeam = (userId: number) => {
    if (activeRootUserId === userId && filters.rootUserId === String(userId)) return;

    const nextFilters = { rootUserId: String(userId), descendantUserId: "" };
    setNavigationStack((current) => [...current, { rootUserId: activeRootUserId, filters }]);
    setFilters(nextFilters);
    setActiveRootUserId(userId);
    setExpandedUserIds(new Set());
    void loadRelations(nextFilters, userId);
  };

  const toggleUserExpanded = (userId: number) => {
    setExpandedUserIds((current) => {
      const next = new Set(current);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="TEAM OPS"
        title={t("teamRelationshipManagement")}
        description={t("reviewReferralTeamRelationshipsByParentChildAndLevelToTroubleshootCommissionPaths")}
        actions={<GitBranch className="h-5 w-5 text-primary" />}
      />

      <ErrorAlert message={error} />

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rootUserId">{t("rootUserId")}</Label>
                <Input
                  id="rootUserId"
                  inputMode="numeric"
                  placeholder={t("enterRootUserId")}
                  value={filters.rootUserId}
                  onChange={(event) => setFilters((current) => ({ ...current, rootUserId: event.target.value }))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") submitSearch();
                  }}
                  className="h-10 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descendantUserId">{t("descendantUserId")}</Label>
                <Input
                  id="descendantUserId"
                  inputMode="numeric"
                  placeholder={t("enterDescendantUserId")}
                  value={filters.descendantUserId}
                  onChange={(event) => setFilters((current) => ({ ...current, descendantUserId: event.target.value }))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") submitSearch();
                  }}
                  className="h-10 bg-background"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
              <Button onClick={submitSearch} disabled={loading}>
                <Search className="h-4 w-4" />
                {t("viewTeam")}
              </Button>
              <Button variant="outline" onClick={resetSearch} disabled={loading}>
                <RotateCcw className="h-4 w-4" />
                {t("globalView")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard title={t("currentRoot")} value={activeRootUserId !== null ? formatEmpty(activeRootUserId) : t("globalTopology")} />
        <MetricCard title={t("level1Users")} value={directCount} />
        <MetricCard title={t("level2Users")} value={secondCount} />
      </div>

      {total > PAGE_SIZE ? (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {t("partialDataNotice", { count: PAGE_SIZE, total })}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
        <Card className="min-h-[520px] shadow-sm">
          <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-base">{activeRootUserId !== null ? t("selectedUserTopology") : t("globalRelationshipTopology")}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{t("clickUserToSwitchContext")}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={goBackToParent} disabled={loading || navigationStack.length === 0}>
                <ArrowLeft className="h-4 w-4" />
                {t("backToParent")}
              </Button>
              <Badge variant="outline" className="rounded-full">
                {relations.length} / {total}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <LoadingState label={dt("loading")} />
            ) : sections.length === 0 ? (
              <EmptyState label={t("noSYet")} />
            ) : (
              <div className="space-y-5">
                {sections.map((section) => (
                  <TeamTreeSection
                    key={section.rootUserId}
                    section={section}
                    childRelationMap={childRelationMap}
                    activeRootUserId={activeRootUserId}
                    onUserClick={openUserTeam}
                    expandedUserIds={expandedUserIds}
                    onToggleUser={toggleUserExpanded}
                    t={t}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="min-h-[520px] shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("userTeamDetail")}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {activeRootUserId !== null ? t("showingSelectedUserTeam", { userId: activeRootUserId }) : t("selectUserHint")}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <LoadingState label={dt("loading")} compact />
            ) : activeSection ? (
              <TeamDetailPanel
                section={activeSection}
                childRelationMap={childRelationMap}
                onUserClick={openUserTeam}
                t={t}
              />
            ) : (
              <EmptyState label={t("selectUserHint")} compact />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function parseId(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const numeric = Number(trimmed);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function buildTeamSections(relations: UserTeamRelation[], activeRootUserId: number | null): TeamSection[] {
  const rootIds = activeRootUserId !== null
    ? [activeRootUserId]
    : Array.from(new Set(relations.map((relation) => relation.ancestorUserId)));

  return rootIds.map((rootUserId) => ({
    rootUserId,
    directRelations: relations.filter((relation) => relation.ancestorUserId === rootUserId && relation.levelDepth === 1),
    secondRelations: relations.filter((relation) => relation.ancestorUserId === rootUserId && relation.levelDepth === 2),
  }));
}

function groupDirectRelationsByAncestor(relations: UserTeamRelation[]) {
  return relations.reduce<Record<number, UserTeamRelation[]>>((acc, relation) => {
    if (relation.levelDepth !== 1) return acc;

    acc[relation.ancestorUserId] = [...(acc[relation.ancestorUserId] ?? []), relation];
    return acc;
  }, {});
}

function MetricCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
          <div className="mt-1 text-2xl font-semibold text-foreground">{value}</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
          <Users className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}

function TeamTreeSection({
  section,
  childRelationMap,
  activeRootUserId,
  onUserClick,
  expandedUserIds,
  onToggleUser,
  t,
}: {
  section: TeamSection;
  childRelationMap: Record<number, UserTeamRelation[]>;
  activeRootUserId: number | null;
  onUserClick: (userId: number) => void;
  expandedUserIds: Set<number>;
  onToggleUser: (userId: number) => void;
  t: TeamTranslator;
}) {
  const secondUserIds = new Set(section.secondRelations.map((relation) => relation.descendantUserId));
  const attachedSecondUserIds = new Set<number>();
  const rootExpanded = expandedUserIds.has(section.rootUserId);

  return (
    <div className="space-y-3">
      <UserNodeButton
        userId={section.rootUserId}
        label={activeRootUserId === section.rootUserId ? t("currentUser") : t("rootUser")}
        active={activeRootUserId === section.rootUserId}
        viewLabel={t("viewUserTeam")}
        onToggle={() => onToggleUser(section.rootUserId)}
        onViewTeam={() => onUserClick(section.rootUserId)}
      />

      {rootExpanded ? (
        <div className="ml-5 space-y-3 pl-4">
        {section.directRelations.length === 0 ? (
          <div className="text-sm text-muted-foreground">{t("noDirectUsers")}</div>
        ) : (
          section.directRelations.map((relation) => {
            const childRelations = (childRelationMap[relation.descendantUserId] ?? []).filter((childRelation) =>
              secondUserIds.size > 0 ? secondUserIds.has(childRelation.descendantUserId) : true,
            );
            childRelations.forEach((childRelation) => attachedSecondUserIds.add(childRelation.descendantUserId));
            const directExpanded = expandedUserIds.has(relation.descendantUserId);

            return (
              <div key={relation.id} className="relative">
                <UserNodeButton
                  userId={relation.descendantUserId}
                  label={t("level1Direct")}
                  relation={relation}
                  viewLabel={t("viewUserTeam")}
                  onToggle={() => onToggleUser(relation.descendantUserId)}
                  onViewTeam={() => onUserClick(relation.descendantUserId)}
                />

                {directExpanded && childRelations.length > 0 ? (
                  <div className="ml-5 mt-2 space-y-2 pl-4">
                    {childRelations.map((childRelation) => (
                      <UserNodeButton
                        key={childRelation.id}
                        userId={childRelation.descendantUserId}
                        label={t("level2Indirect")}
                        relation={childRelation}
                        compact
                        viewLabel={t("viewUserTeam")}
                        onToggle={() => onUserClick(childRelation.descendantUserId)}
                        onViewTeam={() => onUserClick(childRelation.descendantUserId)}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })
        )}

        {section.secondRelations.filter((relation) => !attachedSecondUserIds.has(relation.descendantUserId)).length > 0 ? (
          <div className="rounded-md border border-dashed bg-muted/20 p-3">
            <div className="mb-2 text-xs font-medium text-muted-foreground">{t("unmatchedLevel2Users")}</div>
            <div className="space-y-2">
              {section.secondRelations
                .filter((relation) => !attachedSecondUserIds.has(relation.descendantUserId))
                .map((relation) => (
                  <UserNodeButton
                    key={relation.id}
                    userId={relation.descendantUserId}
                    label={t("level2Indirect")}
                    relation={relation}
                    compact
                    viewLabel={t("viewUserTeam")}
                    onToggle={() => onUserClick(relation.descendantUserId)}
                    onViewTeam={() => onUserClick(relation.descendantUserId)}
                  />
                ))}
            </div>
          </div>
        ) : null}
        </div>
      ) : null}
    </div>
  );
}

function TeamDetailPanel({
  section,
  childRelationMap,
  onUserClick,
  t,
}: {
  section: TeamSection;
  childRelationMap: Record<number, UserTeamRelation[]>;
  onUserClick: (userId: number) => void;
  t: TeamTranslator;
}) {
  const secondUserIds = new Set(section.secondRelations.map((relation) => relation.descendantUserId));

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/20 p-4">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("currentRoot")}</div>
        <div className="mt-2 flex items-center gap-2 text-lg font-semibold">
          <UserRound className="h-4 w-4 text-muted-foreground" />
          <span>{formatEmpty(section.rootUserId)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <SectionHeading label={t("level1Users")} count={section.directRelations.length} />
        {section.directRelations.length === 0 ? (
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">{t("noDirectUsers")}</div>
        ) : (
          section.directRelations.map((relation) => {
            const childRelations = (childRelationMap[relation.descendantUserId] ?? []).filter((childRelation) =>
              secondUserIds.has(childRelation.descendantUserId),
            );

            return (
              <div key={relation.id} className="rounded-lg border bg-background/40 p-3">
                <UserSummary
                  relation={relation}
                  onClick={() => onUserClick(relation.descendantUserId)}
                  t={t}
                />
                {childRelations.length > 0 ? (
                  <div className="mt-3 space-y-2 border-t pt-3">
                    <SectionHeading label={t("level2Users")} count={childRelations.length} small />
                    {childRelations.map((childRelation) => (
                      <UserSummary
                        key={childRelation.id}
                        relation={childRelation}
                        onClick={() => onUserClick(childRelation.descendantUserId)}
                        t={t}
                        compact
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function UserNodeButton({
  userId,
  label,
  relation,
  active,
  compact,
  viewLabel,
  onToggle,
  onViewTeam,
}: {
  userId: number;
  label: string;
  relation?: UserTeamRelation;
  active?: boolean;
  compact?: boolean;
  viewLabel: string;
  onToggle: () => void;
  onViewTeam: () => void;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-stretch gap-2 rounded-lg border bg-card p-1 shadow-sm",
        active && "border-primary/50 bg-primary/10",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        className={cn(
          "h-auto min-w-0 flex-1 justify-start gap-3 whitespace-normal px-2 py-2 text-left hover:bg-muted/60",
          compact && "py-1.5",
        )}
        onClick={onToggle}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
          <UserRound className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground">{formatEmpty(userId)}</span>
          {relation ? (
            <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <StatusBadge status={`L${relation.levelDepth}`} label={`L${relation.levelDepth}`} />
              <DateTimeText value={relation.createdAt} />
            </span>
          ) : (
            <span className="block text-xs text-muted-foreground">
              {label}
            </span>
          )}
        </span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={viewLabel}
        title={viewLabel}
        className="my-1 h-8 w-8 shrink-0 self-center text-muted-foreground hover:text-foreground"
        onClick={onViewTeam}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function UserSummary({
  relation,
  onClick,
  t,
  compact,
}: {
  relation: UserTeamRelation;
  onClick: () => void;
  t: TeamTranslator;
  compact?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "flex h-auto w-full items-center justify-between gap-3 whitespace-normal rounded-md border bg-card px-3 py-2 text-left transition-colors hover:bg-muted/60",
        compact && "py-1.5",
      )}
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">{formatEmpty(relation.descendantUserId)}</span>
        <span className="mt-1 block text-xs text-muted-foreground">
          {t("relationshipCreatedAt")} <DateTimeText value={relation.createdAt} />
        </span>
      </span>
      <StatusBadge status={`L${relation.levelDepth}`} label={`L${relation.levelDepth}`} />
    </Button>
  );
}

function SectionHeading({ label, count, small }: { label: string; count: number; small?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className={cn("font-medium text-foreground", small ? "text-xs" : "text-sm")}>{label}</div>
      <Badge variant="secondary" className="rounded-full">{count}</Badge>
    </div>
  );
}

function LoadingState({ label, compact }: { label: string; compact?: boolean }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground", compact ? "h-48" : "h-80")}>
      <Loader2 className="h-6 w-6 animate-spin" />
      {label}
    </div>
  );
}

function EmptyState({ label, compact }: { label: string; compact?: boolean }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/20 text-sm text-muted-foreground", compact ? "h-48" : "h-80")}>
      <Users className="h-8 w-8 text-muted-foreground/60" />
      {label}
    </div>
  );
}
