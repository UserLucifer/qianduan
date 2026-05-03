import { adminApiGet, adminApiPost, adminApiPut } from "./http";
import type {
  CreateAdminRequest,
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
  AdminRechargeChannelQuery,
  AdminRechargeChannelResponse,
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
  BlogCategory,
  BlogTag,
  CommissionRecordResponse,
  CreateRechargeChannelRequest,
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
  SchedulerLogResponse,
  SettlementOrderResponse,
  SysAdminLog,
  SysNotification,
  UpdateRechargeChannelRequest,
  UpdateSysConfigRequest,
  UserTeamRelation,
  UserWallet,
  WalletTransactionResponse,
  WithdrawOrderQueryRequest,
  WithdrawOrderResponse,
  TeamSummaryResponse,
  AdminBlogPost,
  SysAdminRow,
  SysAdminQuery,
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

export const adminLogin = (data: AdminLoginRequest) =>
  adminApiPost<AdminLoginResponse, AdminLoginRequest>("/api/admin/auth/login", data);

export const adminLogout = () =>
  adminApiPost<void>("/api/admin/auth/logout");

export const createAdminUser = (data: CreateAdminRequest) =>
  adminApiPost<void, CreateAdminRequest>("/api/admin/auth/register", data);

export const getAdminList = (params: SysAdminQuery = {}) =>
  adminApiGet<PageResult<SysAdminRow>>("/api/admin/auth/admins", { params });


export const getAdminMe = () =>
  adminApiGet<AdminMeResponse>("/api/admin/auth/me");

export const getAdminOverviewMap = () =>
  adminApiGet<AdminDashboardOverview>("/api/admin/dashboard/overview");

export const getAdminFinanceMap = () =>
  adminApiGet<AdminDashboardFinance>("/api/admin/dashboard/finance");

export const getAdminOrdersMap = () =>
  adminApiGet<AdminDashboardOrders>("/api/admin/dashboard/orders");

export const getAdminUsersMap = () =>
  adminApiGet<AdminDashboardUsers>("/api/admin/dashboard/users");

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
      ...overview.data,
      ...finance.data,
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
    overview: overview.data,
    finance: finance.data,
    orders: orders.data,
    users: users.data,
  };
};

export const getAdminUsers = (params: AdminUserQuery = {}) =>
  adminApiGet<PageResult<AdminUserRow>>("/api/admin/users", { params });

export const getAdminUserDetail = (userId: number) =>
  adminApiGet<AdminUserRow>(`/api/admin/users/${userId}`);

export const enableAdminUser = (userId: number) =>
  adminApiPost<AdminUserRow>(`/api/admin/users/${userId}/enable`);

export const disableAdminUser = (userId: number) =>
  adminApiPost<AdminUserRow>(`/api/admin/users/${userId}/disable`);

export const getAdminUserTeam = (userId: number) =>
  adminApiGet<TeamSummaryResponse>(`/api/admin/users/${userId}/team`);

export const getAdminWallets = (params: AdminWalletQuery = {}) =>
  adminApiGet<PageResult<UserWallet>>("/api/admin/wallets", { params });

export const getAdminWalletByUser = (userId: number) =>
  adminApiGet<UserWallet>(`/api/admin/wallets/${userId}`);

export const getAdminWalletTransactions = (params: AdminWalletTransactionQuery = {}) =>
  adminApiGet<PageResult<WalletTransactionResponse>>("/api/admin/wallet-transactions", { params });

export const getAdminRechargeOrders = (params: RechargeOrderQueryRequest = {}) =>
  adminApiGet<PageResult<RechargeOrderResponse>>("/api/admin/recharge/orders", { params });

export const getAdminRechargeOrderDetail = (rechargeNo: string) =>
  adminApiGet<RechargeOrderResponse>(`/api/admin/recharge/orders/${rechargeNo}`);

export const approveRecharge = (
  rechargeNo: string,
  data: { actualAmount: number; reviewRemark?: string },
) =>
  adminApiPost<RechargeOrderResponse, { actualAmount: number; reviewRemark?: string }>(
    `/api/admin/recharge/orders/${rechargeNo}/approve`,
    data,
  );

export const rejectRecharge = (
  rechargeNo: string,
  data: { reviewRemark: string },
) =>
  adminApiPost<RechargeOrderResponse, { reviewRemark: string }>(
    `/api/admin/recharge/orders/${rechargeNo}/reject`,
    data,
  );

export const getAdminRechargeChannels = (params: AdminRechargeChannelQuery = {}) =>
  adminApiGet<PageResult<AdminRechargeChannelResponse>>("/api/admin/recharge/channels", { params });

