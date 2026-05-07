"use client";

import { useCallback, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { 
  Eye, 
  Receipt, 
  CalendarClock, 
  FastForward, 
  UserCheck, 
  Search,
  ArrowRightLeft,
  Loader2,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getSettlementOrderDetail, getSettlementOrders } from "@/api/settlement";
import type { PageResult, SettlementOrderQueryRequest, SettlementOrderResponse } from "@/api/types";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { toErrorMessage } from "@/lib/format";
import { cn } from "@/lib/utils";

const initialParams: SettlementOrderQueryRequest = { pageNo: 1, pageSize: 12 };

export default function SettlementsPage() {
  const t = useTranslations("DashboardSettlements");
  const dt = useTranslations("DataTable");

  const loader = useCallback(async (params: SettlementOrderQueryRequest): Promise<PageResult<SettlementOrderResponse>> => {
    // MOCK DATA FOR PREVIEW
    const mockRecords: SettlementOrderResponse[] = [
      {
        settlementNo: "S20240507001",
        orderNo: "R20240401001",
        settlementType: "EXPIRE",
        principalAmount: 1000,
        profitAmount: 245.5,
        penaltyAmount: 0,
        actualSettleAmount: 1245.5,
        currency: "USDT",
        status: "SETTLED",
        createdAt: "2024-05-07 10:00:00",
        walletTxNo: "TX88273645",
        remark: "Monthly settlement"
      },
      {
        settlementNo: "S20240507002",
        orderNo: "R20240415082",
        settlementType: "EARLY_TERMINATE",
        principalAmount: 5000,
        profitAmount: 120,
        penaltyAmount: 500,
        actualSettleAmount: 4620,
        currency: "USDT",
        status: "PENDING",
        createdAt: "2024-05-07 11:30:00",
        remark: "User requested early termination"
      },
      {
        settlementNo: "S20240507003",
        orderNo: "R20240320993",
        settlementType: "MANUAL",
        principalAmount: 0,
        profitAmount: 1500,
        penaltyAmount: 0,
        actualSettleAmount: 1500,
        currency: "USDT",
        status: "SETTLED",
        createdAt: "2024-05-06 09:15:00",
        walletTxNo: "TX88273990",
        remark: "Commission adjustment"
      },
      {
        settlementNo: "S20240507004",
        orderNo: "R20240420112",
        settlementType: "EXPIRE",
        principalAmount: 2000,
        profitAmount: 450,
        penaltyAmount: 0,
        actualSettleAmount: 2450,
        currency: "USDT",
        status: "CANCELLED",
        createdAt: "2024-05-05 14:20:00",
        remark: "Order failed before settlement"
      },
      {
        settlementNo: "S20240507005",
        orderNo: "R20240501005",
        settlementType: "EXPIRE",
        principalAmount: 3500,
        profitAmount: 820.75,
        penaltyAmount: 0,
        actualSettleAmount: 4320.75,
        currency: "USDT",
        status: "SETTLED",
        createdAt: "2024-05-04 16:45:00",
        walletTxNo: "TX88275512"
      },
      {
        settlementNo: "S20240507006",
        orderNo: "R20240428009",
        settlementType: "EARLY_TERMINATE",
        principalAmount: 1200,
        profitAmount: 45.2,
        penaltyAmount: 120,
        actualSettleAmount: 1125.2,
        currency: "USDT",
        status: "SETTLED",
        createdAt: "2024-05-03 12:00:00",
        walletTxNo: "TX88276601"
      }
    ];

    return {
      records: mockRecords,
      total: mockRecords.length,
      pageNo: 1,
      pageSize: 12
    };

    // const res = await getSettlementOrders(params);
    // return res.data;
  }, []);

  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialParams);
  const [activeTab, setActiveTab] = useState("ALL");
  const [keyword, setKeyword] = useState("");
  const [detail, setDetail] = useState<SettlementOrderResponse | null>(null);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const getSettlementTypeIcon = (type: string | null | undefined) => {
    switch (type) {
      case "EXPIRE": return <CalendarClock className="h-4 w-4" />;
      case "EARLY":
      case "EARLY_TERMINATE": return <FastForward className="h-4 w-4" />;
      case "MANUAL": return <UserCheck className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  const openDetail = async (settlementNo: string) => {
    try {
      const res = await getSettlementOrderDetail(settlementNo);
      setDetail(res.data);
    } catch (err) {
      toast.error(toErrorMessage(err));
    }
  };

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    const type = val === "ALL" ? undefined : val;
    updateParams({ ...page, pageNo: 1, settlementType: type });
  };

  const handleStatusChange = (val: string) => {
    const status = val === "ALL" ? undefined : val;
    updateParams({ ...page, pageNo: 1, status });
  };

  const sections: DetailSectionDef<SettlementOrderResponse>[] = [
    {
      title: t("detail.title"),
      fields: [
        { label: t("detail.settlementNo"), render: (d) => <span className="font-mono text-xs font-bold">{d.settlementNo}</span> },
        { label: t("detail.orderNo"), render: (d) => <span className="font-mono text-xs">{d.orderNo}</span> },
        { label: t("detail.type"), render: (d) => t(`settlementTypes.${d.settlementType}`) },
        { label: t("detail.status"), render: (d) => <StatusBadge status={d.status} /> },
        { label: t("detail.principal"), render: (d) => <MoneyText value={d.principalAmount} /> },
        { label: t("detail.profit"), render: (d) => <MoneyText value={d.profitAmount} signed /> },
        { label: t("detail.penalty"), render: (d) => <MoneyText value={d.penaltyAmount} /> },
        { label: t("detail.actual"), render: (d) => <MoneyText value={d.actualSettleAmount} signed /> },
        { label: t("detail.walletTx"), render: (d) => d.walletTxNo || "-" },
        { label: t("detail.remark"), render: (d) => d.remark || "-" },
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} description={t("header.description")} />

      <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full md:w-auto">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground border border-border/50">
            <TabsTrigger value="ALL" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              {t("filters.allTypes")}
            </TabsTrigger>
            <TabsTrigger value="EXPIRE" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              {t("filters.expire")}
            </TabsTrigger>
            <TabsTrigger value="EARLY_TERMINATE" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              {t("filters.early")}
            </TabsTrigger>
            <TabsTrigger value="MANUAL" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              {t("filters.manual")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Select defaultValue="ALL" onValueChange={handleStatusChange}>
            <SelectTrigger className="h-10 w-[140px] bg-card border-border text-xs font-medium">
              <SelectValue placeholder={t("filters.allStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("filters.allStatus")}</SelectItem>
              <SelectItem value="PENDING">{t("filters.pending")}</SelectItem>
              <SelectItem value="SETTLED">{t("filters.settled")}</SelectItem>
              <SelectItem value="CANCELLED">{t("filters.canceled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="min-h-[400px]">
        {loading && page.records.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{dt("loading")}</span>
          </div>
        ) : page.records.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/30">
            <FileText className="h-10 w-10 text-muted-foreground/40" />
            <span className="text-sm font-medium text-muted-foreground">{t("empty")}</span>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {page.records.map((row) => (
              <div
                key={row.settlementNo}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/20 hover:bg-muted/30 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      {getSettlementTypeIcon(row.settlementType)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">
                        {t(`settlementTypes.${row.settlementType}`)}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        #{row.settlementNo.slice(-8)}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={row.status} />
                </div>

                <div className="space-y-3 border-t border-border/50 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t("columns.orderNo")}</span>
                    <span className="font-mono text-xs font-medium">{row.orderNo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t("columns.amount")}</span>
                    <MoneyText value={row.actualSettleAmount} signed className="text-sm font-black" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t("columns.time")}</span>
                    <div className="text-[10px] text-muted-foreground">
                      <DateTimeText value={row.createdAt} />
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full justify-between border border-border/50 bg-muted/20 text-xs font-bold hover:bg-primary/5 hover:text-primary"
                  onClick={() => void openDetail(row.settlementNo)}
                >
                  <span className="flex items-center">
                    <ArrowRightLeft className="mr-2 h-3 w-3 opacity-50" />
                    {t("actionDetail")}
                  </span>
                  <Eye className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {page.total > page.pageSize && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-border pt-6 gap-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {dt("pageSummary", {
              pageNo: page.pageNo,
              pageCount: Math.ceil(page.total / page.pageSize),
              total: page.total
            })}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page.pageNo <= 1}
              onClick={() => changePage(page.pageNo - 1)}
            >
              {dt("previousPage")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page.pageNo >= Math.ceil(page.total / page.pageSize)}
              onClick={() => changePage(page.pageNo + 1)}
            >
              {dt("nextPage")}
            </Button>
          </div>
        </div>
      )}

      <DetailDrawer
        data={detail}
        open={Boolean(detail)}
        title={t("drawerTitle")}
        subtitle={(data) => data.settlementNo}
        sections={sections}
        onClose={() => setDetail(null)}
      />
    </div>
  );
}
