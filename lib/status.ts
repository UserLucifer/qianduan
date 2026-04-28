export type StatusTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "brand";

export interface StatusMeta {
  label: string;
  tone: StatusTone;
}

import {
  CommonStatus,
  RentalOrderStatus,
  RechargeOrderStatus,
  WithdrawOrderStatus,
  ApiTokenStatus,
  ApiDeployOrderStatus,
  ProfitStatus,
  RentalSettlementOrderStatus,
  RentalOrderSettlementStatus,
  NotificationBizType,
  WalletBusinessType,
  WalletTransactionType,
  RentalSettlementType
} from "@/types/enums";

const STATUS_MAP: Record<string, StatusMeta> = {
  [CommonStatus.ENABLED.toString()]: { label: "已启用", tone: "success" },
  [CommonStatus.DISABLED.toString()]: { label: "已禁用", tone: "neutral" },

  [RentalOrderStatus.PENDING_PAY]: { label: "待支付", tone: "warning" },
  [RentalOrderStatus.PAID]: { label: "已支付/打款", tone: "success" },
  [RentalOrderStatus.PENDING_ACTIVATION]: { label: "待激活", tone: "warning" },
  [RentalOrderStatus.ACTIVATING]: { label: "激活中", tone: "info" },
  [RentalOrderStatus.RUNNING]: { label: "运行中", tone: "success" },
  [RentalOrderStatus.PAUSED]: { label: "已暂停", tone: "warning" },
  [RentalOrderStatus.EXPIRED]: { label: "已到期", tone: "neutral" },
  [RentalOrderStatus.SETTLING]: { label: "结算中", tone: "info" },
  [RentalOrderStatus.SETTLED]: { label: "已结算", tone: "success" },
  [RentalOrderStatus.EARLY_CLOSED]: { label: "提前结束", tone: "neutral" },
  [RentalOrderStatus.CANCELED]: { label: "已取消", tone: "neutral" },

  [RechargeOrderStatus.SUBMITTED]: { label: "待审核", tone: "warning" },
  [RechargeOrderStatus.APPROVED]: { label: "已通过", tone: "success" },
  [RechargeOrderStatus.REJECTED]: { label: "已拒绝", tone: "danger" },

  [WithdrawOrderStatus.PENDING_REVIEW]: { label: "待审核", tone: "warning" },
  // [WithdrawOrderStatus.PAID]: { label: "已打款", tone: "success" }, // Duplicate with RentalOrderStatus.PAID

  [ApiTokenStatus.GENERATED]: { label: "已生成", tone: "neutral" },
  [ApiTokenStatus.ACTIVE]: { label: "正常", tone: "success" },
  [ApiTokenStatus.REVOKED]: { label: "已撤销", tone: "danger" },

  [ApiDeployOrderStatus.REFUNDED]: { label: "已退款", tone: "neutral" },

  [ProfitStatus.NOT_STARTED]: { label: "未开始", tone: "neutral" },
  [ProfitStatus.FINISHED]: { label: "已结束", tone: "success" },

  [RentalOrderSettlementStatus.UNSETTLED]: { label: "未结算", tone: "neutral" },

  "NORMAL": { label: "正常", tone: "success" },
  "ABNORMAL": { label: "异常", tone: "danger" },
  "INACTIVE": { label: "未启用", tone: "neutral" },
  "DEPLOYING": { label: "部署中", tone: "info" },
  "COMPLETED": { label: "已完成", tone: "success" },
};

const NUMERIC_STATUS_MAP: Record<number, StatusMeta> = {
  0: { label: "已禁用", tone: "neutral" },
  1: { label: "已启用", tone: "success" },
};

export function getStatusMeta(status: string | number | boolean | null | undefined): StatusMeta {
  if (typeof status === "boolean") return NUMERIC_STATUS_MAP[status ? 1 : 0];
  if (typeof status === "number") return NUMERIC_STATUS_MAP[status] ?? { label: String(status), tone: "neutral" };
  if (!status) return { label: "-", tone: "neutral" };
  return STATUS_MAP[status] ?? { label: status, tone: "neutral" };
}

export function bizTypeLabel(type: string | null | undefined): string {
  const labels: Record<string, string> = {
    [WalletBusinessType.RECHARGE]: "充值",
    [WalletBusinessType.WITHDRAW]: "提现",
    [WalletBusinessType.RENT_PAY]: "租赁支付",
    [WalletBusinessType.API_DEPLOY_FEE]: "API 部署",
    [WalletBusinessType.RENT_PROFIT]: "租赁收益",
    [WalletBusinessType.COMMISSION_PROFIT]: "佣金收益",
    [WalletBusinessType.SETTLEMENT]: "结算",
    [WalletBusinessType.EARLY_PENALTY]: "提前结算违约金",
    [WalletBusinessType.REFUND]: "退款",
    [WalletBusinessType.ADJUST]: "调账",
  };
  if (!type) return "-";
  return labels[type] ?? type;
}

export function txTypeLabel(type: string | null | undefined): string {
  const labels: Record<string, string> = {
    [WalletTransactionType.IN]: "入账",
    [WalletTransactionType.OUT]: "支出",
    [WalletTransactionType.FREEZE]: "冻结",
    [WalletTransactionType.UNFREEZE]: "解冻",
  };
  if (!type) return "-";
  return labels[type] ?? type;
}

export function notificationTypeLabel(type: string | null | undefined): string {
  const labels: Record<string, string> = {
    "SYSTEM": "系统通知",
    "ANNOUNCEMENT": "公告",
    "ALERT": "风险提醒",
    "ORDER": "订单通知",
    "FINANCE": "财务通知",
    "PROFIT": "收益通知",
  };
  if (!type) return "-";
  return labels[type] ?? type;
}

export function settlementTypeLabel(type: string | null | undefined): string {
  const labels: Record<string, string> = {
    [RentalSettlementType.EXPIRE]: "到期结算",
    [RentalSettlementType.EARLY_TERMINATE]: "提前结算",
    [RentalSettlementType.MANUAL]: "人工结算",
  };
  if (!type) return "-";
  return labels[type] ?? type;
}
