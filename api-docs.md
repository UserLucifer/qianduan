# 算力租赁平台 API

**Version:** `v1`

GPU 算力租赁、API 激活、钱包、收益和佣金后台接口

## Servers

| URL | Description |
|---|---|
| `http://localhost:8080` | Generated server url |

## Global Security

- `BearerAuth`

## Security Schemes

| Name | Type | Scheme | Bearer Format | In | Name |
|---|---|---|---|---|---|
| `BearerAuth` | http | bearer | JWT | - | - |

## Overview

- Endpoint groups: **25**
- API operations: **156**
- Component schemas: **182**

## Table of Contents

- [Admin Auth](#admin-auth)
- [Admin Blog](#admin-blog)
- [Admin Business](#admin-business)
- [Admin Catalog](#admin-catalog)
- [Admin Dashboard](#admin-dashboard)
- [Admin Notifications](#admin-notifications)
- [Admin Recharge](#admin-recharge)
- [Admin Scheduler](#admin-scheduler)
- [Admin SysConfig](#admin-sysconfig)
- [Admin Withdraw](#admin-withdraw)
- [Auth](#auth)
- [Blog](#blog)
- [Commission](#commission)
- [Notifications](#notifications)
- [Product Catalog](#product-catalog)
- [Profit](#profit)
- [Push Devices](#push-devices)
- [Recharge](#recharge)
- [Rental](#rental)
- [Settlement](#settlement)
- [System](#system)
- [Team](#team)
- [User](#user)
- [Wallet](#wallet)
- [Withdraw](#withdraw)
- [Component Schemas](#component-schemas)

## API Endpoints

## Admin Auth

| Method | Path | Summary |
|---|---|---|
| `POST` | `/api/admin/auth/login` | Admin login |
| `POST` | `/api/admin/auth/logout` | Admin logout |
| `GET` | `/api/admin/auth/me` | Current admin |

### `POST` /api/admin/auth/login

**Summary:** Admin login

**Operation ID:** `login_1`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `AdminLoginRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseAdminLoginResponse` |

### `POST` /api/admin/auth/logout

**Summary:** Admin logout

**Operation ID:** `logout`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseVoid` |

### `GET` /api/admin/auth/me

**Summary:** Current admin

**Operation ID:** `me_2`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseAdminMeResponse` |

## Admin Blog

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/admin/blog/categories` | Admin blog categories |
| `POST` | `/api/admin/blog/categories` | Create blog category |
| `PUT` | `/api/admin/blog/categories/{id}` | Update blog category |
| `POST` | `/api/admin/blog/categories/{id}/disable` | Disable blog category |
| `POST` | `/api/admin/blog/categories/{id}/enable` | Enable blog category |
| `GET` | `/api/admin/blog/posts` | Admin blog posts |
| `POST` | `/api/admin/blog/posts` | Create blog post |
| `GET` | `/api/admin/blog/posts/{id}` | Admin blog post detail |
| `PUT` | `/api/admin/blog/posts/{id}` | Update blog post |
| `POST` | `/api/admin/blog/posts/{id}/delete` | Delete blog post |
| `POST` | `/api/admin/blog/posts/{id}/publish` | Publish blog post |
| `POST` | `/api/admin/blog/posts/{id}/unpublish` | Unpublish blog post |
| `GET` | `/api/admin/blog/tags` | Admin blog tags |
| `POST` | `/api/admin/blog/tags` | Create blog tag |
| `PUT` | `/api/admin/blog/tags/{id}` | Update blog tag |
| `POST` | `/api/admin/blog/tags/{id}/disable` | Disable blog tag |
| `POST` | `/api/admin/blog/tags/{id}/enable` | Enable blog tag |

### `GET` /api/admin/blog/categories

**Summary:** Admin blog categories

**Operation ID:** `categories_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `status` | query | No | `integer` (int32) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultBlogCategory` |

### `POST` /api/admin/blog/categories

**Summary:** Create blog category

**Operation ID:** `createCategory`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `BlogCategory`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseBlogCategory` |

### `PUT` /api/admin/blog/categories/{id}

**Summary:** Update blog category

**Operation ID:** `updateCategory`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `BlogCategory`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseBlogCategory` |

### `POST` /api/admin/blog/categories/{id}/disable

**Summary:** Disable blog category

**Operation ID:** `disableCategory`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseBlogCategory` |

### `POST` /api/admin/blog/categories/{id}/enable

**Summary:** Enable blog category

**Operation ID:** `enableCategory`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseBlogCategory` |

### `GET` /api/admin/blog/posts

**Summary:** Admin blog posts

**Operation ID:** `posts_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `category_id` | query | No | `integer` (int64) | - |
| `tag_id` | query | No | `integer` (int64) | - |
| `publish_status` | query | No | `integer` (int32) | - |
| `start_time` | query | No | `string` (date-time) | - |
| `end_time` | query | No | `string` (date-time) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultMapStringObject` |

### `POST` /api/admin/blog/posts

**Summary:** Create blog post

**Operation ID:** `createPost`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `BlogPostRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

### `GET` /api/admin/blog/posts/{id}

**Summary:** Admin blog post detail

**Operation ID:** `post_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

### `PUT` /api/admin/blog/posts/{id}

**Summary:** Update blog post

**Operation ID:** `updatePost`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `BlogPostRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

### `POST` /api/admin/blog/posts/{id}/delete

**Summary:** Delete blog post

**Operation ID:** `deletePost`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseVoid` |

### `POST` /api/admin/blog/posts/{id}/publish

**Summary:** Publish blog post

**Operation ID:** `publishPost`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

### `POST` /api/admin/blog/posts/{id}/unpublish

**Summary:** Unpublish blog post

**Operation ID:** `unpublishPost`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

### `GET` /api/admin/blog/tags

**Summary:** Admin blog tags

**Operation ID:** `tags_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `status` | query | No | `integer` (int32) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultBlogTag` |

### `POST` /api/admin/blog/tags

**Summary:** Create blog tag

**Operation ID:** `createTag`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `BlogTag`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseBlogTag` |

### `PUT` /api/admin/blog/tags/{id}

**Summary:** Update blog tag

**Operation ID:** `updateTag`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `BlogTag`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseBlogTag` |

### `POST` /api/admin/blog/tags/{id}/disable

**Summary:** Disable blog tag

**Operation ID:** `disableTag`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseBlogTag` |

### `POST` /api/admin/blog/tags/{id}/enable

**Summary:** Enable blog tag

**Operation ID:** `enableTag`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseBlogTag` |

## Admin Business

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/admin/api-credentials` | Admin API credentials |
| `GET` | `/api/admin/api-credentials/{credentialNo}` | Admin API credential detail |
| `GET` | `/api/admin/api-deploy-orders` | Admin API deploy orders |
| `GET` | `/api/admin/api-deploy-orders/{deployNo}` | Admin API deploy order detail |
| `GET` | `/api/admin/commission/records` | Admin commission records |
| `GET` | `/api/admin/commission/records/{commissionNo}` | Admin commission record detail |
| `GET` | `/api/admin/logs` | Admin operation logs |
| `GET` | `/api/admin/logs/{id}` | Admin operation log detail |
| `GET` | `/api/admin/profit/records` | Admin profit records |
| `GET` | `/api/admin/profit/records/{profitNo}` | Admin profit record detail |
| `GET` | `/api/admin/rental/orders` | Admin rental orders |
| `GET` | `/api/admin/rental/orders/{orderNo}` | Admin rental order detail |
| `GET` | `/api/admin/settlement/orders` | Admin settlement orders |
| `GET` | `/api/admin/settlement/orders/{settlementNo}` | Admin settlement order detail |
| `GET` | `/api/admin/team/relations` | Admin team relations |
| `GET` | `/api/admin/users` | Admin users |
| `GET` | `/api/admin/users/{userId}` | Admin user detail |
| `POST` | `/api/admin/users/{userId}/disable` | Disable user |
| `POST` | `/api/admin/users/{userId}/enable` | Enable user |
| `GET` | `/api/admin/users/{userId}/team` | Admin user team |
| `GET` | `/api/admin/wallet-transactions` | Admin wallet transactions |
| `GET` | `/api/admin/wallets` | Admin wallets |
| `GET` | `/api/admin/wallets/{userId}` | Admin wallet by user |

### `GET` /api/admin/api-credentials

**Summary:** Admin API credentials

**Operation ID:** `apiCredentials`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `user_id` | query | No | `integer` (int64) | - |
| `credential_no` | query | No | `string` | - |
| `token_status` | query | No | `string` | - |
| `start_time` | query | No | `string` (date-time) | - |
| `end_time` | query | No | `string` (date-time) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultMapStringObject` |

### `GET` /api/admin/api-credentials/{credentialNo}

**Summary:** Admin API credential detail

**Operation ID:** `apiCredential_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `credentialNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

### `GET` /api/admin/api-deploy-orders

**Summary:** Admin API deploy orders

**Operation ID:** `apiDeployOrders`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `user_id` | query | No | `integer` (int64) | - |
| `deploy_no` | query | No | `string` | - |
| `status` | query | No | `string` | - |
| `start_time` | query | No | `string` (date-time) | - |
| `end_time` | query | No | `string` (date-time) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultApiDeployOrder` |

### `GET` /api/admin/api-deploy-orders/{deployNo}

**Summary:** Admin API deploy order detail

**Operation ID:** `apiDeployOrder`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `deployNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseApiDeployOrder` |

### `GET` /api/admin/commission/records

**Summary:** Admin commission records

**Operation ID:** `commissionRecords`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `user_id` | query | No | `integer` (int64) | - |
| `order_no` | query | No | `string` | - |
| `level_no` | query | No | `integer` (int32) | - |
| `status` | query | No | `string` | - |
| `start_time` | query | No | `string` (date-time) | - |
| `end_time` | query | No | `string` (date-time) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultCommissionRecord` |

### `GET` /api/admin/commission/records/{commissionNo}

**Summary:** Admin commission record detail

**Operation ID:** `commissionRecord`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `commissionNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseCommissionRecord` |

### `GET` /api/admin/logs

**Summary:** Admin operation logs

**Operation ID:** `logs`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `admin_id` | query | No | `integer` (int64) | - |
| `action` | query | No | `string` | - |
| `biz_type` | query | No | `string` | - |
| `start_time` | query | No | `string` (date-time) | - |
| `end_time` | query | No | `string` (date-time) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultSysAdminLog` |

### `GET` /api/admin/logs/{id}

**Summary:** Admin operation log detail

**Operation ID:** `log`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseSysAdminLog` |

### `GET` /api/admin/profit/records

**Summary:** Admin profit records

**Operation ID:** `profitRecords`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `user_id` | query | No | `integer` (int64) | - |
| `order_no` | query | No | `string` | - |
| `status` | query | No | `string` | - |
| `profit_date` | query | No | `string` (date) | - |
| `start_time` | query | No | `string` (date-time) | - |
| `end_time` | query | No | `string` (date-time) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultRentalProfitRecord` |

### `GET` /api/admin/profit/records/{profitNo}

**Summary:** Admin profit record detail

**Operation ID:** `profitRecord`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `profitNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRentalProfitRecord` |

### `GET` /api/admin/rental/orders

**Summary:** Admin rental orders

**Operation ID:** `rentalOrders`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `user_id` | query | No | `integer` (int64) | - |
| `order_no` | query | No | `string` | - |
| `order_status` | query | No | `string` | - |
| `profit_status` | query | No | `string` | - |
| `settlement_status` | query | No | `string` | - |
| `start_time` | query | No | `string` (date-time) | - |
| `end_time` | query | No | `string` (date-time) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultRentalOrder` |

### `GET` /api/admin/rental/orders/{orderNo}

**Summary:** Admin rental order detail

**Operation ID:** `rentalOrder`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `orderNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

Response `data` is a rental order detail object and includes:

| Field | Type | Description |
|---|---|---|
| `orderNo` | string | Rental order number |
| `userName` | string | User name for the order |
| `apiCredential` | object/null | API credential detail |

### `GET` /api/admin/settlement/orders

**Summary:** Admin settlement orders

**Operation ID:** `settlementOrders`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `user_id` | query | No | `integer` (int64) | - |
| `order_no` | query | No | `string` | - |
| `settlement_type` | query | No | `string` | - |
| `status` | query | No | `string` | - |
| `start_time` | query | No | `string` (date-time) | - |
| `end_time` | query | No | `string` (date-time) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultRentalSettlementOrder` |

### `GET` /api/admin/settlement/orders/{settlementNo}

**Summary:** Admin settlement order detail

**Operation ID:** `settlementOrder`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `settlementNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRentalSettlementOrder` |

### `GET` /api/admin/team/relations

**Summary:** Admin team relations

**Operation ID:** `teamRelations`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `ancestor_user_id` | query | No | `integer` (int64) | - |
| `descendant_user_id` | query | No | `integer` (int64) | - |
| `level_depth` | query | No | `integer` (int32) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultUserTeamRelation` |

### `GET` /api/admin/users

**Summary:** Admin users

**Operation ID:** `users`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `email` | query | No | `string` | - |
| `user_id` | query | No | `string` | - |
| `status` | query | No | `integer` (int32) | - |
| `start_time` | query | No | `string` (date-time) | - |
| `end_time` | query | No | `string` (date-time) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultMapStringObject` |

### `GET` /api/admin/users/{userId}

**Summary:** Admin user detail

**Operation ID:** `user`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `userId` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

### `POST` /api/admin/users/{userId}/disable

**Summary:** Disable user

**Operation ID:** `disableUser`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `userId` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

### `POST` /api/admin/users/{userId}/enable

**Summary:** Enable user

**Operation ID:** `enableUser`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `userId` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

### `GET` /api/admin/users/{userId}/team

**Summary:** Admin user team

**Operation ID:** `userTeam`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `userId` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

### `GET` /api/admin/wallet-transactions

**Summary:** Admin wallet transactions

**Operation ID:** `walletTransactions`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `user_id` | query | No | `integer` (int64) | - |
| `wallet_no` | query | No | `string` | - |
| `tx_type` | query | No | `string` | - |
| `biz_type` | query | No | `string` | - |
| `start_time` | query | No | `string` (date-time) | - |
| `end_time` | query | No | `string` (date-time) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultWalletTransaction` |

### `GET` /api/admin/wallets

**Summary:** Admin wallets

**Operation ID:** `wallets`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `user_id` | query | No | `integer` (int64) | - |
| `wallet_no` | query | No | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultUserWallet` |

### `GET` /api/admin/wallets/{userId}

**Summary:** Admin wallet by user

**Operation ID:** `wallet`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `userId` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseAdminWalletResponse` |

## Admin Catalog

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/admin/ai-models` | Admin AI models |
| `POST` | `/api/admin/ai-models` | Create AI model |
| `PUT` | `/api/admin/ai-models/{modelCode}` | Update AI model |
| `POST` | `/api/admin/ai-models/{modelCode}/disable` | Disable AI model |
| `POST` | `/api/admin/ai-models/{modelCode}/enable` | Enable AI model |
| `GET` | `/api/admin/gpu-models` | Admin GPU models |
| `POST` | `/api/admin/gpu-models` | Create GPU model |
| `PUT` | `/api/admin/gpu-models/{id}` | Update GPU model |
| `POST` | `/api/admin/gpu-models/{id}/disable` | Disable GPU model |
| `POST` | `/api/admin/gpu-models/{id}/enable` | Enable GPU model |
| `GET` | `/api/admin/products` | Admin products |
| `POST` | `/api/admin/products` | Create product |
| `GET` | `/api/admin/products/{productCode}` | Admin product detail |
| `PUT` | `/api/admin/products/{productCode}` | Update product |
| `POST` | `/api/admin/products/{productCode}/disable` | Disable product |
| `POST` | `/api/admin/products/{productCode}/enable` | Enable product |
| `GET` | `/api/admin/regions` | Admin regions |
| `POST` | `/api/admin/regions` | Create region |
| `PUT` | `/api/admin/regions/{id}` | Update region |
| `POST` | `/api/admin/regions/{id}/disable` | Disable region |
| `POST` | `/api/admin/regions/{id}/enable` | Enable region |
| `GET` | `/api/admin/rental-cycle-rules` | Admin rental cycle rules |
| `POST` | `/api/admin/rental-cycle-rules` | Create rental cycle rule |
| `PUT` | `/api/admin/rental-cycle-rules/{cycleCode}` | Update rental cycle rule |
| `POST` | `/api/admin/rental-cycle-rules/{cycleCode}/disable` | Disable rental cycle rule |
| `POST` | `/api/admin/rental-cycle-rules/{cycleCode}/enable` | Enable rental cycle rule |

### `GET` /api/admin/ai-models

**Summary:** Admin AI models

**Operation ID:** `aiModels_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `model_code` | query | No | `string` | - |
| `status` | query | No | `integer` (int32) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultAiModel` |

### `POST` /api/admin/ai-models

**Summary:** Create AI model

**Operation ID:** `createAiModel`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `AiModel`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseAiModel` |

### `PUT` /api/admin/ai-models/{modelCode}

**Summary:** Update AI model

**Operation ID:** `updateAiModel`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `modelCode` | path | Yes | `string` | - |

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `AiModel`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseAiModel` |

### `POST` /api/admin/ai-models/{modelCode}/disable

**Summary:** Disable AI model

**Operation ID:** `disableAiModel`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `modelCode` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseAiModel` |

### `POST` /api/admin/ai-models/{modelCode}/enable

**Summary:** Enable AI model

**Operation ID:** `enableAiModel`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `modelCode` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseAiModel` |

### `GET` /api/admin/gpu-models

**Summary:** Admin GPU models

**Operation ID:** `gpuModels_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `model_code` | query | No | `string` | - |
| `status` | query | No | `integer` (int32) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultGpuModel` |

### `POST` /api/admin/gpu-models

**Summary:** Create GPU model

**Operation ID:** `createGpuModel`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `GpuModel`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseGpuModel` |

### `PUT` /api/admin/gpu-models/{id}

**Summary:** Update GPU model

**Operation ID:** `updateGpuModel`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `GpuModel`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseGpuModel` |

### `POST` /api/admin/gpu-models/{id}/disable

**Summary:** Disable GPU model

**Operation ID:** `disableGpuModel`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseGpuModel` |

### `POST` /api/admin/gpu-models/{id}/enable

**Summary:** Enable GPU model

**Operation ID:** `enableGpuModel`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseGpuModel` |

### `GET` /api/admin/products

**Summary:** Admin products

**Operation ID:** `products_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `product_code` | query | No | `string` | - |
| `region_id` | query | No | `integer` (int64) | - |
| `gpu_model_id` | query | No | `integer` (int64) | - |
| `status` | query | No | `integer` (int32) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultAdminProductResponse` |

### `POST` /api/admin/products

**Summary:** Create product

**Operation ID:** `createProduct`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `Product`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseProduct` |

### `GET` /api/admin/products/{productCode}

**Summary:** Admin product detail

**Operation ID:** `product`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `productCode` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseAdminProductResponse` |

### `PUT` /api/admin/products/{productCode}

**Summary:** Update product

**Operation ID:** `updateProduct`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `productCode` | path | Yes | `string` | - |

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `Product`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseProduct` |

### `POST` /api/admin/products/{productCode}/disable

**Summary:** Disable product

**Operation ID:** `disableProduct`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `productCode` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseProduct` |

### `POST` /api/admin/products/{productCode}/enable

**Summary:** Enable product

**Operation ID:** `enableProduct`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `productCode` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseProduct` |

### `GET` /api/admin/regions

**Summary:** Admin regions

**Operation ID:** `regions_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `region_code` | query | No | `string` | - |
| `status` | query | No | `integer` (int32) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultRegion` |

### `POST` /api/admin/regions

**Summary:** Create region

**Operation ID:** `createRegion`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `Region`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRegion` |

### `PUT` /api/admin/regions/{id}

**Summary:** Update region

**Operation ID:** `updateRegion`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `Region`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRegion` |

### `POST` /api/admin/regions/{id}/disable

**Summary:** Disable region

**Operation ID:** `disableRegion`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRegion` |

### `POST` /api/admin/regions/{id}/enable

**Summary:** Enable region

**Operation ID:** `enableRegion`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRegion` |

### `GET` /api/admin/rental-cycle-rules

**Summary:** Admin rental cycle rules

**Operation ID:** `cycleRules`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `cycle_code` | query | No | `string` | - |
| `status` | query | No | `integer` (int32) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultRentalCycleRule` |

### `POST` /api/admin/rental-cycle-rules

**Summary:** Create rental cycle rule

**Operation ID:** `createCycleRule`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `RentalCycleRule`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRentalCycleRule` |

### `PUT` /api/admin/rental-cycle-rules/{cycleCode}

**Summary:** Update rental cycle rule

**Operation ID:** `updateCycleRule`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `cycleCode` | path | Yes | `string` | - |

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `RentalCycleRule`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRentalCycleRule` |

### `POST` /api/admin/rental-cycle-rules/{cycleCode}/disable

**Summary:** Disable rental cycle rule

**Operation ID:** `disableCycleRule`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `cycleCode` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRentalCycleRule` |

### `POST` /api/admin/rental-cycle-rules/{cycleCode}/enable

**Summary:** Enable rental cycle rule

**Operation ID:** `enableCycleRule`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `cycleCode` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRentalCycleRule` |

## Admin Dashboard

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/admin/dashboard/finance` | Dashboard finance |
| `GET` | `/api/admin/dashboard/orders` | Dashboard orders |
| `GET` | `/api/admin/dashboard/overview` | Dashboard overview |
| `GET` | `/api/admin/dashboard/users` | Dashboard users |

### `GET` /api/admin/dashboard/finance

**Summary:** Dashboard finance

**Operation ID:** `finance`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

### `GET` /api/admin/dashboard/orders

**Summary:** Dashboard orders

**Operation ID:** `orders_6`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

### `GET` /api/admin/dashboard/overview

**Summary:** Dashboard overview

**Operation ID:** `overview`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

### `GET` /api/admin/dashboard/users

**Summary:** Dashboard users

**Operation ID:** `users_1`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

## Admin Notifications

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/admin/notifications` | Admin notifications |
| `POST` | `/api/admin/notifications` | Create notification |
| `POST` | `/api/admin/notifications/broadcast` | Broadcast notification |
| `GET` | `/api/admin/notifications/{id}` | Admin notification detail |
| `POST` | `/api/admin/notifications/{id}/cancel` | Cancel notification |

### `GET` /api/admin/notifications

**Summary:** Admin notifications

**Operation ID:** `notifications_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `user_id` | query | No | `integer` (int64) | - |
| `read_status` | query | No | `integer` (int32) | - |
| `notification_type` | query | No | `string` | - |
| `biz_type` | query | No | `string` | - |
| `start_time` | query | No | `string` (date-time) | - |
| `end_time` | query | No | `string` (date-time) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultSysNotification` |

### `POST` /api/admin/notifications

**Summary:** Create notification

**Operation ID:** `create_1`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `NotificationCreateRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseSysNotification` |

### `POST` /api/admin/notifications/broadcast

**Summary:** Broadcast notification

**Operation ID:** `broadcast`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `NotificationBroadcastRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseInteger` |

### `GET` /api/admin/notifications/{id}

**Summary:** Admin notification detail

**Operation ID:** `notification_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseSysNotification` |

### `POST` /api/admin/notifications/{id}/cancel

**Summary:** Cancel notification

**Operation ID:** `cancel_3`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseVoid` |

## Admin Recharge

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/admin/recharge/orders` | Admin recharge orders |
| `GET` | `/api/admin/recharge/orders/{rechargeNo}` | Admin recharge order detail |
| `POST` | `/api/admin/recharge/orders/{rechargeNo}/approve` | Approve recharge order |
| `POST` | `/api/admin/recharge/orders/{rechargeNo}/reject` | Reject recharge order |

### `GET` /api/admin/recharge/orders

**Summary:** Admin recharge orders

**Operation ID:** `orders_5`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `request` | query | Yes | `RechargeOrderQueryRequest` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultRechargeOrderResponse` |

### `GET` /api/admin/recharge/orders/{rechargeNo}

**Summary:** Admin recharge order detail

**Operation ID:** `detail_7`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `rechargeNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRechargeOrderResponse` |

### `POST` /api/admin/recharge/orders/{rechargeNo}/approve

**Summary:** Approve recharge order

**Operation ID:** `approve_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `rechargeNo` | path | Yes | `string` | - |

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `AdminApproveRechargeRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRechargeOrderResponse` |

### `POST` /api/admin/recharge/orders/{rechargeNo}/reject

**Summary:** Reject recharge order

**Operation ID:** `reject_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `rechargeNo` | path | Yes | `string` | - |

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `AdminRejectRechargeRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRechargeOrderResponse` |

## Admin Scheduler

| Method | Path | Summary |
|---|---|---|
| `POST` | `/api/admin/scheduler/activation-timeout-cancel/run` | Run activation timeout cancel scheduler |
| `POST` | `/api/admin/scheduler/auto-pause/run` | Run auto pause scheduler |
| `POST` | `/api/admin/scheduler/commission-generate/run` | Run commission generate scheduler |
| `POST` | `/api/admin/scheduler/daily-profit/run` | Run daily profit scheduler |
| `POST` | `/api/admin/scheduler/expire-settlement/run` | Run expire settlement scheduler |

### `POST` /api/admin/scheduler/activation-timeout-cancel/run

**Summary:** Run activation timeout cancel scheduler

**Operation ID:** `runActivationTimeoutCancel`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseSchedulerRunResult` |

### `POST` /api/admin/scheduler/auto-pause/run

**Summary:** Run auto pause scheduler

**Operation ID:** `runAutoPause`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseSchedulerRunResult` |

### `POST` /api/admin/scheduler/commission-generate/run

**Summary:** Run commission generate scheduler

**Operation ID:** `runCommissionGenerate`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseSchedulerRunResult` |

### `POST` /api/admin/scheduler/daily-profit/run

**Summary:** Run daily profit scheduler

**Operation ID:** `runDailyProfit`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseSchedulerRunResult` |

### `POST` /api/admin/scheduler/expire-settlement/run

**Summary:** Run expire settlement scheduler

**Operation ID:** `runExpireSettlement`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseSchedulerRunResult` |

## Admin SysConfig

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/admin/sys-configs` | Admin system config list |
| `GET` | `/api/admin/sys-configs/{configKey}` | Admin system config detail |
| `PUT` | `/api/admin/sys-configs/{configKey}` | Update system config |

### `GET` /api/admin/sys-configs

**Summary:** Admin system config list

**Operation ID:** `configs`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `request` | query | Yes | `AdminSysConfigQueryRequest` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultAdminSysConfigResponse` |

### `GET` /api/admin/sys-configs/{configKey}

**Summary:** Admin system config detail

**Operation ID:** `detail_6`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `configKey` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseAdminSysConfigResponse` |

### `PUT` /api/admin/sys-configs/{configKey}

**Summary:** Update system config

**Operation ID:** `update`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `configKey` | path | Yes | `string` | - |

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `UpdateSysConfigRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseAdminSysConfigResponse` |

## Admin Withdraw

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/admin/withdraw/orders` | Admin withdraw orders |
| `GET` | `/api/admin/withdraw/orders/{withdrawNo}` | Admin withdraw order detail |
| `POST` | `/api/admin/withdraw/orders/{withdrawNo}/approve` | Approve withdraw order |
| `POST` | `/api/admin/withdraw/orders/{withdrawNo}/paid` | Mark withdraw order paid |
| `POST` | `/api/admin/withdraw/orders/{withdrawNo}/reject` | Reject withdraw order |

### `GET` /api/admin/withdraw/orders

**Summary:** Admin withdraw orders

**Operation ID:** `orders_4`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `request` | query | Yes | `WithdrawOrderQueryRequest` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultWithdrawOrderResponse` |

### `GET` /api/admin/withdraw/orders/{withdrawNo}

**Summary:** Admin withdraw order detail

**Operation ID:** `detail_5`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `withdrawNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseWithdrawOrderResponse` |

### `POST` /api/admin/withdraw/orders/{withdrawNo}/approve

**Summary:** Approve withdraw order

**Operation ID:** `approve`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `withdrawNo` | path | Yes | `string` | - |

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `AdminApproveWithdrawRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseWithdrawOrderResponse` |

### `POST` /api/admin/withdraw/orders/{withdrawNo}/paid

**Summary:** Mark withdraw order paid

**Operation ID:** `paid`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `withdrawNo` | path | Yes | `string` | - |

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `AdminPaidWithdrawRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseWithdrawOrderResponse` |

### `POST` /api/admin/withdraw/orders/{withdrawNo}/reject

**Summary:** Reject withdraw order

**Operation ID:** `reject`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `withdrawNo` | path | Yes | `string` | - |

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `AdminRejectWithdrawRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseWithdrawOrderResponse` |

## Auth

| Method | Path | Summary |
|---|---|---|
| `POST` | `/api/auth/login` | Login with email and password |
| `POST` | `/api/auth/login/password` | Login with email and password |
| `POST` | `/api/auth/password/reset` | Reset password with email code |
| `POST` | `/api/auth/register` | Register with email code, user name and password |
| `POST` | `/api/auth/reset-password` | Reset password with email code |
| `POST` | `/api/auth/reset-password/email-code/send` | Send reset password email code |
| `POST` | `/api/auth/reset-password/email-code/verify` | Verify reset password email code |
| `POST` | `/api/auth/signup` | Signup with email code, user name and password |
| `POST` | `/api/auth/signup/email-code/send` | Send signup email code |
| `POST` | `/api/auth/signup/email-code/verify` | Verify signup email code |

### `POST` /api/auth/login

**Summary:** Login with email and password

**Operation ID:** `login`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `LoginRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseLoginResponse` |

### `POST` /api/auth/login/password

**Summary:** Login with email and password

**Operation ID:** `passwordLogin`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `LoginRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseLoginResponse` |

### `POST` /api/auth/password/reset

**Summary:** Reset password with email code

**Operation ID:** `passwordReset`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `ResetPasswordRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseVoid` |

### `POST` /api/auth/register

**Summary:** Register with email code, user name and password

**Operation ID:** `register_1`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `SignupRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseLoginResponse` |

### `POST` /api/auth/reset-password

**Summary:** Reset password with email code

**Operation ID:** `resetPassword`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `ResetPasswordRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseVoid` |

### `POST` /api/auth/reset-password/email-code/send

**Summary:** Send reset password email code

**Operation ID:** `sendResetPasswordEmailCode`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `SendEmailCodeRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseVoid` |

### `POST` /api/auth/reset-password/email-code/verify

**Summary:** Verify reset password email code

**Operation ID:** `verifyResetPasswordEmailCode`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `VerifyEmailCodeRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseVoid` |

### `POST` /api/auth/signup

**Summary:** Signup with email code, user name and password

**Operation ID:** `signup`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `SignupRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseLoginResponse` |

### `POST` /api/auth/signup/email-code/send

**Summary:** Send signup email code

**Operation ID:** `sendSignupEmailCode`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `SendEmailCodeRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseVoid` |

### `POST` /api/auth/signup/email-code/verify

**Summary:** Verify signup email code

**Operation ID:** `verifySignupEmailCode`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `VerifyEmailCodeRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseVoid` |

## Blog

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/blog/categories` | Public blog categories |
| `GET` | `/api/blog/posts` | Public blog posts |
| `GET` | `/api/blog/posts/{id}` | Public blog post detail |
| `GET` | `/api/blog/tags` | Public blog tags |

### `GET` /api/blog/categories

**Summary:** Public blog categories

**Operation ID:** `categories`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseListBlogCategory` |

### `GET` /api/blog/posts

**Summary:** Public blog posts

**Operation ID:** `posts`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `category_id` | query | No | `integer` (int64) | - |
| `tag_id` | query | No | `integer` (int64) | - |
| `start_time` | query | No | `string` (date-time) | - |
| `end_time` | query | No | `string` (date-time) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultMapStringObject` |

### `GET` /api/blog/posts/{id}

**Summary:** Public blog post detail

**Operation ID:** `post`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringObject` |

### `GET` /api/blog/tags

**Summary:** Public blog tags

**Operation ID:** `tags`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseListBlogTag` |

## Commission

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/commission/records` | Current user commission records |
| `GET` | `/api/commission/summary` | Current user commission summary |

### `GET` /api/commission/records

**Summary:** Current user commission records

**Operation ID:** `records_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `request` | query | Yes | `CommissionRecordQueryRequest` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultCommissionRecordResponse` |

### `GET` /api/commission/summary

**Summary:** Current user commission summary

**Operation ID:** `summary_2`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseCommissionSummaryResponse` |

## Notifications

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/notifications` | Current user notifications |
| `POST` | `/api/notifications/read-all` | Mark all notifications read |
| `GET` | `/api/notifications/{id}` | Current user notification detail |
| `POST` | `/api/notifications/{id}/read` | Mark notification read |

### `GET` /api/notifications

**Summary:** Current user notifications

**Operation ID:** `notifications`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `pageNo` | query | No | `integer` (int64) default: `1` | - |
| `pageSize` | query | No | `integer` (int64) default: `10` | - |
| `read_status` | query | No | `integer` (int32) | - |
| `notification_type` | query | No | `string` | - |
| `start_time` | query | No | `string` (date-time) | - |
| `end_time` | query | No | `string` (date-time) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultSysNotification` |

### `POST` /api/notifications/read-all

**Summary:** Mark all notifications read

**Operation ID:** `readAll`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseLong` |

### `GET` /api/notifications/{id}

**Summary:** Current user notification detail

**Operation ID:** `notification`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseSysNotification` |

### `POST` /api/notifications/{id}/read

**Summary:** Mark notification read

**Operation ID:** `read`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `id` | path | Yes | `integer` (int64) | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseSysNotification` |

## Product Catalog

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/ai-models` | Enabled AI models |
| `GET` | `/api/gpu-models` | Enabled GPU models |
| `GET` | `/api/products` | Enabled products |
| `GET` | `/api/products/{productCode}` | Enabled product detail |
| `GET` | `/api/regions` | Enabled regions |
| `GET` | `/api/rental-cycle-rules` | Enabled rental cycle rules |

### `GET` /api/ai-models

**Summary:** Enabled AI models

**Operation ID:** `aiModels`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseListAiModelResponse` |

### `GET` /api/gpu-models

**Summary:** Enabled GPU models

**Operation ID:** `gpuModels`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseListGpuModelResponse` |

### `GET` /api/products

**Summary:** Enabled products

**Operation ID:** `products`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `request` | query | Yes | `ProductQueryRequest` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultProductResponse` |

### `GET` /api/products/{productCode}

**Summary:** Enabled product detail

**Operation ID:** `detail_4`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `productCode` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseProductResponse` |

### `GET` /api/regions

**Summary:** Enabled regions

**Operation ID:** `regions`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseListRegionResponse` |

### `GET` /api/rental-cycle-rules

**Summary:** Enabled rental cycle rules

**Operation ID:** `rentalCycleRules`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseListRentalCycleRuleResponse` |

## Profit

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/profit/records` | Current user profit records |
| `GET` | `/api/profit/summary` | Current user profit summary |

### `GET` /api/profit/records

**Summary:** Current user profit records

**Operation ID:** `records`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `request` | query | Yes | `ProfitRecordQueryRequest` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultProfitRecordResponse` |

### `GET` /api/profit/summary

**Summary:** Current user profit summary

**Operation ID:** `summary_1`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseProfitSummaryResponse` |

## Push Devices

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/push-devices` | Current user push devices |
| `POST` | `/api/push-devices/register` | Register push device |
| `POST` | `/api/push-devices/unregister` | Unregister push device |

### `GET` /api/push-devices

**Summary:** Current user push devices

**Operation ID:** `devices`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseListUserPushDevice` |

### `POST` /api/push-devices/register

**Summary:** Register push device

**Operation ID:** `register`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `RegisterPushDeviceRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseUserPushDevice` |

### `POST` /api/push-devices/unregister

**Summary:** Unregister push device

**Operation ID:** `unregister`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `UnregisterPushDeviceRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseVoid` |

## Recharge

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/recharge/channels` | Enabled recharge channels |
| `GET` | `/api/recharge/orders` | Current user recharge orders |
| `POST` | `/api/recharge/orders` | Submit recharge order |
| `GET` | `/api/recharge/orders/{rechargeNo}` | Current user recharge order detail |
| `POST` | `/api/recharge/orders/{rechargeNo}/cancel` | Cancel submitted recharge order |

### `GET` /api/recharge/channels

**Summary:** Enabled recharge channels

**Operation ID:** `channels`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseListRechargeChannelResponse` |

### `GET` /api/recharge/orders

**Summary:** Current user recharge orders

**Operation ID:** `orders_3`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `request` | query | Yes | `RechargeOrderQueryRequest` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultRechargeOrderResponse` |

### `POST` /api/recharge/orders

**Summary:** Submit recharge order

**Operation ID:** `createOrder_1`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `CreateRechargeOrderRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRechargeOrderResponse` |

### `GET` /api/recharge/orders/{rechargeNo}

**Summary:** Current user recharge order detail

**Operation ID:** `detail_3`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `rechargeNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRechargeOrderResponse` |

### `POST` /api/recharge/orders/{rechargeNo}/cancel

**Summary:** Cancel submitted recharge order

**Operation ID:** `cancel_2`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `rechargeNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseVoid` |

## Rental

| Method | Path | Summary |
|---|---|---|
| `POST` | `/api/rental/estimate` | Estimate rental profit |
| `GET` | `/api/rental/orders` | Current user rental orders |
| `POST` | `/api/rental/orders` | Create rental order |
| `GET` | `/api/rental/orders/{orderNo}` | Current user rental order detail |
| `GET` | `/api/rental/orders/{orderNo}/api-credential` | Current user rental order API credential |
| `POST` | `/api/rental/orders/{orderNo}/cancel` | Cancel rental order |
| `GET` | `/api/rental/orders/{orderNo}/deploy-info` | Current user API deploy info |
| `GET` | `/api/rental/orders/{orderNo}/deploy-order` | Current user API deploy order |
| `POST` | `/api/rental/orders/{orderNo}/deploy/pay` | Pay API deploy fee |
| `POST` | `/api/rental/orders/{orderNo}/pay` | Pay rental machine fee |
| `GET` | `/api/rental/orders/{orderNo}/profits` | Current user rental order profit records |
| `POST` | `/api/rental/orders/{orderNo}/settle-early` | Settle current user rental order early |
| `POST` | `/api/rental/orders/{orderNo}/start` | Start paused rental order |

### `POST` /api/rental/estimate

**Summary:** Estimate rental profit

**Operation ID:** `estimate`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `RentalEstimateRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRentalEstimateResponse` |

### `GET` /api/rental/orders

**Summary:** Current user rental orders

**Operation ID:** `orders_2`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `request` | query | Yes | `RentalOrderQueryRequest` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultRentalOrderSummaryResponse` |

### `POST` /api/rental/orders

**Summary:** Create rental order

**Operation ID:** `create`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `CreateRentalOrderRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRentalOrderDetailResponse` |

### `GET` /api/rental/orders/{orderNo}

**Summary:** Current user rental order detail

**Operation ID:** `detail_2`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `orderNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRentalOrderDetailResponse` |

### `GET` /api/rental/orders/{orderNo}/api-credential

**Summary:** Current user rental order API credential

**Operation ID:** `apiCredential`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `orderNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseApiCredentialResponse` |

### `POST` /api/rental/orders/{orderNo}/cancel

**Summary:** Cancel rental order

**Operation ID:** `cancel_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `orderNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRentalOrderDetailResponse` |

### `GET` /api/rental/orders/{orderNo}/deploy-info

**Summary:** Current user API deploy info

**Operation ID:** `deployInfo`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `orderNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseApiDeployInfoResponse` |

### `GET` /api/rental/orders/{orderNo}/deploy-order

**Summary:** Current user API deploy order

**Operation ID:** `deployOrder`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `orderNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseApiDeployOrderResponse` |

### `POST` /api/rental/orders/{orderNo}/deploy/pay

**Summary:** Pay API deploy fee

**Operation ID:** `payDeployFee`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `orderNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseApiDeployOrderResponse` |

### `POST` /api/rental/orders/{orderNo}/pay

**Summary:** Pay rental machine fee

**Operation ID:** `pay`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `orderNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRentalOrderDetailResponse` |

### `GET` /api/rental/orders/{orderNo}/profits

**Summary:** Current user rental order profit records

**Operation ID:** `profits`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `orderNo` | path | Yes | `string` | - |
| `request` | query | Yes | `ProfitRecordQueryRequest` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultProfitRecordResponse` |

### `POST` /api/rental/orders/{orderNo}/settle-early

**Summary:** Settle current user rental order early

**Operation ID:** `settleEarly`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `orderNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseSettlementOrderResponse` |

### `POST` /api/rental/orders/{orderNo}/start

**Summary:** Start paused rental order

**Operation ID:** `start`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `orderNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseRentalOrderDetailResponse` |

## Settlement

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/settlement/orders` | Current user settlement orders |
| `GET` | `/api/settlement/orders/{settlementNo}` | Current user settlement order detail |

### `GET` /api/settlement/orders

**Summary:** Current user settlement orders

**Operation ID:** `orders_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `request` | query | Yes | `SettlementOrderQueryRequest` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultSettlementOrderResponse` |

### `GET` /api/settlement/orders/{settlementNo}

**Summary:** Current user settlement order detail

**Operation ID:** `detail_1`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `settlementNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseSettlementOrderResponse` |

## System

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/system/health` | Health check |

### `GET` /api/system/health

**Summary:** Health check

**Operation ID:** `health`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseMapStringString` |

## Team

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/team/members` | Current user team members |
| `GET` | `/api/team/summary` | Current user team summary |

### `GET` /api/team/members

**Summary:** Current user team members

**Operation ID:** `members`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `request` | query | Yes | `TeamMemberQueryRequest` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultTeamMemberResponse` |

### `GET` /api/team/summary

**Summary:** Current user team summary

**Operation ID:** `summary`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseTeamSummaryResponse` |

## User

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/user/me` | Current frontend user |

### `GET` /api/user/me

**Summary:** Current frontend user

**Operation ID:** `me_1`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseUserMeResponse` |

## Wallet

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/wallet/me` | Current user wallet |
| `GET` | `/api/wallet/transactions` | Current user wallet transactions |

### `GET` /api/wallet/me

**Summary:** Current user wallet

**Operation ID:** `me`

**Parameters**

_None_

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseWalletMeResponse` |

### `GET` /api/wallet/transactions

**Summary:** Current user wallet transactions

**Operation ID:** `transactions`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `request` | query | Yes | `WalletTransactionQueryRequest` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultWalletTransactionResponse` |

## Withdraw

| Method | Path | Summary |
|---|---|---|
| `GET` | `/api/withdraw/orders` | Current user withdraw orders |
| `POST` | `/api/withdraw/orders` | Submit withdraw order |
| `GET` | `/api/withdraw/orders/{withdrawNo}` | Current user withdraw order detail |
| `POST` | `/api/withdraw/orders/{withdrawNo}/cancel` | Cancel pending withdraw order |

### `GET` /api/withdraw/orders

**Summary:** Current user withdraw orders

**Operation ID:** `orders`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `request` | query | Yes | `WithdrawOrderQueryRequest` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponsePageResultWithdrawOrderResponse` |

### `POST` /api/withdraw/orders

**Summary:** Submit withdraw order

**Operation ID:** `createOrder`

**Parameters**

_None_

**Request Body**

- Required: **Yes**
- Content:
- `application/json`: `CreateWithdrawOrderRequest`

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseWithdrawOrderResponse` |

### `GET` /api/withdraw/orders/{withdrawNo}

**Summary:** Current user withdraw order detail

**Operation ID:** `detail`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `withdrawNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseWithdrawOrderResponse` |

### `POST` /api/withdraw/orders/{withdrawNo}/cancel

**Summary:** Cancel pending withdraw order

**Operation ID:** `cancel`

**Parameters**

| Name | In | Required | Type | Description |
|---|---:|:---:|---|---|
| `withdrawNo` | path | Yes | `string` | - |

**Request Body**

_None_

**Responses**

| Status | Description | Content / Schema |
|---:|---|---|
| `200` | OK | `*/*`: `ApiResponseVoid` |

## Component Schemas

### AdminApproveRechargeRequest

- Type: `object`
- Required fields: `actualAmount`

| Field | Type | Description |
|---|---|---|
| `actualAmount` **required** | `number` min: `0.0` | - |
| `reviewRemark` | `string` | - |

### AdminApproveWithdrawRequest

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `reviewRemark` | `string` | - |

### AdminLoginRequest

- Type: `object`
- Required fields: `password`, `userName`

| Field | Type | Description |
|---|---|---|
| `userName` **required** | `string` | - |
| `password` **required** | `string` | - |

### AdminLoginResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `adminAccessToken` | `string` | - |
| `admin` | `AdminMeResponse` | - |

### AdminMeResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `adminId` | `integer` (int64) | - |
| `userName` | `string` | - |
| `status` | `integer` (int32) | - |
| `role` | `string` | - |

### AdminPaidWithdrawRequest

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `payProofNo` | `string` | - |

### AdminRejectRechargeRequest

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `reviewRemark` | `string` | - |

### AdminRejectWithdrawRequest

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `reviewRemark` | `string` | - |

### AdminSysConfigQueryRequest

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `pageNo` | `integer` (int32) min: `1` | - |
| `pageSize` | `integer` (int32) min: `1` max: `100` | - |
| `configKey` | `string` | - |

### AdminSysConfigResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `configKey` | `string` | - |
| `configValue` | `string` | - |
| `configDesc` | `string` | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### AiModel

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `modelCode` | `string` | - |
| `modelName` | `string` | - |
| `vendorName` | `string` | - |
| `logoUrl` | `string` | - |
| `monthlyTokenConsumptionTrillion` | `number` | - |
| `tokenUnitPrice` | `number` | - |
| `deployTechFee` | `number` | - |
| `status` | `integer` (int32) | - |
| `sortNo` | `integer` (int32) | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### AiModelResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `modelCode` | `string` | - |
| `modelName` | `string` | - |
| `vendorName` | `string` | - |
| `logoUrl` | `string` | - |
| `monthlyTokenConsumptionTrillion` | `number` | - |
| `tokenUnitPrice` | `number` | - |
| `deployTechFee` | `number` | - |

### ApiCredentialResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `credentialNo` | `string` | - |
| `apiName` | `string` | - |
| `apiBaseUrl` | `string` | - |
| `tokenMasked` | `string` | - |
| `modelNameSnapshot` | `string` | - |
| `deployFeeSnapshot` | `number` | - |
| `tokenStatus` | `string` | - |
| `generatedAt` | `string` (date-time) | - |
| `activationPaidAt` | `string` (date-time) | - |
| `activatedAt` | `string` (date-time) | - |
| `autoPauseAt` | `string` (date-time) | - |
| `pausedAt` | `string` (date-time) | - |
| `startedAt` | `string` (date-time) | - |
| `expiredAt` | `string` (date-time) | - |

### ApiDeployInfoResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `orderNo` | `string` | - |
| `orderStatus` | `string` | - |
| `credentialNo` | `string` | - |
| `tokenStatus` | `string` | - |
| `modelNameSnapshot` | `string` | - |
| `deployFeeSnapshot` | `number` | - |
| `apiName` | `string` | - |
| `apiBaseUrl` | `string` | - |
| `tokenMasked` | `string` | - |
| `deployOrderStatus` | `string` | - |
| `paidAt` | `string` (date-time) | - |

### ApiDeployOrder

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `deployNo` | `string` | - |
| `userId` | `integer` (int64) | - |
| `userName` | `string` | 用户名称 |
| `rentalOrderId` | `integer` (int64) | - |
| `apiCredentialId` | `integer` (int64) | - |
| `aiModelId` | `integer` (int64) | - |
| `modelNameSnapshot` | `string` | - |
| `currency` | `string` | - |
| `deployFeeAmount` | `number` | - |
| `status` | `string` | - |
| `walletTxNo` | `string` | - |
| `paidAt` | `string` (date-time) | - |
| `canceledAt` | `string` (date-time) | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### ApiDeployOrderResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `deployNo` | `string` | - |
| `userName` | `string` | 用户名称 |
| `orderNo` | `string` | - |
| `credentialNo` | `string` | - |
| `modelNameSnapshot` | `string` | - |
| `deployFeeAmount` | `number` | - |
| `status` | `string` | - |
| `walletTxNo` | `string` | - |
| `paidAt` | `string` (date-time) | - |
| `createdAt` | `string` (date-time) | - |

### ApiResponseAdminLoginResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `AdminLoginResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseAdminMeResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `AdminMeResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseAdminSysConfigResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `AdminSysConfigResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseAiModel

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `AiModel` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseApiCredentialResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `ApiCredentialResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseApiDeployInfoResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `ApiDeployInfoResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseApiDeployOrder

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `ApiDeployOrder` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseApiDeployOrderResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `ApiDeployOrderResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseBlogCategory

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `BlogCategory` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseBlogTag

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `BlogTag` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseCommissionRecord

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `CommissionRecord` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseCommissionSummaryResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `CommissionSummaryResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseGpuModel

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `GpuModel` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseInteger

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `integer` (int32) | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseListAiModelResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `array` array of `AiModelResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseListBlogCategory

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `array` array of `BlogCategory` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseListBlogTag

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `array` array of `BlogTag` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseListGpuModelResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `array` array of `GpuModelResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseListRechargeChannelResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `array` array of `RechargeChannelResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseListRegionResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `array` array of `RegionResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseListRentalCycleRuleResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `array` array of `RentalCycleRuleResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseListUserPushDevice

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `array` array of `UserPushDevice` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseLoginResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `LoginResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseLong

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `integer` (int64) | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseMapStringObject

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `object` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseMapStringString

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `object` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultAdminSysConfigResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultAdminSysConfigResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultAiModel

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultAiModel` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultApiDeployOrder

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultApiDeployOrder` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultBlogCategory

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultBlogCategory` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultBlogTag

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultBlogTag` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultCommissionRecord

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultCommissionRecord` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultCommissionRecordResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultCommissionRecordResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultGpuModel

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultGpuModel` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultMapStringObject

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultMapStringObject` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultAdminProductResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultAdminProductResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultProduct

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultProduct` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultProductResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultProductResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultProfitRecordResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultProfitRecordResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultRechargeOrderResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultRechargeOrderResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultRegion

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultRegion` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultRentalCycleRule

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultRentalCycleRule` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultRentalOrder

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultRentalOrder` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultRentalOrderSummaryResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultRentalOrderSummaryResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultRentalProfitRecord

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultRentalProfitRecord` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultRentalSettlementOrder

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultRentalSettlementOrder` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultSettlementOrderResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultSettlementOrderResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultSysAdminLog

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultSysAdminLog` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultSysNotification

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultSysNotification` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultTeamMemberResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultTeamMemberResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultUserTeamRelation

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultUserTeamRelation` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultUserWallet

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultUserWallet` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultWalletTransaction

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultWalletTransaction` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultWalletTransactionResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultWalletTransactionResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponsePageResultWithdrawOrderResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `PageResultWithdrawOrderResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseAdminProductResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `AdminProductResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseProduct

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `Product` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseProductResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `ProductResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseProfitSummaryResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `ProfitSummaryResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseRechargeOrderResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `RechargeOrderResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseRegion

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `Region` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseRentalCycleRule

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `RentalCycleRule` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseRentalEstimateResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `RentalEstimateResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseRentalOrderDetailResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `RentalOrderDetailResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseRentalProfitRecord

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `RentalProfitRecord` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseRentalSettlementOrder

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `RentalSettlementOrder` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseSchedulerRunResult

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `SchedulerRunResult` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseSettlementOrderResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `SettlementOrderResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseSysAdminLog

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `SysAdminLog` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseSysNotification

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `SysNotification` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseTeamSummaryResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `TeamSummaryResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseUserMeResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `UserMeResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseUserPushDevice

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `UserPushDevice` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseUserWallet

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `UserWallet` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseVoid

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `object` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseWalletMeResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `WalletMeResponse` | - |
| `timestamp` | `string` (date-time) | - |

### ApiResponseWithdrawOrderResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `code` | `integer` (int32) | - |
| `message` | `string` | - |
| `data` | `WithdrawOrderResponse` | - |
| `timestamp` | `string` (date-time) | - |

### BlogCategory

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `categoryName` | `string` | - |
| `sortNo` | `integer` (int32) | - |
| `status` | `integer` (int32) | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### BlogPostRequest

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `categoryId` | `integer` (int64) | - |
| `title` | `string` | - |
| `summary` | `string` | - |
| `coverImageUrl` | `string` | - |
| `contentMarkdown` | `string` | - |
| `publishStatus` | `integer` (int32) | - |
| `isTop` | `integer` (int32) | - |
| `sortNo` | `integer` (int32) | - |
| `tagIds` | `array` array of `integer` (int64) | - |

### BlogTag

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `tagName` | `string` | - |
| `sortNo` | `integer` (int32) | - |
| `status` | `integer` (int32) | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### CommissionRecord

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `commissionNo` | `string` | - |
| `benefitUserId` | `integer` (int64) | - |
| `sourceUserId` | `integer` (int64) | - |
| `userName` | `string` | 用户名称 |
| `sourceOrderId` | `integer` (int64) | - |
| `sourceProfitId` | `integer` (int64) | - |
| `levelNo` | `integer` (int32) | - |
| `currency` | `string` | - |
| `sourceProfitAmount` | `number` | - |
| `commissionRateSnapshot` | `number` | - |
| `commissionAmount` | `number` | - |
| `status` | `string` | - |
| `walletTxNo` | `string` | - |
| `settledAt` | `string` (date-time) | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### CommissionRecordQueryRequest

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `pageNo` | `integer` (int32) min: `1` | - |
| `pageSize` | `integer` (int32) min: `1` max: `100` | - |
| `levelNo` | `integer` (int32) | - |
| `status` | `string` enum: `PENDING`, `SETTLED`, `CANCELED` | - |
| `startTime` | `string` (date-time) | - |
| `endTime` | `string` (date-time) | - |

### CommissionRecordResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `commissionNo` | `string` | - |
| `sourceUserId` | `integer` (int64) | - |
| `userName` | `string` | 用户名称 |
| `sourceOrderId` | `integer` (int64) | - |
| `sourceProfitId` | `integer` (int64) | - |
| `levelNo` | `integer` (int32) | - |
| `sourceProfitAmount` | `number` | - |
| `commissionRateSnapshot` | `number` | - |
| `commissionAmount` | `number` | - |
| `status` | `string` | - |
| `walletTxNo` | `string` | - |
| `settledAt` | `string` (date-time) | - |
| `createdAt` | `string` (date-time) | - |

### CommissionSummaryResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `totalCommission` | `number` | - |
| `todayCommission` | `number` | - |
| `yesterdayCommission` | `number` | - |
| `currentMonthCommission` | `number` | - |
| `level1Commission` | `number` | - |
| `level2Commission` | `number` | - |
| `level3Commission` | `number` | - |

### CreateRechargeOrderRequest

- Type: `object`
- Required fields: `applyAmount`, `channelId`

| Field | Type | Description |
|---|---|---|
| `channelId` **required** | `integer` (int64) | - |
| `applyAmount` **required** | `number` min: `0.0` | - |
| `externalTxNo` | `string` | - |
| `paymentProofUrl` | `string` | - |
| `userRemark` | `string` | - |

### CreateRentalOrderRequest

- Type: `object`
- Required fields: `aiModelId`, `cycleRuleId`, `productId`

| Field | Type | Description |
|---|---|---|
| `productId` **required** | `integer` (int64) | - |
| `aiModelId` **required** | `integer` (int64) | - |
| `cycleRuleId` **required** | `integer` (int64) | - |

### CreateWithdrawOrderRequest

- Type: `object`
- Required fields: `accountNo`, `applyAmount`, `network`

| Field | Type | Description |
|---|---|---|
| `network` **required** | `string` | - |
| `accountName` | `string` | - |
| `accountNo` **required** | `string` | - |
| `applyAmount` **required** | `number` min: `0.0` | - |

### GpuModel

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `modelCode` | `string` | - |
| `modelName` | `string` | - |
| `sortNo` | `integer` (int32) | - |
| `status` | `integer` (int32) | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### GpuModelResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `modelCode` | `string` | - |
| `modelName` | `string` | - |

### LoginRequest

- Type: `object`
- Required fields: `email`, `password`

| Field | Type | Description |
|---|---|---|
| `email` **required** | `string` | - |
| `password` **required** | `string` | - |

### LoginResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `accessToken` | `string` | - |
| `tokenType` | `string` | - |
| `user` | `UserProfile` | - |

### NotificationBroadcastRequest

- Type: `object`
- Required fields: `content`, `title`, `type`

| Field | Type | Description |
|---|---|---|
| `title` **required** | `string` | - |
| `content` **required** | `string` | - |
| `type` **required** | `string` | - |
| `bizType` | `string` | - |
| `bizId` | `integer` (int64) | - |

### NotificationCreateRequest

- Type: `object`
- Required fields: `content`, `title`, `type`, `userId`

| Field | Type | Description |
|---|---|---|
| `userId` **required** | `integer` (int64) | - |
| `title` **required** | `string` | - |
| `content` **required** | `string` | - |
| `type` **required** | `string` | - |
| `bizType` | `string` | - |
| `bizId` | `integer` (int64) | - |

### PageResultAdminSysConfigResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `AdminSysConfigResponse` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultAiModel

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `AiModel` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultApiDeployOrder

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `ApiDeployOrder` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultBlogCategory

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `BlogCategory` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultBlogTag

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `BlogTag` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultCommissionRecord

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `CommissionRecord` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultCommissionRecordResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `CommissionRecordResponse` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultGpuModel

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `GpuModel` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultMapStringObject

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `object` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultAdminProductResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `AdminProductResponse` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultProduct

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `Product` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultProductResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `ProductResponse` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultProfitRecordResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `ProfitRecordResponse` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultRechargeOrderResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `RechargeOrderResponse` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultRegion

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `Region` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultRentalCycleRule

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `RentalCycleRule` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultRentalOrder

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `RentalOrder` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultRentalOrderSummaryResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `RentalOrderSummaryResponse` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultRentalProfitRecord

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `RentalProfitRecord` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultRentalSettlementOrder

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `RentalSettlementOrder` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultSettlementOrderResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `SettlementOrderResponse` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultSysAdminLog

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `SysAdminLog` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultSysNotification

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `SysNotification` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultTeamMemberResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `TeamMemberResponse` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultUserTeamRelation

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `UserTeamRelation` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultUserWallet

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `UserWallet` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultWalletTransaction

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `WalletTransaction` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultWalletTransactionResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `WalletTransactionResponse` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### PageResultWithdrawOrderResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `records` | `array` array of `WithdrawOrderResponse` | - |
| `total` | `integer` (int64) | - |
| `pageNo` | `integer` (int64) | - |
| `pageSize` | `integer` (int64) | - |

### AdminProductResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `productCode` | `string` | - |
| `productName` | `string` | - |
| `machineCode` | `string` | - |
| `machineAlias` | `string` | - |
| `regionId` | `integer` (int64) | - |
| `regionName` | `string` | ???? |
| `gpuModelId` | `integer` (int64) | - |
| `gpuModelName` | `string` | GPU ???? |
| `gpuMemoryGb` | `integer` (int32) | - |
| `gpuPowerTops` | `number` | - |
| `rentPrice` | `number` | - |
| `tokenOutputPerMinute` | `integer` (int64) | - |
| `tokenOutputPerDay` | `integer` (int64) | - |
| `rentableUntil` | `string` (date) | - |
| `totalStock` | `integer` (int32) | - |
| `availableStock` | `integer` (int32) | - |
| `rentedStock` | `integer` (int32) | - |
| `cpuModel` | `string` | - |
| `cpuCores` | `integer` (int32) | - |
| `memoryGb` | `integer` (int32) | - |
| `systemDiskGb` | `integer` (int32) | - |
| `dataDiskGb` | `integer` (int32) | - |
| `maxExpandDiskGb` | `integer` (int32) | - |
| `driverVersion` | `string` | - |
| `cudaVersion` | `string` | - |
| `hasCacheOptimization` | `integer` (int32) | - |
| `status` | `integer` (int32) | - |
| `sortNo` | `integer` (int32) | - |
| `versionNo` | `integer` (int32) | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### Product

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `productCode` | `string` | - |
| `productName` | `string` | - |
| `machineCode` | `string` | - |
| `machineAlias` | `string` | - |
| `regionId` | `integer` (int64) | - |
| `gpuModelId` | `integer` (int64) | - |
| `gpuMemoryGb` | `integer` (int32) | - |
| `gpuPowerTops` | `number` | - |
| `rentPrice` | `number` | - |
| `tokenOutputPerMinute` | `integer` (int64) | - |
| `tokenOutputPerDay` | `integer` (int64) | - |
| `rentableUntil` | `string` (date) | - |
| `totalStock` | `integer` (int32) | - |
| `availableStock` | `integer` (int32) | - |
| `rentedStock` | `integer` (int32) | - |
| `cpuModel` | `string` | - |
| `cpuCores` | `integer` (int32) | - |
| `memoryGb` | `integer` (int32) | - |
| `systemDiskGb` | `integer` (int32) | - |
| `dataDiskGb` | `integer` (int32) | - |
| `maxExpandDiskGb` | `integer` (int32) | - |
| `driverVersion` | `string` | - |
| `cudaVersion` | `string` | - |
| `hasCacheOptimization` | `integer` (int32) | - |
| `status` | `integer` (int32) | - |
| `sortNo` | `integer` (int32) | - |
| `versionNo` | `integer` (int32) | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### ProductQueryRequest

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `pageNo` | `integer` (int32) min: `1` | - |
| `pageSize` | `integer` (int32) min: `1` max: `100` | - |
| `regionId` | `integer` (int64) | - |
| `gpuModelId` | `integer` (int64) | - |

### ProductResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `productCode` | `string` | - |
| `productName` | `string` | - |
| `machineCode` | `string` | - |
| `machineAlias` | `string` | - |
| `regionName` | `string` | - |
| `gpuModelName` | `string` | - |
| `gpuMemoryGb` | `integer` (int32) | - |
| `gpuPowerTops` | `number` | - |
| `rentPrice` | `number` | - |
| `tokenOutputPerMinute` | `integer` (int64) | - |
| `tokenOutputPerDay` | `integer` (int64) | - |
| `rentableUntil` | `string` (date) | - |
| `totalStock` | `integer` (int32) | - |
| `availableStock` | `integer` (int32) | - |
| `rentedStock` | `integer` (int32) | - |
| `cpuModel` | `string` | - |
| `cpuCores` | `integer` (int32) | - |
| `memoryGb` | `integer` (int32) | - |
| `systemDiskGb` | `integer` (int32) | - |
| `dataDiskGb` | `integer` (int32) | - |
| `maxExpandDiskGb` | `integer` (int32) | - |
| `driverVersion` | `string` | - |
| `cudaVersion` | `string` | - |
| `hasCacheOptimization` | `integer` (int32) | - |

### ProfitRecordQueryRequest

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `pageNo` | `integer` (int32) min: `1` | - |
| `pageSize` | `integer` (int32) min: `1` max: `100` | - |
| `rentalOrderId` | `integer` (int64) | - |
| `orderNo` | `string` | - |
| `profitDate` | `string` (date) | - |
| `status` | `string` enum: `PENDING`, `SETTLED`, `CANCELED` | - |

### ProfitRecordResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `profitNo` | `string` | - |
| `orderNo` | `string` | - |
| `productNameSnapshot` | `string` | - |
| `aiModelNameSnapshot` | `string` | - |
| `profitDate` | `string` (date) | - |
| `gpuDailyTokenSnapshot` | `integer` (int64) | - |
| `tokenPriceSnapshot` | `number` | - |
| `yieldMultiplierSnapshot` | `number` | - |
| `baseProfitAmount` | `number` | - |
| `finalProfitAmount` | `number` | - |
| `status` | `string` | - |
| `walletTxNo` | `string` | - |
| `commissionGenerated` | `integer` (int32) | - |
| `settledAt` | `string` (date-time) | - |

### ProfitSummaryResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `totalProfit` | `number` | - |
| `todayProfit` | `number` | - |
| `yesterdayProfit` | `number` | - |
| `currentMonthProfit` | `number` | - |
| `settledProfitCount` | `integer` (int64) | - |

### RechargeChannelResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `channelId` | `integer` (int64) | - |
| `channelCode` | `string` | - |
| `channelName` | `string` | - |
| `network` | `string` | - |
| `displayUrl` | `string` | - |
| `accountName` | `string` | - |
| `accountNo` | `string` | - |
| `minAmount` | `number` | - |
| `maxAmount` | `number` | - |

### RechargeOrderQueryRequest

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `pageNo` | `integer` (int32) min: `1` | - |
| `pageSize` | `integer` (int32) min: `1` max: `100` | - |
| `status` | `string` enum: `SUBMITTED`, `APPROVED`, `REJECTED`, `CANCELED` | - |
| `startTime` | `string` (date-time) | - |
| `endTime` | `string` (date-time) | - |

### RechargeOrderResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `rechargeNo` | `string` | - |
| `userName` | `string` | 用户名称 |
| `channelId` | `integer` (int64) | - |
| `currency` | `string` | - |
| `channelName` | `string` | - |
| `network` | `string` | - |
| `displayUrl` | `string` | - |
| `accountNo` | `string` | - |
| `applyAmount` | `number` | - |
| `actualAmount` | `number` | - |
| `externalTxNo` | `string` | - |
| `paymentProofUrl` | `string` | - |
| `userRemark` | `string` | - |
| `status` | `string` | - |
| `reviewedBy` | `integer` (int64) | - |
| `reviewedAt` | `string` (date-time) | - |
| `reviewRemark` | `string` | - |
| `creditedAt` | `string` (date-time) | - |
| `walletTxNo` | `string` | - |
| `createdAt` | `string` (date-time) | - |

### Region

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `regionCode` | `string` | - |
| `regionName` | `string` | - |
| `sortNo` | `integer` (int32) | - |
| `status` | `integer` (int32) | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### RegionResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `regionCode` | `string` | - |
| `regionName` | `string` | - |

### RegisterPushDeviceRequest

- Type: `object`
- Required fields: `deviceToken`, `deviceType`

| Field | Type | Description |
|---|---|---|
| `deviceType` **required** | `string` | - |
| `deviceToken` **required** | `string` | - |

### RentalCycleRule

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `cycleCode` | `string` | - |
| `cycleName` | `string` | - |
| `cycleDays` | `integer` (int32) | - |
| `yieldMultiplier` | `number` | - |
| `earlyPenaltyRate` | `number` | - |
| `status` | `integer` (int32) | - |
| `sortNo` | `integer` (int32) | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### RentalCycleRuleResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `cycleCode` | `string` | - |
| `cycleName` | `string` | - |
| `cycleDays` | `integer` (int32) | - |
| `yieldMultiplier` | `number` | - |
| `earlyPenaltyRate` | `number` | - |

### RentalEstimateRequest

- Type: `object`
- Required fields: `aiModelId`, `cycleRuleId`, `productId`

| Field | Type | Description |
|---|---|---|
| `productId` **required** | `integer` (int64) | - |
| `aiModelId` **required** | `integer` (int64) | - |
| `cycleRuleId` **required** | `integer` (int64) | - |

### RentalEstimateResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `productId` | `integer` (int64) | - |
| `productName` | `string` | - |
| `aiModelId` | `integer` (int64) | - |
| `aiModelName` | `string` | - |
| `cycleRuleId` | `integer` (int64) | - |
| `cycleName` | `string` | - |
| `cycleDays` | `integer` (int32) | - |
| `rentPrice` | `number` | - |
| `deployTechFee` | `number` | - |
| `tokenOutputPerDay` | `integer` (int64) | - |
| `tokenUnitPrice` | `number` | - |
| `yieldMultiplier` | `number` | - |
| `expectedDailyProfit` | `number` | - |
| `expectedTotalProfit` | `number` | - |

### RentalOrder

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `orderNo` | `string` | - |
| `userId` | `integer` (int64) | - |
| `userName` | `string` | 用户名称 |
| `productId` | `integer` (int64) | - |
| `aiModelId` | `integer` (int64) | - |
| `cycleRuleId` | `integer` (int64) | - |
| `productCodeSnapshot` | `string` | - |
| `productNameSnapshot` | `string` | - |
| `machineCodeSnapshot` | `string` | - |
| `machineAliasSnapshot` | `string` | - |
| `regionNameSnapshot` | `string` | - |
| `gpuModelSnapshot` | `string` | - |
| `gpuMemorySnapshotGb` | `integer` (int32) | - |
| `gpuPowerTopsSnapshot` | `number` | - |
| `gpuRentPriceSnapshot` | `number` | - |
| `tokenOutputPerDaySnapshot` | `integer` (int64) | - |
| `aiModelNameSnapshot` | `string` | - |
| `aiVendorNameSnapshot` | `string` | - |
| `monthlyTokenConsumptionSnapshot` | `number` | - |
| `tokenUnitPriceSnapshot` | `number` | - |
| `deployFeeSnapshot` | `number` | - |
| `cycleDaysSnapshot` | `integer` (int32) | - |
| `yieldMultiplierSnapshot` | `number` | - |
| `earlyPenaltyRateSnapshot` | `number` | - |
| `currency` | `string` | - |
| `orderAmount` | `number` | - |
| `paidAmount` | `number` | - |
| `expectedDailyProfit` | `number` | - |
| `expectedTotalProfit` | `number` | - |
| `orderStatus` | `string` | - |
| `profitStatus` | `string` | - |
| `settlementStatus` | `string` | - |
| `machinePayTxNo` | `string` | - |
| `paidAt` | `string` (date-time) | - |
| `apiGeneratedAt` | `string` (date-time) | - |
| `deployFeePaidAt` | `string` (date-time) | - |
| `activatedAt` | `string` (date-time) | - |
| `autoPauseAt` | `string` (date-time) | - |
| `pausedAt` | `string` (date-time) | - |
| `startedAt` | `string` (date-time) | - |
| `profitStartAt` | `string` (date-time) | - |
| `profitEndAt` | `string` (date-time) | - |
| `expiredAt` | `string` (date-time) | - |
| `canceledAt` | `string` (date-time) | - |
| `finishedAt` | `string` (date-time) | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### RentalOrderDetailResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `orderNo` | `string` | - |
| `userName` | `string` | 用户名称 |
| `productId` | `integer` (int64) | - |
| `aiModelId` | `integer` (int64) | - |
| `cycleRuleId` | `integer` (int64) | - |
| `productCodeSnapshot` | `string` | - |
| `productNameSnapshot` | `string` | - |
| `machineCodeSnapshot` | `string` | - |
| `machineAliasSnapshot` | `string` | - |
| `regionNameSnapshot` | `string` | - |
| `gpuModelSnapshot` | `string` | - |
| `gpuMemorySnapshotGb` | `integer` (int32) | - |
| `gpuPowerTopsSnapshot` | `number` | - |
| `gpuRentPriceSnapshot` | `number` | - |
| `tokenOutputPerDaySnapshot` | `integer` (int64) | - |
| `aiModelNameSnapshot` | `string` | - |
| `aiVendorNameSnapshot` | `string` | - |
| `monthlyTokenConsumptionSnapshot` | `number` | - |
| `tokenUnitPriceSnapshot` | `number` | - |
| `deployFeeSnapshot` | `number` | - |
| `cycleDaysSnapshot` | `integer` (int32) | - |
| `yieldMultiplierSnapshot` | `number` | - |
| `earlyPenaltyRateSnapshot` | `number` | - |
| `currency` | `string` | - |
| `orderAmount` | `number` | - |
| `paidAmount` | `number` | - |
| `expectedDailyProfit` | `number` | - |
| `expectedTotalProfit` | `number` | - |
| `orderStatus` | `string` | - |
| `profitStatus` | `string` | - |
| `settlementStatus` | `string` | - |
| `machinePayTxNo` | `string` | - |
| `paidAt` | `string` (date-time) | - |
| `apiGeneratedAt` | `string` (date-time) | - |
| `deployFeePaidAt` | `string` (date-time) | - |
| `activatedAt` | `string` (date-time) | - |
| `autoPauseAt` | `string` (date-time) | - |
| `pausedAt` | `string` (date-time) | - |
| `startedAt` | `string` (date-time) | - |
| `profitStartAt` | `string` (date-time) | - |
| `profitEndAt` | `string` (date-time) | - |
| `expiredAt` | `string` (date-time) | - |
| `canceledAt` | `string` (date-time) | - |
| `finishedAt` | `string` (date-time) | - |
| `createdAt` | `string` (date-time) | - |
| `apiCredential` | `ApiCredentialResponse` | - |

### RentalOrderQueryRequest

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `pageNo` | `integer` (int32) min: `1` | - |
| `pageSize` | `integer` (int32) min: `1` max: `100` | - |
| `orderStatus` | `string` enum: `PENDING_PAY`, `PAID`, `PENDING_ACTIVATION`, `ACTIVATING`, `PAUSED`, `RUNNING`, `EXPIRED`, `SETTLING`, `SETTLED`, `EARLY_CLOSED`, `CANCELED` | - |
| `startTime` | `string` (date-time) | - |
| `endTime` | `string` (date-time) | - |

### RentalOrderSummaryResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `orderNo` | `string` | - |
| `userName` | `string` | 用户名称 |
| `productNameSnapshot` | `string` | - |
| `machineCodeSnapshot` | `string` | - |
| `machineAliasSnapshot` | `string` | - |
| `aiModelNameSnapshot` | `string` | - |
| `cycleDaysSnapshot` | `integer` (int32) | - |
| `orderAmount` | `number` | - |
| `expectedDailyProfit` | `number` | - |
| `expectedTotalProfit` | `number` | - |
| `orderStatus` | `string` | - |
| `profitStatus` | `string` | - |
| `settlementStatus` | `string` | - |
| `createdAt` | `string` (date-time) | - |
| `paidAt` | `string` (date-time) | - |
| `apiGeneratedAt` | `string` (date-time) | - |
| `deployFeePaidAt` | `string` (date-time) | - |
| `activatedAt` | `string` (date-time) | - |
| `autoPauseAt` | `string` (date-time) | - |
| `pausedAt` | `string` (date-time) | - |
| `startedAt` | `string` (date-time) | - |
| `profitStartAt` | `string` (date-time) | - |
| `profitEndAt` | `string` (date-time) | - |

### RentalProfitRecord

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `profitNo` | `string` | - |
| `userId` | `integer` (int64) | - |
| `userName` | `string` | 用户名称 |
| `rentalOrderId` | `integer` (int64) | - |
| `profitDate` | `string` (date) | - |
| `gpuDailyTokenSnapshot` | `integer` (int64) | - |
| `tokenPriceSnapshot` | `number` | - |
| `yieldMultiplierSnapshot` | `number` | - |
| `baseProfitAmount` | `number` | - |
| `finalProfitAmount` | `number` | - |
| `status` | `string` | - |
| `walletTxNo` | `string` | - |
| `commissionGenerated` | `integer` (int32) | - |
| `settledAt` | `string` (date-time) | - |
| `remark` | `string` | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### RentalSettlementOrder

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `settlementNo` | `string` | - |
| `userId` | `integer` (int64) | - |
| `userName` | `string` | 用户名称 |
| `rentalOrderId` | `integer` (int64) | - |
| `settlementType` | `string` | - |
| `currency` | `string` | - |
| `principalAmount` | `number` | - |
| `profitAmount` | `number` | - |
| `penaltyAmount` | `number` | - |
| `actualSettleAmount` | `number` | - |
| `status` | `string` | - |
| `reviewedBy` | `integer` (int64) | - |
| `reviewedAt` | `string` (date-time) | - |
| `settledAt` | `string` (date-time) | - |
| `walletTxNo` | `string` | - |
| `remark` | `string` | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### ResetPasswordRequest

- Type: `object`
- Required fields: `code`, `email`, `newPassword`

| Field | Type | Description |
|---|---|---|
| `email` **required** | `string` | - |
| `code` **required** | `string` | - |
| `newPassword` **required** | `string` | - |

### SchedulerRunResult

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `taskName` | `string` | - |
| `totalCount` | `integer` (int32) | - |
| `successCount` | `integer` (int32) | - |
| `failCount` | `integer` (int32) | - |
| `status` | `string` | - |
| `errorMessage` | `string` | - |

### SendEmailCodeRequest

- Type: `object`
- Required fields: `email`

| Field | Type | Description |
|---|---|---|
| `email` **required** | `string` | - |

### SettlementOrderQueryRequest

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `pageNo` | `integer` (int32) min: `1` | - |
| `pageSize` | `integer` (int32) min: `1` max: `100` | - |
| `settlementType` | `string` enum: `EXPIRE`, `EARLY_TERMINATE`, `MANUAL` | - |
| `status` | `string` enum: `PENDING`, `SETTLED`, `REJECTED`, `CANCELED` | - |
| `startTime` | `string` (date-time) | - |
| `endTime` | `string` (date-time) | - |

### SettlementOrderResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `settlementNo` | `string` | - |
| `orderNo` | `string` | - |
| `settlementType` | `string` | - |
| `currency` | `string` | - |
| `principalAmount` | `number` | - |
| `profitAmount` | `number` | - |
| `penaltyAmount` | `number` | - |
| `actualSettleAmount` | `number` | - |
| `status` | `string` | - |
| `reviewedBy` | `integer` (int64) | - |
| `reviewedAt` | `string` (date-time) | - |
| `settledAt` | `string` (date-time) | - |
| `walletTxNo` | `string` | - |
| `remark` | `string` | - |
| `createdAt` | `string` (date-time) | - |

### SignupRequest

- Type: `object`
- Required fields: `code`, `email`, `password`, `userName`

| Field | Type | Description |
|---|---|---|
| `email` **required** | `string` | - |
| `code` **required** | `string` | - |
| `userName` **required** | `string` | - |
| `password` **required** | `string` | - |
| `inviteCode` | `string` | - |

### SysAdminLog

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `adminId` | `integer` (int64) | - |
| `action` | `string` | - |
| `actionName` | `string` | 操作中文名称 |
| `targetTable` | `string` | - |
| `targetId` | `integer` (int64) | - |
| `beforeValue` | `string` | - |
| `afterValue` | `string` | - |
| `remark` | `string` | - |
| `ip` | `string` | - |
| `createdAt` | `string` (date-time) | - |

### SysNotification

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `userId` | `integer` (int64) | - |
| `title` | `string` | - |
| `content` | `string` | - |
| `type` | `string` | - |
| `bizType` | `string` | - |
| `bizId` | `integer` (int64) | - |
| `readStatus` | `integer` (int32) | - |
| `readAt` | `string` (date-time) | - |
| `createdAt` | `string` (date-time) | - |

### TeamMemberQueryRequest

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `pageNo` | `integer` (int32) min: `1` | - |
| `pageSize` | `integer` (int32) min: `1` max: `100` | - |
| `levelDepth` | `integer` (int32) min: `1` | - |

### TeamMemberResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `userId` | `string` | - |
| `userName` | `string` | 用户名称 |
| `email` | `string` | - |
| `status` | `integer` (int32) | - |
| `levelDepth` | `integer` (int32) | - |
| `createdAt` | `string` (date-time) | - |

### TeamSummaryResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `totalTeamCount` | `integer` (int64) | - |
| `directTeamCount` | `integer` (int64) | - |
| `level2TeamCount` | `integer` (int64) | - |
| `level3TeamCount` | `integer` (int64) | - |
| `deeperTeamCount` | `integer` (int64) | - |

### UnregisterPushDeviceRequest

- Type: `object`
- Required fields: `deviceToken`

| Field | Type | Description |
|---|---|---|
| `deviceToken` **required** | `string` | - |

### UpdateSysConfigRequest

- Type: `object`
- Required fields: `configValue`

| Field | Type | Description |
|---|---|---|
| `configValue` **required** | `string` | - |
| `configDesc` | `string` | - |

### UserMeResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `userId` | `string` | - |
| `email` | `string` | - |
| `userName` | `string` | - |
| `status` | `integer` (int32) | - |

### UserProfile

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `userId` | `string` | - |
| `email` | `string` | - |
| `userName` | `string` | - |

### UserPushDevice

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `userId` | `integer` (int64) | - |
| `deviceType` | `string` | - |
| `deviceToken` | `string` | - |
| `status` | `integer` (int32) | - |
| `lastActiveAt` | `string` (date-time) | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### UserTeamRelation

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `ancestorUserId` | `integer` (int64) | - |
| `descendantUserId` | `integer` (int64) | - |
| `levelDepth` | `integer` (int32) | - |
| `createdAt` | `string` (date-time) | - |

### UserWallet

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `walletNo` | `string` | - |
| `userId` | `integer` (int64) | - |
| `currency` | `string` | - |
| `availableBalance` | `number` | - |
| `frozenBalance` | `number` | - |
| `totalRecharge` | `number` | - |
| `totalWithdraw` | `number` | - |
| `totalProfit` | `number` | - |
| `totalCommission` | `number` | - |
| `status` | `integer` (int32) | - |
| `versionNo` | `integer` (int32) | - |
| `createdAt` | `string` (date-time) | - |
| `updatedAt` | `string` (date-time) | - |

### VerifyEmailCodeRequest

- Type: `object`
- Required fields: `code`, `email`

| Field | Type | Description |
|---|---|---|
| `email` **required** | `string` | - |
| `code` **required** | `string` | - |

### WalletMeResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `currency` | `string` | - |
| `availableBalance` | `number` | - |
| `frozenBalance` | `number` | - |
| `totalRecharge` | `number` | - |
| `totalWithdraw` | `number` | - |
| `totalProfit` | `number` | - |
| `totalCommission` | `number` | - |

### WalletTransaction

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `id` | `integer` (int64) | - |
| `txNo` | `string` | - |
| `idempotencyKey` | `string` | - |
| `userId` | `integer` (int64) | - |
| `userName` | `string` | 用户名称 |
| `walletId` | `integer` (int64) | - |
| `currency` | `string` | - |
| `txType` | `string` | - |
| `amount` | `number` | - |
| `beforeAvailableBalance` | `number` | - |
| `afterAvailableBalance` | `number` | - |
| `beforeFrozenBalance` | `number` | - |
| `afterFrozenBalance` | `number` | - |
| `bizType` | `string` | - |
| `bizOrderNo` | `string` | - |
| `remark` | `string` | - |
| `createdAt` | `string` (date-time) | - |

### WalletTransactionQueryRequest

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `pageNo` | `integer` (int32) min: `1` | - |
| `pageSize` | `integer` (int32) min: `1` max: `100` | - |
| `bizType` | `string` enum: `RECHARGE`, `WITHDRAW`, `RENT_PAY`, `API_DEPLOY_FEE`, `RENT_PROFIT`, `COMMISSION_PROFIT`, `SETTLEMENT`, `EARLY_PENALTY`, `REFUND`, `ADJUST` | - |
| `txType` | `string` enum: `IN`, `OUT`, `FREEZE`, `UNFREEZE` | - |
| `startTime` | `string` (date-time) | - |
| `endTime` | `string` (date-time) | - |

### WalletTransactionResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `txNo` | `string` | - |
| `userName` | `string` | 用户名称 |
| `txType` | `string` | - |
| `amount` | `number` | - |
| `beforeAvailableBalance` | `number` | - |
| `afterAvailableBalance` | `number` | - |
| `beforeFrozenBalance` | `number` | - |
| `afterFrozenBalance` | `number` | - |
| `bizType` | `string` | - |
| `bizOrderNo` | `string` | - |
| `remark` | `string` | - |
| `createdAt` | `string` (date-time) | - |

### WithdrawOrderQueryRequest

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `pageNo` | `integer` (int32) min: `1` | - |
| `pageSize` | `integer` (int32) min: `1` max: `100` | - |
| `status` | `string` enum: `PENDING_REVIEW`, `APPROVED`, `PAID`, `REJECTED`, `CANCELED` | - |
| `startTime` | `string` (date-time) | - |
| `endTime` | `string` (date-time) | - |

### WithdrawOrderResponse

- Type: `object`

| Field | Type | Description |
|---|---|---|
| `withdrawNo` | `string` | - |
| `userName` | `string` | 用户名称 |
| `currency` | `string` | - |
| `withdrawMethod` | `string` | - |
| `network` | `string` | - |
| `accountName` | `string` | - |
| `accountNo` | `string` | - |
| `applyAmount` | `number` | - |
| `feeAmount` | `number` | - |
| `actualAmount` | `number` | - |
| `status` | `string` | - |
| `freezeTxNo` | `string` | - |
| `unfreezeTxNo` | `string` | - |
| `paidTxNo` | `string` | - |
| `reviewedBy` | `integer` (int64) | - |
| `reviewedAt` | `string` (date-time) | - |
| `reviewRemark` | `string` | - |
| `paidAt` | `string` (date-time) | - |
| `payProofNo` | `string` | - |
| `createdAt` | `string` (date-time) | - |
