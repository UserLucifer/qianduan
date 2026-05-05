'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  Leaf,
  type LucideIcon
} from 'lucide-react';

import MarketingMegaMenu from './MarketingMegaMenu';

type CompanyItem = {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const companyItems: CompanyItem[] = [
  { name: '关于我们', description: '了解团队、使命和算力基础设施方向', href: '/about', icon: Building2 },
  { name: '可持续发展', description: '查看能源效率和长期运营责任', href: '/sustainability', icon: Leaf },
  { name: '企业解决方案', description: '为大型团队定制网络、存储与支持', href: '/enterprise', icon: BriefcaseBusiness },
  { name: '融资', description: '为 GPU 主机匹配融资与硬件采购支持', href: '/financing', icon: CircleDollarSign }
];

export default function CompanyMegaMenu() {
  return (
    <MarketingMegaMenu className="w-[660px] items-stretch">
      <main className="min-w-0 flex-1 p-6">
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            公司
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {companyItems.map((item) => {
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
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          合作咨询
        </h3>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          需要面向团队的专属资源池、网络隔离或采购支持，可以直接发起企业咨询。
        </p>
        <Link
          href="/contact"
          prefetch={false}
          className="mt-auto inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
        >
          联系我们
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </aside>
    </MarketingMegaMenu>
  );
}
