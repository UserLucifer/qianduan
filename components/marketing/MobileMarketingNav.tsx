'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Building2,
  Cpu,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Server,
  Settings,
  Sparkles,
  Workflow,
  X
} from 'lucide-react';

import { type UserMeResponse } from '@/api/user';
import { UserAvatar } from '@/components/shared/UserAvatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { getAvatarUrl } from '@/lib/avatars';

type MobileMarketingNavProps = {
  user: UserMeResponse | null;
  onLogout: () => void;
};

const navGroups = [
  {
    title: '产品',
    icon: Cpu,
    items: [
      { name: 'GPU 计算', href: '/gpu-computing', description: '浏览 GPU 实例和算力规格' },
      { name: '租赁', href: '/rental', description: '按需选择可用资源并下单' },
      { name: '基础架构控制', href: '#', description: '托管集群、网络和运行控制' },
      { name: '数据与存储', href: '#', description: '对象存储与高性能数据路径' }
    ]
  },
  {
    title: '产品用例',
    icon: Sparkles,
    items: [
      { name: 'AI 文本生成', href: '/use-cases/ai-text-generation', description: '内容、知识库与文本任务' },
      { name: 'AI 图像+视频生成', href: '/use-cases/ai-image-video-generation', description: 'AIGC 批量生成工作流' },
      { name: '人工智能代理', href: '/use-cases/ai-agents', description: '智能体任务执行与编排' },
      { name: '全部用例', href: '/use-cases', description: '查看完整用例列表' }
    ]
  },
  {
    title: '解决方案',
    icon: Workflow,
    items: [
      { name: '大模型训练', href: '/solutions/llm-training', description: '裸金属 GPU 集群' },
      { name: '高并发推理', href: '/solutions/high-concurrency-inference', description: '低延迟弹性 API 部署' },
      { name: 'AIGC 初创企业', href: '/solutions/aigc-startups', description: '面向初创团队的资源方案' },
      { name: '企业解决方案', href: '/enterprise', description: '专属网络、存储和支持' }
    ]
  },
  {
    title: '公司',
    icon: Building2,
    items: [
      { name: '关于我们', href: '/about', description: '团队、使命和平台方向' },
      { name: '可持续发展', href: '/sustainability', description: '能源效率与长期责任' },
      { name: '企业解决方案', href: '/enterprise', description: '为大型团队定制资源' }
    ]
  }
];

const directLinks = [
  { name: '租赁', href: '/rental', icon: Server },
  { name: '博客', href: '/blog', icon: BookOpen },
  { name: '帮助中心', href: '/help-center', icon: HelpCircle },
  { name: '企业咨询', href: '/enterprise', icon: Building2 }
];

export default function MobileMarketingNav({
  user,
  onLogout
}: MobileMarketingNavProps) {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    closeMenu();
    onLogout();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="打开导航菜单"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="inset-0 flex h-[100dvh] w-screen max-w-none flex-col border-0 bg-zinc-900 p-0 text-white shadow-none sm:max-w-none lg:hidden [&>button]:hidden"
      >
        <SheetTitle className="sr-only">移动端导航</SheetTitle>
        <SheetDescription className="sr-only">
          打开产品、产品用例、解决方案、公司和账户入口。
        </SheetDescription>

        <div className="flex h-20 shrink-0 items-center justify-between px-8">
          <Link
            href="/"
            onClick={closeMenu}
            className="text-xl font-bold text-white"
          >
            算力租赁
          </Link>
          <SheetClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-11 w-11 text-white hover:bg-white/10 hover:text-white"
              aria-label="关闭导航菜单"
              onClick={closeMenu}
            >
              <X className="h-6 w-6" />
            </Button>
          </SheetClose>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-10 pb-8 pt-1">
          <div className="space-y-3 pb-8">
            {user ? (
              <Button
                asChild
                variant="outline"
                className="h-12 w-full border-white/20 bg-transparent text-base font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/dashboard" onClick={closeMenu}>
                  控制面板
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="h-12 w-full border-white/20 bg-transparent text-base font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/login" onClick={closeMenu}>
                  登录
                </Link>
              </Button>
            )}
          </div>

          <Accordion type="single" collapsible className="w-full border-0">
            {navGroups.map((group) => {
              return (
                <AccordionItem
                  key={group.title}
                  value={group.title}
                  className="border-b-0"
                >
                  <AccordionTrigger className="min-h-12 py-3 text-lg font-semibold text-white hover:no-underline [&>svg]:text-white/80">
                    {group.title}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-1 pb-4">
                    {group.items.map((item) => (
                      <Link
                        key={`${group.title}-${item.name}`}
                        href={item.href}
                        prefetch={false}
                        onClick={closeMenu}
                        className="block rounded-lg px-3 py-3 transition-colors hover:bg-white/10"
                      >
                        <span className="block text-sm font-semibold text-white">
                          {item.name}
                        </span>
                        <span className="mt-1 block text-xs leading-snug text-white/60">
                          {item.description}
                        </span>
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="mt-4 space-y-2 border-t border-white/10 pt-8">
            {directLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={false}
                  onClick={closeMenu}
                  className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-lg font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Icon className="h-4 w-4 text-white/60" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {user && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 pb-4">
                <UserAvatar
                  src={getAvatarUrl(user.avatarKey)}
                  name={user.userName}
                  className="h-10 w-10 shrink-0 border border-white/15"
                />
                <div className="min-w-0">
                  <p className="truncate text-xs text-white/50">{user.email}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-white">
                    {user.userName || "未命名用户"}
                  </p>
                </div>
              </div>
              <Button
                asChild
                variant="ghost"
                className="h-11 w-full justify-start text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/dashboard" onClick={closeMenu}>
                  <LayoutDashboard className="h-4 w-4" />
                  控制面板
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="h-11 w-full justify-start text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/dashboard/settings" onClick={closeMenu}>
                  <Settings className="h-4 w-4" />
                  账户设置
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-11 w-full justify-start text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                退出登录
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
