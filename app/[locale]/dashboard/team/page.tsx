"use client";

import { useCallback, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Copy, Users, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getTeamMembers, getTeamSummary } from "@/api/team";
import { getCurrentUser } from "@/api/user";
import type { PageResult, TeamMemberQueryRequest, TeamMemberResponse, TeamSummaryResponse, UserMeResponse } from "@/api/types";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getAvatarUrl } from "@/lib/avatars";

const initialParams: TeamMemberQueryRequest = { pageNo: 1, pageSize: 12 };

export default function TeamPage() {
  const t = useTranslations("DashboardTeam");
  const dt = useTranslations("DataTable");
  
  const summaryLoader = useCallback(async (): Promise<TeamSummaryResponse> => {
    const res = await getTeamSummary();
    return res.data;
  }, []);

  const userLoader = useCallback(async (): Promise<UserMeResponse> => {
    const res = await getCurrentUser();
    return res.data;
  }, []);

  const loader = useCallback(async (params: TeamMemberQueryRequest): Promise<PageResult<TeamMemberResponse>> => {
    const res = await getTeamMembers(params);
    return res.data;
  }, []);

  const summary = useAsyncResource(summaryLoader);
  const user = useAsyncResource(userLoader);
  const members = usePaginatedResource(loader, initialParams);
  
  const [activeTab, setActiveTab] = useState("ALL");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (members.error) {
      toast.error(members.error);
    }
  }, [members.error]);

  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const inviteLink = user.data?.inviteCode && origin ? `${origin}/signup?inviteCode=${user.data.inviteCode}` : "";

  const copyInviteLink = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    toast.success(t.has("invite.copySuccess") ? t("invite.copySuccess") : "Copied successfully");
  };

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    const depth = val === "ALL" ? undefined : Number(val);
    members.updateParams({ ...members.page, pageNo: 1, levelDepth: depth, keyword });
  };

  const handleSearch = () => {
    const depth = activeTab === "ALL" ? undefined : Number(activeTab);
    members.updateParams({ ...members.page, pageNo: 1, levelDepth: depth, keyword });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} description={t("header.description")} />
      
      {/* Invite Area */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-medium text-foreground">
              {t("invite.title")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.has("invite.subtitle") ? t("invite.subtitle") : "Share this link to expand your network."}
            </p>
          </div>
          <div className="flex w-full md:max-w-md items-center gap-2 rounded-md border border-border bg-muted/30 p-1">
            <Input 
              readOnly 
              value={inviteLink || (user.loading ? t("invite.loading") : "")} 
              className="border-0 bg-transparent text-sm focus-visible:ring-0 shadow-none h-9 text-foreground" 
            />
            <Button 
              size="sm" 
              onClick={() => void copyInviteLink()} 
              disabled={!inviteLink}
              className="shrink-0"
            >
              <Copy className="mr-2 h-4 w-4" />
              {t("invite.copy")}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Area */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard title={t("stats.total")} value={summary.data?.totalTeamCount ?? 0} description={t("stats.totalDesc")} icon={Users} loading={summary.loading} />
        <StatsCard title={t("stats.direct")} value={summary.data?.directTeamCount ?? 0} description={t("stats.directDesc")} icon={Users} loading={summary.loading} />
        <StatsCard title={t("stats.level2")} value={summary.data?.level2TeamCount ?? 0} description={t("stats.level2Desc")} icon={Users} loading={summary.loading} />
      </div>

      <div className="space-y-4">
        {/* Controls: Tabs + Search */}
        <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full md:w-auto">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground border border-border/50">
              {[
                { value: "ALL", label: t("filters.allLevels") },
                { value: "1", label: t("filters.level1") },
                { value: "2", label: t("filters.level2") },
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value} 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder={t.has("filters.searchPlaceholder") ? t("filters.searchPlaceholder") : "Search..."}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 h-9 border-border bg-card text-sm focus-visible:ring-1 focus-visible:ring-primary rounded-md"
            />
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="min-h-[400px]">
          {members.loading && members.page.records.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{dt("loading")}</span>
            </div>
          ) : members.page.records.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/30">
              <Users className="h-10 w-10 text-muted-foreground/50" />
              <span className="text-sm font-medium text-muted-foreground">{dt("empty")}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {members.page.records.map((member) => (
                <div 
                  key={member.userId} 
                  className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:bg-muted/30 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        src={getAvatarUrl(member.avatarKey)}
                        name={member.userName || member.userId}
                        className="h-10 w-10 border border-border"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {member.userName || "-"}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={member.status} />
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center rounded bg-muted/30 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider border border-border/50">
                        {t("columns.levelValue", { level: member.levelDepth })}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {t("columns.joinedAt")}: <DateTimeText value={member.createdAt} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {members.page.total > members.page.pageSize && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 gap-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {dt("pageSummary", { pageNo: members.page.pageNo, pageCount: Math.ceil(members.page.total / members.page.pageSize), total: members.page.total })}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={members.page.pageNo <= 1} 
                onClick={() => members.changePage(members.page.pageNo - 1)}
              >
                {dt("previousPage")}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={members.page.pageNo >= Math.ceil(members.page.total / members.page.pageSize)} 
                onClick={() => members.changePage(members.page.pageNo + 1)}
              >
                {dt("nextPage")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
