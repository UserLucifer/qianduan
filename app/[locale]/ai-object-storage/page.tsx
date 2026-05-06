import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from "@/i18n/navigation";
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  BadgeCheck,
  CircleCheck,
  CircleX,
  Clock3,
  Database,
  DollarSign,
  LockKeyhole,
  Maximize2,
  Network,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI 对象存储 | 算力租赁',
  description: '面向 AI 工作负载的高性能、安全、可靠对象存储，支持训练、微调、推理与大规模数据迁移。',
};

const storageAssets = {
  hero: '/videos/Ai对象存储/hero视频.mp4',
  objectStorage: '/videos/Ai对象存储/CoreWeave AI Object Storage模块视频.mp4',
  distributedFile: '/videos/Ai对象存储/Distributed%20file%20storage%E7%9A%84%E5%9B%BE%E7%89%87.avif',
  localStorage: '/videos/Ai对象存储/底部视频.mp4',
  ctaBackground: '/videos/Ai对象存储/底部背景图.avif',
};

const aiStorageFeatures: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: '尽快将数据送入 GPU',
    description: 'GenAI 模型需要大量数据，也需要更快的数据供给。以可靠、低摩擦的方式处理大规模数据集，缩短训练等待时间。',
    icon: Database,
  },
  {
    title: '从中断处继续',
    description: '通过关键结果检查点减少硬件中断后的延迟，让团队在恢复后继续沿着原有进度推进。',
    icon: Clock3,
  },
  {
    title: '获得顶级可靠性',
    description: '自动快照、恢复与保留策略帮助生产任务保持连续；存储与计算分离，让数据更容易移动和追踪。',
    icon: ShieldCheck,
  },
  {
    title: '保持安全',
    description: '传输中和静态数据均可加密，并结合访问管理、认证与基于角色的策略保护关键数据。',
    icon: LockKeyhole,
  },
];

const objectStorageSteps = [
  {
    title: '本地对象传输加速器（LOTA）',
    description: '通过在 GPU 节点侧缓存数据，让对象数据更贴近 GPU，提供最高 7GB/s/GPU 的近本地吞吐，降低延迟并提升集群利用率。',
  },
  {
    title: '自动化、按用量计费',
    description: '将低频数据以更低成本保存，同时在需要时即时访问。无需手动分层或多套 API，计费清晰可预测。',
  },
  {
    title: '跨区域与跨云统一数据',
    description: '访问单一全局数据集，无需复制即可简化操作、降低成本，并让 GPU 资源保持高效利用。',
  },
];

const objectStorageCards: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: '行业领先性能',
    description: '通过最高 7GB/s/GPU 的吞吐，让计算资源持续保持高利用率。',
    icon: Zap,
  },
  {
    title: '简化扩展',
    description: '一个全局数据集和完整可观测工具，让不同位置的工作负载更轻松扩展。',
    icon: Maximize2,
  },
  {
    title: '更低总拥有成本',
    description: '对低频数据采用自动化按用量计费，减少不必要的迁移和复制成本。',
    icon: DollarSign,
  },
  {
    title: '企业级可靠性',
    description: '支持认证、持久性、可用性与静态及传输中加密，保护关键 AI 工作负载。',
    icon: LockKeyhole,
  },
];

const migrationRows = [
  '主流云厂商数据迁移',
  '全托管迁移',
  '端到端校验',
  '无需关闭账号',
  '专家直连支持',
  '无流出费用',
  '无厂商锁定',
  '无退出惩罚',
];

const distributedCards: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: '为 AI 构建的网络',
    description: '高性能、超低延迟网络架构从底层开始服务于 GenAI 数据访问，让训练、部署和推理获得所需速度。',
    icon: Network,
  },
  {
    title: '战略级合作',
    description: '与 VAST 的合作帮助我们管理并保护海量数据，同时满足多实例共享访问所需的 POSIX 语义。',
    icon: BadgeCheck,
  },
  {
    title: '大规模极速访问',
    description: '使用 PB 级共享文件系统，以最高 1GB/s/GPU 的能力支持大型 GPU 集群。',
    icon: Zap,
  },
];

