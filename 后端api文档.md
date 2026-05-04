# 后端 API 文档

## 通用错误码

后端已补充模块化错误码，前端应优先使用响应体 `code` 做业务分支，不要依赖 `message` 文案匹配。

完整清单见：[后端错误码文档.md](./后端错误码文档.md)

通用响应结构：

```json
{
  "code": 0,
  "message": "成功",
  "data": {},
  "timestamp": "2026-05-03 10:30:00"
}
```

关键处理规则：

- `code = 0` 表示成功。
- Spring Security 拦截层的未登录响应也使用统一结构，`HTTP 401` 对应 `code=20012`。
- `401` 或 `code=20011/20012/80004`：按登录失效或未登录处理。
- `409`：多为重复提交、业务处理中或并发状态变化，前端需要阻止重复点击并提示刷新/稍后重试。
- `422`：参数校验失败，字段级错误在 `data`。

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
- `docPublishStatus`
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
- 推送设备接口响应不再直接返回 `UserPushDevice` Entity，改为 `PushDeviceResponse`；原始 `deviceToken` 仅用于注册/注销请求，响应只返回 `deviceTokenMasked`。
- 系统通知接口不再直接返回 `SysNotification` Entity：
  - 前台 `GET /api/notifications`、`GET /api/notifications/{id}`、`POST /api/notifications/{id}/read` 返回 `NotificationResponse`。
  - 后台 `GET /api/admin/notifications`、`GET /api/admin/notifications/{id}`、`POST /api/admin/notifications` 返回 `AdminNotificationResponse`。
  - 通知响应字段统一为 `id`、`userId`、`userName`、`title`、`content`、`type`、`bizType`、`bizId`、`readStatus`、`readAt`、`createdAt`。
- 系统配置后台接口继续返回 `AdminSysConfigResponse`，字段为 `id`、`configKey`、`configValue`、`configDesc`、`createdAt`、`updatedAt`，并已补齐 OpenAPI 字段说明。
- 定时任务手动执行接口返回 `SchedulerRunResult`，字段为 `taskName`、`totalCount`、`successCount`、`failCount`、`status`、`errorMessage`，并已补齐 OpenAPI 字段说明。
- 博客分类/标签接口不再直接返回或接收 Entity：
  - 前台 `GET /api/blog/categories` 返回 `List<BlogCategoryResponse>`。
  - 前台 `GET /api/blog/tags` 返回 `List<BlogTagResponse>`。
  - 后台分类列表/创建/更新/启用/禁用返回 `BlogCategoryResponse`，创建/更新请求体使用 `BlogCategoryRequest`。
  - 后台标签列表/创建/更新/启用/禁用返回 `BlogTagResponse`，创建/更新请求体使用 `BlogTagRequest`。
  - `BlogCategoryResponse` 字段：`id`、`categoryName`、`sortNo`、`status`、`createdAt`、`updatedAt`。
  - `BlogTagResponse` 字段：`id`、`tagName`、`sortNo`、`status`、`createdAt`、`updatedAt`。
  - `BlogCategoryRequest` 字段：`categoryName`、`sortNo`、`status`，其中 `categoryName` 必填。
  - `BlogTagRequest` 字段：`tagName`、`sortNo`、`status`，其中 `tagName` 必填。
- 截至第四阶段收尾扫描，后端 Controller 已无直接导入 `*.entity.*` 的 API 暴露点；Entity 仍只作为持久化模型在 Service/Mapper 内部使用。

## 文档中心接口

### 1. 文档分区

`docSection` 枚举：
- `guide`：向导
- `integration`：集成
- `faq`：常见问题
- `support`：支持，可选

`docLanguage` 枚举：
- `zh-CN`：中文，默认值
- `en-US`：英文

### 2. 公开文档接口（免登录）

