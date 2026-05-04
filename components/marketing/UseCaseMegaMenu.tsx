'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Boxes,
  Code2,
  DatabaseZap,
  FileText,
  ImageIcon,
  Mic,
  MonitorCog,
  SlidersHorizontal,
  type LucideIcon
} from 'lucide-react';

import MarketingMegaMenu from './MarketingMegaMenu';

type UseCaseItem = {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const useCaseItems: UseCaseItem[] = [
  { name: 'AI 文本生成', description: '面向客服、内容和知识库生成', href: '/use-cases/ai-text-generation', icon: FileText },
  { name: 'AI 图像+视频生成', description: '批量生成与创意制作', href: '/use-cases/ai-image-video-generation', icon: ImageIcon },
  { name: '人工智能代理', description: '多步骤任务编排与执行', href: '/use-cases/ai-agents', icon: Bot },
  { name: 'AI 微调', description: '领域模型快速适配', href: '/use-cases/ai-fine-tuning', icon: SlidersHorizontal },
  { name: '批量数据处理', description: '高吞吐离线任务处理', href: '/use-cases/batch-data-processing', icon: DatabaseZap },
  { name: '音频转文本转录', description: '语音识别与内容归档', href: '/use-cases/audio-to-text-transcription', icon: Mic },
  { name: '虚拟计算', description: '弹性工作站与远程桌面', href: '/use-cases/virtual-computing', icon: MonitorCog },
  { name: 'GPU 编程', description: 'CUDA 开发与性能调优', href: '/use-cases/gpu-programming', icon: Code2 },
  { name: '图形渲染', description: '渲染农场和 3D 制作', href: '/use-cases/3d-rendering', icon: Boxes }
];

export default function UseCaseMegaMenu() {
  return (
    <MarketingMegaMenu className="w-[820px] items-stretch">
      <main className="min-w-0 flex-1 p-6">
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            产品用例
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {useCaseItems.map((item) => {
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
          工作负载地图
        </h3>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          从生成式 AI 到图形渲染，按实际工作负载选择合适的 GPU 资源和部署方式。
        </p>
        <Link
          href="/use-cases"
          prefetch={false}
          className="mt-auto inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
        >
          查看全部用例
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </aside>
    </MarketingMegaMenu>
  );
}
