# shadcn/ui 重构记录

## 阶段 0：重构基线

日期：2026-05-03

### 目标

在继续重构前固定当前项目基线，确保后续每一批 UI 迁移都不会把已有后端接口、类型检查和构建状态打断。

### 验证基线

- `npm.cmd run lint -- --quiet`：通过，当前无阻塞级 ESLint error。
- `node_modules\.bin\tsc.cmd --noEmit --pretty false`：通过。
- `npm.cmd run build`：通过。
- `git diff --check`：通过，仅存在 Git 对 LF/CRLF 的工作区提示。

### 当前剩余 lint warnings

`npm.cmd run lint` 当前仍有 100 条 warning，但不再导致命令失败。分类如下：

- `@typescript-eslint/no-unused-vars`：80 条
- `@next/next/no-img-element`：11 条
- `react-hooks/exhaustive-deps`：4 条
- `react-hooks/incompatible-library`：4 条
- `jsx-a11y/alt-text`：1 条

warning 较集中的文件：

- `app/dashboard/orders/page.tsx`：12 条
- `app/admins/content/page.tsx`：9 条
- `app/components/CompanyMegaMenu.tsx`：8 条
- `app/gpu-computing/page.tsx`：8 条
- `app/components/UseCaseMegaMenu.tsx`：8 条
- `app/use-cases/[slug]/page.tsx`：5 条
- `components/admin/BlogManagers.tsx`：4 条
- `app/dashboard/settings/page.tsx`：4 条
- `components/shared/SearchPanel.tsx`：4 条

### 当前 UI 旧模式扫描

- 原生 `<button>`：39 处
- 原生 `<input>`：14 处
- 原生 `<textarea>`：4 处
- `window.prompt`：2 处
- `--admin-*`：128 处
- `bg-[#...]`：61 处
- `text-[#...]`：12 处
- `border-[#...]`：14 处
- `bg-[var(...)]`：48 处
- `text-[var(...)]`：51 处
- `border-[var(...)]`：46 处

### 后端数据约束

后续重构页面时，所有业务数据必须继续来自现有 `api/*` 和 hooks，不允许为了 UI 展示新增 mock 数据或写死统计数据。

当前扫描到已直接使用 API/hooks 的页面范围包括：

- 管理后台：`/admins/api`、`/admins/commissions`、`/admins/config`、`/admins/content`、`/admins/dashboard`、`/admins/gpu`、`/admins/login`、`/admins/logs`、`/admins/management`、`/admins/models`、`/admins/notifications`、`/admins/orders`、`/admins/products`、`/admins/profits`、`/admins/recharge`、`/admins/recharge-channels`、`/admins/regions`、`/admins/rules`、`/admins/scheduler`、`/admins/settlements`、`/admins/team`、`/admins/users`、`/admins/wallets`、`/admins/withdraw`
- 用户后台：`/dashboard`、`/dashboard/api`、`/dashboard/commissions`、`/dashboard/notifications`、`/dashboard/orders`、`/dashboard/products`、`/dashboard/profits`、`/dashboard/recharge`、`/dashboard/settings`、`/dashboard/settlements`、`/dashboard/team`、`/dashboard/wallet`、`/dashboard/withdraw`
- 账号和内容：`/login`、`/signup`、`/reset-password`、`/rental`、`/blog`、`/blog/[id]`

### 构建备注

`npm.cmd run build` 构建成功，但仍输出 3 条 Recharts 容器 `width(-1)` / `height(-1)` 警告。后续图表组件重构时需要单独处理容器尺寸和 `ResponsiveContainer` 的稳定布局。

## 阶段 1：用户后台基础层

日期：2026-05-03

### 目标

统一用户后台 `/dashboard` 的基础壳层和部分共享展示组件，让后续页面重构可以继续沿用同一套 shadcn/ui 组件和语义 token。

### 修改范围

- `app/dashboard/layout.tsx`
- `components/dashboard/sidebar.tsx`
- `components/dashboard/header.tsx`
- `components/shared/PageHeader.tsx`
- `components/shared/MoneyText.tsx`
- `components/shared/DateTimeText.tsx`
- `components/shared/StatusIndicator.tsx`
- `components/shared/ConfirmActionButton.tsx`
- `components/shared/DetailDrawer.tsx`

### 使用的 shadcn/ui 组件

- `Button`
- `Input`
- `DropdownMenu`
- `DropdownMenuTrigger`
- `DropdownMenuContent`
- `DropdownMenuItem`
- `DropdownMenuLabel`
- `DropdownMenuSeparator`
- `Dialog`
- `DialogTrigger`
- `DialogContent`
- `DialogHeader`
- `DialogTitle`
- `DialogDescription`
- `DialogFooter`

### 具体改动

- 用户后台 layout 移除内联 `--admin-*` 样式，改用 shadcn/Tailwind 语义 token：`bg-background`、`text-foreground`。
- 用户后台侧边栏菜单项改为使用 shadcn `Button asChild` 组合 `Link`。
- 用户后台侧边栏修复菜单分组、菜单项和品牌标题中文文案。
- 用户后台顶部栏搜索框由原生 `<input>` 改为 shadcn `Input`。
- 用户后台顶部栏继续使用 shadcn `Button` 和 `DropdownMenu`，并修复用户菜单中文文案。
- 顶部栏页面标题改为从 `USER_NAV_ITEMS` 菜单配置中推导，减少 sidebar/header 文案重复。
- `PageHeader`、`MoneyText`、`DateTimeText`、`StatusIndicator` 移除对 `--admin-*` 变量的依赖，改用 `text-foreground`、`text-muted-foreground`、`text-primary`。
- `ConfirmActionButton` 统一使用 shadcn `Dialog` 默认语义样式，修复确认/取消文案。
- `DetailDrawer` 移除 `admin-card` 和 `--admin-*` 依赖，改用 `border-border`、`bg-background`、`bg-card`、`text-foreground` 等语义 token。

