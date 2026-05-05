import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Activity,
  CircleCheck,
  Clock3,
  Gauge,
  Maximize2,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '托管 Kubernetes | 算力租赁',
  description: '面向生成式 AI 的托管 Kubernetes 服务，用于构建、训练和部署大规模 AI 应用。',
};

const cksAssets = {
  hero: '/videos/%E6%89%98%E7%AE%A1KBs/Kubernetes%20Management%20for%20GenAI%20CKS%20CoreWeave.mp4',
  cta: '/videos/%E6%89%98%E7%AE%A1KBs/10001.avif',
};

const generativeCards = [
  {
    title: '裸金属上的 Kubernetes',
    description:
      '移除虚拟化层，让团队直接使用裸金属节点，获得更好的节点性能、更低延迟、更清晰的可观测性和更快上线速度。',
  },
  {
    title: '面向 AI 的预配置集群',
    description:
      'CKS 集群预装网络、存储接口、GPU 驱动、Slurm-on-Kubernetes 与可观测性插件，让团队从第一天就能进入生产。',
  },
  {
    title: '紧密集成 AI 编排工具',
    description:
      '原生集成 Slurm、Kubeflow、KServe 等工作负载编排工具，让开发者把时间用于模型创新，而不是集群管理。',
  },
];

const performanceRows: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: '从 GPU 节点获得最大性能',
    description:
      'CKS 使用裸金属节点和 NVIDIA BlueField DPU 卸载节点与资源管理流程，帮助训练、实验和推理任务获得更稳定的 GPU 性能。',
    icon: Gauge,
  },
  {
    title: '超算级规模与性能',
    description:
      '基于 NVIDIA InfiniBand、集群级互联与面向 AI 的存储服务，支持跨 100K+ GPU 的集群扩展，同时保持高性能交付。',
    icon: Maximize2,
  },
  {
    title: '可靠性与韧性',
    description:
      '与任务控制和集群健康管理能力深度集成，减少日常中断并降低大规模集群运维开销。',
    icon: ShieldCheck,
  },
];

const securityCards = [
  {
    title: '通过 VPC 安全连接',
    description:
      '使用 VPC 网络和加密能力创建隔离的 CKS 集群，并通过 NVIDIA BlueField DPU 管理计算与存储资源连接。',
  },
  {
    title: '细粒度可观测性',
    description:
      '获得集群、节点和作业级指标，快速定位基础架构问题，并在问题影响工作负载前完成处理。',
  },
  {
    title: '把中断扼杀在萌芽',
    description:
      '自动健康检查持续运行在空闲节点上，识别潜在硬件问题并替换问题节点，降低对关键任务的影响。',
  },
];

const solutionCards: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: '释放 SUNK 的能力',
    description:
      '在 CKS 上运行 Slurm，让 Slurm 作业与容器化工作负载共用同一集群，提高工作负载弹性和资源利用率。',
    icon: Zap,
  },
  {
    title: '用 Tensorizer 缩短等待',
    description:
      'Tensorizer 将 AI 模型和张量序列化为单文件并从 HTTPS 或 S3 端点流式加载，缩短模型加载时间。',
    icon: Clock3,
  },
  {
    title: '结合任务控制做更多事',
    description:
      '任务控制在交付前确保 CKS 集群就绪，并持续监控基础架构健康，提升集群性能和恢复能力。',
    icon: Activity,
  },
];

