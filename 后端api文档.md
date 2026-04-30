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
