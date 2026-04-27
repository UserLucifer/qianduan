import { apiGet, apiPost, apiPut } from "./http";
import type {
  AdminApiCredentialQuery,
  AdminApiCredentialRow,
  AdminApiDeployOrderQuery,
  AdminCatalogQuery,
  AdminCommissionRecordQuery,
  AdminDashboardFinance,
  AdminDashboardOrders,
  AdminDashboardOverview,
  AdminDashboardUsers,
  AdminLogQuery,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminMeResponse,
  AdminProductRequest,
  AdminProfitRecordQuery,
  AdminRentalOrderQuery,
  AdminSettlementOrderQuery,
  AdminSysConfigQueryRequest,
  AdminSysConfigResponse,
  AdminTeamRelationQuery,
  AdminUserQuery,
  AdminUserRow,
  AdminWalletQuery,
  AdminWalletTransactionQuery,
  AiModelResponse,
  ApiDeployOrderResponse,
  ApiMapObject,
  BlogCategory,
  BlogTag,
  CommissionRecordResponse,
  GpuModelResponse,
  NotificationBroadcastRequest,
  NotificationCreateRequest,
  NotificationQueryRequest,
  PageQuery,
  PageResult,
  ProductResponse,
  ProfitRecordResponse,
  RechargeOrderQueryRequest,
  RechargeOrderResponse,
  RegionResponse,
  RentalCycleRuleResponse,
  RentalOrderDetailResponse,
  SchedulerRunResult,
  SettlementOrderResponse,
  SysAdminLog,
  SysNotification,
  UpdateSysConfigRequest,
  UserTeamRelation,
  UserWallet,
  WalletTransactionResponse,
  WithdrawOrderQueryRequest,
  WithdrawOrderResponse,
} from "./types";

export type {
  AdminApiCredentialQuery,
  AdminApiCredentialRow as AdminApiCredentialResponse,
  AdminApiDeployOrderQuery,
  AdminCatalogQuery,
  AdminCommissionRecordQuery,
  AdminDashboardFinance,
  AdminDashboardOrders,
  AdminDashboardOverview,
  AdminDashboardOverview as AdminDashboardOverviewResponse,
  AdminDashboardUsers,
  AdminLogQuery,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminMeResponse,
  AdminProductRequest,
  AdminProfitRecordQuery,
  AdminRentalOrderQuery,
  AdminSettlementOrderQuery,
  AdminSysConfigQueryRequest,
  AdminSysConfigResponse,
  AdminTeamRelationQuery,
  AdminUserQuery,
  AdminUserRow,
  AdminWalletQuery,
  AdminWalletTransactionQuery,
  ApiDeployOrderResponse as AdminApiDeployOrderResponse,
  BlogCategory,
  BlogTag,
  CommissionRecordResponse as AdminCommissionRecordResponse,
  GpuModelResponse as AdminGpuModelResponse,
  ProductResponse as AdminProductResponse,
  ProfitRecordResponse as AdminProfitRecordResponse,
  RechargeOrderResponse as AdminRechargeOrderResponse,
  RegionResponse as AdminRegionResponse,
  RentalCycleRuleResponse as AdminCycleRuleResponse,
  RentalOrderDetailResponse as AdminRentalOrderResponse,
  SchedulerRunResult,
  SettlementOrderResponse as AdminSettlementOrderResponse,
  SysAdminLog as AdminLogResponse,
  SysNotification as AdminNotificationResponse,
  UserWallet,
  WalletTransactionResponse,
  WithdrawOrderResponse as AdminWithdrawOrderResponse,
};

