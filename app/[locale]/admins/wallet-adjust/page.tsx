"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AlertTriangle, CheckCircle2, Copy, Loader2, RefreshCcw, Search, WalletCards } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CopyableSecret } from "@/components/shared/CopyableSecret";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Link } from "@/i18n/navigation";
import { adjustAdminWallet, getAdminWalletByUser, getAdminWallets } from "@/api/admin";
import type {
  AdminWalletAdjustResponse,
  AdminWalletAdjustTxType,
  UserWallet,
} from "@/api/types";
import { cn } from "@/lib/utils";
import { formatEmpty, toErrorMessage } from "@/lib/format";

const REASON_LIMIT = 255;
const LOW_VALUE_REASONS = new Set(["处理", "调账", "补差价", "adjust", "adjustment", "process"]);

const parseUserId = (value: string | null | undefined) => {
  const next = Number(value);
  return Number.isFinite(next) && next > 0 ? String(Math.trunc(next)) : "";
};

const generateAdjustNo = () => {
  const now = new Date();
  const parts = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ];
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `ADJ${parts.join("")}${random}`;
};

const formatUsdt8 = (value: number | null | undefined, currency = "USDT") => {
  const amount = Number.isFinite(value) ? Number(value) : 0;
  return `${amount.toLocaleString(undefined, {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  })} ${currency}`;
};

const normalizeAmountInput = (value: string) => {
  const trimmed = value.trim();
  if (!/^\d*(\.\d{0,8})?$/.test(trimmed)) return null;
  return trimmed;
};

const parseAmount = (value: string) => {
  if (!value) return null;
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
};

