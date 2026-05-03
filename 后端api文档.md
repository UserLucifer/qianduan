# 后端 API 文档

## 用户头像选择

### 1. 登录返回用户信息新增字段

接口：

- `POST /api/auth/login`
- `POST /api/auth/login/password`
- `POST /api/auth/signup`
- `POST /api/auth/register`

返回体中的 `data.user` 新增：

```json
{
  "id": 1,
  "userId": "U202604300001",
  "email": "user@example.com",
  "userName": "demo",
  "avatarKey": "avatar_1"
}
```

说明：

- `avatarKey` 是前端组件库头像标识，不是图片 URL。
- 老用户未选择头像时，`avatarKey` 可能为 `null`。

### 2. 当前用户信息新增字段

接口：

```http
GET /api/user/me
Authorization: Bearer <token>
```

返回：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "userId": "U202604300001",
    "email": "user@example.com",
    "userName": "demo",
    "avatarKey": "avatar_1",
    "status": 1,
    "createdAt": "2026-05-01 10:30:00"
  }
}
```

说明：

- `createdAt` 是用户注册时间。
- 时间格式按后端统一 JSON 配置返回：`yyyy-MM-dd HH:mm:ss`。
- 前端如果要展示“注册时间”，直接读取 `data.createdAt`。

### 3. 修改当前用户头像

接口：

```http
PUT /api/user/avatar
Authorization: Bearer <token>
Content-Type: application/json
```

请求体：

```json
{
  "avatarKey": "avatar_1"
}
```

字段规则：

- 必填
- 最大长度 64
- 只允许字母、数字、下划线 `_`、中划线 `-`

返回：同 `GET /api/user/me` 的 `data`。

前端接入方式：

- 前端头像组件库维护自己的头像列表，例如 `avatar_1`、`avatar_2`、`robot_blue`。
- 用户选择头像后，只提交选中的 `avatarKey`。
- 页面展示头像时，用后端返回的 `avatarKey` 映射到前端本地组件库头像。
- 如果 `avatarKey` 为 `null`，前端展示默认头像。

## 系统公共接口

### 1. 前端枚举字典

接口：

```http
GET /api/system/enums
```

返回：

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "commonStatus": [
      { "name": "ENABLED", "value": 1, "label": "启用" },
      { "name": "DISABLED", "value": 0, "label": "停用" }
    ],
    "rentalOrderStatus": [
      { "name": "PENDING_PAY", "value": "PENDING_PAY", "label": "待支付" },
      { "name": "RUNNING", "value": "RUNNING", "label": "运行中" }
    ]
  }
}
```

说明：

- `data` 是枚举分组 Map，key 为枚举业务名。
- 每个枚举项包含 `name`、`value`、`label`。
- 不返回 `ErrorCode`、管理员角色、定时任务内部状态。
- `rentalOrderStatus` 不返回保留/内部状态：`PAID`、`SETTLING`、`SETTLED`。

当前返回分组：

- `commonStatus`
- `blogPublishStatus`
- `commissionLevel`
- `deviceType`
- `emailVerifyScene`
- `notificationBizType`
- `notificationType`
- `profitStatus`
- `readStatus`
- `rechargeOrderStatus`
- `recordSettleStatus`
- `rentalOrderSettlementStatus`
- `rentalOrderStatus`
- `rentalSettlementOrderStatus`
- `rentalSettlementType`
- `walletBusinessType`
- `walletTransactionType`
- `withdrawOrderStatus`
- `apiDeployOrderStatus`
- `apiTokenStatus`

### 2. 管理后台清理 Redis 缓存

接口：

```http
POST /api/admin/system/cache/redis/clear
Authorization: Bearer <admin-token>
```

返回：

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "deletedCount": 2,
    "prefixes": [
      "compute-rental:cache:",
      "compute-rental:email-code:"
    ],
    "executedAt": "2026-05-03 15:40:00"
  }
}
```

说明：

- 后端使用 Redis `SCAN` 分批删除，不使用 `KEYS`。
- 只清理白名单前缀：`compute-rental:cache:*`、`compute-rental:email-code:*`。
- 不清理 `scheduler:*:lock`，避免误删定时任务锁。
- 操作会写入管理员操作日志。

## 管理后台接口字段策略

- 后台接口优先返回完整业务字段，包括 `id`、`status`、`sortNo`、`versionNo`、`createdAt`、`updatedAt` 等运维字段。
- 敏感字段不明文返回：密码哈希不返回，API token/密钥类字段只返回掩码或加密后的展示值。
- 管理后台用户列表/详情返回新增 `avatarKey`。
- 管理后台商品目录接口不再直接返回 Entity，返回 Admin DTO：
  - 地区：`AdminRegionResponse`
  - GPU 型号：`AdminGpuModelResponse`
  - AI 模型：`AdminAiModelResponse`
  - 租赁周期规则：`AdminRentalCycleRuleResponse`
  - 商品：`AdminProductResponse`
- 管理后台商品目录创建/更新请求不再使用 Entity 作为 OpenAPI Schema，改为 Admin Request DTO：
  - 地区：`AdminRegionRequest`
  - GPU 型号：`AdminGpuModelRequest`
  - AI 模型：`AdminAiModelRequest`
  - 租赁周期规则：`AdminRentalCycleRuleRequest`
  - 商品：`AdminProductRequest`
- 商品目录 Admin Request DTO 只包含可编辑业务字段，不包含 `id`、`createdAt`、`updatedAt` 等服务端维护字段；商品 `versionNo` 保留用于后续乐观锁并发控制。
- 管理后台业务查询接口不再直接返回 Entity，改为 Admin Response DTO：
  - 钱包流水：`AdminWalletTransactionResponse`
  - 租赁订单列表：`AdminRentalOrderResponse`
  - API 部署订单：`AdminApiDeployOrderResponse`
  - 收益记录：`AdminProfitRecordResponse`
  - 结算订单：`AdminSettlementOrderResponse`
  - 佣金记录：`AdminCommissionRecordResponse`
  - 团队关系：`AdminTeamRelationResponse`
  - 操作日志：`AdminLogResponse`
- 上述 Admin Response DTO 保留后台排查需要的业务字段；API 凭证仍只返回 `tokenMasked`，不返回 `tokenCiphertext`。
