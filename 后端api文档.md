# 算力租赁后端 API 联调文档

更新时间：2026-04-29  
后端地址：`http://localhost:8080`  
接口前缀：以各接口表中的完整路径为准。

## 1. 通用约定

### 1.1 请求格式

- `POST` / `PUT` 有请求体的接口统一使用 `Content-Type: application/json`
- 时间格式：
  - `LocalDateTime`：`yyyy-MM-dd HH:mm:ss`
  - `LocalDate`：`yyyy-MM-dd`
- 金额类型均用数字或字符串数字传递，前端建议按字符串保存展示精度，例如 `"100.00"`。
- 分页参数默认：`pageNo=1`，`pageSize=10`。

### 1.2 统一响应

所有业务接口返回：

```json
{
  "code": 0,
  "message": "成功",
  "data": {},
  "timestamp": "2026-04-29 12:00:00"
}
```

分页 `data` 结构：

```json
{
  "records": [],
  "total": 0,
  "pageNo": 1,
  "pageSize": 10
}
```

常见错误码：

| code | 含义 |
|---:|---|
| `0` | 成功 |
| `400` | 请求参数错误 |
| `401` | 未登录或登录已过期 |
| `403` | 无权限访问 |
| `404` | 资源不存在 |
| `422` | 参数校验失败 |
| `10000` | 业务处理失败 |
| `10001` | 余额不足 |
| `10002` | 重复操作 |
| `10003` | 请求过于频繁 |
| `500` | 系统异常 |

### 1.3 鉴权

公开接口：

- `/api/auth/**`
- `/api/admin/auth/login`
- `/api/blog/**`
- `/api/system/health`
- `/doc.html`、`/v3/api-docs/**`、`/swagger-ui/**`

用户端登录后请求头：

```http
Authorization: Bearer <accessToken>
```

管理端登录后请求头：

```http
Authorization: Bearer <adminAccessToken>
```

`/api/admin/**` 需要管理员 token；其他非公开接口需要用户 token。

## 2. 用户认证

| 方法 | 路径 | 鉴权 | 传参 | 返回 data |
|---|---|---|---|---|
| `POST` | `/api/auth/signup/email-code/send` | 公开 | body: `SendEmailCodeRequest` | `null` |
| `POST` | `/api/auth/signup/email-code/verify` | 公开 | body: `VerifyEmailCodeRequest` | `null` |
| `POST` | `/api/auth/signup` | 公开 | body: `SignupRequest` | `LoginResponse` |
| `POST` | `/api/auth/register` | 公开 | body: `SignupRequest` | `LoginResponse` |
| `POST` | `/api/auth/login` | 公开 | body: `LoginRequest` | `LoginResponse` |
| `POST` | `/api/auth/login/password` | 公开 | body: `LoginRequest` | `LoginResponse` |
| `POST` | `/api/auth/reset-password/email-code/send` | 公开 | body: `SendEmailCodeRequest` | `null` |
| `POST` | `/api/auth/reset-password/email-code/verify` | 公开 | body: `VerifyEmailCodeRequest` | `null` |
| `POST` | `/api/auth/reset-password` | 公开 | body: `ResetPasswordRequest` | `null` |
| `POST` | `/api/auth/password/reset` | 公开 | body: `ResetPasswordRequest` | `null` |

请求体：

```json
// SendEmailCodeRequest
{ "email": "user@example.com" }

// VerifyEmailCodeRequest
{ "email": "user@example.com", "code": "123456" }

// SignupRequest
{
  "email": "user@example.com",
  "code": "123456",
  "userName": "张三",
  "password": "12345678",
  "inviteCode": "可选的邀请码"
}

// LoginRequest
{ "email": "user@example.com", "password": "12345678" }

// ResetPasswordRequest
{ "email": "user@example.com", "code": "123456", "newPassword": "12345678" }
```

`LoginResponse`：

```json
{
  "accessToken": "jwt",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": 1,
    "userId": "U10001",
    "email": "user@example.com",
    "userName": "张三"
  }
}
```

## 3. 用户、钱包、设备

| 方法 | 路径 | 鉴权 | 传参 | 返回 data |
|---|---|---|---|---|
| `GET` | `/api/user/me` | 用户 | 无 | `UserMeResponse` |
| `GET` | `/api/wallet/me` | 用户 | 无 | `WalletMeResponse` |
| `GET` | `/api/wallet/transactions` | 用户 | query: `WalletTransactionQueryRequest` | `PageResult<WalletTransactionResponse>` |
| `POST` | `/api/push-devices/register` | 用户 | body: `RegisterPushDeviceRequest` | `UserPushDevice` |
| `POST` | `/api/push-devices/unregister` | 用户 | body: `UnregisterPushDeviceRequest` | `null` |
| `GET` | `/api/push-devices` | 用户 | 无 | `List<UserPushDevice>` |

查询参数：

```text
WalletTransactionQueryRequest:
pageNo, pageSize, bizType, txType, startTime, endTime
```

