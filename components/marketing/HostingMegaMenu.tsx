'use client';

import Link from 'next/link';
import {
  Building2,
  CircleDollarSign,
  Server,
  Users,
  type LucideIcon
} from 'lucide-react';

import MarketingMegaMenu from './MarketingMegaMenu';

type HostingItem = {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const hostingItems: HostingItem[] = [
  {
    name: '托管',
    description: '发布 GPU 主机并获得客户、支持、账单和交易流',
    href: '/hosting',
    icon: Users
  },
  {
    name: '数据中心',
    description: '申请认证数据中心，获得信任标签和优先展示',
    href: '/data-center',
    icon: Building2
  },
  {
    name: '融资',
    description: '为 GPU 主机匹配融资与硬件采购支持',
    href: '/financing',
    icon: CircleDollarSign
  },
  {
    name: '硬件',
    description: '采购认证 GPU 服务器并预配置为平台可用状态',
    href: '/hardware',
    icon: Server
  }
];

export default function HostingMegaMenu() {
  return (
    <MarketingMegaMenu className="w-[620px] items-stretch">
      <main className="min-w-0 flex-1 p-6">
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            托管
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {hostingItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={false}
                className="group rounded-lg p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-muted p-1.5 text-foreground transition-colors group-hover:bg-background">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold leading-tight text-foreground">
                      {item.name}
                    </div>
                    <div className="mt-1 text-xs leading-snug text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <aside className="flex w-64 shrink-0 flex-col bg-muted/30 p-6">
        <div className="rounded-md bg-muted p-2 text-foreground">
          <Server className="h-4 w-4" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">
          硬件与资金支持
        </h3>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          从 GPU 服务器采购到融资方案，帮助团队更高效地完成资源准备。
        </p>
        <Link
          href="/hardware"
          prefetch={false}
          className="mt-auto text-xs font-semibold text-primary hover:underline"
        >
          查看硬件 →
        </Link>
      </aside>
    </MarketingMegaMenu>
  );
}