### 影响页面

本阶段主要影响用户后台壳层，因此所有 `/dashboard` 子页面都会受到 header/sidebar/layout 样式影响。

重点需要检查：

- `/dashboard`
- `/dashboard/products`
- `/dashboard/orders`
- `/dashboard/recharge`
- `/dashboard/settings`
- `/dashboard/notifications`
- `/dashboard/wallet`

### 需要检查的交互

- 用户后台侧边栏菜单跳转
- 当前菜单高亮
- 顶部栏页面标题
- 顶部栏搜索框视觉和焦点状态
- 亮色/暗色主题切换
- 通知入口跳转
- 用户头像下拉菜单
- 用户退出登录
- 使用 `DetailDrawer` 的详情抽屉
- 使用 `ConfirmActionButton` 的确认弹窗

### 验证记录

- `node_modules\.bin\eslint.cmd app\dashboard\layout.tsx components\dashboard\sidebar.tsx components\dashboard\header.tsx components\shared\PageHeader.tsx components\shared\MoneyText.tsx components\shared\DateTimeText.tsx components\shared\StatusIndicator.tsx components\shared\ConfirmActionButton.tsx components\shared\DetailDrawer.tsx`：通过
- `node_modules\.bin\tsc.cmd --noEmit --pretty false`：通过
- `npm run build`：通过
- `npm run lint`：未通过。失败来自仓库既有 lint 问题，主要包括 `@typescript-eslint/no-explicit-any`、未使用变量、`next/no-img-element`、React Hook 相关警告等；本阶段触碰文件的定向 eslint 已通过。

### 备注

- 运行 `npx tsc --noEmit --pretty false` 时被 PowerShell 执行策略拦截，因此改用 `node_modules\.bin\tsc.cmd --noEmit --pretty false`。
- `npm run build` 构建成功，但构建输出包含 Recharts 容器宽高为 `-1` 的既有运行期警告，后续图表页面重构时需要单独处理。

## 阶段 2：共享业务组件规范化

日期：2026-05-03

### 目标

优先收敛被后台和用户控制台复用的业务展示组件，把可替换的自绘 UI 迁移到 shadcn/ui 基础组件和语义 token，同时保持现有 props、数据结构和后端 API 数据来源不变。

### 修改范围

- `components/shared/DetailDrawer.tsx`
- `components/shared/SearchPanel.tsx`
- `components/shared/DataTable.tsx`
- `components/shared/StatsCard.tsx`
- `components/shared/StatusBadge.tsx`
- `components/shared/CopyableSecret.tsx`
- `components/shared/ConfirmActionButton.tsx`

### 使用的 shadcn/ui 组件

- `Drawer`
- `DrawerContent`
- `DrawerHeader`
- `DrawerTitle`
- `DrawerDescription`
- `Card`
- `CardContent`
- `Table`
- `TableHeader`
- `TableBody`
- `TableRow`
- `TableHead`
- `TableCell`
- `Badge`
- `Button`

### 具体改动

- `DetailDrawer` 从 portal + 原生 backdrop button 的自绘抽屉迁移为 shadcn `Drawer`，保留原有 `open`、`data`、`title`、`subtitle`、`sections`、`children`、`onClose` API，补齐 Drawer/Dialog 原语提供的关闭、可访问性和焦点管理能力。
- `SearchPanel` 改为 shadcn `Card` 承载，标题区域使用 shadcn `Button`，并让 `defaultCollapsed` 真正控制筛选区域展开/折叠。
- `DataTable` 保持现有泛型列定义、分页和虚拟滚动行为，统一到 shadcn `TableRow`、`TableCell` 与 `bg-card`、`text-card-foreground`、`border-border` 等语义 token。
- `StatsCard`、`StatusBadge`、`CopyableSecret` 移除局部灰色、品牌色硬编码，改用 shadcn 语义 token 和既有 `Badge`、`Button`。
- `ConfirmActionButton` 保持确认弹窗业务行为不变，仅补齐确认按钮图标间距。

### 后端数据约束

本阶段只调整共享展示组件和交互外壳，没有新增 mock 数据，没有替换页面级 API hooks，没有改变表格列渲染、详情字段映射、分页参数或提交 payload。

### 验证记录

- `npm.cmd run lint -- --quiet`：通过。
- `node_modules\.bin\tsc.cmd --noEmit --pretty false`：通过。
- `npm.cmd run build`：通过。
- `git diff --check`：通过，仅存在 Git 对 LF/CRLF 的工作区提示。

### 当前剩余问题

- `npm.cmd run lint` 仍有 96 条 warning，不阻塞命令退出；主要是未使用变量、`next/no-img-element`、React Hook 依赖和 Recharts 兼容性提示。
- `npm.cmd run build` 仍输出 3 条 Recharts 容器 `width(-1)` / `height(-1)` 警告，后续处理图表页面时需要单独修复容器尺寸。
- `/admins` 的 `--admin-*` 平行主题系统仍未迁移，这是后续阶段最大的系统性重构点。