- `GET /api/docs/categories?section=guide&language=zh-CN`：返回指定 language + section 下启用状态的文档分类树，响应 `List<DocCategoryResponse>`。
- `GET /api/docs/articles?pageNo=1&pageSize=10&section=guide&language=zh-CN&category_id=1&keyword=gpu`：分页返回已发布文档。
- `GET /api/docs/articles/section/{section}/home?language=en-US`：返回指定 language + section 的已发布首页文档；未配置时返回 `code=404`、`message=分区首页文档不存在`。
- `GET /api/docs/articles/{id}?language=zh-CN`：按 ID 查看已发布文档详情，并增加浏览量。
- `GET /api/docs/articles/slug/{slug}?language=en-US`：按 slug + language 查看已发布文档详情，并增加浏览量。
- `GET /api/docs/search?pageNo=1&pageSize=10&section=guide&language=en-US&keyword=gpu`：搜索已发布文档，搜索范围为标题、摘要、Markdown 正文。

公开接口只返回：
- `doc_category.status = 1`
- `doc_article.publish_status = 1`
- 未传 `language` 时默认 `zh-CN`

### 3. 后台文档分类接口（管理员登录）

- `GET /api/admin/docs/categories?pageNo=1&pageSize=10&language=zh-CN&section=guide&parent_id=1&status=1`
- `POST /api/admin/docs/categories`
- `PUT /api/admin/docs/categories/{id}`
- `POST /api/admin/docs/categories/{id}/enable`
- `POST /api/admin/docs/categories/{id}/disable`
- `POST /api/admin/docs/categories/{id}/delete`

`DocCategoryRequest`：
```json
{
  "language": "zh-CN",
  "section": "guide",
  "parentId": null,
  "categoryCode": "quick-start",
  "categoryName": "快速开始",
  "icon": "book",
  "sortNo": 0,
  "status": 1
}
```

`DocCategoryResponse` 字段：
- `id`
- `language`
- `section`
- `parentId`
- `categoryCode`
- `categoryName`
- `icon`
- `sortNo`
- `status`
- `children`
- `createdAt`
- `updatedAt`

分类规则：
- `language` 未传时默认 `zh-CN`，仅支持 `zh-CN`、`en-US`。
- `section` 必填。
- 分类唯一约束为 `language + section + categoryCode`。
- 子分类必须与父分类 `language` 和 `section` 一致。
- 有子分类或文档挂载时不能删除。

### 4. 后台文档文章接口（管理员登录）

- `GET /api/admin/docs/articles?pageNo=1&pageSize=10&language=en-US&section=faq&category_id=1&publish_status=1&is_section_home=1&keyword=gpu&start_time=2026-05-01 00:00:00&end_time=2026-05-31 23:59:59`
- `GET /api/admin/docs/articles/{id}`
- `POST /api/admin/docs/articles`
- `PUT /api/admin/docs/articles/{id}`
- `POST /api/admin/docs/articles/{id}/publish`
- `POST /api/admin/docs/articles/{id}/unpublish`
- `POST /api/admin/docs/articles/{id}/delete`

`DocArticleRequest`：
```json
{
  "language": "zh-CN",
  "section": "guide",
  "categoryId": 1,
  "title": "文档中心概览",
  "slug": "docs-overview",
  "summary": "文档中心介绍",
  "contentMarkdown": "# 文档中心概览",
  "publishStatus": 1,
  "isSectionHome": 1,
  "sortNo": 0
}
```

`DocArticleResponse` 字段：
- `id`
- `language`
- `section`
- `categoryId`
- `categoryName`
- `title`
- `slug`
- `summary`
- `contentMarkdown`
- `publishStatus`
- `isSectionHome`
- `publishedAt`
- `sortNo`
- `viewCount`
- `createdBy`
- `createdAt`
- `updatedAt`

文章规则：
- `language` 未传时默认 `zh-CN`，仅支持 `zh-CN`、`en-US`。
- `section` 必填。
- `isSectionHome`：`1` 为分区首页文档，`0` 为普通文档。
- 文章唯一约束为 `language + slug`。
- 每个 `language + section` 最多只能有一篇 `isSectionHome = 1` 且已发布的文章。
- 文章 `categoryId` 所属分类的 `language` 和 `section` 必须与文章一致。

发布状态：
- `0`：草稿
- `1`：已发布
- `2`：已下线
