// Auto-generated from backend enums

export enum AdminRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  FINANCE = "FINANCE",
}

export enum ApiDeployOrderStatus {
  PENDING_PAY = "PENDING_PAY",
  PAID = "PAID",
  CANCELED = "CANCELED",
  REFUNDED = "REFUNDED",
}

export enum ApiTokenStatus {
  GENERATED = "GENERATED",
  ACTIVATING = "ACTIVATING",
  PAUSED = "PAUSED",
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}

export enum BlogPublishStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  OFFLINE = 2,
}

export enum CommissionLevel {
  LEVEL_1 = 1,
  LEVEL_2 = 2,
  LEVEL_3 = 3,
}

export enum CommonStatus {
  ENABLED = 1,
  DISABLED = 0,
}

export enum DeviceType {
  IOS = "IOS",
  ANDROID = "ANDROID",
}

export enum EmailVerifyScene {
  SIGNUP = "SIGNUP",
  RESET_PASSWORD = "RESET_PASSWORD",
}

export enum EmailVerifyStatus {
  UNUSED = 0,
  USED = 1,
  EXPIRED = 2,
}


export enum NotificationBizType {
  RECHARGE_SUCCESS = "RECHARGE_SUCCESS",
  WITHDRAW_SUCCESS = "WITHDRAW_SUCCESS",
  WITHDRAW_REJECTED = "WITHDRAW_REJECTED",
  PROFIT_SUCCESS = "PROFIT_SUCCESS",
  COMMISSION_SUCCESS = "COMMISSION_SUCCESS",
  API_ACTIVATED = "API_ACTIVATED",
  ORDER_CANCELED = "ORDER_CANCELED",
  ORDER_EXPIRED = "ORDER_EXPIRED",
  BLOG_UPDATE = "BLOG_UPDATE",
}

export enum NotificationType {
  FINANCIAL = "FINANCIAL",
  SYSTEM = "SYSTEM",
  BLOG = "BLOG",
}

export enum ProfitStatus {
  NOT_STARTED = "NOT_STARTED",
  RUNNING = "RUNNING",
  PAUSED = "PAUSED",
  FINISHED = "FINISHED",
}

export enum ReadStatus {
  UNREAD = 0,
  READ = 1,
}

export enum RechargeOrderStatus {
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
}

export enum RecordSettleStatus {
  PENDING = "PENDING",
  SETTLED = "SETTLED",
  CANCELED = "CANCELED",
}

export enum RentalOrderSettlementStatus {
  UNSETTLED = "UNSETTLED",
  SETTLING = "SETTLING",
  SETTLED = "SETTLED",
}

export enum RentalOrderStatus {
  PENDING_PAY = "PENDING_PAY",
  PAID = "PAID",
  PENDING_ACTIVATION = "PENDING_ACTIVATION",
  ACTIVATING = "ACTIVATING",
  PAUSED = "PAUSED",
  RUNNING = "RUNNING",
  EXPIRED = "EXPIRED",
  SETTLING = "SETTLING",
  SETTLED = "SETTLED",
  EARLY_CLOSED = "EARLY_CLOSED",
  CANCELED = "CANCELED",
}

export enum RentalSettlementOrderStatus {
  PENDING = "PENDING",
  SETTLED = "SETTLED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
}

export enum RentalSettlementType {
  EXPIRE = "EXPIRE",
  EARLY_TERMINATE = "EARLY_TERMINATE",
  MANUAL = "MANUAL",
}

export enum SchedulerLogStatus {
  RUNNING = "RUNNING",
  SUCCESS = "SUCCESS",
  PARTIAL_FAIL = "PARTIAL_FAIL",
  FAIL = "FAIL",
}

export enum WalletBusinessType {
  RECHARGE = "RECHARGE",
  WITHDRAW = "WITHDRAW",
  RENT_PAY = "RENT_PAY",
  API_DEPLOY_FEE = "API_DEPLOY_FEE",
  RENT_PROFIT = "RENT_PROFIT",
  COMMISSION_PROFIT = "COMMISSION_PROFIT",
  SETTLEMENT = "SETTLEMENT",
  EARLY_PENALTY = "EARLY_PENALTY",
  REFUND = "REFUND",
  ADJUST = "ADJUST",
}

export enum WalletTransactionType {
  IN = "IN",
  OUT = "OUT",
  FREEZE = "FREEZE",
  UNFREEZE = "UNFREEZE",
}

export enum WithdrawOrderStatus {
  PENDING_REVIEW = "PENDING_REVIEW",
  APPROVED = "APPROVED",
  PAID = "PAID",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
}

