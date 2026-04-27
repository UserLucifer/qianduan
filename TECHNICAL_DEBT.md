# Technical Debt & Development Roadmap

记录当前版本中因前后端对接不一致、接口缺失或开发周期限制而采取的降级处理逻辑，以及下一轮迭代需要补齐的 API 和功能点。

## 1. 接口与数据模型债务 (API & Data Model)

### 1.1 字段名不一致 (Field Inconsistency)
*   **现象**：后端在不同环境或接口中返回的字段名不统一（如 `userId` vs `id`，`totalUsers` vs `totalUserCount`）。
*   **当前处理**：
    *   在 `api/admin.ts` 中使用了 `numberFromMap` 和 `stringFromMap` 辅助函数进行多路径适配。
    *   在 `management/page.tsx` 中使用了 `resolveUserId` 函数兼容多种 ID 格式。
*   **后续目标**：后端统一规范字段名为 `camelCase`，并固定核心实体的 ID 字段名。

### 1.2 弱类型定义 (Weak Typing)
*   **现象**：大量详情接口（如用户详情、订单详情、API 凭证详情）目前返回 `ApiMapObject` (即 `Record<string, any>`)。
*   **当前处理**：前端通过 `pickString` 等辅助函数手动提取字段，缺乏编译时类型检查。
*   **后续目标**：为所有详情接口定义严格的 TypeScript Interface，减少 `any` 和 `ApiMapObject` 的使用。

### 1.3 状态枚举映射 (Status Enum Mapping)
*   **现象**：部分状态（如系统运行状态）在后端缺失或返回非标准格式。
*   **当前处理**：前端硬编码了 `"NORMAL"` 或 `"-"` 作为降级显示。
*   **后续目标**：后端下发完整的配置字典接口，前端动态映射状态码与 Label。

## 2. 功能与页面债务 (Features & Pages)

### 2.1 目录管理模块 (Catalog Management)
*   **现状**：产品目录、GPU 型号、机房地区、周期规则等模块目前仅实现了基础的“查询”和“启用/禁用”逻辑。
*   **待补齐**：
    *   完整的“新增”与“编辑”表单页面（目前 API 已预留 `apiPost` / `apiPut` 但 UI 未落地）。
    *   多选批量操作功能。

### 2.2 财务审核细节 (Finance Review)
*   **现状**：充值/提现审核目前依赖 `window.prompt` 进行简单的信息输入。
*   **待补齐**：
    *   专业的审核弹窗（Dialog/Modal），支持上传凭证截图和选择预设拒绝原因。

### 2.3 调度中心 (Scheduler)
*   **现状**：调度任务目前仅支持单次手动触发。
*   **待补齐**：
    *   查看调度任务执行日志。
    *   编辑任务执行周期。

## 3. 下一轮开发待办事项 (Next Sprint TODOs)

- [ ] **重构详情页**：将 `DetailDrawer` 中的字段提取逻辑从 `pickString` 迁移到强类型 Model。
- [ ] **表单落地**：实现 `createAdminProduct` 和 `updateAdminProduct` 的前端交互逻辑。
- [ ] **性能优化**：为管理后台的大数据量表格引入虚拟滚动（Virtual Scroll）支持。
- [ ] **全局搜索**：在 `AdminHeader` 中实现真正的全局跨模块搜索功能。
- [ ] **权限细化**：根据后端下发的权限列表，实现前端路由和按钮级的权限控制（ACL）。

---
*最后更新时间：2026-04-27*