function VideoVisual({ src, ariaLabel }: { src: string; ariaLabel: string }) {
  return (
    <video
      aria-label={ariaLabel}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className="h-full w-full object-contain"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

function CheckBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-current ${className}`}
      aria-hidden="true"
    >
      <CircleCheck className="h-6 w-6" />
    </span>
  );
}

export default function ManagedKubernetesPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="min-h-[720px] bg-[#f7f8fa]">
          <div className="mx-auto grid min-h-[720px] max-w-[1440px] items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.88fr_1fr] lg:px-16">
            <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
              <h1 className="text-5xl font-semibold leading-[1.03] tracking-[-0.05em] text-[#1f2530] sm:text-6xl lg:text-7xl">
                CoreWeave Kubernetes 服务
              </h1>
              <p className="mt-8 max-w-[600px] text-xl leading-8 text-[#1f2530] sm:text-2xl sm:leading-10">
                专为构建、训练和部署 AI 应用打造的托管 Kubernetes 环境。
              </p>
              <Button
                asChild
                className="mt-10 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">开始使用</Link>
              </Button>
            </div>
            <div className="mx-auto aspect-[1.02] w-full max-w-[620px] overflow-hidden rounded-[22px] bg-white lg:mx-0">
              <VideoVisual src={cksAssets.hero} ariaLabel="CoreWeave Kubernetes 服务动画" />
            </div>
          </div>
        </section>

        <section className="bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1240px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              面向生成式 AI 设计
            </h2>
            <p className="mx-auto mt-7 max-w-[960px] text-lg leading-8 text-white/86">
              大量 GPU 有效算力会被系统低效消耗。CKS 从底层围绕生成式 AI 构建，把 Kubernetes、裸金属、网络、存储和编排工具放在同一个高性能栈中。
            </p>

            <div className="mt-16 grid gap-7 lg:grid-cols-3">
              {generativeCards.map((card) => (
                <Card
                  key={card.title}
                  className="group min-h-[390px] rounded-[22px] border-0 bg-[#1a1a1a] text-white shadow-none transition-colors duration-300 hover:bg-[#2F45EE]"
                >
                  <CardContent className="flex h-full flex-col items-center justify-start px-8 py-12 text-center">
                    <CheckBadge className="text-white/85 transition-colors duration-300 group-hover:text-white" />
                    <h3 className="mt-10 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                      {card.title}
                    </h3>
                    <p className="mt-8 text-lg leading-8 text-white/58 transition-colors duration-300 group-hover:text-white">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#050505] px-5 text-white sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1220px] overflow-hidden border-t border-white/15 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="flex items-start justify-center border-white/15 px-6 py-16 lg:border-r lg:px-10 lg:py-20">
              <div className="w-full max-w-[560px]">
                <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
                  行业领先的性能、规模与韧性
                </h2>
                <p className="mt-8 text-lg leading-8 text-white/88">
                  在专为 AI 工作负载构建的环境中启动 GPU 超级集群，获得超低延迟、高速互联和人机协同自动化能力。
                </p>
              </div>
            </div>

            <div>
              {performanceRows.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="flex min-h-[180px] items-start gap-7 border-t border-white/15 px-6 py-9 first:border-t-0 lg:px-10 lg:py-12"
                  >
                    <Icon className="mt-1 h-9 w-9 shrink-0 text-white/75" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                        {feature.title}
                      </h3>
                      <p className="mt-5 max-w-[640px] text-base leading-7 text-white/55">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1240px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              企业级安全与可观测性
            </h2>
            <div className="mx-auto mt-8 max-w-[1040px] space-y-6 text-lg leading-8 text-black/86">
              <p>
                CKS 面向关键任务提供企业级安全和可观测性，让团队精确理解集群状态，并在工作负载中断后快速恢复。
              </p>
              <p>
                借助更细粒度的集群可见性，团队可以提升故障定位效率并最大化集群利用率。
              </p>
            </div>

            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {securityCards.map((card) => (
                <Card
                  key={card.title}
                  className="group min-h-[420px] overflow-hidden rounded-[22px] border-[#0b45f5] bg-transparent text-black shadow-none transition-colors duration-300 hover:border-[#2F45EE] hover:bg-[#2F45EE] hover:text-white"
                >
                  <CardContent className="flex h-full flex-col items-center p-10 text-center">
                    <CheckBadge className="text-black/82 transition-colors duration-300 group-hover:text-white" />
                    <h3 className="mt-9 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                      {card.title}
                    </h3>
                    <p className="mt-8 text-lg leading-8 text-black/62 transition-colors duration-300 group-hover:text-white">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1240px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              一整套解决方案栈
            </h2>
            <p className="mx-auto mt-7 max-w-[880px] text-lg leading-8 text-white/86">
              CKS 为 AI 工作负载而生，整合开发者需要的运行时、模型加载和集群管理能力，让 AI 应用构建与部署更快、更简单、更具成本效率。
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-[1220px] gap-10 border-t border-white/15 pt-16 lg:grid-cols-3">
            {solutionCards.map((card) => {
              const Icon = card.icon;

              return (
                <article key={card.title} className="text-center">
                  <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[8px] border border-[#2f45ee] text-white">
                    <Icon className="h-9 w-9" aria-hidden="true" />
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em]">
                    {card.title}
                  </h3>
                  <p className="mx-auto mt-6 max-w-[360px] text-lg leading-8 text-white/58">
                    {card.description}
                  </p>
                  <Link
                    href="/contact-sales"
                    className="mt-7 inline-flex items-center gap-2 text-base font-semibold text-[#1557ff] underline underline-offset-4 hover:text-[#5d84ff]"
                  >
                    了解更多
                    <span aria-hidden="true">-&gt;</span>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <Image
            src={cksAssets.cta}
            alt=""
            fill
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-right opacity-85"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#f7f8fa] via-[#f7f8fa]/92 to-[#f7f8fa]/20" />
          <div className="mx-auto max-w-[1220px]">
            <div className="max-w-[520px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#1f2530] sm:text-5xl">
                今天开始构建 CKS
              </h2>
              <p className="mt-8 text-xl leading-8 text-[#1f2530]/88">
                不要满足于为传统 Web 应用构建的 Kubernetes 平台。使用真正面向 AI 的平台。
              </p>
              <Button
                asChild
                className="mt-10 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">开始使用</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
