"use client";

import type * as React from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ConfirmActionButton({
  children,
  title,
  description,
  confirmText = "确认",
  loading = false,
  variant = "outline",
  className,
  onConfirm,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  loading?: boolean;
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: string;
  onConfirm: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);

  const confirm = async () => {
    await onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant={variant} size="sm" className={className}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-[var(--admin-border)] bg-[var(--admin-panel-strong)] text-[var(--admin-text)]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-[var(--admin-muted)]">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="border-[var(--admin-border)] bg-[var(--admin-panel-soft)] text-[var(--admin-muted)] hover:bg-[var(--admin-hover)]"
            onClick={() => setOpen(false)}
          >
            取消
          </Button>
          <Button
            type="button"
            className="bg-[#5e6ad2] text-white hover:bg-[#7170ff]"
            onClick={confirm}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