export const createAdminRechargeChannel = (data: CreateRechargeChannelRequest) =>
  adminApiPost<AdminRechargeChannelResponse, CreateRechargeChannelRequest>("/api/admin/recharge/channels", data);

export const updateAdminRechargeChannel = (id: number, data: UpdateRechargeChannelRequest) =>
  adminApiPut<AdminRechargeChannelResponse, UpdateRechargeChannelRequest>(`/api/admin/recharge/channels/${id}`, data);

export const deleteAdminRechargeChannel = (id: number) =>
  adminApiPost<void>(`/api/admin/recharge/channels/${id}/delete`);

export const getAdminWithdrawOrders = (params: WithdrawOrderQueryRequest = {}) =>
  adminApiGet<PageResult<WithdrawOrderResponse>>("/api/admin/withdraw/orders", { params });

export const getAdminWithdrawOrderDetail = (withdrawNo: string) =>
  adminApiGet<WithdrawOrderResponse>(`/api/admin/withdraw/orders/${withdrawNo}`);

export const approveWithdraw = (
  withdrawNo: string,
  data: { reviewRemark?: string },
) =>
  adminApiPost<WithdrawOrderResponse, { reviewRemark?: string }>(
    `/api/admin/withdraw/orders/${withdrawNo}/approve`,
    data,
  );

export const markWithdrawPaid = (
  withdrawNo: string,
  data: { payProofNo: string },
) =>
  adminApiPost<WithdrawOrderResponse, { payProofNo: string }>(
    `/api/admin/withdraw/orders/${withdrawNo}/paid`,
    data,
  );

export const rejectWithdraw = (
  withdrawNo: string,
  data: { reviewRemark: string },
) =>
  adminApiPost<WithdrawOrderResponse, { reviewRemark: string }>(
    `/api/admin/withdraw/orders/${withdrawNo}/reject`,
    data,
  );

export const getAdminRentalOrders = (params: AdminRentalOrderQuery = {}) =>
  adminApiGet<PageResult<RentalOrderDetailResponse>>("/api/admin/rental/orders", { params });

export const getAdminRentalOrderDetail = (orderNo: string) =>
  adminApiGet<RentalOrderDetailResponse>(`/api/admin/rental/orders/${orderNo}`);

export const getAdminApiCredentials = (params: AdminApiCredentialQuery = {}) =>
  adminApiGet<PageResult<AdminApiCredentialRow>>("/api/admin/api-credentials", { params });

export const getAdminApiCredentialDetail = (credentialNo: string) =>
  adminApiGet<AdminApiCredentialRow>(`/api/admin/api-credentials/${credentialNo}`);

export const getAdminApiDeployOrders = (params: AdminApiDeployOrderQuery = {}) =>
  adminApiGet<PageResult<ApiDeployOrderResponse>>("/api/admin/api-deploy-orders", { params });

export const getAdminApiDeployOrderDetail = (deployNo: string) =>
  adminApiGet<ApiDeployOrderResponse>(`/api/admin/api-deploy-orders/${deployNo}`);

export const getAdminProfitRecords = (params: AdminProfitRecordQuery = {}) =>
  adminApiGet<PageResult<ProfitRecordResponse>>("/api/admin/profit/records", { params });

export const getAdminProfitRecordDetail = (profitNo: string) =>
  adminApiGet<ProfitRecordResponse>(`/api/admin/profit/records/${profitNo}`);

export const getAdminCommissionRecords = (params: AdminCommissionRecordQuery = {}) =>
  adminApiGet<PageResult<CommissionRecordResponse>>("/api/admin/commission/records", { params });

export const getAdminCommissionRecordDetail = (commissionNo: string) =>
  adminApiGet<CommissionRecordResponse>(`/api/admin/commission/records/${commissionNo}`);

export const getAdminSettlementOrders = (params: AdminSettlementOrderQuery = {}) =>
  adminApiGet<PageResult<SettlementOrderResponse>>("/api/admin/settlement/orders", { params });

export const getAdminSettlementOrderDetail = (settlementNo: string) =>
  adminApiGet<SettlementOrderResponse>(`/api/admin/settlement/orders/${settlementNo}`);

export const getAdminTeamRelations = (params: AdminTeamRelationQuery = {}) =>
  adminApiGet<PageResult<UserTeamRelation>>("/api/admin/team/relations", { params });

export const getAdminProducts = (params: AdminCatalogQuery = {}) =>
  adminApiGet<PageResult<ProductResponse>>("/api/admin/products", { params });

export const getAdminProductDetail = (productCode: string) =>
  adminApiGet<ProductResponse>(`/api/admin/products/${productCode}`);

export const createAdminProduct = (data: AdminProductRequest) =>
  adminApiPost<ProductResponse, AdminProductRequest>("/api/admin/products", data);

