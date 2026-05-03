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

## 阶段 3：管理后台壳层主题收敛

日期：2026-05-03

### 目标

先把 `/admins` 的 layout/header/sidebar 从独立 `--admin-*` 主题变量和 `.admin-*` 类中解耦，统一到 shadcn/ui 语义 token，为后续逐页迁移管理后台页面降低阻力。

### 修改范围

- `app/admins/layout.tsx`
- `components/admin/header.tsx`

`components/admin/sidebar.tsx` 已经基本使用 `bg-background`、`border-border`、`text-muted-foreground`、`Button/Link` 组合和 lucide 图标，本阶段未做代码改动。

### 使用的 shadcn/ui 组件

- `Button`
- `Input`
- `DropdownMenu`
- `DropdownMenuTrigger`
- `DropdownMenuContent`
- `DropdownMenuItem`
- `Avatar`
- `AvatarFallback`

### 具体改动

- `/admins` layout 移除内联注入的 `--admin-*` 变量、`.admin-shell`、`.admin-header`、`.admin-search`、`.admin-user-chip`、`.admin-nav-*` 等旧主题类。
- `/admins` layout 外壳改用 `bg-background`、`text-foreground`、`selection:bg-primary/30`，主内容间距改为响应式 `p-4 sm:p-6 lg:p-8`。
- 修正管理后台窄屏布局：主内容左边距从固定 `pl-64` 改为 `lg:pl-64`，避免 sidebar 在 `lg` 以下隐藏后仍挤压页面。
- 保留隐藏 Salesmartly 客服组件和 View Transition 兼容样式，不再把这些样式作为一套后台主题系统。
- 管理后台 header 移除原生搜索 `<input>` 和自绘用户下拉菜单，改用 shadcn `Input`、`DropdownMenu`、`Avatar` 和 `Button`。
- header 面包屑、图标按钮、通知点、用户头像和主题切换统一使用 `border-border`、`bg-muted`、`text-muted-foreground`、`text-primary` 等语义 token。

### 后端数据约束

本阶段没有修改任何 `api/*` 方法、页面级 hooks、请求参数、登录 token 写入规则或后端返回数据映射。`AdminHeader` 仍通过 `getAdminMe()` 读取真实管理员信息，通过 `adminLogout()` 调用真实退出接口。

### 验证记录

- `node_modules\.bin\eslint.cmd app\admins\layout.tsx components\admin\header.tsx components\admin\sidebar.tsx`：通过，仅曾发现并已修复 `catch` 未使用变量 warning。
- `npm.cmd run lint -- --quiet`：通过。
- `node_modules\.bin\tsc.cmd --noEmit --pretty false`：通过。
- `npm.cmd run build`：通过。

### 当前剩余问题

- `--admin-*` 使用量从阶段 2 后的 128 处降到 70 处，剩余主要集中在 `/admins` 页面和 `components/admin/*` 表单内部，留到阶段 4 逐页清理。
- `npm.cmd run build` 仍输出 3 条 Recharts 容器 `width(-1)` / `height(-1)` 警告，和本阶段壳层改动无关。
- 本阶段没有做浏览器视觉回归截图；需要后端登录态可用后重点检查 `/admins/dashboard`、`/admins/users`、`/admins/orders`、`/admins/scheduler` 的 header、侧边栏、主题切换和移动端布局。

## 阶段 4：管理后台页面旧 UI 清理

日期：2026-05-03

### 目标

在阶段 3 壳层收敛后，继续清理 `/admins` 页面和 `components/admin/*` 表单内部的旧主题变量、硬编码主色和原生控件，让管理后台页面层统一使用 shadcn/ui 基础组件与语义 token。

### 修改范围

- `/admins` 页面：`config`、`content`、`gpu`、`management`、`models`、`notifications`、`orders`、`products`、`profits`、`recharge`、`recharge-channels`、`regions`、`rules`、`scheduler`、`users`、`wallets`、`withdraw`
- 管理后台表单组件：`BlogManagers`、`BlogPostForm`、`CatalogForms`、`NotificationForms`、`RechargeForms`

### 具体改动

- 清理页面和表单中的 `--admin-*`、`bg-[var(...)]`、`text-[var(...)]`、`border-[var(...)]`。
- 页面操作按钮、Dialog、Card、TabsList、Badge、表单说明文字统一改用 `Button` 默认 variant 和 `bg-card`、`border-border`、`text-muted-foreground`、`text-primary` 等 shadcn 语义 token。
- `BlogManagers` 的状态/编辑小图标从原生 `<button>` 改为 shadcn `Button`。
- `recharge`、`withdraw` 审核拒绝原因输入框从原生 `<textarea>` 改为 shadcn `Textarea`。
- `config` 配置分组切换从原生 `<button>` 改为 shadcn `Button`，保留原有分组切换行为。

### 后端数据约束

本阶段没有修改任何 `api/*` 方法，没有替换 `usePaginatedResource` loader，没有改查询参数、详情字段映射、审核动作、创建/更新 payload 或 token 存取逻辑。所有表格、详情、表单提交仍走既有后端接口。

### 验证记录