请求体：

```json
// RegisterPushDeviceRequest
{ "deviceType": "IOS", "deviceToken": "push-token" }

// UnregisterPushDeviceRequest
{ "deviceToken": "push-token" }
```

响应字段：

```text
UserMeResponse:
id, userId, email, userName, status

WalletMeResponse:
currency, availableBalance, frozenBalance, totalRecharge, totalWithdraw, totalProfit, totalCommission

WalletTransactionResponse:
txNo, userName, txType, amount, beforeAvailableBalance, afterAvailableBalance,
beforeFrozenBalance, afterFrozenBalance, bizType, bizOrderNo, remark, createdAt
```

## 4. 商品目录

公开商品接口：

| 方法 | 路径 | 鉴权 | 传参 | 返回 data |
|---|---|---|---|---|
| `GET` | `/api/regions` | 用户 | 无 | `List<RegionResponse>` |
| `GET` | `/api/gpu-models` | 用户 | 无 | `List<GpuModelResponse>` |
| `GET` | `/api/ai-models` | 用户 | 无 | `List<AiModelResponse>` |
| `GET` | `/api/rental-cycle-rules` | 用户 | 无 | `List<RentalCycleRuleResponse>` |
| `GET` | `/api/products` | 用户 | query: `ProductQueryRequest` | `PageResult<ProductResponse>` |
| `GET` | `/api/products/{productCode}` | 用户 | path: `productCode` | `ProductResponse` |

商品列表查询参数：

```text
ProductQueryRequest:
pageNo, pageSize, regionId, gpuModelId, minRentPrice, maxRentPrice
```

核心响应字段：

```text
RegionResponse:
id, regionCode, regionName, sortNo

GpuModelResponse:
id, modelCode, modelName, sortNo

AiModelResponse:
id, modelCode, modelName, vendorName, logoUrl,
monthlyTokenConsumptionTrillion, tokenUnitPrice, deployTechFee, sortNo

RentalCycleRuleResponse:
id, cycleCode, cycleName, cycleDays, yieldMultiplier, earlyPenaltyRate, sortNo

ProductResponse:
id, productCode, productName, machineCode, machineAlias, regionName, gpuModelName,
gpuMemoryGb, gpuPowerTops, rentPrice, tokenOutputPerMinute, tokenOutputPerDay,
rentableUntil, totalStock, availableStock, rentedStock, cpuModel, cpuCores,
memoryGb, systemDiskGb, dataDiskGb, maxExpandDiskGb, driverVersion, cudaVersion,
hasCacheOptimization
```

## 5. 租赁订单与收益

| 方法 | 路径 | 鉴权 | 传参 | 返回 data |
|---|---|---|---|---|
| `POST` | `/api/rental/estimate` | 用户 | body: `RentalEstimateRequest` | `RentalEstimateResponse` |
| `POST` | `/api/rental/orders` | 用户 | body: `CreateRentalOrderRequest` | `RentalOrderDetailResponse` |
| `GET` | `/api/rental/orders` | 用户 | query: `RentalOrderQueryRequest` | `PageResult<RentalOrderSummaryResponse>` |
| `GET` | `/api/rental/orders/{orderNo}` | 用户 | path: `orderNo` | `RentalOrderDetailResponse` |
| `POST` | `/api/rental/orders/{orderNo}/pay` | 用户 | path: `orderNo` | `RentalOrderDetailResponse` |
| `POST` | `/api/rental/orders/{orderNo}/cancel` | 用户 | path: `orderNo` | `RentalOrderDetailResponse` |
| `GET` | `/api/rental/orders/{orderNo}/api-credential` | 用户 | path: `orderNo` | `ApiCredentialResponse` |
| `GET` | `/api/rental/orders/{orderNo}/profits` | 用户 | path + query: `ProfitRecordQueryRequest` | `PageResult<ProfitRecordResponse>` |
| `POST` | `/api/rental/orders/{orderNo}/settle-early` | 用户 | path: `orderNo` | `SettlementOrderResponse` |
| `GET` | `/api/rental/orders/{orderNo}/deploy-info` | 用户 | path: `orderNo` | `ApiDeployInfoResponse` |
| `POST` | `/api/rental/orders/{orderNo}/deploy/pay` | 用户 | path: `orderNo` | `ApiDeployOrderResponse` |
| `GET` | `/api/rental/orders/{orderNo}/deploy-order` | 用户 | path: `orderNo` | `ApiDeployOrderResponse` |
| `POST` | `/api/rental/orders/{orderNo}/start` | 用户 | path: `orderNo` | `RentalOrderDetailResponse` |
| `GET` | `/api/profit/records` | 用户 | query: `ProfitRecordQueryRequest` | `PageResult<ProfitRecordResponse>` |
| `GET` | `/api/profit/summary` | 用户 | 无 | `ProfitSummaryResponse` |
| `GET` | `/api/settlement/orders` | 用户 | query: `SettlementOrderQueryRequest` | `PageResult<SettlementOrderResponse>` |
| `GET` | `/api/settlement/orders/{settlementNo}` | 用户 | path: `settlementNo` | `SettlementOrderResponse` |

