# 后端 API 文档

## 团队成员

### GET `/api/team/members`

说明：查询当前登录用户的团队成员分页列表。

鉴权：需要用户登录。

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `pageNo` | number | 否 | 页码，默认 `1` |
| `pageSize` | number | 否 | 每页数量，默认 `10`，最大 `100` |
| `levelDepth` | number | 否 | 团队层级，`1` 为直属下级，`2` 为二级下级，`3` 为三级下级 |
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
| `levelNo` | number | 否 | 佣金层级，`1` 一级、`2` 二级、`3` 三级 |
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