- `/admins` 与 `components/admin` 下旧 UI 扫描：`--admin-* = 0`，`bg/text/border-[var(...)] = 0`，原生 `<button>/<input>/<textarea> = 0`。
- `npm.cmd run lint -- --quiet`：通过。
- `node_modules\.bin\tsc.cmd --noEmit --pretty false`：通过。
- `git diff --check`：通过，仅存在 Git 对 LF/CRLF 的工作区提示。
- `npm.cmd run build`：通过。

### 当前剩余问题

- `npm.cmd run build` 仍输出 3 条 Recharts 容器 `width(-1)` / `height(-1)` 警告，和本阶段页面 token 清理无关。
- `components/ui/multi-select.tsx` 仍有一处 `text-[var(...)]`，它属于通用 UI 组件而非 `/admins` 页面层，建议后续单独纳入共享组件清理。
- 本阶段没有改 `window.prompt` 的分类/标签重命名交互；虽然不再阻塞 shadcn token 收敛，但后续可迁移为 `Dialog` 表单提升一致性。

## 阶段 5：用户后台页面重构与生产验证

日期：2026-05-03

### 目标

以用户后台的核心业务路径为主线，优先保障用户能顺畅完成资产查看、产品选购、充值付款、API 凭证查看、收益查看和提现申请。页面 UI 继续收敛到 shadcn/ui 基础组件、lucide 图标和语义 token，同时确认数据来源仍为真实后端接口。

### 修改范围

- 用户后台外壳：`app/dashboard/layout.tsx`
- 用户后台首页：`app/dashboard/page.tsx`
- 关键业务页：`products`、`recharge`、`api`、`profits`、`settlements`、`withdraw`、`notifications`、`team`
- 用户后台图表组件：`components/dashboard/revenue-chart.tsx`、`components/dashboard/stats-cards.tsx`
- 本地 API 配置：`.env.local`

### 具体改动

- 修正用户后台移动端布局：`pl-64` 改为 `lg:pl-64`，主内容 padding 改为 `p-4 sm:p-6 lg:p-8`，避免 sidebar 在移动端隐藏后内容仍被 256px 左边距推偏。
- 产品选购页将地区、GPU、AI 模型、租赁周期等选择入口统一为 shadcn `Button`，移除原生 `<button>` 和硬编码主色；保留 `getProducts`、`getGpuModels`、`getAiModels`、`createRentalOrder`、`estimateRental`、`payRentalOrder` 等真实后端调用。
- 充值页将快捷金额、渠道卡片和确认按钮统一到 shadcn `Button/Input` 与 `Card` token，优化选中态对比度；保留 `getRechargeChannels`、`createRechargeOrder`、`cancelRechargeOrder`、`getRechargeOrderDetail` 等真实后端调用。
- 用户首页资产中心、API 状态、快捷入口和收益图表去除旧灰/白/紫直写样式，改用 `bg-card`、`bg-muted`、`text-muted-foreground`、`text-primary`、`border-border`、`destructive` 等 shadcn 语义 token。
- API、收益、提现、结算、通知、团队等页面同步清理旧 hover 背景、面板背景、分页容器和图表 inline 颜色。
- `.env.local` 将 `NEXT_PUBLIC_API_BASE_URL` 明确指向 `http://localhost:8080`，避免浏览器端 Axios 使用空 `baseURL` 请求前端站点自身。

### 后端数据约束

本阶段没有新增 mock 数据，没有把页面数据替换为静态数组，也没有改动请求 payload 或后端字段映射。扫描 `app/dashboard` 与 `components/dashboard` 未发现 `mock/MOCK/dummy/fake/模拟` 数据源；用户后台页面仍通过 `@/api/*`、`useAsyncResource`、`usePaginatedResource` 和既有 Axios 客户端访问后端。

### 验证记录

- 用户后台旧 UI 扫描：`--admin-*`、`bg/text/border-[var(...)]`、`bg/text/border-[#...]`、原生 `<button>/<input>/<textarea>`、`window.prompt`、旧图表色值均为 0。
- `npm.cmd run lint -- --quiet`：通过。
- `node_modules\.bin\tsc.cmd --noEmit --pretty false`：通过。
- `git diff --check`：通过，仅存在 Git 对 LF/CRLF 的工作区提示。
- `npm.cmd run build`：通过。
- `Invoke-WebRequest http://localhost:8080/swagger-ui/index.html`：200，确认本地后端 Swagger 可访问。
- `Invoke-WebRequest http://localhost:3000/dashboard/products`、`/dashboard/recharge`：200。
- Playwright Chromium 截图 smoke：`/dashboard`、`/dashboard/products`、`/dashboard/recharge` 桌面视口成功；同三条路由 390x844 移动视口成功。

### 当前剩余问题

- 未提供真实用户登录态，Playwright 访问受保护用户后台路由时会按预期跳转到登录页；因此本阶段只能完成路由渲染/登录保护/移动端外壳 smoke，不能替代登录后的真实下单、充值提交、提现提交端到端测试。
- 当前运行中的前端 dev server 需要重启后才会读取新的 `.env.local` API 地址。
- `npm.cmd run build` 仍输出 3 条 Recharts 容器 `width(-1)` / `height(-1)` 警告，构建成功但建议后续单独处理图表容器尺寸。