export const updateAdminProduct = (productCode: string, data: AdminProductRequest) =>
  adminApiPut<ProductResponse, AdminProductRequest>(`/api/admin/products/${productCode}`, data);

export const enableAdminProduct = (productCode: string) =>
  adminApiPost<ProductResponse>(`/api/admin/products/${productCode}/enable`);

export const disableAdminProduct = (productCode: string) =>
  adminApiPost<ProductResponse>(`/api/admin/products/${productCode}/disable`);

export const getAdminRegions = (params: AdminCatalogQuery = {}) =>
  adminApiGet<PageResult<RegionResponse>>("/api/admin/regions", { params });

export const createAdminRegion = (data: Partial<RegionResponse>) =>
  adminApiPost<RegionResponse, Partial<RegionResponse>>("/api/admin/regions", data);

export const updateAdminRegion = (id: number, data: Partial<RegionResponse>) =>
  adminApiPut<RegionResponse, Partial<RegionResponse>>(`/api/admin/regions/${id}`, data);

export const enableAdminRegion = (id: number) =>
  adminApiPost<RegionResponse>(`/api/admin/regions/${id}/enable`);

export const disableAdminRegion = (id: number) =>
  adminApiPost<RegionResponse>(`/api/admin/regions/${id}/disable`);

export const getAdminGpuModels = (params: AdminCatalogQuery = {}) =>
  adminApiGet<PageResult<GpuModelResponse>>("/api/admin/gpu-models", { params });

export const createAdminGpuModel = (data: Partial<GpuModelResponse>) =>
  adminApiPost<GpuModelResponse, Partial<GpuModelResponse>>("/api/admin/gpu-models", data);

export const updateAdminGpuModel = (id: number, data: Partial<GpuModelResponse>) =>
  adminApiPut<GpuModelResponse, Partial<GpuModelResponse>>(`/api/admin/gpu-models/${id}`, data);

export const enableAdminGpuModel = (id: number) =>
  adminApiPost<GpuModelResponse>(`/api/admin/gpu-models/${id}/enable`);

export const disableAdminGpuModel = (id: number) =>
  adminApiPost<GpuModelResponse>(`/api/admin/gpu-models/${id}/disable`);

export const getAdminAiModels = (params: AdminCatalogQuery = {}) =>
  adminApiGet<PageResult<AiModelResponse>>("/api/admin/ai-models", { params });

export const createAdminAiModel = (data: Partial<AiModelResponse>) =>
  adminApiPost<AiModelResponse, Partial<AiModelResponse>>("/api/admin/ai-models", data);

export const updateAdminAiModel = (modelCode: string, data: Partial<AiModelResponse>) =>
  adminApiPut<AiModelResponse, Partial<AiModelResponse>>(`/api/admin/ai-models/${modelCode}`, data);

export const enableAdminAiModel = (modelCode: string) =>
  adminApiPost<AiModelResponse>(`/api/admin/ai-models/${modelCode}/enable`);

export const disableAdminAiModel = (modelCode: string) =>
  adminApiPost<AiModelResponse>(`/api/admin/ai-models/${modelCode}/disable`);

export const getAdminCycleRules = (params: AdminCatalogQuery = {}) =>
  adminApiGet<PageResult<RentalCycleRuleResponse>>("/api/admin/rental-cycle-rules", { params });

export const createAdminCycleRule = (data: Partial<RentalCycleRuleResponse>) =>
  adminApiPost<RentalCycleRuleResponse, Partial<RentalCycleRuleResponse>>("/api/admin/rental-cycle-rules", data);

export const updateAdminCycleRule = (cycleCode: string, data: Partial<RentalCycleRuleResponse>) =>
  adminApiPut<RentalCycleRuleResponse, Partial<RentalCycleRuleResponse>>(
    `/api/admin/rental-cycle-rules/${cycleCode}`,
    data,
  );

export const enableAdminCycleRule = (cycleCode: string) =>
  adminApiPost<RentalCycleRuleResponse>(`/api/admin/rental-cycle-rules/${cycleCode}/enable`);

export const disableAdminCycleRule = (cycleCode: string) =>
  adminApiPost<RentalCycleRuleResponse>(`/api/admin/rental-cycle-rules/${cycleCode}/disable`);

export const getAdminSysConfigs = (params: AdminSysConfigQueryRequest = {}) =>
  adminApiGet<PageResult<AdminSysConfigResponse>>("/api/admin/sys-configs", { params });

export const getAdminSysConfigDetail = (configKey: string) =>
  adminApiGet<AdminSysConfigResponse>(`/api/admin/sys-configs/${configKey}`);

