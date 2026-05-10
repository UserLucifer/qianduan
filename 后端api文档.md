# 后端 API 文档

## 后台客户管理

### GET `/api/admin/users`

说明：分页查询后台客户列表。

鉴权：需要管理员登录。

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `pageNo` | number | 否 | 页码，默认 `1` |
| `pageSize` | number | 否 | 每页数量，默认 `10` |
| `keyword` | string | 否 | 模糊搜索关键词，匹配邮箱 `email` 或用户名 `userName` |
| `status` | number | 否 | 用户状态 |
| `start_time` | string | 否 | 注册开始时间，格式 `yyyy-MM-dd HH:mm:ss`；可单独传入 |
| `end_time` | string | 否 | 注册结束时间，格式 `yyyy-MM-dd HH:mm:ss` |
| `email` | string | 否 | 邮箱，兼容旧筛选 |
| `user_id` | string | 否 | 用户业务编号，兼容旧筛选；后台客户列表页面不再使用 |

### POST `/api/admin/users/{userId}/disable`

说明：禁用用户。禁用后系统会暂停该用户 RUNNING（运行中）订单、关闭运行片段、暂停 ACTIVE（生效中）API 凭证；该用户历史 JWT 会在后续请求中被拒绝。

鉴权：需要管理员登录。

路径参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `userId` | number | 是 | 用户主键 ID |

### POST `/api/admin/users/{userId}/enable`

说明：接口保留，但当前业务口径为“用户禁用后不可重新启用”。调用会返回业务错误 `USER_REENABLE_NOT_ALLOWED`。

鉴权：需要管理员登录。

路径参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `userId` | number | 是 | 用户主键 ID |

## 后台钱包管理

### GET `/api/admin/wallets`

说明：分页查询用户钱包列表。

鉴权：需要管理员登录。

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `pageNo` | number | 否 | 页码，默认 `1` |
| `pageSize` | number | 否 | 每页数量，默认 `10` |
| `keyword` | string | 否 | 模糊搜索关键词，匹配用户名称 `userName` 或邮箱 `email` |
| `user_id` | number | 否 | 用户主键 ID，兼容旧筛选 |
| `wallet_no` | string | 否 | 钱包编号，兼容旧筛选 |

响应字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | number | 钱包主键 ID |
| `walletNo` | string | 钱包编号 |
| `userId` | number | 用户主键 ID |
| `userName` | string | 用户名称 |
| `email` | string | 用户邮箱 |
| `currency` | string | 币种 |
| `availableBalance` | number | 可用余额 |
| `frozenBalance` | number | 冻结余额 |
| `totalRecharge` | number | 累计充值 |
| `totalWithdraw` | number | 累计提现 |
| `totalProfit` | number | 累计收益 |
| `totalCommission` | number | 累计佣金 |
| `status` | number | 钱包状态 |
| `versionNo` | number | 版本号 |
| `createdAt` | string | 创建时间 |
| `updatedAt` | string | 更新时间 |

### GET `/api/admin/wallets/{userId}`

说明：查询指定用户钱包详情。

鉴权：需要管理员登录。

路径参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `userId` | number | 是 | 用户主键 ID |

响应字段同 `GET /api/admin/wallets`，包含 `email`。

### GET `/api/admin/wallet-transactions`

说明：分页查询平台钱包资金流水。

鉴权：需要管理员登录。

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `pageNo` | number | 否 | 页码，默认 `1` |
| `pageSize` | number | 否 | 每页数量，默认 `10` |
| `keyword` | string | 否 | 模糊搜索关键词，匹配用户名称 `userName` 或邮箱 `email` |
| `user_id` | number | 否 | 用户主键 ID，兼容旧筛选 |
| `wallet_no` | string | 否 | 钱包编号，兼容旧筛选 |
| `tx_type` | string | 否 | 资金流水类型：`IN`、`OUT`、`FREEZE`、`UNFREEZE` |
| `biz_type` | string | 否 | 业务类型 |
| `start_time` | string | 否 | 开始时间，格式 `yyyy-MM-dd HH:mm:ss`；可单独传入 |
| `end_time` | string | 否 | 结束时间，格式 `yyyy-MM-dd HH:mm:ss` |

