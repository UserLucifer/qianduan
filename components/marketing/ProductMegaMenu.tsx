'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  ChevronRight,
  Cloud,
  Cpu,
  Database,
  Target,
  Zap,
  type LucideIcon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MarketingMegaMenu from './MarketingMegaMenu';

type ProductSubItem = {
  name: string;
  href: string;
  items?: string[];
};

type ProductCategory = {
  id: string;
  name: string;
  icon: LucideIcon;
  subItems: ProductSubItem[];
  featured: {
    title: string;
    description: string;
    image: string;
  };
};

const productCategories: ProductCategory[] = [
  {
    id: 'foundation',
    name: '基础架构',
    icon: Cpu,
    subItems: [
      { name: 'GPU 计算', href: '/gpu-computing', items: ['NVIDIA Blackwell', 'NVIDIA Hopper', 'NVIDIA Ada Lovelace'] },
      { name: 'CPU 计算', href: '#' },
      { name: '裸金属服务器', href: '#' },
      { name: '网络', href: '#' }
    ],
    featured: {
      title: '算力租赁荣获 SemiAnalysis 铂金级',
      description: '唯一两度获得铂金评级的 AI 云服务商，了解为何算力租赁是 AI 的核心云。',
      image: '/images/navagation/1.jpg'
    }
  },
  {
    id: 'data-storage',
    name: '数据与存储',
    icon: Database,
    subItems: [
      { name: 'AI 对象存储', href: '#' },
      { name: '专用 VAST 存储', href: '#' },
      { name: '分布式文件存储', href: '#' },
      { name: '本地存储', href: '#' }
    ],
    featured: {
      title: '零流出数据迁移 (0EM)',
      description: '免费、无锁定地将数据迁移到算力租赁，由专家引导传输至高性能 AI 对象存储。',
      image: '/images/navagation/2.jpg'
    }
  },
  {
    id: 'infrastructure-control',
    name: '基础架构控制',
    icon: Cloud,
    subItems: [
      { name: '托管 Kubernetes', href: '#' }
    ],
    featured: {
      title: '定义 AI 核心云',
      description: '探索算力租赁的 AI 核心云如何重新定义基础架构。',
      image: '/images/navagation/3.jpg'
    }
  },
  {
    id: 'runtime-acceleration',
    name: '运行加速',
    icon: Zap,
    subItems: [
      { name: 'SUNK', href: '#' },
      { name: 'SUNK Anywhere', href: '#' },
      { name: 'Serverless RL', href: '#' }
    ],
    featured: {
      title: 'MLPerf v5.0 测试结果',
      description: '算力租赁在 MLPerf 基准测试中持续刷新纪录，在 AI 训练与推理性能方面处于行业领先地位。',
      image: '/images/navagation/4.jpg'
    }
  },
  {
    id: 'model-agent-development',
    name: '模型与代理开发',
    icon: Target,
    subItems: [
      { name: '训练', href: '#' },
      { name: '微调', href: '#' },
      { name: '推理', href: '#' },
      { name: '监控', href: '#' }
    ],
    featured: {
      title: '算力租赁 ARENA',
      description: '在专用基础架构上运行真实的 AI 工作负载，在投入生产前验证性能、规模和成本。',
      image: '/images/navagation/5.avif'
    }
  },
  {
    id: 'mission-control',
    name: '任务控制',
    icon: Activity,
    subItems: [
      { name: 'Mission Control', href: '#' },
      { name: 'Fleet lifecycle controller', href: '#' },
      { name: 'Node lifecycle controller', href: '#' },
      { name: 'Observability', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'Tensorizer', href: '#' }
    ],
    featured: {
      title: 'Mission Control: 大型 AI 运行标准',
      description: 'Mission Control 将可观测性、安全审计可见性和自动化操作结合在一起，保持 AI 基础架构的可靠与透明。',
      image: '/images/navagation/6.jpg'
    }
  }
];

export default function ProductMegaMenu() {
  const [activeCategory, setActiveCategory] = useState(productCategories[0]);
  const ActiveIcon = activeCategory.icon;

  return (
    <MarketingMegaMenu className="w-[1080px] items-stretch">
      <aside className="w-64 shrink-0 border-r border-border/50 bg-muted/20 p-4">
        <div className="px-3 pb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            产品目录
          </h3>
        </div>
        <div className="flex flex-col gap-1">
          {productCategories.map((category) => {
            const Icon = category.icon;

            return (
              <Button
                key={category.id}
                type="button"
                variant="ghost"
                className={cn(
                  'h-auto w-full justify-start gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground',
                  activeCategory.id === category.id && 'bg-accent/60 text-foreground'
                )}
                onFocus={() => setActiveCategory(category)}
                onMouseEnter={() => setActiveCategory(category)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{category.name}</span>
                <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            );
          })}
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-muted p-2 text-foreground">
                <ActiveIcon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  {activeCategory.name}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  按能力选择云端算力、存储与运行控制模块。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {activeCategory.subItems.map((sub) => (
                <Link
                  key={sub.name}
                  href={sub.href}
                  prefetch={false}
                  className="group rounded-lg border border-transparent p-3 transition-colors hover:border-border/60 hover:bg-accent/50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      {sub.name}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </div>
                  {sub.items ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {sub.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs leading-snug text-muted-foreground">
                      查看相关规格与可用资源。
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <aside className="flex w-80 shrink-0 flex-col bg-muted/30 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory.id}-featured`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex h-full flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border/50">
              <Image
                src={activeCategory.featured.image}
                alt={activeCategory.featured.title}
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
            <div className="pt-5">
              <h4 className="text-sm font-semibold leading-snug text-foreground">
                {activeCategory.featured.title}
              </h4>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {activeCategory.featured.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </aside>
    </MarketingMegaMenu>
  );
}