function VideoVisual({
  src,
  ariaLabel,
  className = '',
}: {
  src: string;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <video
      aria-label={ariaLabel}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className={`h-full w-full object-contain ${className}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

function FeatureRows({
  features,
}: {
  features: Array<{ title: string; description: string; icon: LucideIcon }>;
}) {
  return (
    <div>
      {features.map((feature) => {
        const Icon = feature.icon;

        return (
          <article
            key={feature.title}
            className="flex min-h-[150px] items-start gap-6 border-t border-white/15 px-6 py-8 first:border-t-0 lg:px-10"
          >
            <Icon className="mt-1 h-8 w-8 shrink-0 text-white/72" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                {feature.title}
              </h3>
              <p className="mt-4 max-w-[620px] text-base leading-7 text-white/55">
                {feature.description}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function MigrationCard({
  title,
  price,
  variant,
}: {
  title: string;
  price: string;
  variant: 'primary' | 'legacy';
}) {
  const isPrimary = variant === 'primary';

  return (
    <Card
      className={
        isPrimary
          ? 'rounded-[24px] border-0 bg-white text-black shadow-none'
          : 'rounded-[24px] border-0 bg-[#777687] text-white shadow-none'
      }
    >
      <CardContent className="p-8 sm:p-9">
        <h3 className="text-3xl font-semibold leading-tight tracking-[-0.04em]">
          {title}
        </h3>
        <p className="mt-7 text-lg leading-none">
          <span className={isPrimary ? 'text-3xl text-[#0b45f5]' : 'text-3xl text-white'}>
            {price}
          </span>
          <span className={isPrimary ? 'ml-2 text-sm text-black' : 'ml-2 text-sm text-white'}>
            流出费用
          </span>
        </p>
        <ul className="mt-8 space-y-0">
          {migrationRows.map((row, index) => {
            const enabled = isPrimary || index < 3;
            const Icon = enabled ? CircleCheck : CircleX;

            return (
              <li
                key={row}
                className={
                  isPrimary
                    ? 'flex items-start gap-4 border-t border-black/12 py-4 first:border-t-0'
                    : 'flex items-start gap-4 border-t border-white/18 py-4 first:border-t-0'
                }
              >
                <Icon
                  className={
                    enabled
                      ? 'mt-0.5 h-5 w-5 shrink-0 fill-[#0b45f5] text-white'
                      : 'mt-0.5 h-5 w-5 shrink-0 fill-white/45 text-white'
                  }
                  aria-hidden="true"
                />
                <span className={isPrimary ? 'text-base leading-6 text-black' : 'text-base leading-6 text-white'}>
                  {row}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function AiObjectStoragePage() {
  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="min-h-[650px] bg-[#f7f8fa]">
          <div className="mx-auto grid min-h-[650px] max-w-[1440px] items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.82fr_1fr] lg:px-16">
            <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
              <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#1f2530] sm:text-6xl lg:text-7xl">
                AI 对象存储
              </h1>
              <p className="mt-7 max-w-[620px] text-xl leading-8 text-[#1f2530] sm:text-2xl sm:leading-10">
                为 AI 提供高性能、安全、可靠的存储能力。
              </p>
            </div>
            <div className="mx-auto aspect-[1.45] w-full max-w-[720px] lg:mx-0">
              <VideoVisual src={storageAssets.hero} ariaLabel="AI 对象存储首屏动画" />
            </div>
          </div>
        </section>

        <section className="bg-[#050505] px-5 text-white sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1220px] overflow-hidden lg:grid-cols-[0.82fr_1.18fr]">
            <div className="flex items-start justify-center border-white/15 px-6 py-16 lg:border-r lg:px-10 lg:py-20">
              <div className="w-full max-w-[520px]">
                <h2 className="text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl sm:tracking-[-0.04em]">
                  为 AI 工作负载量身打造
                </h2>
                <div className="mt-8 space-y-6 text-lg leading-8 text-white/88">
                  <p>不要让存储性能拖慢集群。</p>
                  <p>为容器化工作负载和虚拟服务器获得更高吞吐、更低延迟的数据访问能力。</p>
                </div>
              </div>
            </div>
            <FeatureRows features={aiStorageFeatures} />
          </div>
        </section>

        <section className="border-y border-black/15 bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1180px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              CoreWeave AI 对象存储
            </h2>
            <p className="mx-auto mt-7 max-w-[820px] text-lg leading-8 text-black/82">
              以 AI 原生对象存储更快、更可靠地训练、微调和部署模型，减少复制成本与性能取舍。
            </p>
            <Button
              asChild
              className="mt-8 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
            >
              <Link href="/contact-sales">了解如何运行</Link>
            </Button>

            <div className="mt-24 grid items-center gap-14 text-left lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <div className="aspect-[1.05] overflow-hidden border border-black/30 bg-white">
                <VideoVisual
                  src={storageAssets.objectStorage}
                  ariaLabel="CoreWeave AI 对象存储模块动画"
                />
              </div>

              <div className="space-y-16">
                {objectStorageSteps.map((step) => (
                  <article key={step.title} className="flex items-start gap-8">
                    <div className="flex h-28 w-12 shrink-0 items-center justify-center rounded-full border border-black text-black">
                      <CircleCheck className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {step.title}
                      </h3>
                      <p className="mt-6 max-w-[620px] text-lg leading-8 text-black/62">
                        {step.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {objectStorageCards.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Card
                    key={feature.title}
                    className="min-h-[310px] rounded-[18px] border-[#0b45f5] bg-transparent shadow-none"
                  >
                    <CardContent className="flex h-full flex-col items-center p-9 text-center">
                      <Icon className="h-9 w-9 text-black/70" aria-hidden="true" />
                      <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {feature.title}
                      </h3>
                      <p className="mt-8 text-base leading-7 text-black/64">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#eef0f3] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1160px] items-start gap-12 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="max-w-[520px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                零流出数据迁移（0EM）
              </h2>
              <p className="mt-8 text-lg leading-8 text-black/84">
                0EM 计划显著降低大规模数据迁移的成本和复杂度，帮助你直接从任意主流云迁移至 AI 对象存储，无流出费用、无退出惩罚，并尽量降低对创新节奏的影响。
              </p>
              <Button
                asChild
                className="mt-9 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">了解更多</Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <MigrationCard title="算力租赁 0EM 计划" price="$0.00/GB" variant="primary" />
              <MigrationCard title="传统超大云厂商" price="最高 $0.12/GB" variant="legacy" />
            </div>
          </div>
        </section>

        <section
          id="distributed-file-storage"
          className="scroll-mt-24 bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1220px]">
            <div className="grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <div>
                <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                  分布式文件存储
                </h2>
                <p className="mt-8 max-w-[620px] text-lg leading-8 text-white/82">
                  分布式文件存储帮助集中化管理资产，支撑 GenAI 所需的并行计算和共享数据访问。
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Button
                    asChild
                    className="h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
                  >
                    <Link href="/benchmarks">查看基准测试</Link>
                  </Button>
                  <Button
                    asChild
                    className="h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
                  >
                    <Link href="/contact-sales">优化存储</Link>
                  </Button>
                </div>
              </div>

              <div
                role="img"
                aria-label="分布式文件存储示意图"
                className="aspect-[1.06] overflow-hidden rounded-[24px] bg-white bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url("${storageAssets.distributedFile}")` }}
              />
            </div>

            <div className="mt-20 grid gap-7 lg:grid-cols-3">
              {distributedCards.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Card
                    key={feature.title}
                    className="min-h-[360px] rounded-[18px] border-[#0b45f5] bg-transparent text-white shadow-none"
                  >
                    <CardContent className="flex h-full flex-col items-center justify-start p-10 text-center">
                      <Icon className="h-9 w-9 text-white/62" aria-hidden="true" />
                      <h3 className="mt-10 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {feature.title}
                      </h3>
                      <p className="mt-8 text-lg leading-8 text-white/58">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="local-storage"
          className="scroll-mt-24 bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16"
        >
          <div className="mx-auto grid max-w-[1180px] items-center gap-16 lg:grid-cols-[0.9fr_1fr] lg:gap-20">
            <div className="max-w-[580px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                本地存储
              </h2>
              <div className="mt-8 space-y-7 text-lg leading-8 text-black/88">
                <p>
                  Kubernetes 方案让客户可以访问本地存储。根据节点类型不同，支持最高 60TB 的临时本地存储。
                </p>
                <p>
                  所有物理节点均提供 SSD 或 NVMe 临时本地存储，无需额外创建卷声明即可在容器文件系统内写入。
                </p>
                <p>这些能力无需额外成本。</p>
              </div>
            </div>

            <div className="aspect-[1.05] overflow-hidden bg-white">
              <VideoVisual src={storageAssets.localStorage} ariaLabel="本地存储动画" />
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] px-6 py-14 sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1220px] gap-8 rounded-[22px] bg-black p-8 text-white lg:grid-cols-[0.98fr_1.02fr] lg:p-12">
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-20 w-20 rotate-45 rounded-[18px] border-[18px] border-white" />
                <p className="mt-12 text-6xl font-semibold tracking-[-0.04em]">WEKA</p>
              </div>
            </div>

            <div className="rounded-[20px] bg-white p-8 text-black sm:p-10 lg:p-12">
              <p className="text-lg font-semibold tracking-[0.08em] text-black/58">Featured</p>
              <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.04em]">
                NeuralMesh™ by WEKA®
              </h2>
              <p className="mt-2 text-xl font-semibold leading-7">
                面向高要求 AI 工作负载的高 IOPS 存储
              </p>
              <div className="mt-10 space-y-8 text-lg leading-8 text-black/86">
                <p>
                  Checkpoint、小文件、元数据密集型流水线都需要稳定低延迟。NeuralMesh 在高负载下仍能提供一致性能，适配需要 POSIX 语义和极高 IOPS 的分布式训练与数据密集型推理。
                </p>
                <p>
                  专用 NeuralMesh 集群提供完整租户隔离、专用加密密钥和 GPU 同位置部署，适合与 Kubernetes 工作流原生集成。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-[#101010] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28">
          <Image
            src={storageAssets.ctaBackground}
            alt=""
            fill
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-88"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/74 to-black/20" />
          <div className="mx-auto max-w-[1180px]">
            <div className="max-w-[680px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                面向 AI 的专用存储
              </h2>
              <p className="mt-7 max-w-[620px] text-lg leading-8 text-white/78">
                让计算、网络与存储协同运行，支撑 GenAI 的未来工作负载。
              </p>
              <Button
                asChild
                className="mt-9 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">了解方案</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-[#34333a] px-6 py-12 text-center text-white/68 sm:px-10">
          <p className="mx-auto max-w-[860px] text-base leading-7">
            *可根据存储合同价值，免费完成一次最高 4.17GB/美元的第三方云数据迁移，具体提供商由算力租赁确认。
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