## 后台充值审核

### GET `/api/admin/recharge/orders`

说明：分页查询后台充值审核订单。

鉴权：需要管理员登录。

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `pageNo` | number | 否 | 页码，默认 `1` |
| `pageSize` | number | 否 | 每页数量，默认 `10`，最大 `100` |
| `keyword` | string | 否 | 模糊搜索关键词，匹配用户名称 `userName` 或邮箱 `email` |
| `status` | string | 否 | 充值审核状态，如 `SUBMITTED`、`APPROVED`、`REJECTED`、`CANCELED` |
| `startTime` | string | 否 | 创建开始时间，格式 `yyyy-MM-dd HH:mm:ss`；可单独传入 |
| `endTime` | string | 否 | 创建结束时间，格式 `yyyy-MM-dd HH:mm:ss` |

响应字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `rechargeNo` | string | 充值订单号 |
| `userName` | string | 充值人用户名 |
| `email` | string | 充值人邮箱 |
| `channelName` | string | 支付渠道名称 |
| `network` | string | 支付网络 |
| `applyAmount` | number | 申请充值金额 |
| `actualAmount` | number | 实际到账金额 |
| `externalTxNo` | string | 外部交易号 |
| `paymentProofUrl` | string | 支付凭证地址 |
| `status` | string | 充值审核状态 |
| `reviewedBy` | number | 审核人管理员 ID |
| `reviewedAt` | string | 审核时间 |
| `creditedAt` | string | 到账时间 |
| `walletTxNo` | string | 钱包流水号 |
| `createdAt` | string | 创建时间 |

## 后台提现审核

### GET `/api/admin/withdraw/orders`

说明：分页查询后台提现审核订单。

鉴权：需要管理员登录。

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `pageNo` | number | 否 | 页码，默认 `1` |
| `pageSize` | number | 否 | 每页数量，默认 `10`，最大 `100` |
| `keyword` | string | 否 | 模糊搜索关键词，匹配用户名称 `userName` 或邮箱 `email` |
| `status` | string | 否 | 提现审核状态，如 `PENDING_REVIEW`、`APPROVED`、`PAID`、`REJECTED`、`CANCELED` |
| `startTime` | string | 否 | 创建开始时间，格式 `yyyy-MM-dd HH:mm:ss`；可单独传入 |
| `endTime` | string | 否 | 创建结束时间，格式 `yyyy-MM-dd HH:mm:ss` |

响应字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `withdrawNo` | string | 提现订单号 |
| `userName` | string | 提现人用户名 |
| `email` | string | 提现人邮箱 |
| `currency` | string | 币种 |
| `withdrawMethod` | string | 提现方式 |
| `network` | string | 收款网络 |
| `accountName` | string | 收款人 |
| `accountNo` | string | 收款账户 |
| `applyAmount` | number | 申请提现金额 |
| `feeAmount` | number | 手续费 |
| `actualAmount` | number | 实际打款金额 |
| `status` | string | 提现审核状态 |
| `reviewedBy` | number | 审核人管理员 ID |
| `reviewedAt` | string | 审核时间 |
| `paidAt` | string | 打款时间 |
| `payProofNo` | string | 打款凭证号 |
| `createdAt` | string | 创建时间 |

## 后台收益对账

### GET `/api/admin/profit/records`

说明：分页查询后台收益记录。

鉴权：需要管理员登录。

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `pageNo` | number | 否 | 页码，默认 `1` |
| `pageSize` | number | 否 | 每页数量，默认 `10` |
| `keyword` | string | 否 | 模糊搜索关键词，匹配用户名称 `userName` 或邮箱 `email` |
| `user_id` | number | 否 | 用户主键 ID，兼容旧筛选 |
| `order_no` | string | 否 | 租赁订单号 |
| `status` | string | 否 | 收益状态，如 `PENDING`、`SETTLING`、`SETTLED`、`FAILED` |
| `profit_date` | string | 否 | 收益日期，格式 `yyyy-MM-dd`。每日任务在 00:00 后生成上一自然日收益；到期任务会补结到期当日分钟收益 |
| `start_time` | string | 否 | 创建开始时间，格式 `yyyy-MM-dd HH:mm:ss`；可单独传入 |
| `end_time` | string | 否 | 创建结束时间，格式 `yyyy-MM-dd HH:mm:ss` |

