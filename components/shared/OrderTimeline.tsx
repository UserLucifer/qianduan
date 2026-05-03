"use client";

import { useMemo } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  CreditCard, 
  Play, 
  Zap, 
  AlertCircle,
  XCircle
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { RentalOrderDetailResponse } from "@/api/types";
import { RentalOrderStatus } from "@/types/enums";
import { DateTimeText } from "./DateTimeText";
import { MoneyText } from "./MoneyText";

interface TimelineNode {
  id: string;
  title: string;
  time?: string;
  status: "completed" | "active" | "pending" | "warning" | "danger";
  icon: LucideIcon;
  description?: React.ReactNode;
}

export function OrderTimeline({ data }: { data: RentalOrderDetailResponse }) {
  const nodes = useMemo(() => {
    const list: TimelineNode[] = [];
    const s = data.orderStatus as RentalOrderStatus;

    // 1. Order Created
    list.push({
      id: "created",
      title: "订单已创建",
      time: data.createdAt,
      status: "completed",
      icon: Clock,
      description: "系统已收到租赁申请"
    });

    // 2. Payment
    if (data.paidAt) {
      list.push({
        id: "paid",
        title: "支付已入账",
        time: data.paidAt,
        status: "completed",
        icon: CreditCard,
        description: <span className="flex items-center gap-1">支付金额: <MoneyText value={data.paidAmount ?? data.orderAmount} /></span>
      });
    } else if (s === RentalOrderStatus.PENDING_PAY) {
      list.push({
        id: "paid",
        title: "等待支付",
        status: "active",
        icon: CreditCard,
        description: "请尽快完成支付以启动资源"
      });
    }

    // 3. Activation
    if (data.activatedAt) {
      list.push({
        id: "activated",
        title: "算力节点激活",
        time: data.activatedAt,
        status: "completed",
        icon: Zap,
        description: "节点已分配并进入初始化阶段"
      });
    } else if (s === RentalOrderStatus.ACTIVATING || s === RentalOrderStatus.PAID) {
      list.push({
        id: "activated",
        title: "算力节点激活中",
        status: "active",
        icon: Zap,
        description: "正在调度算力集群资源..."
      });
    }

    // 4. Running
    if (s === RentalOrderStatus.RUNNING) {
      list.push({
        id: "running",
        title: "集群持续运行中",
        status: "active",
        icon: Play,
        description: (
          <div className="space-y-1">
            <p>算力运行状态正常，正在产生收益</p>
            <p className="text-emerald-500 font-bold font-mono">预计总收益: <MoneyText value={data.expectedTotalProfit} /></p>
          </div>
        )
      });
    }

    // Exceptions
    if (s === RentalOrderStatus.PAUSED) {
      list.push({
        id: "paused",
        title: "算力已暂停",
        time: data.pausedAt,
        status: "warning",
        icon: AlertCircle,
        description: "资源由于系统维护或策略已暂停"
      });
    }

    if (s === RentalOrderStatus.EARLY_CLOSED) {
      list.push({
        id: "early_closed",
        title: "提前终止结算",
        time: data.finishedAt,
        status: "danger",
        icon: XCircle,
        description: "用户已申请提前终止，正在进行违约结算"
      });
    }

    // 5. Completion
    if (s === RentalOrderStatus.SETTLED || s === RentalOrderStatus.EXPIRED) {
      list.push({
        id: "finished",
        title: s === RentalOrderStatus.SETTLED ? "租赁已结算" : "租赁已到期",
        time: data.finishedAt || data.expiredAt,
        status: "completed",
        icon: CheckCircle2,
        description: "资产租赁生命周期已结束"
      });
    } else if (s !== RentalOrderStatus.CANCELED && s !== RentalOrderStatus.EARLY_CLOSED) {
      list.push({
        id: "finished_pending",
        title: "到期自动结算",
        time: data.expiredAt,
        status: "pending",
        icon: Circle,
        description: "系统将在租赁期满后自动发起结算"
      });
    }

    if (s === RentalOrderStatus.CANCELED) {
      list.push({
        id: "canceled",
        title: "订单已取消",
        time: data.canceledAt,
        status: "danger",
        icon: XCircle,
        description: "订单由于超时或手动操作已关闭"
      });
    }

    return list;
  }, [data]);

  return (
    <div className="relative space-y-0 pb-4">
      {nodes.map((node, idx) => {
        const isLast = idx === nodes.length - 1;
        const Icon = node.icon;
        
        return (
          <div key={node.id} className="group relative flex gap-6 pb-8 last:pb-0">
            {/* Vertical Line */}
            {!isLast && (
              <div 
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-24px)] w-[2px]",
                  node.status === "completed" ? "bg-brand" : "bg-muted border-l-2 border-dashed border-muted"
                )} 
              />
            )}

            {/* Dot/Icon */}
            <div className={cn(
              "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background border-2 transition-all duration-300 group-hover:scale-110 shadow-sm",
              node.status === "completed" && "border-brand bg-brand/5 text-brand",
              node.status === "active" && "border-brand bg-brand text-white animate-pulse shadow-[0_0_15px_rgba(var(--brand-rgb),0.3)]",
              node.status === "pending" && "border-muted text-muted-foreground",
              node.status === "warning" && "border-amber-500 bg-amber-500/10 text-amber-500",
              node.status === "danger" && "border-destructive bg-destructive/10 text-destructive"
            )}>
              <Icon className="h-4 w-4" />
            </div>

            {/* Content Area */}
            <div className="flex flex-1 flex-col gap-1.5 pt-0.5">
              <div className="flex items-center justify-between gap-4">
                <h4 className={cn("text-sm font-bold tracking-tight", node.status === "active" ? "text-brand" : "text-foreground")}>
                  {node.title}
                </h4>
                {node.time && (
                  <span className="text-[10px] font-mono font-medium text-muted-foreground bg-muted/30 px-2 py-0.5 rounded border">
                    <DateTimeText value={node.time} />
                  </span>
                )}
              </div>
              {node.description && (
                <div className="text-[11px] leading-relaxed text-muted-foreground">
                  {node.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
