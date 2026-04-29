"use client";

import { useCallback, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getAdminSysConfigs, updateAdminSysConfig } from "@/api/admin";
import type { AdminSysConfigQueryRequest, AdminSysConfigResponse, UpdateSysConfigRequest } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { cn } from "@/lib/utils";

// --- Helpers ---
function isBoolValue(v: string): boolean {
  return v === "true" || v === "false";
}
function isLongText(v: string): boolean {
  return v.length > 60 || v.includes("\n");
}

// --- Config Card ---
interface ConfigCardProps {
  item: AdminSysConfigResponse;
  onSaved: () => void;
}

function ConfigCard({ item, onSaved }: ConfigCardProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.configValue);
  const [desc, setDesc] = useState(item.configDesc ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload: UpdateSysConfigRequest = {
        configValue: value,
        configDesc: desc || undefined,
      };
      await updateAdminSysConfig(item.configKey, payload);
      setEditing(false);
      onSaved();
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setValue(item.configValue);
    setDesc(item.configDesc ?? "");
    setEditing(false);
    setError(null);
  };

  const renderValueControl = () => {
    if (isBoolValue(item.configValue)) {
      return (
        <Switch
          checked={value === "true"}
          onCheckedChange={(checked) => {
            const next = checked ? "true" : "false";
            setValue(next);
            // Auto-save immediately for boolean toggles
            void updateAdminSysConfig(item.configKey, {
              configValue: next,
              configDesc: item.configDesc || undefined,
            }).then(onSaved).catch((err) => setError(toErrorMessage(err)));
          }}
        />
      );
    }
    if (!editing) {
      return (
        <span className="text-sm text-foreground break-all">
          {formatEmpty(item.configValue)}
        </span>
      );
    }
    if (isLongText(value)) {
      return (
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-[80px] bg-background text-sm resize-none focus-visible:ring-[#5e6ad2]"
        />
      );
    }
    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-9 bg-background text-sm focus-visible:ring-[#5e6ad2]"
        autoFocus
      />
    );
  };

  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm p-5 flex flex-col gap-4 transition-all",
        editing
          ? "border-[#5e6ad2]/50 ring-1 ring-[#5e6ad2]/30"
          : "border-border"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          {item.configDesc && (
            <span className="text-sm font-semibold text-foreground leading-snug">
              {item.configDesc}
            </span>
          )}
          <code className="text-[11px] font-mono text-muted-foreground bg-muted/50 rounded px-1.5 py-0.5 w-fit">
            {item.configKey}
          </code>
        </div>
        {!isBoolValue(item.configValue) && (
          editing ? (
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleCancel} disabled={submitting}>
                取消
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs bg-[#5e6ad2] text-white hover:bg-[#7170ff]"
                onClick={handleSave}
                disabled={submitting}
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                {submitting ? "保存中..." : "保存"}
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 h-8 text-xs text-muted-foreground hover:bg-muted"
              onClick={() => setEditing(true)}
            >
              编辑
            </Button>
          )
        )}
      </div>

      {/* Value */}
      <div>{renderValueControl()}</div>

      {/* Desc field when editing */}
      {editing && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground font-medium">变更说明（可选）</span>
          <Textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="输入本次变更的用途或说明"
            className="min-h-[56px] bg-background text-sm resize-none focus-visible:ring-[#5e6ad2]"
          />
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Footer */}
      <div className="text-[11px] text-muted-foreground/60 border-t border-border/50 pt-2">
        更新时间：<DateTimeText value={item.updatedAt} className="text-[11px]" />
      </div>
    </div>
  );
}

// --- Group Tabs ---
const CONFIG_GROUPS = [
  { key: "", label: "全部" },
  { key: "wallet", label: "钱包" },
  { key: "withdraw", label: "提现" },
  { key: "recharge", label: "充值" },
  { key: "profit", label: "收益" },
  { key: "commission", label: "佣金" },
  { key: "rental", label: "租赁" },
  { key: "system", label: "系统" },
] as const;

// --- Page ---
const initialQuery: AdminSysConfigQueryRequest = { pageNo: 1, pageSize: 12 };

export default function AdminConfigPage() {
  const [filters, setFilters] = useState({ configKey: "" });
  const [activeGroup, setActiveGroup] = useState("");
  const [globalError, setGlobalError] = useState<string | null>(null);

  const loader = useCallback(
    async (params: AdminSysConfigQueryRequest) => (await getAdminSysConfigs(params)).data,
    []
  );
  const { page, loading, error, updateParams, reload } = usePaginatedResource(loader, initialQuery);

  const totalPages = Math.max(1, Math.ceil(page.total / page.pageSize));

  const applyGroup = (groupKey: string) => {
    setActiveGroup(groupKey);
    setFilters({ configKey: groupKey });
    updateParams({ pageNo: 1, pageSize: page.pageSize, configKey: groupKey || undefined });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="SYSTEM CONFIG"
        title="系统配置"
        description="按配置键查看和修改钱包、提现、收益、佣金与系统开关配置。"
      />

      {(error || globalError) && (
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-destructive">
          {globalError ?? error}
        </div>
      )}

      {/* Group Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {CONFIG_GROUPS.map((group) => (
          <button
            key={group.key}
            onClick={() => applyGroup(group.key)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors border",
              activeGroup === group.key
                ? "bg-[#5e6ad2] text-white border-[#5e6ad2] shadow-sm shadow-indigo-500/20"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 bg-card"
            )}
          >
            {group.label}
          </button>
        ))}
      </div>

      <SearchPanel
        onSearch={() =>
          updateParams({ pageNo: 1, pageSize: page.pageSize, configKey: filters.configKey || undefined })
        }
        onReset={() => {
          setFilters({ configKey: "" });
          setActiveGroup("");
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="configKey">配置键</Label>
          <Input
            id="configKey"
            placeholder="输入键名精确搜索"
            value={filters.configKey}
            onChange={(e) => setFilters({ configKey: e.target.value })}
            className="h-9 w-[240px] bg-background text-foreground"
          />
        </div>
      </SearchPanel>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">配置加载中…</div>
      ) : page.records.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">暂无匹配配置项</div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
            {page.records.map((item) => (
              <ConfigCard
                key={item.configKey}
                item={item}
                onSaved={() => { void reload(); }}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border border-border rounded-xl px-4 py-3 text-xs text-muted-foreground bg-card shadow-sm">
            <span>
              第 {page.pageNo} / {totalPages} 页，共 {page.total} 条数据
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                disabled={page.pageNo <= 1}
                onClick={() => updateParams({ pageNo: page.pageNo - 1, pageSize: page.pageSize })}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                disabled={page.pageNo >= totalPages}
                onClick={() => updateParams({ pageNo: page.pageNo + 1, pageSize: page.pageSize })}
              >
                下一页
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