响应字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | number | 收益记录主键 ID |
| `profitNo` | string | 收益单号 |
| `userId` | number | 用户主键 ID |
| `userName` | string | 用户名称 |
| `rentalOrderId` | number | 租赁订单主键 ID |
| `profitDate` | string | 收益日期，格式 `yyyy-MM-dd` |
| `effectiveMinutes` | number | 本收益日有效运行完整分钟数，不足 1 分钟不计 |
| `periodStartAt` | string | 本次收益计算有效开始时间 |
| `periodEndAt` | string | 本次收益计算有效结束时间 |
| `gpuDailyTokenSnapshot` | number | GPU 每日 Token 产出快照 |
| `tokenPriceSnapshot` | number | Token 单价快照 |
| `yieldMultiplierSnapshot` | number | 收益倍率快照 |
| `baseProfitAmount` | number | 按有效分钟折算后的基础收益 |
| `finalProfitAmount` | number | 按有效分钟折算后的最终入账收益 |
| `status` | string | 收益状态 |
| `walletTxNo` | string | 钱包流水号 |
| `commissionGenerated` | number | 是否已生成佣金：`1` 是，`0` 否 |
| `settledAt` | string | 入账时间 |
| `remark` | string | 备注 |
| `createdAt` | string | 创建时间 |
| `updatedAt` | string | 更新时间 |

## 团队成员

### GET `/api/team/members`

说明：查询当前登录用户的团队成员分页列表。

鉴权：需要用户登录。

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `pageNo` | number | 否 | 页码，默认 `1` |
| `pageSize` | number | 否 | 每页数量，默认 `10`，最大 `100` |
| `levelDepth` | number | 否 | 团队层级，`1` 为直属下级，`2` 为二级下级 |
| `keyword` | string | 否 | 模糊搜索关键词，匹配团队成员邮箱 `email` 或用户名 `userName`，可与 `levelDepth` 同时使用 |

响应字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `userId` | string | 成员公开用户 ID |
| `userName` | string | 用户名/昵称 |
| `avatarKey` | string | 用户头像资源 key，未设置时返回 `null` |
| `status` | number | 用户状态 |
| `levelDepth` | number | 相对于当前用户的团队层级 |
| `createdAt` | string | 团队关系创建时间 |
| `subTeamCount` | number | 该成员的直接和间接下级总数 |
| `parentId` | string | 该成员的直接上级公开用户 ID |

## 当前用户

### GET `/api/user/me`

说明：查询当前登录用户信息。

鉴权：需要用户登录。

响应字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | number | 用户主键 ID |
| `userId` | string | 用户公开编号，不是邀请码 |
| `email` | string | 邮箱 |
| `userName` | string | 用户名/昵称 |
| `avatarKey` | string | 头像资源 key |
| `inviteCode` | string | 当前用户真实邀请码，用于生成注册链接 `/signup?inviteCode={inviteCode}` |
| `status` | number | 用户状态 |
| `createdAt` | string | 注册时间 |

## 佣金明细

### GET `/api/commission/records`

说明：查询当前登录用户的佣金明细分页列表。

鉴权：需要用户登录。

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `pageNo` | number | 否 | 页码，默认 `1` |
| `pageSize` | number | 否 | 每页数量，默认 `10`，最大 `100` |
| `levelNo` | number | 否 | 佣金层级，`1` 一级、`2` 二级 |
| `status` | string | 否 | 结算状态，如 `PENDING`、`SETTLED`、`CANCELED` |
| `startTime` | string | 否 | 开始时间，格式 `yyyy-MM-dd HH:mm:ss` |
| `endTime` | string | 否 | 结束时间，格式 `yyyy-MM-dd HH:mm:ss` |
| `keyword` | string | 否 | 搜索关键字，仅匹配来源下级用户名 `userName` |