export default function AdminWalletAdjustPage() {
  const t = useTranslations("AdminPages.walletAdjust");
  const searchParams = useSearchParams();
  const initialUserId = parseUserId(searchParams.get("user_id"));
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<UserWallet[]>([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [txType, setTxType] = useState<AdminWalletAdjustTxType | null>(null);
  const [amount, setAmount] = useState("");
  const [adjustNo, setAdjustNo] = useState(generateAdjustNo);
  const [reason, setReason] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AdminWalletAdjustResponse | null>(null);
  const queryLoaded = useRef(false);

  const amountValue = parseAmount(amount);
  const projectedAvailable = wallet && amountValue
    ? txType === "OUT"
      ? wallet.availableBalance - amountValue
      : wallet.availableBalance + amountValue
    : wallet?.availableBalance ?? 0;
  const insufficientBalance = Boolean(wallet && txType === "OUT" && amountValue && amountValue > wallet.availableBalance);
  const reasonText = reason.trim();
  const reasonInvalid = reasonText.length > 0 && (reasonText.length < 8 || LOW_VALUE_REASONS.has(reasonText.toLowerCase()));
  const formInvalid = !wallet || !txType || !amountValue || !reasonText || reasonInvalid || insufficientBalance || submitting;

  const selectWallet = useCallback((nextWallet: UserWallet, openAfterSelect = false) => {
    setWallet(nextWallet);
    setKeyword(nextWallet.email || nextWallet.userName || "");
    setSearchResults([]);
    setSearchTotal(0);
    setResult(null);
    setAdjustNo(generateAdjustNo());
    if (openAfterSelect) setSheetOpen(true);
  }, []);

  const loadWalletById = useCallback(async (nextUserId: string, openAfterLoad = false) => {
    const normalized = parseUserId(nextUserId);
    if (!normalized) {
      setError(t("invalidUserId"));
      setWallet(null);
      return;
    }

    setWalletLoading(true);
    setError(null);
    try {
      const res = await getAdminWalletByUser(Number(normalized));
      selectWallet(res.data, openAfterLoad);
    } catch (err) {
      setWallet(null);
      setError(toErrorMessage(err));
    } finally {
      setWalletLoading(false);
    }
  }, [selectWallet, t]);

  const searchWallets = useCallback(async () => {
    const query = keyword.trim();
    if (!query || /^\d+$/.test(query)) {
      setError(t("keywordRequired"));
      setSearchResults([]);
      setSearchTotal(0);
      return;
    }

    setWalletLoading(true);
    setError(null);
    try {
      const res = await getAdminWallets({ pageNo: 1, pageSize: 10, keyword: query });
      setSearchResults(res.data.records);
      setSearchTotal(res.data.total);
    } catch (err) {
      setSearchResults([]);
      setSearchTotal(0);
      setError(toErrorMessage(err));
    } finally {
      setWalletLoading(false);
    }
  }, [keyword, t]);

  useEffect(() => {
    if (queryLoaded.current || !initialUserId) return;
    queryLoaded.current = true;
    void loadWalletById(initialUserId, true);
  }, [initialUserId, loadWalletById]);

  const resetForm = () => {
    setTxType(null);
    setAmount("");
    setReason("");
    setAdjustNo(generateAdjustNo());
    setResult(null);
  };

  const refreshWallet = async () => {
    if (!wallet) return;
    await loadWalletById(String(wallet.userId));
  };

  const submitAdjustment = async () => {
    if (!wallet || !txType || !amountValue || formInvalid) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await adjustAdminWallet(wallet.userId, {
        txType,
        amount: amountValue,
        adjustNo,
        reason: reasonText,
      });
      const adjustResult = res.data;
      toast.success(t("submitSuccess"));
      const walletRes = await getAdminWalletByUser(wallet.userId);
      setWallet(walletRes.data);
      setResult(adjustResult);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  const copyAdjustNo = async () => {
    await navigator.clipboard.writeText(adjustNo);
    toast.success(t("copied"));
  };

  const copyTxNo = async (txNo: string) => {
    await navigator.clipboard.writeText(txNo);
    toast.success(t("copied"));
  };

  const reasonTemplates = useMemo(() => [
    t("templateRechargeUnderpaid"),
    t("templateRechargeOverpaid"),
    t("templateOfflineReconcile"),
    t("templateSupportException"),
    t("templateOperationFix"),
    t("templateOther"),
  ], [t]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <ErrorAlert message={error} />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="border bg-card shadow-sm">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-base">{t("lookupTitle")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("lookupDescription")}</p>
          </CardHeader>
          <CardContent className="space-y-5 p-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={keyword}
                  placeholder={t("keywordPlaceholder")}
                  onChange={(event) => setKeyword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void searchWallets();
                  }}
                  className="h-10 pl-9"
                />
              </div>
              <Button onClick={() => void searchWallets()} disabled={walletLoading}>
                {walletLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {t("lookupWallet")}
              </Button>
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">
                  {t("searchResultSummary", { total: searchTotal })}
                </div>
                <div className="grid gap-3">
                  {searchResults.map((item) => (
                    <WalletSearchResult
                      key={item.walletNo}
                      wallet={item}
                      selected={wallet?.walletNo === item.walletNo}
                      onSelect={() => selectWallet(item)}
                      onAdjust={() => {
                        selectWallet(item);
                        resetForm();
                        setSheetOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {wallet ? (
              <WalletReviewCard
                wallet={wallet}
                onRefresh={() => void refreshWallet()}
                onAdjust={() => {
                  resetForm();
                  setSheetOpen(true);
                }}
              />
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
                {t("emptyWalletHint")}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border bg-card shadow-sm">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-base">{t("guardTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5 text-sm text-muted-foreground">
            <GuardItem index="1" title={t("guardUserTitle")} description={t("guardUserDesc")} />
            <GuardItem index="2" title={t("guardDirectionTitle")} description={t("guardDirectionDesc")} />
            <GuardItem index="3" title={t("guardReasonTitle")} description={t("guardReasonDesc")} />
          </CardContent>
        </Card>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="flex w-full flex-col overflow-y-auto sm:w-[640px] sm:max-w-[640px]">
          <SheetHeader className="pr-8">
            <SheetTitle>{t("sheetTitle")}</SheetTitle>
            <SheetDescription>{t("sheetDescription")}</SheetDescription>
          </SheetHeader>

          {wallet ? (
            <div className="mt-6 flex flex-1 flex-col gap-5">
              <WalletIdentity wallet={wallet} />

              {result ? (
                <SuccessResult
                  result={result}
                  onCopyTxNo={() => void copyTxNo(result.txNo)}
                  onContinue={resetForm}
                />
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>{t("direction")}</Label>
                    <Tabs value={txType ?? ""} onValueChange={(value) => setTxType(value as AdminWalletAdjustTxType)}>
                      <TabsList className="grid h-10 grid-cols-2">
                        <TabsTrigger value="IN">{t("directionIn")}</TabsTrigger>
                        <TabsTrigger value="OUT" className="data-[state=active]:text-destructive">{t("directionOut")}</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    {txType ? (
                      <p className={cn("text-xs", txType === "OUT" ? "text-amber-500" : "text-muted-foreground")}>
                        {txType === "OUT" ? t("directionOutHint") : t("directionInHint")}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adjustAmount">{t("amount")}</Label>
                    <div className="relative">
                      <Input
                        id="adjustAmount"
                        value={amount}
                        inputMode="decimal"
                        placeholder="0.00000000"
                        onChange={(event) => {
                          const next = normalizeAmountInput(event.target.value);
                          if (next !== null) setAmount(next);
                        }}
                        className="h-10 pr-16 font-mono"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">USDT</span>
                    </div>
                    <div className="rounded-lg border bg-muted/20 p-3 text-xs">
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">{t("beforeAvailable")}</span>
                        <span className="font-mono text-foreground">{formatUsdt8(wallet.availableBalance, wallet.currency)}</span>
                      </div>
                      <div className="mt-2 flex justify-between gap-3">
                        <span className="text-muted-foreground">{t("projectedAvailable")}</span>
                        <span className={cn("font-mono", insufficientBalance ? "text-destructive" : "text-foreground")}>
                          {formatUsdt8(projectedAvailable, wallet.currency)}
                        </span>
                      </div>
                    </div>
                    {insufficientBalance ? (
                      <p className="text-xs font-medium text-destructive">{t("insufficientBalance")}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adjustNo">{t("adjustNo")}</Label>
                    <div className="flex gap-2">
                      <Input id="adjustNo" value={adjustNo} readOnly className="h-10 font-mono" />
                      <Button type="button" variant="outline" size="icon" onClick={() => void copyAdjustNo()} aria-label={t("copyAdjustNo")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="outline" size="icon" onClick={() => setAdjustNo(generateAdjustNo())} aria-label={t("regenerateAdjustNo")}>
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("reasonTemplate")}</Label>
                    <Select onValueChange={setReason}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder={t("selectReasonTemplate")} />
                      </SelectTrigger>
                      <SelectContent>
                        {reasonTemplates.map((template) => (
                          <SelectItem key={template} value={template}>
                            {template}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="reason">{t("reason")}</Label>
                      <span className={cn("text-xs", reason.length > REASON_LIMIT ? "text-destructive" : "text-muted-foreground")}>
                        {reason.length}/{REASON_LIMIT}
                      </span>
                    </div>
                    <Textarea
                      id="reason"
                      value={reason}
                      maxLength={REASON_LIMIT}
                      rows={4}
                      placeholder={t("reasonPlaceholder")}
                      onChange={(event) => setReason(event.target.value)}
                    />
                    {reasonInvalid ? <p className="text-xs font-medium text-destructive">{t("reasonInvalid")}</p> : null}
                  </div>

                  <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-500">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{t("riskNotice")}</AlertDescription>
                  </Alert>

                  <Button className="mt-auto w-full" disabled={formInvalid} onClick={() => setConfirmOpen(true)}>
                    {t("submit")}
                  </Button>
                </>
              )}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="z-[260]">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {wallet ? (
            <div className="space-y-2 rounded-lg border bg-muted/20 p-4 text-sm">
              <ConfirmRow label={t("user")} value={`${wallet.userId} / ${formatEmpty(wallet.userName)} / ${formatEmpty(wallet.email)}`} />
              <ConfirmRow label={t("direction")} value={txType === "OUT" ? t("directionOut") : t("directionIn")} danger={txType === "OUT"} />
              <ConfirmRow label={t("amount")} value={formatUsdt8(amountValue, wallet.currency)} />
              <ConfirmRow label={t("beforeAvailable")} value={formatUsdt8(wallet.availableBalance, wallet.currency)} />
              <ConfirmRow label={t("projectedAvailable")} value={formatUsdt8(projectedAvailable, wallet.currency)} danger={txType === "OUT"} />
              <ConfirmRow label={t("adjustNo")} value={adjustNo} />
              <ConfirmRow label={t("reason")} value={reasonText} />
            </div>
          ) : null}
          {txType === "OUT" ? (
            <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{t("confirmOutNotice")}</AlertDescription>
            </Alert>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>{t("cancel")}</AlertDialogCancel>
            <Button disabled={submitting} onClick={() => void submitAdjustment()}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t("confirmSubmit")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function WalletSearchResult({
  wallet,
  selected,
  onSelect,
  onAdjust,
}: {
  wallet: UserWallet;
  selected: boolean;
  onSelect: () => void;
  onAdjust: () => void;
}) {
  const t = useTranslations("AdminPages.walletAdjust");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-background/40",
        selected && "border-primary/50 bg-primary/10",
      )}
    >
      <WalletIdentityRows wallet={wallet} />
      <div className="flex flex-col gap-2 border-t border-border bg-muted/20 p-4 sm:flex-row">
        <Button variant="outline" size="sm" onClick={onSelect}>
          {selected ? t("selected") : t("selectWallet")}
        </Button>
        <Button size="sm" onClick={onAdjust}>
          <WalletCards className="h-4 w-4" />
          {t("manualAdjust")}
        </Button>
      </div>
    </div>
  );
}

function WalletReviewCard({
  wallet,
  onRefresh,
  onAdjust,
}: {
  wallet: UserWallet;
  onRefresh: () => void;
  onAdjust: () => void;
}) {
  const t = useTranslations("AdminPages.walletAdjust");

  return (
    <div className="overflow-hidden rounded-lg border bg-background/40">
      <WalletIdentityRows wallet={wallet} />
      <div className="flex flex-col gap-2 border-t border-border bg-muted/20 p-4 sm:flex-row">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCcw className="h-4 w-4" />
          {t("refreshWallet")}
        </Button>
        <Button onClick={onAdjust}>
          <WalletCards className="h-4 w-4" />
          {t("manualAdjust")}
        </Button>
      </div>
    </div>
  );
}

function WalletIdentity({ wallet, compact = false }: { wallet: UserWallet; compact?: boolean }) {
  const t = useTranslations("AdminPages.walletAdjust");

  return (
    <div className={cn("grid gap-3", compact ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
      <InfoCell label={t("userId")} value={<CopyableSecret value={String(wallet.userId)} maskedValue={String(wallet.userId)} canReveal={false} />} />
      <InfoCell label={t("userName")} value={formatEmpty(wallet.userName)} />
      <InfoCell label={t("email")} value={<CopyableSecret value={wallet.email} maskedValue={wallet.email} canReveal={false} />} />
      <InfoCell label={t("walletNo")} value={<CopyableSecret value={wallet.walletNo} maskedValue={wallet.walletNo} canReveal={false} />} />
      <InfoCell label={t("availableBalance")} value={<span className="font-mono">{formatUsdt8(wallet.availableBalance, wallet.currency)}</span>} />
      <InfoCell label={t("frozenBalance")} value={<span className="font-mono">{formatUsdt8(wallet.frozenBalance, wallet.currency)}</span>} />
      <InfoCell label={t("walletStatus")} value={<StatusBadge status={wallet.status} />} />
    </div>
  );
}

function WalletIdentityRows({ wallet }: { wallet: UserWallet }) {
  const t = useTranslations("AdminPages.walletAdjust");

  return (
    <div className="divide-y divide-border">
      <InfoRow label={t("userId")} value={<CopyableSecret value={String(wallet.userId)} maskedValue={String(wallet.userId)} canReveal={false} truncate={false} className="w-full justify-between" />} />
      <InfoRow label={t("userName")} value={formatEmpty(wallet.userName)} />
      <InfoRow label={t("email")} value={<CopyableSecret value={wallet.email} maskedValue={wallet.email} canReveal={false} truncate={false} className="w-full justify-between" />} />
      <InfoRow label={t("walletNo")} value={<CopyableSecret value={wallet.walletNo} maskedValue={wallet.walletNo} canReveal={false} truncate={false} className="w-full justify-between" />} />
      <InfoRow label={t("availableBalance")} value={<span className="font-mono">{formatUsdt8(wallet.availableBalance, wallet.currency)}</span>} />
      <InfoRow label={t("frozenBalance")} value={<span className="font-mono">{formatUsdt8(wallet.frozenBalance, wallet.currency)}</span>} />
      <InfoRow label={t("walletStatus")} value={<StatusBadge status={wallet.status} />} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-2 px-4 py-3 sm:grid-cols-[140px_minmax(0,1fr)]">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="min-w-0 break-words text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
      <div className="min-w-0 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function GuardItem({ index, title, description }: { index: string; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-semibold text-muted-foreground">
        {index}
      </div>
      <div className="space-y-1">
        <div className="font-medium text-foreground">{title}</div>
        <div>{description}</div>
      </div>
    </div>
  );
}

function ConfirmRow({ label, value, danger }: { label: string; value: ReactNode; danger?: boolean }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[128px_minmax(0,1fr)]">
      <div className="text-muted-foreground">{label}</div>
      <div className={cn("break-words font-medium text-foreground", danger && "text-amber-500")}>{value}</div>
    </div>
  );
}

function SuccessResult({
  result,
  onCopyTxNo,
  onContinue,
}: {
  result: AdminWalletAdjustResponse;
  onCopyTxNo: () => void;
  onContinue: () => void;
}) {
  const t = useTranslations("AdminPages.walletAdjust");

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-500">
        <div className="flex items-center gap-2 font-semibold">
          <CheckCircle2 className="h-5 w-5" />
          {t("successTitle")}
        </div>
        <p className="mt-2 text-sm text-emerald-500/80">{t("successDescription")}</p>
      </div>
      <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
        <ConfirmRow label={t("transactionNo")} value={<CopyableSecret value={result.txNo} maskedValue={result.txNo} canReveal={false} />} />
        <ConfirmRow label={t("direction")} value={result.txType === "OUT" ? t("directionOut") : t("directionIn")} danger={result.txType === "OUT"} />
        <ConfirmRow label={t("amount")} value={formatUsdt8(result.amount, result.currency)} />
        <ConfirmRow label={t("beforeAvailable")} value={formatUsdt8(result.beforeAvailableBalance, result.currency)} />
        <ConfirmRow label={t("afterAvailable")} value={formatUsdt8(result.afterAvailableBalance, result.currency)} />
        <ConfirmRow label={t("adjustNo")} value={result.adjustNo} />
        <ConfirmRow label={t("createdAt")} value={<DateTimeText value={result.createdAt} />} />
        <ConfirmRow label={t("bizType")} value={<Badge variant="outline">{result.bizType}</Badge>} />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Button variant="outline" onClick={onCopyTxNo}>
          <Copy className="h-4 w-4" />
          {t("copyTxNo")}
        </Button>
        <Button asChild variant="outline">
          <Link href={`/admins/wallets?user_id=${result.userId}&biz_type=ADJUST`}>
            {t("viewTransactions")}
          </Link>
        </Button>
        <Button onClick={onContinue}>{t("continueAdjust")}</Button>
      </div>
    </div>
  );
}
