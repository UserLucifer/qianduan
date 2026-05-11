"use client";

import { useCallback, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  BookMarked,
  Edit2,
  Loader2,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import {
  createWithdrawAddress,
  deleteWithdrawAddress,
  getWithdrawAddresses,
  setDefaultWithdrawAddress,
  updateWithdrawAddress,
} from "@/api/withdraw";
import type {
  CreateWithdrawAddressRequest,
  WithdrawAddressResponse,
} from "@/api/types";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { toErrorMessage } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const networks = ["TRC20", "ERC20", "BEP20"];

type FormData = {
  network: string;
  accountName: string;
  accountNo: string;
  label: string;
  defaultAddress: boolean;
};

const emptyForm: FormData = {
  network: "TRC20",
  accountName: "",
  accountNo: "",
  label: "",
  defaultAddress: false,
};

export default function WithdrawAddressesPage() {
  const t = useTranslations("WithdrawAddresses");

  const loader = useCallback(async (): Promise<WithdrawAddressResponse[]> => {
    const res = await getWithdrawAddresses();
    return res.data;
  }, []);
  const { data: addresses, loading, error, reload } = useAsyncResource(loader);

  // Surface initial loading errors as toasts
  useEffect(() => {
    if (error) {
      toast.error(toErrorMessage(error));
    }
  }, [error]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const openAddDialog = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (addr: WithdrawAddressResponse) => {
    setEditingId(addr.addressId);
    setForm({
      network: addr.network,
      accountName: addr.accountName || "",
      accountNo: addr.accountNo,
      label: addr.label || "",
      defaultAddress: addr.defaultAddress,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!form.accountNo.trim()) {
      toast.error(t("errors.accountRequired"));
      return;
    }
    setSubmitting(true);
    try {
      const payload: CreateWithdrawAddressRequest = {
        network: form.network,
        accountNo: form.accountNo.trim(),
        accountName: form.accountName.trim() || undefined,
        label: form.label.trim() || undefined,
        defaultAddress: form.defaultAddress || undefined,
      };
      if (editingId !== null) {
        await updateWithdrawAddress(editingId, payload);
        toast.success(t("toasts.updated"));
      } else {
        await createWithdrawAddress(payload);
        toast.success(t("toasts.created"));
      }
      setDialogOpen(false);
      await reload();
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (addressId: number) => {
    try {
      await deleteWithdrawAddress(addressId);
      toast.success(t("toasts.deleted"));
      await reload();
    } catch (err) {
      toast.error(toErrorMessage(err));
    }
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      await setDefaultWithdrawAddress(addressId);
      toast.success(t("toasts.defaultSet"));
      await reload();
    } catch (err) {
      toast.error(toErrorMessage(err));
    }
  };

  const list = addresses ?? [];

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        eyebrow={t("header.eyebrow")}
        title={t("header.title")}
        description={t("header.description")}
      />

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t("summary", { count: list.length })}
        </p>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("actions.add")}
        </Button>
      </div>

      {/* Address Cards */}
      {loading && !addresses ? (
        <div className="flex h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
          <BookMarked className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            {t("empty.title")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            {t("empty.description")}
          </p>
          <Button onClick={openAddDialog} variant="outline" className="mt-6 gap-2">
            <Plus className="h-4 w-4" />
            {t("actions.addFirst")}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((addr) => (
            <div
              key={addr.addressId}
              className={cn(
                "group relative rounded-xl border bg-card p-5 transition-colors hover:border-primary/30",
                addr.defaultAddress && "border-primary/40 ring-1 ring-primary/10"
              )}
            >
              {/* Default badge */}
              {addr.defaultAddress && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  <Star className="h-3 w-3 fill-current" />
                  {t("card.default")}
                </div>
              )}

              {/* Network badge */}
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-medium text-foreground">
                  {addr.network}
                </span>
                {addr.label && (
                  <span className="truncate text-xs text-muted-foreground">
                    {addr.label}
                  </span>
                )}
              </div>

              {/* Address */}
              <p className="mb-1 break-all font-mono text-sm leading-relaxed text-foreground/90">
                {addr.accountNo}
              </p>
              {addr.accountName && (
                <p className="text-xs text-muted-foreground">
                  {addr.accountName}
                </p>
              )}

              {/* Actions */}
              <div className="mt-4 flex items-center gap-2 border-t border-border/50 pt-3">
                {!addr.defaultAddress && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-primary"
                    onClick={() => void handleSetDefault(addr.addressId)}
                  >
                    <Star className="h-3 w-3" />
                    {t("actions.setDefault")}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => openEditDialog(addr)}
                >
                  <Edit2 className="h-3 w-3" />
                  {t("actions.edit")}
                </Button>
                <ConfirmActionButton
                  title={t("confirm.deleteTitle")}
                  description={t("confirm.deleteDescription")}
                  confirmText={t("confirm.deleteConfirm")}
                  variant="ghost"
                  className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-destructive"
                  onConfirm={() => handleDelete(addr.addressId)}
                >
                  <Trash2 className="h-3 w-3" />
                  {t("actions.delete")}
                </ConfirmActionButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden !flex !flex-col border-none shadow-2xl bg-background">
          <div className="flex flex-col w-full p-6 space-y-6">
            {/* Header section - Following Admin Style */}
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold tracking-tight">
                {editingId !== null ? t("dialog.editTitle") : t("dialog.addTitle")}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {editingId !== null
                  ? t("dialog.editDescription")
                  : t("dialog.addDescription")}
              </DialogDescription>
            </div>

            <div className="flex flex-col w-full gap-6">
              <div className="space-y-8">
                {/* Basic Configuration Section */}
                <section>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-muted-foreground">
                    <span className="h-3 w-1 rounded-full bg-primary"></span>
                    {t("form.basicSection")}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t("form.network")}</Label>
                      <Select
                        value={form.network}
                        onValueChange={(v) => setForm((f) => ({ ...f, network: v }))}
                      >
                        <SelectTrigger className="h-10 bg-background transition-colors hover:border-primary/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {networks.map((n) => (
                            <SelectItem key={n} value={n}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t("form.label")}</Label>
                      <Input
                        value={form.label}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, label: e.target.value }))
                        }
                        placeholder={t("form.labelPlaceholder")}
                        className="h-10 bg-background"
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <Label className="text-sm font-medium">{t("form.accountNo")}</Label>
                      <Input
                        value={form.accountNo}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, accountNo: e.target.value }))
                        }
                        placeholder={t("form.accountNoPlaceholder")}
                        className="h-10 bg-background font-mono text-sm"
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <Label className="text-sm font-medium">{t("form.accountName")}</Label>
                      <Input
                        value={form.accountName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, accountName: e.target.value }))
                        }
                        placeholder={t("form.accountNamePlaceholder")}
                        className="h-10 bg-background"
                      />
                    </div>
                  </div>
                </section>

                {/* Settings Section */}
                <section>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-muted-foreground">
                    <span className="h-3 w-1 rounded-full bg-primary"></span>
                    {t("form.settingsSection")}
                  </h3>
                  
                  <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 p-4 transition-all hover:bg-muted/30">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold">{t("form.defaultAddress")}</p>
                      <p className="text-xs text-muted-foreground/70">
                        {t("form.defaultAddressHint")}
                      </p>
                    </div>
                    <Switch
                      checked={form.defaultAddress}
                      onCheckedChange={(v) =>
                        setForm((f) => ({ ...f, defaultAddress: v }))
                      }
                    />
                  </div>
                </section>
              </div>
            </div>

            {/* Footer - Admin Style with Border */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-4">
              <Button
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
                className="h-10 px-6 font-medium"
              >
                {t("dialog.cancel")}
              </Button>
              <Button
                onClick={() => void handleSubmit()}
                disabled={submitting}
                className="h-10 min-w-[120px] px-8 font-bold shadow-sm"
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId !== null ? t("dialog.save") : t("dialog.add")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
