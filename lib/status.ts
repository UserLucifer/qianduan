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

const STATUS_MAP: Record<string, StatusMeta> = {
  ACTIVE: { label: "已启用", tone: "success" },
  ENABLED: { label: "已启用", tone: "success" },
  DISABLED: { label: "已禁用", tone: "neutral" },
  INACTIVE: { label: "未启用", tone: "neutral" },
  SUBMITTED: { label: "待审核", tone: "warning" },
  PENDING_REVIEW: { label: "待审核", tone: "warning" },
  APPROVED: { label: "已通过", tone: "success" },
  REJECTED: { label: "已拒绝", tone: "danger" },
  CANCELED: { label: "已取消", tone: "neutral" },
  CANCELLED: { label: "已取消", tone: "neutral" },
  PAID: { label: "已支付", tone: "success" },
  PENDING_PAY: { label: "待支付", tone: "warning" },
  PENDING_PAYMENT: { label: "待支付", tone: "warning" },
  PENDING_ACTIVATION: { label: "待激活", tone: "warning" },
  ACTIVATING: { label: "激活中", tone: "info" },
  RUNNING: { label: "运行中", tone: "success" },
  PAUSED: { label: "已暂停", tone: "warning" },
  EXPIRED: { label: "已到期", tone: "neutral" },
  SETTLING: { label: "结算中", tone: "info" },
  SETTLED: { label: "已结算", tone: "success" },
  EARLY_CLOSED: { label: "提前结束", tone: "neutral" },
  PENDING: { label: "待处理", tone: "warning" },
  SUCCESS: { label: "成功", tone: "success" },
  FAILED: { label: "失败", tone: "danger" },
  NORMAL: { label: "正常", tone: "success" },
  ABNORMAL: { label: "异常", tone: "danger" },
  CANCELED_BY_SYSTEM: { label: "系统取消", tone: "neutral" },
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
    RECHARGE: "充值",
    WITHDRAW: "提现",
    RENT_PAY: "租赁支付",
    API_DEPLOY_FEE: "API 部署费",
    RENT_PROFIT: "租赁收益",
    COMMISSION_PROFIT: "佣金收益",
    SETTLEMENT: "结算",
    EARLY_PENALTY: "提前结算违约金",
    REFUND: "退款",
    ADJUST: "系统调账",
  };
  if (!type) return "-";
  return labels[type] ?? type;
}

export function txTypeLabel(type: string | null | undefined): string {
  const labels: Record<string, string> = {
    IN: "入账",
    OUT: "支出",
    FREEZE: "冻结",
    UNFREEZE: "解冻",
  };
  if (!type) return "-";
  return labels[type] ?? type;
}

export function notificationTypeLabel(type: string | null | undefined): string {
  const labels: Record<string, string> = {
    SYSTEM: "系统通知",
    ANNOUNCEMENT: "公告",
    ALERT: "风险提醒",
    ORDER: "订单通知",
    FINANCE: "财务通知",
    PROFIT: "收益通知",
  };
  if (!type) return "-";
  return labels[type] ?? type;
}

export function settlementTypeLabel(type: string | null | undefined): string {
  const labels: Record<string, string> = {
    EXPIRE: "到期结算",
    EARLY_TERMINATE: "提前结算",
    MANUAL: "人工结算",
  };
  if (!type) return "-";
  return labels[type] ?? type;
}