响应字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `commissionNo` | string | 佣金单号 |
| `sourceUserId` | number | 产生收益的下级用户主键 ID |
| `userName` | string | 产生收益的下级用户名 |
| `sourceOrderId` | number | 来源租赁订单主键 ID |
| `sourceProfitId` | number | 来源收益记录主键 ID |
| `levelNo` | number | 佣金层级 |
| `sourceProfitAmount` | number | 来源收益金额 |
| `commissionRateSnapshot` | number | 佣金比例快照 |
| `commissionAmount` | number | 佣金金额 |
| `status` | string | 结算状态 |
| `walletTxNo` | string | 钱包流水号 |
| `settledAt` | string | 入账时间 |
| `createdAt` | string | 创建时间 |

## 后台定时任务

### POST `/api/admin/scheduler/deploy-fee-timeout-cancel/run`

说明：手动触发“部署费超时取消”任务。机器费已付但部署费超时未支付时，系统取消订单并退还机器费。

鉴权：需要管理员登录。

兼容路径：`POST /api/admin/scheduler/activation-timeout-cancel/run` 仍可调用同一任务，但前端新页面建议使用新路径。

### POST `/api/admin/scheduler/daily-profit/run`

说明：手动触发每日收益结算任务。任务按完整分钟结算上一自然日的运行收益，不足 1 分钟不计收益。

鉴权：需要管理员登录。

### POST `/api/admin/scheduler/expire-settlement/run`

说明：手动触发订单到期结算任务。订单到期后会先补结到期当日未结算的运行分钟收益，再返还本金并关闭订单。

鉴权：需要管理员登录。

### POST `/api/admin/scheduler/commission-generate/run`

说明：手动触发佣金生成任务。基于已入账收益生成一级、二级佣金。

鉴权：需要管理员登录。

### POST `/api/admin/scheduler/auto-pause/run`

说明：手动触发自动暂停任务。支付部署费 24 小时后，把运行中资产自动暂停。

鉴权：需要管理员登录。

## 算力租赁订单与 API 部署

### POST `/api/rental/orders/{orderNo}/deploy/pay`

说明：支付当前用户租赁订单的 API 部署费。

鉴权：需要用户登录。

业务状态：

| 阶段 | 订单状态 | API Token 状态 | 说明 |
| --- | --- | --- | --- |
| 支付机器费后 | `PENDING_ACTIVATION` | `GENERATED` | API 凭证已生成，等待支付部署费 |
| 支付部署费成功后 | `RUNNING` | `ACTIVE` | 资产立即运行并开始产生收益，同时写入 `profitStartAt`、`profitEndAt`、`autoPauseAt=支付时间+24小时` |
| 支付部署费 24 小时后 | `PAUSED` | `PAUSED` | 定时任务自动暂停资产，收益状态同步为 `PAUSED` |
| 用户重新启动后 | `RUNNING` | `ACTIVE` | 恢复收益；已有收益周期不会重新计算 |

响应字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `deployNo` | string | 部署支付单号 |
| `userName` | string | 用户名 |
| `orderNo` | string | 租赁订单号 |
| `credentialNo` | string | API 凭证编号 |
| `modelNameSnapshot` | string | 模型快照名称 |
| `deployFeeAmount` | number | 部署费用 |
| `status` | string | 部署支付单状态，支付成功为 `PAID` |
| `walletTxNo` | string | 钱包流水号 |
| `paidAt` | string | 部署费支付时间 |
| `createdAt` | string | 部署支付单创建时间 |

### POST `/api/rental/orders/{orderNo}/start`

说明：启动已自动暂停的资产。

鉴权：需要用户登录。

限制：

| 前置状态 | 结果 |
| --- | --- |
| 订单 `PAUSED` 且 API Token `PAUSED` | 订单变为 `RUNNING`，API Token 变为 `ACTIVE`，收益状态变为 `RUNNING` |
| 非暂停状态 | 返回订单不可启动错误 |

说明：启动不会重置已存在的收益周期；仅兼容补齐历史数据中缺失的 `profitStartAt`、`profitEndAt`。
