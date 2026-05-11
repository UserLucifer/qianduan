"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { BookMarked, Eye, Loader2, Send, ShieldCheck, Star, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { CopyableSecret } from "@/components/shared/CopyableSecret";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  cancelWithdrawOrder,
  createWithdrawOrder,
  getWithdrawAddresses,
  getWithdrawOrderDetail,
  getWithdrawOrders,
  sendWithdrawEmailCode,
} from "@/api/withdraw";
import { getWalletInfo } from "@/api/wallet";
import type { PageResult, WalletMeResponse, WithdrawAddressResponse, WithdrawOrderQueryRequest, WithdrawOrderResponse } from "@/api/types";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { toErrorMessage } from "@/lib/format";
import { createClientRequestId } from "@/lib/client-request-id";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const initialParams: WithdrawOrderQueryRequest = { pageNo: 1, pageSize: 10 };
const networks = ["TRC20", "ERC20", "BEP20"];

// System configuration constants (usually from backend, here as defaults for preview)
const WITHDRAW_FEE = 1.0;
const MIN_WITHDRAW_AMOUNT = 10.0;

export default function WithdrawPage() {
  const t = useTranslations("DashboardWithdraw");
  const walletLoader = useCallback(async (): Promise<WalletMeResponse> => {
    const res = await getWalletInfo();
    return res.data;
  }, []);
  const addressLoader = useCallback(async (): Promise<WithdrawAddressResponse[]> => {
    const res = await getWithdrawAddresses();
    return res.data;
  }, []);
  const loader = useCallback(async (params: WithdrawOrderQueryRequest): Promise<PageResult<WithdrawOrderResponse>> => {
    const res = await getWithdrawOrders(params);
    return res.data;
  }, []);
  const wallet = useAsyncResource(walletLoader);
  const addressBook = useAsyncResource(addressLoader);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialParams);
  const [filters, setFilters] = useState<WithdrawOrderQueryRequest>(initialParams);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [network, setNetwork] = useState("TRC20");
  const [accountNo, setAccountNo] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [detail, setDetail] = useState<WithdrawOrderResponse | null>(null);
  const requestIdRef = useRef<{ key: string; id: string } | null>(null);

  // Security Modal States
  const [securityOpen, setSecurityOpen] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [googleCode, setGoogleCode] = useState("");
  const [confirmedSafe, setConfirmedSafe] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);

  // Countdown timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = async () => {
    if (countdown > 0 || sendingCode) return;
    setSendingCode(true);
    try {
      await sendWithdrawEmailCode();
      toast.success(t("toasts.codeSent"));
      setCountdown(60);
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setSendingCode(false);
    }
  };

  // Surface initial loading and pagination errors as toasts
  useEffect(() => {
    if (error) toast.error(toErrorMessage(error));
  }, [error]);

  useEffect(() => {
    if (wallet.error) toast.error(toErrorMessage(wallet.error));
  }, [wallet.error]);

  useEffect(() => {
    if (addressBook.error) toast.error(toErrorMessage(addressBook.error));
  }, [addressBook.error]);

  const selectAddress = (addressId: string) => {
    if (addressId === "manual") {
      setSelectedAddressId(null);
      setNetwork("TRC20");
      setAccountNo("");
      setAccountName("");
      return;
    }
    const id = Number(addressId);
    const addr = addressBook.data?.find((a) => a.addressId === id);
    if (addr) {
      setSelectedAddressId(addr.addressId);
      setNetwork(addr.network);
      setAccountNo(addr.accountNo);
      setAccountName(addr.accountName || "");
    }
  };

  const handleManualEdit = () => {
    // User manually edited address fields, clear address book selection
    if (selectedAddressId !== null) {
      setSelectedAddressId(null);
    }
  };

  const handleOpenSecurity = () => {
    if (!isAmountValid || !accountNo.trim()) return;
    setEmailCode("");
    setGoogleCode("");
    setConfirmedSafe(false);
    setSecurityOpen(true);
  };

  const submitWithdraw = async () => {
    if (submitting || !confirmedSafe || !emailCode.trim()) return;
    setSubmitting(true);
    try {
      const applyAmount = Number(amount);
      if (!Number.isFinite(applyAmount) || applyAmount <= 0) throw new Error(t("errors.invalidAmount"));
      if (wallet.data && applyAmount > wallet.data.availableBalance) throw new Error(t("errors.insufficient"));
      if (!accountNo.trim()) throw new Error(t("errors.accountRequired"));

      if (selectedAddressId !== null) {
        // Submit with address book ID
        const requestKey = JSON.stringify([selectedAddressId, applyAmount]);
        const clientRequestId =
          requestIdRef.current?.key === requestKey
            ? requestIdRef.current.id
            : createClientRequestId("withdraw");
        requestIdRef.current = { key: requestKey, id: clientRequestId };
        await createWithdrawOrder({
          withdrawAddressId: selectedAddressId,
          applyAmount,
          emailCode: emailCode.trim(),
          googleCode: googleCode.trim() || undefined,
          clientRequestId,
        });
      } else {
        // Submit manually
        const requestKey = JSON.stringify([
          network,
          accountName.trim(),
          accountNo.trim(),
          applyAmount,
        ]);
        const clientRequestId =
          requestIdRef.current?.key === requestKey
            ? requestIdRef.current.id
            : createClientRequestId("withdraw");
        requestIdRef.current = { key: requestKey, id: clientRequestId };
        await createWithdrawOrder({
          network,
          accountName: accountName.trim() || undefined,
          accountNo: accountNo.trim(),
          applyAmount,
          emailCode: emailCode.trim(),
          googleCode: googleCode.trim() || undefined,
          clientRequestId,
        });
      }
      requestIdRef.current = null;
      setAmount("");
      setAccountNo("");
      setAccountName("");
      setNetwork("TRC20");
      setSelectedAddressId(null);
      setSecurityOpen(false);
      toast.success(t("messages.submitted"));
      await Promise.all([reload(), wallet.reload()]);
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = async (withdrawNo: string) => {
    try {
      const res = await getWithdrawOrderDetail(withdrawNo);
      setDetail(res.data);
    } catch (err) {
      toast.error(toErrorMessage(err));
    }
  };

  const cancelOrder = async (withdrawNo: string) => {
    try {
      await cancelWithdrawOrder(withdrawNo);
      await Promise.all([reload(), wallet.reload()]);
      toast.success(t("messages.cancelled"));
    } catch (err) {
      toast.error(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<WithdrawOrderResponse>[] = [
    { key: "withdrawNo", title: t("columns.withdrawNo"), render: (row) => <span className="font-mono text-xs">{row.withdrawNo}</span> },
    { key: "applyAmount", title: t("columns.amount"), render: (row) => <MoneyText value={row.applyAmount} /> },
    { key: "feeAmount", title: t("columns.feeActual"), render: (row) => <span><MoneyText value={row.feeAmount} /> / <MoneyText value={row.actualAmount} /></span> },
    { key: "network", title: t("columns.account"), render: (row) => <span>{row.network} · <CopyableSecret value={row.accountNo} canReveal={false} /></span> },
    { key: "status", title: t("columns.status"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "paidAt", title: t("columns.paidAt"), render: (row) => <DateTimeText value={row.paidAt} /> },
    {
      key: "actions",
      title: t("columns.actions"),
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted" onClick={() => void openDetail(row.withdrawNo)}>
            <Eye className="h-3.5 w-3.5" />{t("actions.detail")}</Button>
          {row.status === "PENDING_REVIEW" ? (
            <ConfirmActionButton title={t("actions.cancelTitle")} description={t("actions.cancelDescription")} confirmText={t("actions.cancelConfirm")} onConfirm={() => cancelOrder(row.withdrawNo)}>
              <XCircle className="h-3.5 w-3.5" />{t("actions.cancel")}</ConfirmActionButton>
          ) : null}
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<WithdrawOrderResponse>[] = [
    {
      title: t("detail.withdrawInfo"),
      fields: [
        { label: t("detail.orderNo"), render: (detail) => <span className="font-mono">{detail.withdrawNo}</span> },
        { label: t("detail.status"), render: (detail) => <StatusBadge status={detail.status} /> },
        { label: t("detail.applyAmount"), render: (detail) => <MoneyText value={detail.applyAmount} /> },
        { label: t("detail.fee"), render: (detail) => <MoneyText value={detail.feeAmount} /> },
        { label: t("detail.actualAmount"), render: (detail) => <MoneyText value={detail.actualAmount} /> },
        { label: t("detail.network"), render: (detail) => detail.network },
        { label: t("detail.accountName"), render: (detail) => detail.accountName || "-" },
        { label: t("detail.accountNo"), render: (detail) => <CopyableSecret value={detail.accountNo} canReveal={false} /> },
      ],
    },
    {
      title: t("detail.reviewPay"),
      fields: [
        { label: t("detail.reviewRemark"), render: (detail) => detail.reviewRemark || "-" },
        { label: t("detail.reviewedAt"), render: (detail) => <DateTimeText value={detail.reviewedAt} /> },
        { label: t("detail.payProof"), render: (detail) => detail.payProofNo || "-" },
        { label: t("detail.paidAt"), render: (detail) => <DateTimeText value={detail.paidAt} /> },
      ],
    },
  ];

  const addresses = addressBook.data ?? [];
  const hasAddresses = addresses.length > 0;

  // Real-time calculations
  const applyAmount = Number(amount) || 0;
  const isAmountValid = applyAmount >= MIN_WITHDRAW_AMOUNT && applyAmount <= (wallet.data?.availableBalance ?? 0);
  const actualAmount = Math.max(0, applyAmount - WITHDRAW_FEE);
  const showAmountError = amount !== "" && !isAmountValid;

  const handleAllAmount = () => {
    if (wallet.data) {
      setAmount(wallet.data.availableBalance.toString());
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} description={t("header.description")} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatsCard title={t("stats.available")} value={<MoneyText value={wallet.data?.availableBalance} />} description={wallet.data?.currency ?? "USDT"} icon={Send} loading={wallet.loading} />
        <StatsCard title={t("stats.frozen")} value={<MoneyText value={wallet.data?.frozenBalance} />} description={t("stats.frozenDesc")} icon={Send} loading={wallet.loading} />
        <StatsCard title={t("stats.total")} value={<MoneyText value={wallet.data?.totalWithdraw} />} description={t("stats.totalDesc")} icon={Send} loading={wallet.loading} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left: Action Area */}
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("form.withdrawalAction")}
            </h3>

            <div className="space-y-6">
              {/* Network Selection - Segmented Control Style */}
              <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground">{t("form.network")}</Label>
                <Tabs value={network} onValueChange={(v) => { setNetwork(v); handleManualEdit(); }} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1">
                    {networks.map((item) => (
                      <TabsTrigger key={item} value={item} className="text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        {item}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {/* Address Selection / Input */}
              {hasAddresses && (
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-muted-foreground">{t("form.addressBook")}</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={selectedAddressId === null ? "secondary" : "outline"}
                      size="sm"
                      className="h-8 text-[11px]"
                      onClick={() => selectAddress("manual")}
                    >
                      {t("form.manualInput")}
                    </Button>
                    {addresses.map((addr) => (
                      <Button
                        key={addr.addressId}
                        type="button"
                        variant={selectedAddressId === addr.addressId ? "secondary" : "outline"}
                        size="sm"
                        className={cn(
                          "h-8 gap-1.5 text-[11px] font-mono",
                          selectedAddressId === addr.addressId && "border-primary/50 bg-primary/5"
                        )}
                        onClick={() => selectAddress(String(addr.addressId))}
                      >
                        {addr.defaultAddress && <Star className="h-3 w-3 fill-primary text-primary" />}
                        <span className="font-sans font-medium">{addr.label || addr.network}</span>
                        <span className="opacity-50">
                          {addr.accountNo.slice(0, 6)}…{addr.accountNo.slice(-4)}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">{t("form.accountName")}</Label>
                  <Input
                    value={accountName}
                    onChange={(event) => { setAccountName(event.target.value); handleManualEdit(); }}
                    placeholder={t("form.accountNamePlaceholder")}
                    className="h-10 bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">{t("form.accountNo")}</Label>
                  <Input
                    value={accountNo}
                    onChange={(event) => { setAccountNo(event.target.value); handleManualEdit(); }}
                    placeholder={t("form.accountNoPlaceholder")}
                    className="h-10 bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-muted-foreground">{t("form.amount")}</Label>
                  <span className="text-[10px] text-muted-foreground">
                    {t("stats.available")}: <MoneyText value={wallet.data?.availableBalance} />
                  </span>
                </div>
                <div className="relative">
                  <Input
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder={t("form.amountPlaceholder")}
                    className={cn(
                      "h-11 pr-16 bg-background text-lg font-semibold",
                      showAmountError && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 text-xs font-bold text-primary hover:bg-primary/10"
                    onClick={handleAllAmount}
                  >
                    {t("form.all")}
                  </Button>
                </div>
                {showAmountError && (
                  <p className="text-[11px] font-medium text-destructive">
                    {applyAmount < MIN_WITHDRAW_AMOUNT 
                      ? t("errors.minAmountLimit", { amount: MIN_WITHDRAW_AMOUNT })
                      : t("errors.insufficient")}
                  </p>
                )}
              </div>

              <Button 
                onClick={handleOpenSecurity} 
                disabled={submitting || !isAmountValid || !accountNo.trim()} 
                className="h-12 w-full text-sm font-bold shadow-lg shadow-primary/20"
              >
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {t("form.submit")}
              </Button>
            </div>
          </div>
        </div>

        {/* Security Modal */}
        <Dialog open={securityOpen} onOpenChange={(open) => !submitting && setSecurityOpen(open)}>
          <DialogContent 
            className="sm:max-w-[460px] p-0 overflow-hidden bg-card border-border shadow-2xl"
            onPointerDownOutside={(e) => submitting && e.preventDefault()}
            onEscapeKeyDown={(e) => submitting && e.preventDefault()}
          >
            <DialogHeader className="px-6 pt-6 pb-4 bg-muted/30">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                {t("securityTitle")}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {t("securityDescription")}
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-6 space-y-6">
              {/* Transaction Summary Recap */}
              <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t("form.accountNo")}</span>
                  <span className="text-sm font-mono font-medium text-foreground break-all text-right">{accountNo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t("form.network")}</span>
                  <Badge variant="secondary" className="font-mono">{network}</Badge>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t("form.actualCredit")}</span>
                  <span className="text-lg font-black text-primary"><MoneyText value={actualAmount} /></span>
                </div>
              </div>

              {/* Verification Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground">{t("securityEmailCode")}</Label>
                  <div className="flex gap-2">
                    <Input
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value)}
                      placeholder={t("securityEmailCodePlaceholder")}
                      className="h-10 font-mono tracking-[0.2em]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="min-w-[100px] h-10 text-xs font-bold"
                      onClick={handleSendCode}
                      disabled={countdown > 0 || sendingCode}
                    >
                      {sendingCode ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : countdown > 0 ? `${countdown}s` : t("securityGetCode")}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-muted-foreground">{t("securityGoogleCode")}</Label>
                    <Badge variant="outline" className="text-[9px] opacity-50 px-1 py-0">{t("securityDisabled")}</Badge>
                  </div>
                  <Input
                    value={googleCode}
                    onChange={(e) => setGoogleCode(e.target.value)}
                    placeholder={t("securityGoogleCodePlaceholder")}
                    disabled={true}
                    className="h-10 bg-muted/30 cursor-not-allowed font-mono tracking-[0.2em]"
                  />
                </div>
              </div>

              {/* Safe Acknowledgment */}
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Checkbox 
                  id="confirm-safe" 
                  checked={confirmedSafe} 
                  onCheckedChange={(checked) => setConfirmedSafe(!!checked)} 
                  className="mt-0.5 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <Label 
                  htmlFor="confirm-safe" 
                  className="text-[11px] font-medium leading-relaxed text-foreground cursor-pointer select-none"
                >
                  {t("securitySafeAcknowledgment")}
                </Label>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border mt-0">
              <Button 
                variant="ghost" 
                onClick={() => setSecurityOpen(false)} 
                className="h-10 text-xs font-semibold"
                disabled={submitting}
              >
                {t("securityCancel")}
              </Button>
              <Button 
                onClick={() => void submitWithdraw()} 
                disabled={submitting || !confirmedSafe || !emailCode.trim()} 
                className="h-10 px-8 text-xs font-bold shadow-lg shadow-primary/20"
              >
                {submitting ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
                {t("securityConfirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Right: Settlement Preview */}
        <div className="lg:col-span-2">
          <Card className="sticky top-6 overflow-hidden border-border bg-card shadow-lg">
            <div className="bg-primary/5 px-6 py-4 border-b border-primary/10">
              <h3 className="text-sm font-bold tracking-tight text-primary flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                {t("form.previewTitle")}
              </h3>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("form.previewAmount")}</span>
                  <span className="font-medium text-foreground"><MoneyText value={applyAmount} /></span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("form.previewFee")}</span>
                  <span className="font-medium text-destructive">-{WITHDRAW_FEE} USDT</span>
                </div>
                
                <hr className="my-2 border-border/50" />
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">{t("form.actualCredit")}</span>
                    <span className="text-2xl font-black tracking-tight text-primary">
                      <MoneyText value={actualAmount} />
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-right italic">
                    {t("form.previewHint")}
                  </p>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="rounded-lg bg-muted/30 p-4 border border-border/50">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold text-foreground">
                  <BookMarked className="h-3.5 w-3.5 text-primary" />
                  {t("form.safetyTitle")}
                </div>
                <ul className="space-y-1.5 text-[11px] text-muted-foreground leading-relaxed">
                  <li>• {t("form.safety1")}</li>
                  <li>• {t("form.safety2")}</li>
                  <li>• {t("form.safety3")}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <SearchPanel
        onSearch={() => updateParams({ ...filters, pageNo: 1 })}
        onReset={() => {
          setFilters(initialParams);
          updateParams(initialParams);
        }}
      >
        <div className="space-y-2">
          <Label>{t("filters.status")}</Label>
          <Select value={filters.status ?? "ALL"} onValueChange={(value) => setFilters((current) => ({ ...current, status: value === "ALL" ? undefined : value }))}>
            <SelectTrigger className="h-9 min-w-[140px] bg-background text-foreground">
              <SelectValue placeholder={t("filters.allStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("filters.allStatus")}</SelectItem>
              <SelectItem value="PENDING_REVIEW">{t("filters.pending")}</SelectItem>
              <SelectItem value="APPROVED">{t("filters.approved")}</SelectItem>
              <SelectItem value="REJECTED">{t("filters.rejected")}</SelectItem>
              <SelectItem value="PAID">{t("filters.paid")}</SelectItem>
              <SelectItem value="CANCELLED">{t("filters.cancelled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("filters.startDate")}</Label>
          <Input
            type="date"
            value={filters.startTime ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value || undefined }))}
            className="h-9 w-[160px] bg-background text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label>{t("filters.endDate")}</Label>
          <Input
            type="date"
            value={filters.endTime ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value || undefined }))}
            className="h-9 w-[160px] bg-background text-foreground"
          />
        </div>
      </SearchPanel>

      <DataTable columns={columns} data={page.records} rowKey={(row) => row.withdrawNo} loading={loading} emptyText={t("empty")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={Boolean(detail)} title={t("drawerTitle")} subtitle={(data) => data.withdrawNo} sections={detailSections} onClose={() => setDetail(null)} />
    </div>
  );
}