请求体：

```json
// RentalEstimateRequest / CreateRentalOrderRequest
{
  "productId": 1,
  "aiModelId": 1,
  "cycleRuleId": 1
}
```

查询参数：

```text
RentalOrderQueryRequest:
pageNo, pageSize, orderStatus, startTime, endTime

ProfitRecordQueryRequest:
pageNo, pageSize, rentalOrderId, orderNo, profitDate, startTime, endTime

SettlementOrderQueryRequest:
pageNo, pageSize, settlementType, status, startTime, endTime
```

核心响应字段：

```text
RentalEstimateResponse:
productId, productName, aiModelId, aiModelName, cycleRuleId, cycleName, cycleDays,
rentPrice, deployTechFee, tokenOutputPerDay, tokenUnitPrice, yieldMultiplier,
expectedDailyProfit, expectedTotalProfit, orderAmount

RentalOrderSummaryResponse:
orderNo, userName, productNameSnapshot, machineCodeSnapshot, machineAliasSnapshot,
aiModelNameSnapshot, cycleDaysSnapshot, orderAmount, expectedDailyProfit,
expectedTotalProfit, orderStatus, profitStatus, settlementStatus, createdAt, paidAt,
apiGeneratedAt, deployFeePaidAt, activatedAt, autoPauseAt, pausedAt, startedAt,
profitStartAt, profitEndAt, expiredAt, canceledAt, finishedAt

RentalOrderDetailResponse:
包含 Summary 字段，并额外返回 productId, aiModelId, cycleRuleId, productCodeSnapshot,
regionNameSnapshot, gpuModelSnapshot, gpuMemorySnapshotGb, gpuPowerTopsSnapshot,
gpuRentPriceSnapshot, tokenOutputPerDaySnapshot, aiVendorNameSnapshot,
monthlyTokenConsumptionSnapshot, tokenUnitPriceSnapshot, deployFeeSnapshot,
yieldMultiplierSnapshot, earlyPenaltyRateSnapshot, currency, paidAmount,
machinePayTxNo, updatedAt

ApiCredentialResponse:
credentialNo, apiName, apiBaseUrl, tokenMasked, modelNameSnapshot, deployFeeSnapshot,
tokenStatus, generatedAt, activationPaidAt, activatedAt, autoPauseAt, pausedAt,
startedAt, expiredAt

ApiDeployInfoResponse:
orderNo, orderStatus, credentialNo, tokenStatus, modelNameSnapshot, deployFeeSnapshot,
apiName, apiBaseUrl, tokenMasked, deployOrderStatus

ApiDeployOrderResponse:
deployNo, userName, orderNo, credentialNo, modelNameSnapshot, deployFeeAmount,
status, walletTxNo, paidAt, createdAt

ProfitRecordResponse:
profitNo, orderNo, productNameSnapshot, aiModelNameSnapshot, profitDate,
gpuDailyTokenSnapshot, tokenPriceSnapshot, yieldMultiplierSnapshot,
baseProfitAmount, finalProfitAmount, status, walletTxNo, commissionGenerated, createdAt

ProfitSummaryResponse:
totalProfit, todayProfit, yesterdayProfit, currentMonthProfit

SettlementOrderResponse:
settlementNo, orderNo, settlementType, currency, principalAmount, profitAmount,
penaltyAmount, actualSettleAmount, status, reviewedBy, reviewedAt, settledAt,
walletTxNo, remark, createdAt
```

## 6. 充值

| 方法 | 路径 | 鉴权 | 传参 | 返回 data |
|---|---|---|---|---|
| `GET` | `/api/recharge/channels` | 用户 | 无 | `List<RechargeChannelResponse>` |
| `POST` | `/api/recharge/orders` | 用户 | body: `CreateRechargeOrderRequest` | `RechargeOrderResponse` |
| `GET` | `/api/recharge/orders` | 用户 | query: `RechargeOrderQueryRequest` | `PageResult<RechargeOrderResponse>` |
| `GET` | `/api/recharge/orders/{rechargeNo}` | 用户 | path: `rechargeNo` | `RechargeOrderResponse` |
| `POST` | `/api/recharge/orders/{rechargeNo}/cancel` | 用户 | path: `rechargeNo` | `null` |

请求体：

```json
{
  "channelId": 1,
  "applyAmount": "100.00",
  "externalTxNo": "链上/外部交易号",
  "paymentProofUrl": "付款截图地址",
  "userRemark": "备注"
}
```

查询参数：

```text
RechargeOrderQueryRequest:
pageNo, pageSize, status, startTime, endTime
```

响应字段：

