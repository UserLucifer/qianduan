export interface ApiResponse<T = never> {
  code: number;
  message: string;
  data: T;
  timestamp?: string;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  pageNo: number;
  pageSize: number;
}

export interface PageQuery {
  pageNo?: number;
  pageSize?: number;
}


export interface UserProfile {
  id: number;
  userId: string;
  email: string;
  userName: string;
}

export interface UserMeResponse extends UserProfile {
  status: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: UserProfile;
}

export interface SignupRequest {
  email: string;
  code: string;
  userName: string;
  password: string;
  inviteCode?: string;
}

export interface SendEmailCodeRequest {
  email: string;
}

export interface VerifyEmailCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ProductResponse {
  id: number;
  productCode: string;
  productName: string;
  machineCode: string;
  machineAlias: string;
  regionName: string;
  gpuModelName: string;
  gpuMemoryGb: number;
  gpuPowerTops: number;
  rentPrice: number;
  tokenOutputPerMinute: number;
  tokenOutputPerDay: number;
  rentableUntil: string;
  totalStock: number;
  availableStock: number;
  rentedStock: number;
  cpuModel: string;
  cpuCores: number;
  memoryGb: number;
  systemDiskGb: number;
  dataDiskGb: number;
  maxExpandDiskGb: number;
  driverVersion: string;
  cudaVersion: string;
  hasCacheOptimization: number;
  status?: number;
  sortNo?: number;
  versionNo?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductQueryRequest extends PageQuery {
  regionId?: number;
  gpuModelId?: number;
}

export interface AiModelResponse {
  id: number;
  modelCode: string;
  modelName: string;
  vendorName: string;
  logoUrl: string;
  monthlyTokenConsumptionTrillion: number;
  tokenUnitPrice: number;
  deployTechFee: number;
  status?: number;
  sortNo?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GpuModelResponse {
  id: number;
  modelCode: string;
  modelName: string;
  status?: number;
  sortNo?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegionResponse {
  id: number;
  regionCode: string;
  regionName: string;
  status?: number;
  sortNo?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RentalCycleRuleResponse {
  id: number;
  cycleCode: string;
  cycleName: string;
  cycleDays: number;
  yieldMultiplier: number;
  earlyPenaltyRate: number;
  status?: number;
  sortNo?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RentalEstimateRequest {
  productId: number;
  aiModelId: number;
  cycleRuleId: number;
}

export interface RentalEstimateResponse {
  productId: number;
  productName: string;
  aiModelId: number;
  aiModelName: string;
  cycleRuleId: number;
  cycleName: string;
  cycleDays: number;
  rentPrice: number;
  deployTechFee: number;
  tokenOutputPerDay: number;
  tokenUnitPrice: number;
  yieldMultiplier: number;
  expectedDailyProfit: number;
  expectedTotalProfit: number;
}

export interface CreateRentalOrderRequest {
  productId: number;
  aiModelId: number;
  cycleRuleId: number;
}

export interface ApiCredentialResponse {
  credentialNo: string;
  apiName: string;
  apiBaseUrl: string;
  tokenMasked: string;
  modelNameSnapshot: string;
  deployFeeSnapshot: number;
  tokenStatus: string;
  generatedAt: string;
  activationPaidAt?: string;
  activatedAt?: string;
  autoPauseAt?: string;
  pausedAt?: string;
  startedAt?: string;
  expiredAt?: string;
}

export interface ApiDeployInfoResponse {
  orderNo: string;
  orderStatus: string;
  credentialNo: string;
  tokenStatus: string;
  modelNameSnapshot: string;
  deployFeeSnapshot: number;
  apiName: string;
  apiBaseUrl: string;
  tokenMasked: string;
  deployOrderStatus: string;
  paidAt?: string;
}

export interface ApiDeployOrderResponse {
  deployNo: string;
  orderNo: string;
  credentialNo: string;
  modelNameSnapshot: string;
  deployFeeAmount: number;
  status: string;
  walletTxNo: string;
  paidAt?: string;
  createdAt: string;
}

export interface RentalOrderSummaryResponse {
  orderNo: string;
  userId?: number;
  userName?: string;
  productNameSnapshot: string;
  machineCodeSnapshot: string;
  machineAliasSnapshot: string;
  aiModelNameSnapshot: string;
  cycleDaysSnapshot: number;
  orderAmount: number;
  expectedDailyProfit: number;
  expectedTotalProfit: number;
  orderStatus: string;
  profitStatus: string;
  settlementStatus: string;
  createdAt: string;
  paidAt?: string;
  apiGeneratedAt?: string;
  deployFeePaidAt?: string;
  activatedAt?: string;
  autoPauseAt?: string;
  pausedAt?: string;
  startedAt?: string;
  profitStartAt?: string;
  profitEndAt?: string;
}

export interface RentalOrderDetailResponse extends RentalOrderSummaryResponse {
  productId?: number;
  userId?: number;
  userName?: string;
  email?: string;
  aiModelId?: number;
  cycleRuleId?: number;
  productCodeSnapshot?: string;
  regionNameSnapshot?: string;
  gpuModelSnapshot?: string;
  gpuMemorySnapshotGb?: number;
  gpuPowerTopsSnapshot?: number;
  gpuRentPriceSnapshot?: number;
  tokenOutputPerDaySnapshot?: number;
  aiVendorNameSnapshot?: string;
  monthlyTokenConsumptionSnapshot?: number;
  tokenUnitPriceSnapshot?: number;
  deployFeeSnapshot?: number;
  yieldMultiplierSnapshot?: number;
  earlyPenaltyRateSnapshot?: number;
  currency?: string;
  paidAmount?: number;
  machinePayTxNo?: string;
  expiredAt?: string;
  canceledAt?: string;
  finishedAt?: string;
  apiCredential?: any;
  credentialNo?: string;
  tokenStatus?: string;
  deployOrderStatus?: string;
  apiBaseUrl?: string;
}

export interface RentalOrderQueryRequest extends PageQuery {
  orderStatus?: string;
  startTime?: string;
  endTime?: string;
}

export interface WalletMeResponse {
  currency: string;
  availableBalance: number;
  frozenBalance: number;
  totalRecharge: number;
  totalWithdraw: number;
  totalProfit: number;
  totalCommission: number;
}

export interface WalletTransactionResponse {
  txNo: string;
  txType: string;
  amount: number;
  beforeAvailableBalance: number;
  afterAvailableBalance: number;
  beforeFrozenBalance: number;
  afterFrozenBalance: number;
  bizType: string;
  bizOrderNo: string;
  remark: string;
  createdAt: string;
}

export interface WalletTransactionQueryRequest extends PageQuery {
  bizType?: string;
  txType?: string;
  startTime?: string;
  endTime?: string;
}

export interface RechargeChannelResponse {
  channelId: number;
  channelCode: string;
  channelName: string;
  network: string;
  displayUrl: string;
  accountName: string;
  accountNo: string;
  minAmount: number;
  maxAmount: number;
}

export interface CreateRechargeOrderRequest {
  channelId: number;
  applyAmount: number;
  externalTxNo?: string;
  paymentProofUrl?: string;
  userRemark?: string;
}

export interface RechargeOrderResponse {
  rechargeNo: string;
  userId?: number;
  userName?: string;
  channelId: number;
  currency: string;
  channelName: string;
  network: string;
  displayUrl: string;
  accountNo: string;
  applyAmount: number;
  actualAmount: number;
  externalTxNo: string;
  paymentProofUrl: string;
  userRemark: string;
  status: string;
  reviewedBy?: number;
  reviewedAt?: string;
  reviewRemark?: string;
  creditedAt?: string;
  walletTxNo?: string;
  createdAt: string;
}

export interface RechargeOrderQueryRequest extends PageQuery {
  status?: string;
  startTime?: string;
  endTime?: string;
}

export interface CreateWithdrawOrderRequest {
  network: string;
  accountName?: string;
  accountNo: string;
  applyAmount: number;
}

export interface WithdrawOrderResponse {
  withdrawNo: string;
  userId?: number;
  userName?: string;
  currency: string;
  withdrawMethod: string;
  network: string;
  accountName: string;
  accountNo: string;
  applyAmount: number;
  feeAmount: number;
  actualAmount: number;
  status: string;
  freezeTxNo?: string;
  unfreezeTxNo?: string;
  paidTxNo?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  reviewRemark?: string;
  paidAt?: string;
  payProofNo?: string;
  createdAt: string;
}

export interface WithdrawOrderQueryRequest extends PageQuery {
  status?: string;
  startTime?: string;
  endTime?: string;
}

export interface ProfitSummaryResponse {
  totalProfit: number;
  todayProfit: number;
  yesterdayProfit: number;
  currentMonthProfit: number;
  settledProfitCount: number;
}

export interface ProfitRecordResponse {
  profitNo: string;
  orderNo: string;
  productNameSnapshot: string;
  aiModelNameSnapshot: string;
  profitDate: string;
  gpuDailyTokenSnapshot: number;
  tokenPriceSnapshot: number;
  yieldMultiplierSnapshot: number;
  baseProfitAmount: number;
  finalProfitAmount: number;
  status: string;
  walletTxNo?: string;
  commissionGenerated: number;
  settledAt?: string;
}

export interface ProfitRecordQueryRequest extends PageQuery {
  rentalOrderId?: number;
  orderNo?: string;
  profitDate?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}

export interface CommissionSummaryResponse {
  totalCommission: number;
  todayCommission: number;
  yesterdayCommission: number;
  currentMonthCommission: number;
  level1Commission: number;
  level2Commission: number;
  level3Commission: number;
}

export interface CommissionRecordResponse {
  commissionNo: string;
  sourceUserId: number;
  sourceOrderId: number;
  sourceProfitId: number;
  levelNo: number;
  sourceProfitAmount: number;
  commissionRateSnapshot: number;
  commissionAmount: number;
  status: string;
  walletTxNo?: string;
  settledAt?: string;
  createdAt: string;
}

export interface CommissionRecordQueryRequest extends PageQuery {
  levelNo?: number;
  status?: string;
  startTime?: string;
  endTime?: string;
}

export interface TeamSummaryResponse {
  totalTeamCount: number;
  directTeamCount: number;
  level2TeamCount: number;
  level3TeamCount: number;
  deeperTeamCount: number;
}

export interface TeamMemberResponse {
  userId: string;
  email: string;
  userName: string;
  status: number;
  levelDepth: number;
  createdAt: string;
}

export interface TeamMemberQueryRequest extends PageQuery {
  levelDepth?: number;
}

export interface SettlementOrderResponse {
  settlementNo: string;
  orderNo: string;
  settlementType: string;
  currency: string;
  principalAmount: number;
  profitAmount: number;
  penaltyAmount: number;
  actualSettleAmount: number;
  status: string;
  reviewedBy?: number;
  reviewedAt?: string;
  settledAt?: string;
  walletTxNo?: string;
  remark?: string;
  createdAt: string;
}

export interface SettlementOrderQueryRequest extends PageQuery {
  settlementType?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}

export interface SysNotification {
  id: number;
  userId?: number;
  title: string;
  content: string;
  type: string;
  bizType?: string;
  bizId?: number;
  readStatus?: number;
  readAt?: string;
  status?: number;
  createdAt: string;
}

export interface NotificationQueryRequest extends PageQuery {
  read_status?: number;
  notification_type?: string;
  biz_type?: string;
  start_time?: string;
  end_time?: string;
}

export interface AdminLoginRequest {
  userName: string;
  password: string;
}

export interface AdminMeResponse {
  adminId: number;
  userName: string;
  status: number;
  role: string;
}

export interface AdminLoginResponse {
  adminAccessToken: string;
  admin: AdminMeResponse;
}

export interface AdminDashboardOverview {
  totalUserCount: number;
  todayNewUserCount: number;
  activeUserCount: number;
  totalOrderCount: number;
  runningOrderCount: number;
  pendingPayOrderCount: number;
  abnormalOrderCount: number;
  systemStatus: string;
}

export interface AdminDashboardFinance {
  totalRechargeAmount: number;
  pendingRechargeCount: number;
  totalWithdrawAmount: number;
  pendingWithdrawCount: number;
  pendingPaidWithdrawCount: number;
  totalProfitAmount: number;
  pendingProfitAmount: number;
  totalCommissionAmount: number;
}

export interface AdminDashboardOrders {
  totalOrderCount: number;
  runningOrderCount: number;
  pendingPayOrderCount: number;
  abnormalOrderCount: number;
  completedOrderCount: number;
}

export interface AdminDashboardUsers {
  totalUserCount: number;
  todayNewUserCount: number;
  activeUserCount: number;
  disabledUserCount: number;
}

export interface AdminUserRow {
  id?: number;
  userId?: string;
  email?: string;
  userName?: string;
  status?: number;
  walletNo?: string;
  availableBalance?: number;
  frozenBalance?: number;
  totalProfit?: number;
  totalCommission?: number;
  orderCount?: number;
  createdAt?: string;
  updatedAt?: string;
  walletData?: any;
  teamData?: any;
  orderData?: any;
  teamCount?: number;
}

export interface AdminUserQuery extends PageQuery {
  email?: string;
  user_id?: string;
  status?: number;
  start_time?: string;
  end_time?: string;
}

export interface AdminWalletQuery extends PageQuery {
  user_id?: number;
  wallet_no?: string;
}

export interface UserWallet {
  id: number;
  walletNo: string;
  userId: number;
  userName?: string;
  currency: string;
  availableBalance: number;
  frozenBalance: number;
  totalRecharge: number;
  totalWithdraw: number;
  totalProfit: number;
  totalCommission: number;
  status: number;
  versionNo: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminWalletTransactionQuery extends PageQuery {
  user_id?: number;
  wallet_no?: string;
  tx_type?: string;
  biz_type?: string;
  start_time?: string;
  end_time?: string;
}

export interface AdminRentalOrderQuery extends PageQuery {
  user_id?: number;
  order_no?: string;
  order_status?: string;
  profit_status?: string;
  settlement_status?: string;
  start_time?: string;
  end_time?: string;
}

export interface AdminApiCredentialQuery extends PageQuery {
  user_id?: number;
  credential_no?: string;
  token_status?: string;
  start_time?: string;
  end_time?: string;
}

export interface AdminApiCredentialRow {
  id?: number;
  credentialNo?: string;
  orderNo?: string;
  userId?: number;
  apiName?: string;
  apiBaseUrl?: string;
  tokenMasked?: string;
  tokenStatus?: string;
  deployOrderStatus?: string;
  deployFeeSnapshot?: number;
  modelNameSnapshot?: string;
  generatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  expiredAt?: string;
}

export interface AdminApiDeployOrderQuery extends PageQuery {
  user_id?: number;
  deploy_no?: string;
  status?: string;
  start_time?: string;
  end_time?: string;
}

export interface AdminCommissionRecordQuery extends PageQuery {
  user_id?: number;
  order_no?: string;
  level_no?: number;
  status?: string;
  start_time?: string;
  end_time?: string;
}

export interface AdminProfitRecordQuery extends PageQuery {
  user_id?: number;
  order_no?: string;
  status?: string;
  profit_date?: string;
  start_time?: string;
  end_time?: string;
}

export interface AdminSettlementOrderQuery extends PageQuery {
  user_id?: number;
  order_no?: string;
  settlement_type?: string;
  status?: string;
  start_time?: string;
  end_time?: string;
}

export interface UserTeamRelation {
  id: number;
  ancestorUserId: number;
  descendantUserId: number;
  levelDepth: number;
  createdAt: string;
}

export interface AdminTeamRelationQuery extends PageQuery {
  ancestor_user_id?: number;
  descendant_user_id?: number;
  level_depth?: number;
}

export interface AdminCatalogQuery extends PageQuery {
  status?: number;
  product_code?: string;
  region_id?: number;
  gpu_model_id?: number;
  model_code?: string;
  region_code?: string;
  cycle_code?: string;
}

export interface AdminProductRequest {
  productCode: string;
  productName: string;
  machineCode: string;
  machineAlias: string;
  regionId: number;
  gpuModelId: number;
  gpuMemoryGb: number;
  gpuPowerTops: number;
  rentPrice: number;
  tokenOutputPerMinute: number;
  tokenOutputPerDay: number;
  rentableUntil: string;
  totalStock: number;
  availableStock: number;
  rentedStock: number;
  cpuModel: string;
  cpuCores: number;
  memoryGb: number;
  systemDiskGb: number;
  dataDiskGb: number;
  maxExpandDiskGb: number;
  driverVersion: string;
  cudaVersion: string;
  hasCacheOptimization: number;
  status: number;
  sortNo?: number;
}

export interface AdminSysConfigResponse {
  id: number;
  configKey: string;
  configValue: string;
  configDesc?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminSysConfigQueryRequest extends PageQuery {
  configKey?: string;
}

export interface UpdateSysConfigRequest {
  configValue: string;
  configDesc?: string;
}

export interface NotificationCreateRequest {
  userId: number;
  title: string;
  content: string;
  type: string;
  bizType?: string;
  bizId?: number;
}

export interface NotificationBroadcastRequest {
  title: string;
  content: string;
  type: string;
  bizType?: string;
  bizId?: number;
}

export interface SysAdminLog {
  id: number;
  adminId: number;
  operatorName?: string;
  action: string;
  targetTable: string;
  targetId: number;
  beforeValue?: string;
  afterValue?: string;
  remark?: string;
  ip: string;
  createdAt: string;
}

export interface AdminLogQuery extends PageQuery {
  admin_id?: number;
  action?: string;
  biz_type?: string;
  start_time?: string;
  end_time?: string;
}

export interface SchedulerRunResult {
  taskName: string;
  totalCount: number;
  successCount: number;
  failCount: number;
  status: string;
  errorMessage?: string;
}

export interface SchedulerLogResponse {
  id: number;
  taskName: string;
  status: string;
  totalCount: number;
  successCount: number;
  failCount: number;
  errorMessage?: string;
  startedAt: string;
  finishedAt?: string;
  createdAt: string;
}

export interface BlogCategory {
  id: number;
  categoryName: string;
  sortNo?: number;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogTag {
  id: number;
  tagName: string;
  sortNo?: number;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminBlogPost {
  id?: number;
  categoryId?: number;
  categoryName?: string;
  title?: string;
  summary?: string;
  coverImageUrl?: string;
  contentMarkdown?: string;
  publishStatus?: number;
  status?: number;
  isTop?: number;
  sortNo?: number;
  tagIds?: number[];
  tagNames?: string[];
  createdAt?: string;
  updatedAt?: string;
}
export interface CreateAdminRequest {  
  userName: string;  
  password?: string;  
  role: string;  
} 