export const updateAdminSysConfig = (configKey: string, data: UpdateSysConfigRequest) =>
  adminApiPut<AdminSysConfigResponse, UpdateSysConfigRequest>(
    `/api/admin/sys-configs/${configKey}`,
    data,
  );

export const getAdminNotifications = (params: NotificationQueryRequest = {}) =>
  adminApiGet<PageResult<SysNotification>>("/api/admin/notifications", { params });

export const getAdminNotificationDetail = (id: number) =>
  adminApiGet<SysNotification>(`/api/admin/notifications/${id}`);

export const createAdminNotification = (data: NotificationCreateRequest) =>
  adminApiPost<SysNotification, NotificationCreateRequest>("/api/admin/notifications", data);

export const broadcastAdminNotification = (data: NotificationBroadcastRequest) =>
  adminApiPost<number, NotificationBroadcastRequest>("/api/admin/notifications/broadcast", data);

export const cancelAdminNotification = (id: number) =>
  adminApiPost<void>(`/api/admin/notifications/${id}/cancel`);

export const getAdminLogs = (params: AdminLogQuery = {}) =>
  adminApiGet<PageResult<SysAdminLog>>("/api/admin/logs", { params });

export const getAdminLogDetail = (id: number) =>
  adminApiGet<SysAdminLog>(`/api/admin/logs/${id}`);

export const runScheduler = (task: string, data: Record<string, unknown> = {}) =>
  adminApiPost<SchedulerRunResult, Record<string, unknown>>(`/api/admin/scheduler/${task}/run`, data);

export const getAdminSchedulerLogs = (params: { taskName?: string } & PageQuery = {}) =>
  adminApiGet<PageResult<SchedulerLogResponse>>("/api/admin/scheduler/logs", { params });

export const getAdminBlogCategories = (params: PageQuery = {}) =>
  adminApiGet<PageResult<BlogCategory>>("/api/admin/blog/categories", { params });

export const getAdminBlogTags = (params: PageQuery = {}) =>
  adminApiGet<PageResult<BlogTag>>("/api/admin/blog/tags", { params });

export const getAdminBlogPosts = (params: AdminCatalogQuery = {}) =>
  adminApiGet<PageResult<AdminBlogPost>>("/api/admin/blog/posts", { params });

export const publishAdminBlogPost = (id: number) =>
  adminApiPost<AdminBlogPost>(`/api/admin/blog/posts/${id}/publish`);

export const unpublishAdminBlogPost = (id: number) =>
  adminApiPost<AdminBlogPost>(`/api/admin/blog/posts/${id}/unpublish`);

export const createAdminBlogCategory = (data: Partial<BlogCategory>) =>
  adminApiPost<BlogCategory, Partial<BlogCategory>>("/api/admin/blog/categories", data);

export const updateAdminBlogCategory = (id: number, data: Partial<BlogCategory>) =>
  adminApiPut<BlogCategory, Partial<BlogCategory>>(`/api/admin/blog/categories/${id}`, data);

export const disableAdminBlogCategory = (id: number) =>
  adminApiPost<BlogCategory>(`/api/admin/blog/categories/${id}/disable`);

export const enableAdminBlogCategory = (id: number) =>
  adminApiPost<BlogCategory>(`/api/admin/blog/categories/${id}/enable`);

export const createAdminBlogPost = (data: Partial<AdminBlogPost>) =>
  adminApiPost<AdminBlogPost, Partial<AdminBlogPost>>("/api/admin/blog/posts", data);

export const getAdminBlogPostDetail = (id: number) =>
  adminApiGet<AdminBlogPost>(`/api/admin/blog/posts/${id}`);

export const updateAdminBlogPost = (id: number, data: Partial<AdminBlogPost>) =>
  adminApiPut<AdminBlogPost, Partial<AdminBlogPost>>(`/api/admin/blog/posts/${id}`, data);

export const deleteAdminBlogPost = (id: number) =>
  adminApiPost<void>(`/api/admin/blog/posts/${id}/delete`);

export const createAdminBlogTag = (data: Partial<BlogTag>) =>
  adminApiPost<BlogTag, Partial<BlogTag>>("/api/admin/blog/tags", data);

export const updateAdminBlogTag = (id: number, data: Partial<BlogTag>) =>
  adminApiPut<BlogTag, Partial<BlogTag>>(`/api/admin/blog/tags/${id}`, data);

export const disableAdminBlogTag = (id: number) =>
  adminApiPost<BlogTag>(`/api/admin/blog/tags/${id}/disable`);

export const enableAdminBlogTag = (id: number) =>
  adminApiPost<BlogTag>(`/api/admin/blog/tags/${id}/enable`);
