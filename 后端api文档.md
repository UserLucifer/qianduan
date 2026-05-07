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
| `email` | string | 邮箱 |
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