```text
RechargeChannelResponse:
channelId, channelCode, channelName, network, displayUrl, accountName, accountNo,
minAmount, maxAmount, feeRate, sortNo

RechargeOrderResponse:
rechargeNo, userName, channelId, currency, channelName, network, displayUrl,
accountNo, applyAmount, actualAmount, externalTxNo, paymentProofUrl, userRemark,
status, reviewedBy, reviewedAt, reviewRemark, creditedAt, walletTxNo, createdAt
```

## 7. 提现

| 方法 | 路径 | 鉴权 | 传参 | 返回 data |
|---|---|---|---|---|
| `POST` | `/api/withdraw/orders` | 用户 | body: `CreateWithdrawOrderRequest` | `WithdrawOrderResponse` |
| `GET` | `/api/withdraw/orders` | 用户 | query: `WithdrawOrderQueryRequest` | `PageResult<WithdrawOrderResponse>` |
| `GET` | `/api/withdraw/orders/{withdrawNo}` | 用户 | path: `withdrawNo` | `WithdrawOrderResponse` |
| `POST` | `/api/withdraw/orders/{withdrawNo}/cancel` | 用户 | path: `withdrawNo` | `null` |

请求体：

```json
{
  "network": "TRC20",
  "accountName": "张三",
  "accountNo": "提现地址或账号",
  "applyAmount": "100.00"
}
```

查询参数：

```text
WithdrawOrderQueryRequest:
pageNo, pageSize, status, startTime, endTime
```

响应字段：

```text
WithdrawOrderResponse:
withdrawNo, userName, currency, withdrawMethod, network, accountName, accountNo,
applyAmount, feeAmount, actualAmount, status, freezeTxNo, unfreezeTxNo, paidTxNo,
reviewedBy, reviewedAt, reviewRemark, paidAt, payProofNo, createdAt
```

## 8. 团队与佣金

| 方法 | 路径 | 鉴权 | 传参 | 返回 data |
|---|---|---|---|---|
| `GET` | `/api/team/summary` | 用户 | 无 | `TeamSummaryResponse` |
| `GET` | `/api/team/members` | 用户 | query: `TeamMemberQueryRequest` | `PageResult<TeamMemberResponse>` |
| `GET` | `/api/commission/summary` | 用户 | 无 | `CommissionSummaryResponse` |
| `GET` | `/api/commission/records` | 用户 | query: `CommissionRecordQueryRequest` | `PageResult<CommissionRecordResponse>` |

查询参数：

```text
TeamMemberQueryRequest:
pageNo, pageSize

CommissionRecordQueryRequest:
pageNo, pageSize, levelNo, startTime, endTime
```

响应字段：

```text
TeamSummaryResponse:
totalTeamCount, directTeamCount, level2TeamCount, level3TeamCount, deeperTeamCount

TeamMemberResponse:
userId, userName, email, status, levelDepth, joinedAt

CommissionSummaryResponse:
totalCommission, todayCommission, yesterdayCommission, currentMonthCommission,
level1Commission, level2Commission, level3Commission

CommissionRecordResponse:
commissionNo, sourceUserId, userName, sourceOrderId, sourceProfitId, levelNo,
sourceProfitAmount, commissionRateSnapshot, commissionAmount, status, walletTxNo,
settledAt, createdAt
```

## 9. 通知

用户通知：

| 方法 | 路径 | 鉴权 | 传参 | 返回 data |
|---|---|---|---|---|
| `GET` | `/api/notifications` | 用户 | query: `pageNo,pageSize,readStatus,type,bizType` | `PageResult<SysNotification>` |
| `GET` | `/api/notifications/{id}` | 用户 | path: `id` | `SysNotification` |
| `POST` | `/api/notifications/{id}/read` | 用户 | path: `id` | `SysNotification` |
| `POST` | `/api/notifications/read-all` | 用户 | 无 | 已读数量 `Long` |

通知字段：

```text
SysNotification:
id, userId, title, content, type, bizType, bizId, readStatus, readAt, createdAt
```

## 10. 博客

公开博客：

| 方法 | 路径 | 鉴权 | 传参 | 返回 data |
|---|---|---|---|---|
| `GET` | `/api/blog/categories` | 公开 | 无 | `List<BlogCategory>` |
| `GET` | `/api/blog/tags` | 公开 | 无 | `List<BlogTag>` |
| `GET` | `/api/blog/posts` | 公开 | query: `pageNo,pageSize,category_id,tag_id,start_time,end_time` | `PageResult<BlogPostResponse>` |
| `GET` | `/api/blog/posts/{id}` | 公开 | path: `id` | `BlogPostResponse` |

博客响应字段：

```text
BlogCategory:
id, categoryName, sortNo, status, createdAt, updatedAt

BlogTag:
id, tagName, sortNo, status, createdAt, updatedAt

BlogPostResponse:
id, categoryId, categoryName, title, summary, coverImageUrl, contentMarkdown,
publishStatus, publishedAt, isTop, sortNo, viewCount, createdBy, tagIds, tagNames,
createdAt, updatedAt
```

## 11. 管理端认证

