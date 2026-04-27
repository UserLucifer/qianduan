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
      <DialogContent className="border-white/10 bg-[#18181b] text-zinc-100">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-zinc-500">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
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
