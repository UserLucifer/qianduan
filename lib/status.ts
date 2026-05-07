import {
  CommonStatus,
  RentalOrderStatus,
  RechargeOrderStatus,
  WithdrawOrderStatus,
  ApiTokenStatus,
  ApiDeployOrderStatus,
  ProfitStatus,
  RentalOrderSettlementStatus,
  WalletBusinessType,
  WalletTransactionType,
  RentalSettlementType,
} from "@/types/enums";

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

export type StatusTranslator = ((key: string) => string) & {
  has?: (key: string) => boolean;
};

const STATUS_MAP: Record<string, StatusMeta> = {
  [CommonStatus.ENABLED.toString()]: { label: "Enabled", tone: "success" },
  [CommonStatus.DISABLED.toString()]: { label: "Disabled", tone: "neutral" },

  // Shared enum values that appear across several backend models.
  RUNNING: { label: "Running", tone: "success" },
  PAUSED: { label: "Paused", tone: "neutral" },
  SETTLED: { label: "Settled", tone: "success" },
  SETTLING: { label: "Settling", tone: "warning" },
  CANCELED: { label: "Canceled", tone: "danger" },

  [RentalOrderStatus.PENDING_PAY]: { label: "Pending payment", tone: "warning" },
  [RentalOrderStatus.PAID]: { label: "Paid", tone: "success" },
  [RentalOrderStatus.PENDING_ACTIVATION]: { label: "Pending activation", tone: "warning" },
  [RentalOrderStatus.ACTIVATING]: { label: "Activating", tone: "warning" },
  [RentalOrderStatus.EXPIRED]: { label: "Expired", tone: "danger" },
  [RentalOrderStatus.EARLY_CLOSED]: { label: "Closed early", tone: "neutral" },

  [ProfitStatus.NOT_STARTED]: { label: "Not started", tone: "neutral" },
  [ProfitStatus.FINISHED]: { label: "Finished", tone: "success" },

  [RentalOrderSettlementStatus.UNSETTLED]: { label: "Unsettled", tone: "neutral" },

  [RechargeOrderStatus.SUBMITTED]: { label: "Submitted", tone: "warning" },
  [RechargeOrderStatus.APPROVED]: { label: "Approved", tone: "success" },
  [RechargeOrderStatus.REJECTED]: { label: "Rejected", tone: "danger" },

  [WithdrawOrderStatus.PENDING_REVIEW]: { label: "Pending review", tone: "warning" },

  [ApiTokenStatus.GENERATED]: { label: "Generated", tone: "neutral" },
  [ApiTokenStatus.ACTIVE]: { label: "Active", tone: "success" },
  [ApiTokenStatus.REVOKED]: { label: "Revoked", tone: "danger" },

  [ApiDeployOrderStatus.REFUNDED]: { label: "Refunded", tone: "neutral" },

  NORMAL: { label: "Normal", tone: "success" },
  ABNORMAL: { label: "Abnormal", tone: "danger" },
  INACTIVE: { label: "Inactive", tone: "neutral" },
  DEPLOYING: { label: "Deploying", tone: "info" },
  COMPLETED: { label: "Completed", tone: "success" },
};

const NUMERIC_STATUS_MAP: Record<number, StatusMeta> = {
  0: { label: "Disabled", tone: "neutral" },
  1: { label: "Enabled", tone: "success" },
};

function hasTranslation(t: StatusTranslator | undefined, key: string): boolean {
  return Boolean(t?.has?.(key));
}

function translateLabel(key: string, fallback: string, t?: StatusTranslator): string {
  return t && hasTranslation(t, key) ? t(key) : fallback;
}

function normalizeStatusKey(status: string | number | boolean | null | undefined): string {
  if (typeof status === "boolean") return status ? "1" : "0";
  if (status === null || status === undefined || status === "") return "";
  return String(status);
}

export function getStatusMeta(status: string | number | boolean | null | undefined): StatusMeta {
  if (typeof status === "boolean") return NUMERIC_STATUS_MAP[status ? 1 : 0];
  if (typeof status === "number") return NUMERIC_STATUS_MAP[status] ?? { label: String(status), tone: "neutral" };
  if (!status) return { label: "-", tone: "neutral" };
  return STATUS_MAP[status] ?? { label: status, tone: "neutral" };
}

export function getStatusLabel(
  status: string | number | boolean | null | undefined,
  t?: StatusTranslator,
): string {
  const key = normalizeStatusKey(status);
  if (!key) return "-";
  return translateLabel(key, getStatusMeta(status).label, t);
}

export function getRentalOrderLabel(status: RentalOrderStatus, t?: StatusTranslator): string {
  return getStatusLabel(status, t);
}

export function getRentalOrderTone(status: RentalOrderStatus): StatusTone {
  return STATUS_MAP[status]?.tone || "neutral";
}
export const getRentalOrderColor = getRentalOrderTone;

export function getProfitStatusLabel(status: ProfitStatus, t?: StatusTranslator): string {
  return getStatusLabel(status, t);
}

export function getProfitStatusTone(status: ProfitStatus): StatusTone {
  return STATUS_MAP[status]?.tone || "neutral";
}
export const getProfitStatusColor = getProfitStatusTone;

export function getSettlementStatusLabel(status: RentalOrderSettlementStatus, t?: StatusTranslator): string {
  return getStatusLabel(status, t);
}

export function getSettlementStatusTone(status: RentalOrderSettlementStatus): StatusTone {
  return STATUS_MAP[status]?.tone || "neutral";
}
export const getSettlementStatusColor = getSettlementStatusTone;

function labelForType(type: string | null | undefined, t?: StatusTranslator): string {
  if (!type) return "-";
  return translateLabel(type, type, t);
}

export function bizTypeLabel(type: string | null | undefined, t?: StatusTranslator): string {
  return labelForType(type, t);
}

export function txTypeLabel(type: string | null | undefined, t?: StatusTranslator): string {
  return labelForType(type, t);
}

export function notificationTypeLabel(type: string | null | undefined, t?: StatusTranslator): string {
  return labelForType(type, t);
}

export function settlementTypeLabel(type: string | null | undefined, t?: StatusTranslator): string {
  return labelForType(type, t);
}

export const walletBusinessTypeKeys = Object.values(WalletBusinessType);
export const walletTransactionTypeKeys = Object.values(WalletTransactionType);
export const rentalSettlementTypeKeys = Object.values(RentalSettlementType);