| 方法 | 路径 | 鉴权 | 传参 | 返回 data |
|---|---|---|---|---|
| `POST` | `/api/admin/auth/login` | 公开 | body: `AdminLoginRequest` | `AdminLoginResponse` |
| `GET` | `/api/admin/auth/me` | 管理员 | 无 | `AdminMeResponse` |
| `POST` | `/api/admin/auth/logout` | 管理员 | 无 | `null` |

请求体：

```json
{ "userName": "admin", "password": "password" }
```

响应字段：

```text
AdminLoginResponse:
adminAccessToken, tokenType, expiresIn

AdminMeResponse:
adminId, userName, role, status
```

## 12. 管理端目录维护

所有接口需要管理员 token。

| 方法 | 路径 | 传参 | 返回 data |
|---|---|---|---|
| `GET` | `/api/admin/regions` | query: `pageNo,pageSize,region_code,status` | `PageResult<Region>` |
| `POST` | `/api/admin/regions` | body: `Region` | `Region` |
| `PUT` | `/api/admin/regions/{id}` | path + body: `Region` | `Region` |
| `POST` | `/api/admin/regions/{id}/enable` | path: `id` | `Region` |
| `POST` | `/api/admin/regions/{id}/disable` | path: `id` | `Region` |
| `GET` | `/api/admin/gpu-models` | query: `pageNo,pageSize,model_code,status` | `PageResult<GpuModel>` |
| `POST` | `/api/admin/gpu-models` | body: `GpuModel` | `GpuModel` |
| `PUT` | `/api/admin/gpu-models/{id}` | path + body: `GpuModel` | `GpuModel` |
| `POST` | `/api/admin/gpu-models/{id}/enable` | path: `id` | `GpuModel` |
| `POST` | `/api/admin/gpu-models/{id}/disable` | path: `id` | `GpuModel` |
| `GET` | `/api/admin/products` | query: `pageNo,pageSize,product_code,region_id,gpu_model_id,status` | `PageResult<AdminProductResponse>` |
| `GET` | `/api/admin/products/{productCode}` | path: `productCode` | `AdminProductResponse` |
| `POST` | `/api/admin/products` | body: `Product` | `Product` |
| `PUT` | `/api/admin/products/{productCode}` | path + body: `Product` | `Product` |
| `POST` | `/api/admin/products/{productCode}/enable` | path: `productCode` | `Product` |
| `POST` | `/api/admin/products/{productCode}/disable` | path: `productCode` | `Product` |
| `GET` | `/api/admin/ai-models` | query: `pageNo,pageSize,model_code,status` | `PageResult<AiModel>` |
| `POST` | `/api/admin/ai-models` | body: `AiModel` | `AiModel` |
| `PUT` | `/api/admin/ai-models/{modelCode}` | path + body: `AiModel` | `AiModel` |
| `POST` | `/api/admin/ai-models/{modelCode}/enable` | path: `modelCode` | `AiModel` |
| `POST` | `/api/admin/ai-models/{modelCode}/disable` | path: `modelCode` | `AiModel` |
| `GET` | `/api/admin/rental-cycle-rules` | query: `pageNo,pageSize,cycle_code,status` | `PageResult<RentalCycleRule>` |
| `POST` | `/api/admin/rental-cycle-rules` | body: `RentalCycleRule` | `RentalCycleRule` |
| `PUT` | `/api/admin/rental-cycle-rules/{cycleCode}` | path + body: `RentalCycleRule` | `RentalCycleRule` |
| `POST` | `/api/admin/rental-cycle-rules/{cycleCode}/enable` | path: `cycleCode` | `RentalCycleRule` |
| `POST` | `/api/admin/rental-cycle-rules/{cycleCode}/disable` | path: `cycleCode` | `RentalCycleRule` |

维护对象字段：

```text
Region:
id, regionCode, regionName, sortNo, status, createdAt, updatedAt

GpuModel:
id, modelCode, modelName, sortNo, status, createdAt, updatedAt

AiModel:
id, modelCode, modelName, vendorName, logoUrl, monthlyTokenConsumptionTrillion,
tokenUnitPrice, deployTechFee, status, sortNo, createdAt, updatedAt

Product:
id, productCode, productName, machineCode, machineAlias, regionId, gpuModelId,
gpuMemoryGb, gpuPowerTops, rentPrice, tokenOutputPerMinute, tokenOutputPerDay,
rentableUntil, totalStock, availableStock, rentedStock, cpuModel, cpuCores,
memoryGb, systemDiskGb, dataDiskGb, maxExpandDiskGb, driverVersion, cudaVersion,
hasCacheOptimization, status, sortNo, versionNo, createdAt, updatedAt

RentalCycleRule:
id, cycleCode, cycleName, cycleDays, yieldMultiplier, earlyPenaltyRate, status,
sortNo, createdAt, updatedAt
```

新增时一般不传 `id/createdAt/updatedAt/versionNo`；启用禁用接口不需要 body。

