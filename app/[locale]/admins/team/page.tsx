"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { GitBranch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getAdminTeamRelations } from "@/api/admin";
import type { AdminTeamRelationQuery, UserTeamRelation } from "@/api/types";
import { formatEmpty } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface TeamFilters {
  ancestorUserId: string;
  descendantUserId: string;
  levelDepth: string;
}

const initialFilters: TeamFilters = { ancestorUserId: "", descendantUserId: "", levelDepth: "" };
const initialQuery: AdminTeamRelationQuery = { pageNo: 1, pageSize: 10 };

export default function AdminTeamPage() {
  const t = useTranslations("AdminPages.team");
  const [filters, setFilters] = useState<TeamFilters>(initialFilters);
  const loader = useCallback(async (params: AdminTeamRelationQuery) => (await getAdminTeamRelations(params)).data, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: TeamFilters): AdminTeamRelationQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    ancestor_user_id: nextFilters.ancestorUserId ? Number(nextFilters.ancestorUserId) : undefined,
    descendant_user_id: nextFilters.descendantUserId ? Number(nextFilters.descendantUserId) : undefined,
    level_depth: nextFilters.levelDepth ? Number(nextFilters.levelDepth) : undefined,
  });

  const columns: DataTableColumn<UserTeamRelation>[] = [
    { key: "id", title: t("relationshipID"), render: (row) => formatEmpty(row.id) },
    { key: "ancestorUserId", title: t("parentUser"), render: (row) => formatEmpty(row.ancestorUserId) },
    { key: "descendantUserId", title: t("childUser"), render: (row) => formatEmpty(row.descendantUserId) },
    { key: "levelDepth", title: t("level"), render: (row) => <StatusBadge status={`L${row.levelDepth}`} label={`L${row.levelDepth}`} /> },
    { key: "createdAt", title: t("createdAt"), render: (row) => <DateTimeText value={row.createdAt} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="TEAM OPS"
        title={t("teamRelationshipManagement")}
        description={t("reviewReferralTeamRelationshipsByParentChildAndLevelToTroubleshootCommissionPaths")}
        actions={<GitBranch className="h-5 w-5 text-[#9aa2ff]" />}
      />
      <ErrorAlert message={error} />
      <SearchPanel
        onSearch={() => updateParams(buildQuery(filters))}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="ancestor">{t("parentUserID")}</Label>
          <Input id="ancestor" placeholder={t("enterID")} value={filters.ancestorUserId} onChange={(event) => setFilters((current) => ({ ...current, ancestorUserId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descendant">{t("childUserID")}</Label>
          <Input id="descendant" placeholder={t("enterID")} value={filters.descendantUserId} onChange={(event) => setFilters((current) => ({ ...current, descendantUserId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>{t("relationshipLevel")}</Label>
          <Select value={filters.levelDepth} onValueChange={(val) => setFilters((current) => ({ ...current, levelDepth: val }))}>
            <SelectTrigger className="h-9 w-[120px] bg-background text-foreground">
              <SelectValue placeholder={t("allLevels")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allLevels")}</SelectItem>
              <SelectItem value="1">{t("level1Direct")}</SelectItem>
              <SelectItem value="2">{t("level2Indirect")}</SelectItem>
              <SelectItem value="3">{t("level3Indirect")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SearchPanel>
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.id} loading={loading} emptyText={t("noSYet")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
    </div>
  );
}