const numberFromMap = (map: ApiMapObject, keys: string[]): number => {
  for (const key of keys) {
    const value = map[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
};

const stringFromMap = (map: ApiMapObject, keys: string[], fallback = "NORMAL"): string => {
  for (const key of keys) {
    const value = map[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
};

export const adaptDashboardOverview = (
  overview: ApiMapObject,
  finance: ApiMapObject,
  orders: ApiMapObject,
  users: ApiMapObject,
): AdminDashboardOverview => ({
  totalUserCount: numberFromMap(users, ["totalUserCount", "totalUsers", "total"]),
  todayNewUserCount: numberFromMap(users, ["todayNewUserCount", "newUserCount", "todayNewUsers"]),
  activeUserCount: numberFromMap(users, ["activeUserCount", "activeUsers"]),
  totalOrderCount: numberFromMap(orders, ["totalOrderCount", "totalOrders"]),
  runningOrderCount: numberFromMap(orders, ["runningOrderCount", "runningOrders"]),
  pendingPayOrderCount: numberFromMap(orders, ["pendingPayOrderCount", "pendingPaymentOrderCount", "pendingPayOrders"]),
  abnormalOrderCount: numberFromMap(orders, ["abnormalOrderCount", "exceptionOrderCount", "abnormalOrders"]),
  systemStatus: stringFromMap(overview, ["systemStatus", "status"], "NORMAL"),
});

export const adaptDashboardFinance = (finance: ApiMapObject): AdminDashboardFinance => ({
  totalRechargeAmount: numberFromMap(finance, ["totalRechargeAmount", "rechargeAmount"]),
  pendingRechargeCount: numberFromMap(finance, ["pendingRechargeCount", "pendingRecharges"]),
  totalWithdrawAmount: numberFromMap(finance, ["totalWithdrawAmount", "withdrawAmount"]),
  pendingWithdrawCount: numberFromMap(finance, ["pendingWithdrawCount", "pendingWithdraws"]),
  pendingPaidWithdrawCount: numberFromMap(finance, ["pendingPaidWithdrawCount", "pendingPayWithdrawCount", "pendingPaidWithdraws"]),
  totalProfitAmount: numberFromMap(finance, ["totalProfitAmount", "totalProfit"]),
  pendingProfitAmount: numberFromMap(finance, ["pendingProfitAmount", "pendingProfit"]),
  totalCommissionAmount: numberFromMap(finance, ["totalCommissionAmount", "totalCommission"]),
});

export const adaptDashboardOrders = (orders: ApiMapObject): AdminDashboardOrders => ({
  totalOrderCount: numberFromMap(orders, ["totalOrderCount", "totalOrders"]),
  runningOrderCount: numberFromMap(orders, ["runningOrderCount", "runningOrders"]),
  pendingPayOrderCount: numberFromMap(orders, ["pendingPayOrderCount", "pendingPaymentOrderCount", "pendingPayOrders"]),
  abnormalOrderCount: numberFromMap(orders, ["abnormalOrderCount", "exceptionOrderCount", "abnormalOrders"]),
  completedOrderCount: numberFromMap(orders, ["completedOrderCount", "settledOrderCount", "completedOrders"]),
});

export const adaptDashboardUsers = (users: ApiMapObject): AdminDashboardUsers => ({
  totalUserCount: numberFromMap(users, ["totalUserCount", "totalUsers", "total"]),
  todayNewUserCount: numberFromMap(users, ["todayNewUserCount", "newUserCount", "todayNewUsers"]),
  activeUserCount: numberFromMap(users, ["activeUserCount", "activeUsers"]),
  disabledUserCount: numberFromMap(users, ["disabledUserCount", "disabledUsers"]),
});

export const adminLogin = (data: AdminLoginRequest) =>
  apiPost<AdminLoginResponse, AdminLoginRequest>("/api/admin/auth/login", data);

export const adminLogout = () =>
  apiPost<void>("/api/admin/auth/logout");

export const getAdminMe = () =>
  apiGet<AdminMeResponse>("/api/admin/auth/me");

export const getAdminOverviewMap = () =>
  apiGet<ApiMapObject>("/api/admin/dashboard/overview");

export const getAdminFinanceMap = () =>
  apiGet<ApiMapObject>("/api/admin/dashboard/finance");

export const getAdminOrdersMap = () =>
  apiGet<ApiMapObject>("/api/admin/dashboard/orders");

export const getAdminUsersMap = () =>
  apiGet<ApiMapObject>("/api/admin/dashboard/users");

export const getAdminOverview = async () => {
  const [overview, finance, orders, users] = await Promise.all([
    getAdminOverviewMap(),
    getAdminFinanceMap(),
    getAdminOrdersMap(),
    getAdminUsersMap(),
  ]);

  return {
    ...overview,
    data: {
      ...adaptDashboardOverview(overview.data, finance.data, orders.data, users.data),
      ...adaptDashboardFinance(finance.data),
    },
  };
};

export const getAdminDashboardBundle = async () => {
  const [overview, finance, orders, users] = await Promise.all([
    getAdminOverviewMap(),
    getAdminFinanceMap(),
    getAdminOrdersMap(),
    getAdminUsersMap(),
  ]);

  return {
    overview: adaptDashboardOverview(overview.data, finance.data, orders.data, users.data),
    finance: adaptDashboardFinance(finance.data),
    orders: adaptDashboardOrders(orders.data),
    users: adaptDashboardUsers(users.data),
  };
};

export const getAdminUsers = (params: AdminUserQuery = {}) =>
  apiGet<PageResult<AdminUserRow>>("/api/admin/users", { params });

export const getAdminUserDetail = (userId: number) =>
  apiGet<ApiMapObject>(`/api/admin/users/${userId}`);

export const enableAdminUser = (userId: number) =>
  apiPost<ApiMapObject>(`/api/admin/users/${userId}/enable`);

export const disableAdminUser = (userId: number) =>
  apiPost<ApiMapObject>(`/api/admin/users/${userId}/disable`);

export const getAdminUserTeam = (userId: number) =>
  apiGet<ApiMapObject>(`/api/admin/users/${userId}/team`);

export const getAdminWallets = (params: AdminWalletQuery = {}) =>
  apiGet<PageResult<UserWallet>>("/api/admin/wallets", { params });

export const getAdminWalletByUser = (userId: number) =>
  apiGet<UserWallet>(`/api/admin/wallets/${userId}`);

export const getAdminWalletTransactions = (params: AdminWalletTransactionQuery = {}) =>
  apiGet<PageResult<WalletTransactionResponse>>("/api/admin/wallet-transactions", { params });

export const getAdminRechargeOrders = (params: RechargeOrderQueryRequest = {}) =>
  apiGet<PageResult<RechargeOrderResponse>>("/api/admin/recharge/orders", { params });

export const getAdminRechargeOrderDetail = (rechargeNo: string) =>
  apiGet<RechargeOrderResponse>(`/api/admin/recharge/orders/${rechargeNo}`);

export const approveRecharge = (
  rechargeNo: string,
  data: { actualAmount: number; reviewRemark?: string },
) =>
  apiPost<RechargeOrderResponse, { actualAmount: number; reviewRemark?: string }>(
    `/api/admin/recharge/orders/${rechargeNo}/approve`,
    data,
  );

export const rejectRecharge = (
  rechargeNo: string,
  data: { reviewRemark: string },
) =>
  apiPost<RechargeOrderResponse, { reviewRemark: string }>(
    `/api/admin/recharge/orders/${rechargeNo}/reject`,
    data,
  );

export const getAdminWithdrawOrders = (params: WithdrawOrderQueryRequest = {}) =>
  apiGet<PageResult<WithdrawOrderResponse>>("/api/admin/withdraw/orders", { params });

export const getAdminWithdrawOrderDetail = (withdrawNo: string) =>
  apiGet<WithdrawOrderResponse>(`/api/admin/withdraw/orders/${withdrawNo}`);

export const approveWithdraw = (
  withdrawNo: string,
  data: { reviewRemark?: string },
) =>
  apiPost<WithdrawOrderResponse, { reviewRemark?: string }>(
    `/api/admin/withdraw/orders/${withdrawNo}/approve`,
    data,
  );

export const markWithdrawPaid = (
  withdrawNo: string,
  data: { payProofNo: string },
) =>
  apiPost<WithdrawOrderResponse, { payProofNo: string }>(
    `/api/admin/withdraw/orders/${withdrawNo}/paid`,
    data,
  );

export const rejectWithdraw = (
  withdrawNo: string,
  data: { reviewRemark: string },
) =>
  apiPost<WithdrawOrderResponse, { reviewRemark: string }>(
    `/api/admin/withdraw/orders/${withdrawNo}/reject`,
    data,
  );

export const getAdminRentalOrders = (params: AdminRentalOrderQuery = {}) =>
  apiGet<PageResult<RentalOrderDetailResponse>>("/api/admin/rental/orders", { params });

export const getAdminRentalOrderDetail = (orderNo: string) =>
  apiGet<ApiMapObject>(`/api/admin/rental/orders/${orderNo}`);

export const getAdminApiCredentials = (params: AdminApiCredentialQuery = {}) =>
  apiGet<PageResult<AdminApiCredentialRow>>("/api/admin/api-credentials", { params });

export const getAdminApiCredentialDetail = (credentialNo: string) =>
  apiGet<ApiMapObject>(`/api/admin/api-credentials/${credentialNo}`);

export const getAdminApiDeployOrders = (params: AdminApiDeployOrderQuery = {}) =>
  apiGet<PageResult<ApiDeployOrderResponse>>("/api/admin/api-deploy-orders", { params });

export const getAdminApiDeployOrderDetail = (deployNo: string) =>
  apiGet<ApiDeployOrderResponse>(`/api/admin/api-deploy-orders/${deployNo}`);

export const getAdminProfitRecords = (params: AdminProfitRecordQuery = {}) =>
  apiGet<PageResult<ProfitRecordResponse>>("/api/admin/profit/records", { params });

export const getAdminProfitRecordDetail = (profitNo: string) =>
  apiGet<ProfitRecordResponse>(`/api/admin/profit/records/${profitNo}`);

export const getAdminCommissionRecords = (params: AdminCommissionRecordQuery = {}) =>
  apiGet<PageResult<CommissionRecordResponse>>("/api/admin/commission/records", { params });

export const getAdminCommissionRecordDetail = (commissionNo: string) =>
  apiGet<CommissionRecordResponse>(`/api/admin/commission/records/${commissionNo}`);

export const getAdminSettlementOrders = (params: AdminSettlementOrderQuery = {}) =>
  apiGet<PageResult<SettlementOrderResponse>>("/api/admin/settlement/orders", { params });

export const getAdminSettlementOrderDetail = (settlementNo: string) =>
  apiGet<SettlementOrderResponse>(`/api/admin/settlement/orders/${settlementNo}`);

export const getAdminTeamRelations = (params: AdminTeamRelationQuery = {}) =>
  apiGet<PageResult<UserTeamRelation>>("/api/admin/team/relations", { params });

export const getAdminProducts = (params: AdminCatalogQuery = {}) =>
  apiGet<PageResult<ProductResponse>>("/api/admin/products", { params });

export const getAdminProductDetail = (productCode: string) =>
  apiGet<ProductResponse>(`/api/admin/products/${productCode}`);

export const createAdminProduct = (data: AdminProductRequest) =>
  apiPost<ProductResponse, AdminProductRequest>("/api/admin/products", data);

export const updateAdminProduct = (productCode: string, data: AdminProductRequest) =>
  apiPut<ProductResponse, AdminProductRequest>(`/api/admin/products/${productCode}`, data);

export const enableAdminProduct = (productCode: string) =>
  apiPost<ProductResponse>(`/api/admin/products/${productCode}/enable`);

export const disableAdminProduct = (productCode: string) =>
  apiPost<ProductResponse>(`/api/admin/products/${productCode}/disable`);

export const getAdminRegions = (params: AdminCatalogQuery = {}) =>
  apiGet<PageResult<RegionResponse>>("/api/admin/regions", { params });

export const createAdminRegion = (data: RegionResponse) =>
  apiPost<RegionResponse, RegionResponse>("/api/admin/regions", data);

export const updateAdminRegion = (id: number, data: RegionResponse) =>
  apiPut<RegionResponse, RegionResponse>(`/api/admin/regions/${id}`, data);

export const enableAdminRegion = (id: number) =>
  apiPost<RegionResponse>(`/api/admin/regions/${id}/enable`);

export const disableAdminRegion = (id: number) =>
  apiPost<RegionResponse>(`/api/admin/regions/${id}/disable`);

export const getAdminGpuModels = (params: AdminCatalogQuery = {}) =>
  apiGet<PageResult<GpuModelResponse>>("/api/admin/gpu-models", { params });

export const createAdminGpuModel = (data: GpuModelResponse) =>
  apiPost<GpuModelResponse, GpuModelResponse>("/api/admin/gpu-models", data);

export const updateAdminGpuModel = (id: number, data: GpuModelResponse) =>
  apiPut<GpuModelResponse, GpuModelResponse>(`/api/admin/gpu-models/${id}`, data);

export const enableAdminGpuModel = (id: number) =>
  apiPost<GpuModelResponse>(`/api/admin/gpu-models/${id}/enable`);

export const disableAdminGpuModel = (id: number) =>
  apiPost<GpuModelResponse>(`/api/admin/gpu-models/${id}/disable`);

export const getAdminAiModels = (params: AdminCatalogQuery = {}) =>
  apiGet<PageResult<AiModelResponse>>("/api/admin/ai-models", { params });

export const createAdminAiModel = (data: AiModelResponse) =>
  apiPost<AiModelResponse, AiModelResponse>("/api/admin/ai-models", data);

export const updateAdminAiModel = (modelCode: string, data: AiModelResponse) =>
  apiPut<AiModelResponse, AiModelResponse>(`/api/admin/ai-models/${modelCode}`, data);

export const enableAdminAiModel = (modelCode: string) =>
  apiPost<AiModelResponse>(`/api/admin/ai-models/${modelCode}/enable`);

export const disableAdminAiModel = (modelCode: string) =>
  apiPost<AiModelResponse>(`/api/admin/ai-models/${modelCode}/disable`);

export const getAdminCycleRules = (params: AdminCatalogQuery = {}) =>
  apiGet<PageResult<RentalCycleRuleResponse>>("/api/admin/rental-cycle-rules", { params });

export const createAdminCycleRule = (data: RentalCycleRuleResponse) =>
  apiPost<RentalCycleRuleResponse, RentalCycleRuleResponse>("/api/admin/rental-cycle-rules", data);

export const updateAdminCycleRule = (cycleCode: string, data: RentalCycleRuleResponse) =>
  apiPut<RentalCycleRuleResponse, RentalCycleRuleResponse>(
    `/api/admin/rental-cycle-rules/${cycleCode}`,
    data,
  );

export const enableAdminCycleRule = (cycleCode: string) =>
  apiPost<RentalCycleRuleResponse>(`/api/admin/rental-cycle-rules/${cycleCode}/enable`);

export const disableAdminCycleRule = (cycleCode: string) =>
  apiPost<RentalCycleRuleResponse>(`/api/admin/rental-cycle-rules/${cycleCode}/disable`);

export const getAdminSysConfigs = (params: AdminSysConfigQueryRequest = {}) =>
  apiGet<PageResult<AdminSysConfigResponse>>("/api/admin/sys-configs", { params });

export const getAdminSysConfigDetail = (configKey: string) =>
  apiGet<AdminSysConfigResponse>(`/api/admin/sys-configs/${configKey}`);

export const updateAdminSysConfig = (configKey: string, data: UpdateSysConfigRequest) =>
  apiPut<AdminSysConfigResponse, UpdateSysConfigRequest>(
    `/api/admin/sys-configs/${configKey}`,
    data,
  );

export const getAdminNotifications = (params: NotificationQueryRequest = {}) =>
  apiGet<PageResult<SysNotification>>("/api/admin/notifications", { params });

export const getAdminNotificationDetail = (id: number) =>
  apiGet<SysNotification>(`/api/admin/notifications/${id}`);

export const createAdminNotification = (data: NotificationCreateRequest) =>
  apiPost<SysNotification, NotificationCreateRequest>("/api/admin/notifications", data);

export const broadcastAdminNotification = (data: NotificationBroadcastRequest) =>
  apiPost<number, NotificationBroadcastRequest>("/api/admin/notifications/broadcast", data);

export const cancelAdminNotification = (id: number) =>
  apiPost<void>(`/api/admin/notifications/${id}/cancel`);

export const getAdminLogs = (params: AdminLogQuery = {}) =>
  apiGet<PageResult<SysAdminLog>>("/api/admin/logs", { params });

export const getAdminLogDetail = (id: number) =>
  apiGet<SysAdminLog>(`/api/admin/logs/${id}`);

export const runScheduler = (task: string) =>
  apiPost<SchedulerRunResult>(`/api/admin/scheduler/${task}/run`);

export const getAdminBlogCategories = (params: PageQuery = {}) =>
  apiGet<PageResult<BlogCategory>>("/api/admin/blog/categories", { params });

export const getAdminBlogTags = (params: PageQuery = {}) =>
  apiGet<PageResult<BlogTag>>("/api/admin/blog/tags", { params });

export const getAdminBlogPosts = (params: AdminCatalogQuery = {}) =>
  apiGet<PageResult<ApiMapObject>>("/api/admin/blog/posts", { params });

export const publishAdminBlogPost = (id: number) =>
  apiPost<ApiMapObject>(`/api/admin/blog/posts/${id}/publish`);

export const unpublishAdminBlogPost = (id: number) =>
  apiPost<ApiMapObject>(`/api/admin/blog/posts/${id}/unpublish`);