## 13. 管理端业务查询

所有接口需要管理员 token。

| 方法 | 路径 | 传参 | 返回 data |
|---|---|---|---|
| `GET` | `/api/admin/users` | query: `pageNo,pageSize,email,user_id,status,start_time,end_time` | `PageResult<AdminUserResponse>` |
| `GET` | `/api/admin/users/{userId}` | path: `userId` | `AdminUserResponse` |
| `POST` | `/api/admin/users/{userId}/disable` | path: `userId` | `AdminUserResponse` |
| `POST` | `/api/admin/users/{userId}/enable` | path: `userId` | `AdminUserResponse` |
| `GET` | `/api/admin/wallets` | query: `pageNo,pageSize,user_id,wallet_no` | `PageResult<AdminWalletResponse>` |
| `GET` | `/api/admin/wallets/{userId}` | path: `userId` | `AdminWalletResponse` |
| `GET` | `/api/admin/wallet-transactions` | query: `pageNo,pageSize,user_id,wallet_no,tx_type,biz_type,start_time,end_time` | `PageResult<WalletTransaction>` |
| `GET` | `/api/admin/rental/orders` | query: `pageNo,pageSize,user_id,order_no,order_status,profit_status,settlement_status,start_time,end_time` | `PageResult<RentalOrder>` |
| `GET` | `/api/admin/rental/orders/{orderNo}` | path: `orderNo` | `AdminRentalOrderDetailResponse` |
| `GET` | `/api/admin/api-credentials` | query: `pageNo,pageSize,user_id,credential_no,token_status,start_time,end_time` | `PageResult<AdminApiCredentialResponse>` |
| `GET` | `/api/admin/api-credentials/{credentialNo}` | path: `credentialNo` | `AdminApiCredentialResponse` |
| `GET` | `/api/admin/api-deploy-orders` | query: `pageNo,pageSize,user_id,deploy_no,status,start_time,end_time` | `PageResult<ApiDeployOrder>` |
| `GET` | `/api/admin/api-deploy-orders/{deployNo}` | path: `deployNo` | `ApiDeployOrder` |
| `GET` | `/api/admin/profit/records` | query: `pageNo,pageSize,user_id,order_no,status,profit_date,start_time,end_time` | `PageResult<RentalProfitRecord>` |
| `GET` | `/api/admin/profit/records/{profitNo}` | path: `profitNo` | `RentalProfitRecord` |
| `GET` | `/api/admin/settlement/orders` | query: `pageNo,pageSize,user_id,order_no,settlement_type,status,start_time,end_time` | `PageResult<RentalSettlementOrder>` |
| `GET` | `/api/admin/settlement/orders/{settlementNo}` | path: `settlementNo` | `RentalSettlementOrder` |
| `GET` | `/api/admin/commission/records` | query: `pageNo,pageSize,user_id,order_no,level_no,status,start_time,end_time` | `PageResult<CommissionRecord>` |
| `GET` | `/api/admin/commission/records/{commissionNo}` | path: `commissionNo` | `CommissionRecord` |
| `GET` | `/api/admin/team/relations` | query: `pageNo,pageSize,ancestor_user_id,descendant_user_id,level_depth` | `PageResult<UserTeamRelation>` |
| `GET` | `/api/admin/users/{userId}/team` | path: `userId` | `AdminUserTeamResponse` |
| `GET` | `/api/admin/logs` | query: `pageNo,pageSize,admin_id,action,biz_type,start_time,end_time` | `PageResult<SysAdminLog>` |
| `GET` | `/api/admin/logs/{id}` | path: `id` | `SysAdminLog` |

常用响应字段：

```text
AdminUserResponse:
id, userId, email, userName, status, emailVerifiedAt, lastLoginAt, createdAt, updatedAt

AdminWalletResponse:
id, walletNo, userId, userName, currency, availableBalance, frozenBalance,
totalRecharge, totalWithdraw, totalProfit, totalCommission, status, versionNo,
createdAt, updatedAt

AdminApiCredentialResponse:
id, credentialNo, userId, rentalOrderId, apiName, apiBaseUrl, tokenMasked,
modelNameSnapshot, deployFeeSnapshot, tokenStatus, generatedAt, activationPaidAt,
activatedAt, autoPauseAt, pausedAt, startedAt, expiredAt, revokedAt,
mockRequestCount, mockTokenDisplay, mockLastRefreshAt, remark, createdAt, updatedAt

AdminRentalOrderDetailResponse:
在用户端 RentalOrderDetailResponse 基础上增加 id, userId, credentialNo,
tokenStatus, apiBaseUrl, deployOrderStatus

AdminUserTeamResponse:
userId, totalTeamCount, directTeamCount, level2TeamCount, level3TeamCount,
deeperTeamCount, relations
```

## 14. 管理端充值、提现

所有接口需要管理员 token。

| 方法 | 路径 | 传参 | 返回 data |
|---|---|---|---|
| `GET` | `/api/admin/recharge/channels` | query: `pageNo,pageSize,status` | `PageResult<AdminRechargeChannelResponse>` |
| `POST` | `/api/admin/recharge/channels` | body: `CreateRechargeChannelRequest` | `AdminRechargeChannelResponse` |
| `PUT` | `/api/admin/recharge/channels/{id}` | path + body: `UpdateRechargeChannelRequest` | `AdminRechargeChannelResponse` |
| `POST` | `/api/admin/recharge/channels/{id}/delete` | path: `id` | `null` |
| `GET` | `/api/admin/recharge/orders` | query: `pageNo,pageSize,user_id,recharge_no,status,start_time,end_time` | `PageResult<RechargeOrderResponse>` |
| `GET` | `/api/admin/recharge/orders/{rechargeNo}` | path: `rechargeNo` | `RechargeOrderResponse` |
| `POST` | `/api/admin/recharge/orders/{rechargeNo}/approve` | path + body: `AdminApproveRechargeRequest` | `RechargeOrderResponse` |
| `POST` | `/api/admin/recharge/orders/{rechargeNo}/reject` | path + body: `AdminRejectRechargeRequest` | `RechargeOrderResponse` |
| `GET` | `/api/admin/withdraw/orders` | query: `pageNo,pageSize,user_id,withdraw_no,status,start_time,end_time` | `PageResult<WithdrawOrderResponse>` |
| `GET` | `/api/admin/withdraw/orders/{withdrawNo}` | path: `withdrawNo` | `WithdrawOrderResponse` |
| `POST` | `/api/admin/withdraw/orders/{withdrawNo}/approve` | path + body: `AdminApproveWithdrawRequest` | `WithdrawOrderResponse` |
| `POST` | `/api/admin/withdraw/orders/{withdrawNo}/reject` | path + body: `AdminRejectWithdrawRequest` | `WithdrawOrderResponse` |
| `POST` | `/api/admin/withdraw/orders/{withdrawNo}/paid` | path + body: `AdminPaidWithdrawRequest` | `WithdrawOrderResponse` |

请求体：

```json
// CreateRechargeChannelRequest / UpdateRechargeChannelRequest
{
  "channelCode": "USDT_TRC20",
  "channelName": "USDT-TRC20",
  "network": "TRC20",
  "displayUrl": "充值二维码或链接",
  "accountName": "收款名称",
  "accountNo": "收款地址",
  "minAmount": "100.00",
  "maxAmount": "100000.00",
  "feeRate": "0.00000000",
  "sortNo": 1,
  "status": 1
}

// AdminApproveRechargeRequest
{ "actualAmount": "100.00", "reviewRemark": "审核通过" }

// AdminRejectRechargeRequest
{ "reviewRemark": "拒绝原因" }

// AdminApproveWithdrawRequest
{ "reviewRemark": "审核通过" }

// AdminRejectWithdrawRequest
{ "reviewRemark": "拒绝原因" }

// AdminPaidWithdrawRequest
{ "payProofNo": "付款凭证号" }
```

管理端充值渠道响应字段：

```text
AdminRechargeChannelResponse:
channelId, channelCode, channelName, network, displayUrl, accountName, accountNo,
minAmount, maxAmount, feeRate, sortNo, status, createdAt, updatedAt
```

## 15. 管理端博客

所有接口需要管理员 token。

| 方法 | 路径 | 传参 | 返回 data |
|---|---|---|---|
| `GET` | `/api/admin/blog/categories` | query: `pageNo,pageSize,status` | `PageResult<BlogCategory>` |
| `POST` | `/api/admin/blog/categories` | body: `BlogCategory` | `BlogCategory` |
| `PUT` | `/api/admin/blog/categories/{id}` | path + body: `BlogCategory` | `BlogCategory` |
| `POST` | `/api/admin/blog/categories/{id}/enable` | path: `id` | `BlogCategory` |
| `POST` | `/api/admin/blog/categories/{id}/disable` | path: `id` | `BlogCategory` |
| `GET` | `/api/admin/blog/tags` | query: `pageNo,pageSize,status` | `PageResult<BlogTag>` |
| `POST` | `/api/admin/blog/tags` | body: `BlogTag` | `BlogTag` |
| `PUT` | `/api/admin/blog/tags/{id}` | path + body: `BlogTag` | `BlogTag` |
| `POST` | `/api/admin/blog/tags/{id}/enable` | path: `id` | `BlogTag` |
| `POST` | `/api/admin/blog/tags/{id}/disable` | path: `id` | `BlogTag` |
| `GET` | `/api/admin/blog/posts` | query: `pageNo,pageSize,category_id,tag_id,publish_status,start_time,end_time` | `PageResult<BlogPostResponse>` |
| `GET` | `/api/admin/blog/posts/{id}` | path: `id` | `BlogPostResponse` |
| `POST` | `/api/admin/blog/posts` | body: `BlogPostRequest` | `BlogPostResponse` |
| `PUT` | `/api/admin/blog/posts/{id}` | path + body: `BlogPostRequest` | `BlogPostResponse` |
| `POST` | `/api/admin/blog/posts/{id}/publish` | path: `id` | `BlogPostResponse` |
| `POST` | `/api/admin/blog/posts/{id}/unpublish` | path: `id` | `BlogPostResponse` |
| `POST` | `/api/admin/blog/posts/{id}/delete` | path: `id` | `null` |

请求体：

```json
// BlogCategory
{ "categoryName": "公告", "sortNo": 1, "status": 1 }

// BlogTag
{ "tagName": "平台动态", "sortNo": 1, "status": 1 }

// BlogPostRequest
{
  "categoryId": 1,
  "title": "标题",
  "summary": "摘要",
  "coverImageUrl": "封面地址",
  "contentMarkdown": "正文 Markdown",
  "publishStatus": 0,
  "isTop": 0,
  "sortNo": 1,
  "tagIds": [1, 2]
}
```

## 16. 管理端通知、配置、看板、调度

所有接口需要管理员 token。

| 方法 | 路径 | 传参 | 返回 data |
|---|---|---|---|
| `GET` | `/api/admin/dashboard/overview` | 无 | `DashboardOverviewResponse` |
| `GET` | `/api/admin/dashboard/finance` | 无 | `DashboardFinanceResponse` |
| `GET` | `/api/admin/dashboard/orders` | 无 | `DashboardOrdersResponse` |
| `GET` | `/api/admin/dashboard/users` | 无 | `DashboardUsersResponse` |
| `GET` | `/api/admin/notifications` | query: `pageNo,pageSize,user_id,read_status,type,biz_type` | `PageResult<SysNotification>` |
| `GET` | `/api/admin/notifications/{id}` | path: `id` | `SysNotification` |
| `POST` | `/api/admin/notifications` | body: `NotificationCreateRequest` | `SysNotification` |
| `POST` | `/api/admin/notifications/broadcast` | body: `NotificationBroadcastRequest` | 发送数量 `Integer` |
| `POST` | `/api/admin/notifications/{id}/cancel` | path: `id` | `null` |
| `GET` | `/api/admin/sys-configs` | query: `pageNo,pageSize,configKey` | `PageResult<AdminSysConfigResponse>` |
| `GET` | `/api/admin/sys-configs/{configKey}` | path: `configKey` | `AdminSysConfigResponse` |
| `PUT` | `/api/admin/sys-configs/{configKey}` | path + body: `UpdateSysConfigRequest` | `AdminSysConfigResponse` |
| `POST` | `/api/admin/scheduler/activation-timeout-cancel/run` | 无 | `SchedulerRunResult` |
| `POST` | `/api/admin/scheduler/auto-pause/run` | 无 | `SchedulerRunResult` |
| `POST` | `/api/admin/scheduler/daily-profit/run` | 无 | `SchedulerRunResult` |
| `POST` | `/api/admin/scheduler/expire-settlement/run` | 无 | `SchedulerRunResult` |
| `POST` | `/api/admin/scheduler/commission-generate/run` | 无 | `SchedulerRunResult` |

请求体：

```json
// NotificationCreateRequest
{
  "userId": 1,
  "title": "标题",
  "content": "内容",
  "type": "SYSTEM",
  "bizType": "ORDER",
  "bizId": 1
}

// NotificationBroadcastRequest
{
  "title": "标题",
  "content": "内容",
  "type": "SYSTEM",
  "bizType": "NOTICE",
  "bizId": null
}

// UpdateSysConfigRequest
{ "configValue": "配置值", "configDesc": "配置说明" }
```

看板响应字段：

```text
DashboardOverviewResponse:
totalUsers, activeUsers, disabledUsers, totalRechargeAmount, totalWithdrawAmount,
totalOrderAmount, totalProfitAmount, totalCommissionAmount, runningOrderCount,
pendingRechargeCount, pendingWithdrawCount

DashboardFinanceResponse:
todayRechargeAmount, todayWithdrawAmount, todayProfitAmount, todayCommissionAmount,
walletTotalAvailableBalance, walletTotalFrozenBalance

DashboardOrdersResponse:
orderStatusCounts, profitStatusCounts, todayNewOrderCount, todayPaidOrderCount,
runningOrderCount, pausedOrderCount

DashboardUsersResponse:
todayNewUsers, currentMonthNewUsers, activeUsers, disabledUsers, usersWithParent,
usersWithoutParent

AdminSysConfigResponse:
id, configKey, configValue, configDesc, createdAt, updatedAt
```

## 17. 健康检查

| 方法 | 路径 | 鉴权 | 传参 | 返回 data |
|---|---|---|---|---|
| `GET` | `/api/system/health` | 公开 | 无 | `Map<String,String>` |

示例：

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "status": "UP",
    "application": "compute-rental-backend"
  },
  "timestamp": "2026-04-29 12:00:00"
}
```
