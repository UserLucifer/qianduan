import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from "@/i18n/navigation";
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import SunkCodeBlock from '@/components/marketing/SunkCodeBlock';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Cloud,
  Gauge,
  Hexagon,
  Layers3,
  Settings2,
  Sparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'SUNK Anywhere | 算力租赁',
  description:
    'SUNK Anywhere 将统一训练系统扩展到 CoreWeave 之外，帮助团队在多基础架构环境中保持一致的调度、工作流和可观测性。',
};

const sunkAnywhereAssets = {
  ring: '/images/SUNK-Anywhere/10001.avif',
  banner: '/images/SUNK-Anywhere/10002.avif',
  xander: '/images/SUNK-Anywhere/69812b5d4cb6bc10c69942f6_quote-image_xander-dunn@2x.avif',
};

const contentShellClass =
  'mx-auto w-[calc(100%-40px)] max-w-[1200px] max-[720px]:w-[calc(100%-24px)]';

const whyCards: Array<{
  title: string;
  description: string;
}> = [
  {
    title: '更快进入生产训练',
    description: 'AI 团队应当更快进入可产出的训练阶段，而不是背负更多设置和运维开销。',
  },
  {
    title: '减少人工协调',
    description:
      '训练负载迁移到 CoreWeave 之外时，常会引入新的设置工作和人工协调。SUNK Anywhere 减少这类开销，而不是继续叠加复杂度。',
  },
  {
    title: '基础架构灵活性，不增加负担',
    description:
      '平台团队可以支持单一提供商之外的基础架构，同时避免在不同环境里维护碎片化或脆弱的运行模型。',
  },
  {
    title: '更少碎片化，一个统一训练系统',
    description:
      'SUNK Anywhere 为团队提供一条有意识的扩展路径，让同一套训练系统覆盖更多基础架构环境。',
  },
];

const capabilityCards: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: '把训练环境纳入一个系统',
    description:
      '将更多训练环境能力整合到一个系统里，帮助团队避免外部环境中常见的工具碎片化和人工协调。',
    icon: Hexagon,
  },
  {
    title: '混合调度与可观测钩子',
    description:
      '集成混合调度、面向研究人员的能力和可观测钩子，让团队在负载扩展时仍保持控制力。',
    icon: Settings2,
  },
  {
    title: '更快进入可产出的训练',
    description:
      '通过内置访问、用户环境和容器等基础能力，帮助团队减少设置时间，把更多时间用于训练工作。',
    icon: Gauge,
  },
  {
    title: '跨环境一致运行',
    description:
      '将 SUNK 扩展到 CoreWeave 之外，同时保留熟悉的接口、调度行为和日常运维习惯。',
    icon: Sparkles,
  },
];

const deliverItems: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: '标准化到统一训练系统',
    description:
      '为团队提供更清晰的标准化路径，让高要求 AI 负载在基础架构足迹扩展时仍以相同方式运行。',
    icon: Hexagon,
  },
  {
    title: '减少跨环境碎片化',
    description:
      '降低在多个提供商和客户自有基础架构中运行训练时常见的运维拼装成本。',
    icon: Layers3,
  },
  {
    title: '简化生产 AI 负载路径',
    description:
      '帮助平台和研究团队更快进入可产出的训练阶段，在工作开始前减少设置、适配和运维开销。',
    icon: Workflow,
  },
];

const faqItems = [
  {
    question: '什么是 SUNK Anywhere？',
    answer:
      'SUNK Anywhere 将 SUNK 扩展到 CoreWeave 之外，让团队可以在已有基础架构上使用同一套统一训练系统，而不需要引入独立的外部训练栈。',
  },
  {
    question: '团队什么时候应该使用 SUNK Anywhere？',
    answer:
      '当团队需要在单一环境之外运行高要求 AI 负载，同时希望保持一致的工作流、工具和运维实践时，SUNK Anywhere 更适合。',
  },
  {
    question: '使用 SUNK Anywhere 需要改变现有工作方式吗？',
    answer:
      '不需要。它的设计目标是保留熟悉的接口、调度行为和日常运维实践，让基础架构扩展不会迫使研究人员重新学习作业运行方式。',
  },
  {
    question: '沙盒工作负载在哪里运行？',
    answer:
      '沙盒工作负载可以运行在现有 CoreWeave 环境和已约定的容量之上，用于验证、适配和逐步扩展训练工作流。',
  },
];

function CheckIcon() {
  return (
    <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-[#62a1ff] text-[#2f7cff]">
      <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
    </span>
  );
}

function ArchitectureCard({
  title,
  icon,
}: {
  title: string;
  icon: 'coreweave' | 'cloud';
}) {
  return (
    <div className="rounded-[18px] border border-dashed border-[#0b45f5] bg-[#f7f8fa] p-5 sm:p-6">
      <div className="mb-6 flex h-14 items-center justify-center text-[#2f7cff]">
        {icon === 'cloud' ? (
          <Cloud className="h-14 w-14" strokeWidth={2.4} aria-hidden="true" />
        ) : (
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-9 w-9 rounded-[10px] border-[10px] border-[#2f45ee] border-r-transparent" />
            <span className="h-9 w-3 skew-x-[-28deg] rounded-sm bg-black" />
            <span className="h-9 w-3 skew-x-[-28deg] rounded-sm bg-black" />
          </div>
        )}
      </div>
      <div className="rounded-[16px] bg-[#0d39e7] p-5 text-center text-white sm:p-6">
        <h3 className="text-xl font-semibold leading-tight sm:text-2xl">{title}</h3>
        <div className="mx-auto mt-6 max-w-[280px] rounded-[14px] bg-white px-6 py-5 text-left text-black">
          <p className="mb-4 text-center text-2xl font-semibold text-[#2f7cff]">
            sunk
          </p>
          <p className="mt-3 flex items-center gap-3 text-base font-semibold">
            <Box className="h-5 w-5 text-black/58" aria-hidden="true" />
            Slurm Jobs
          </p>
          <p className="mt-4 flex items-center gap-3 text-base font-semibold">
            <Box className="h-5 w-5 text-black/58" aria-hidden="true" />
            Kubernetes Pods
          </p>
        </div>
        <div className="mx-auto mt-5 max-w-[280px] rounded-[12px] bg-white px-6 py-4 text-left text-base font-semibold text-black">
          <span className="flex items-center gap-3">
            <Box className="h-5 w-5 text-black/58" aria-hidden="true" />
            Kubernetes Pods
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SunkAnywherePage() {
  return (
    <>
      <Header />
      <main className="bg-white text-black">
        <section className="relative isolate overflow-hidden bg-[#eef1f5] py-20 lg:py-28">
          <Image
            src={sunkAnywhereAssets.ring}
            alt=""
            fill
            priority
            sizes="100vw"
            unoptimized
            className="absolute inset-y-0 right-0 -z-10 h-full w-full object-cover object-right opacity-85"
          />
          <div className={`${contentShellClass} grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]`}>
            <div className="max-w-[620px]">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0b45f5] sm:text-base">
                现已全面可用
              </p>
              <h1 className="mt-8 text-4xl font-semibold leading-[1.06] text-[#1f2530] sm:text-5xl lg:text-6xl">
                SUNK Anywhere
              </h1>
              <p className="mt-8 max-w-[600px] text-lg leading-8 text-[#1f2530] sm:text-xl sm:leading-9">
                将行业首个统一训练系统扩展到 CoreWeave 之外，帮助团队在任何已有基础架构上加速并扩展高要求 AI 工作负载。
              </p>
              <Button
                asChild
                className="mt-10 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">开始使用 SUNK Anywhere</Link>
              </Button>
            </div>

            <div className="w-full max-w-[620px] min-w-0 justify-self-center lg:justify-self-end">
              <SunkCodeBlock />
            </div>
          </div>
        </section>

        <section className="bg-[#e9edf2] py-20 lg:py-24">
          <div className={`${contentShellClass} grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20`}>
            <div className="max-w-[640px]">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0b45f5] sm:text-base">
                为什么选择 SUNK Anywhere？
              </p>
              <h2 className="mt-7 text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-5xl">
                灵活性不应该意味着碎片化
              </h2>
              <p className="mt-8 text-lg leading-8 text-black/82">
                随着训练环境扩展到不同提供商和客户自有基础架构，团队会面临不同工作流、控制方式和运行实践并存的风险。这种碎片化会在最需要连续性的地方增加复杂度。
              </p>
              <p className="mt-8 text-lg leading-8 text-black/82">
                SUNK Anywhere 的价值在于把同一套 SUNK 系统扩展到 CoreWeave 之外，让组织在基础架构选择增长时，仍然拥有更快进入生产训练的路径和更少的设置工作。
              </p>
            </div>

            <div className="space-y-6">
              {whyCards.map((item) => (
                <Card key={item.title} className="rounded-[20px] border-0 bg-white shadow-none">
                  <CardContent className="flex gap-7 p-8 sm:p-10">
                    <CheckIcon />
                    <div>
                      <h3 className="text-xl font-semibold leading-tight sm:text-2xl">{item.title}</h3>
                      <p className="mt-6 text-lg leading-8 text-black/58">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className={`${contentShellClass} relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[22px] bg-[#0826b7] px-6 py-14 text-center text-white`}>
            <Image
              src={sunkAnywhereAssets.banner}
              alt=""
              fill
              sizes="(min-width: 1024px) 1320px, 100vw"
              unoptimized
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#0826b7]/50" />
            <div className="relative mx-auto max-w-[760px]">
              <p className="text-sm font-semibold uppercase tracking-wide sm:text-base">SUNK Anywhere</p>
              <h2 className="mt-8 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                市场中最成熟的 Slurm-on-Kubernetes 产品
              </h2>
            </div>
          </div>
        </section>

        <section className="bg-white pb-20 lg:pb-24">
          <div className={`${contentShellClass} text-center`}>
            <h2 className="mx-auto max-w-[860px] text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-5xl">
              跨基础架构环境的一套统一训练系统
            </h2>
            <p className="mx-auto mt-8 max-w-[980px] text-lg leading-8">
              SUNK Anywhere 将同一套统一训练系统扩展到 CoreWeave 之外，帮助团队在基础架构环境扩展时保留一致的调度、工作流和运行实践。
            </p>

            <div className="mt-14 grid gap-10 lg:grid-cols-2">
              <ArchitectureCard title="CoreWeave Kubernetes 服务" icon="coreweave" />
              <ArchitectureCard title="云提供商 Kubernetes" icon="cloud" />
            </div>
          </div>
        </section>

        <section className="bg-[#eef1f5] py-20 lg:py-24">
          <div className={`${contentShellClass} text-center`}>
            <h2 className="mx-auto max-w-[820px] text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-5xl">
              为任何运行位置的高要求 AI 工作负载而建
            </h2>
            <p className="mx-auto mt-8 max-w-[780px] text-lg leading-8">
              SUNK Anywhere 扩展团队已经依赖的统一训练系统，不强迫团队采用新工具或不同的运行方式。
            </p>

            <div className="mt-14 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
              {capabilityCards.map((card) => {
                const Icon = card.icon;

                return (
                  <Card key={card.title} className="rounded-[20px] border-0 bg-white text-left shadow-none">
                    <CardContent className="flex min-h-[380px] flex-col p-9">
                      <Icon className="h-10 w-10 text-[#2f7cff]" aria-hidden="true" />
                      <h3 className="mt-8 text-xl font-semibold leading-tight sm:text-2xl">{card.title}</h3>
                      <p className="mt-7 text-lg leading-8 text-black/72">{card.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#eef1f5] py-20 lg:py-24">
          <div className={`${contentShellClass} text-center`}>
            <h2 className="mx-auto max-w-[720px] text-3xl font-semibold leading-tight sm:text-4xl">
              生产规模先锋团队验证
            </h2>
            <Link
              href="/blog"
              className="mt-7 inline-flex items-center gap-2 text-base font-semibold text-[#0b45f5] underline underline-offset-4"
            >
              查看更多客户故事
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <article className="mt-14 grid overflow-hidden rounded-[18px] bg-white text-left lg:grid-cols-[1.08fr_0.92fr]">
              <div className="flex min-h-[560px] flex-col p-10 sm:p-14">
                <div className="text-[110px] font-semibold leading-none text-[#d9e8ff]">&ldquo;</div>
                <p className="-mt-8 max-w-[640px] text-xl font-medium leading-8 text-black sm:text-2xl sm:leading-9">
                  CoreWeave 的 SUNK 是业界领先的集群管理能力。它把 Slurm on Kubernetes 的优势结合起来，让我们在 CoreWeave 和非 CoreWeave 提供商上运行大规模分布式作业时，仍能保持熟悉的可观测性和生产级长期服务。
                </p>
                <div className="mt-12">
                  <p className="text-xl font-semibold">Xander Dunn</p>
                  <p className="mt-2 text-base italic text-black/72">
                    Periodic Labs 技术人员
                  </p>
                </div>
                <p className="mt-auto pt-10 text-3xl font-light text-black/76">
                  periodic labs
                </p>
              </div>
              <div className="relative min-h-[480px] bg-[#d6e8ff]">
                <Image
                  src={sunkAnywhereAssets.xander}
                  alt="Xander Dunn"
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  unoptimized
                  className="object-cover"
                />
              </div>
            </article>
          </div>
        </section>

        <section className="bg-[#eef1f5] py-20 lg:py-24">
          <div className={`${contentShellClass} grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20`}>
            <div className="flex items-center">
              <div className="max-w-[560px]">
                <p className="text-base font-semibold uppercase text-[#0b45f5]">
                  交付能力
                </p>
                <h2 className="mt-7 text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-5xl">
                  SUNK Anywhere 让什么成为可能
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              {deliverItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Card key={item.title} className="rounded-[20px] border-0 bg-white shadow-none">
                    <CardContent className="flex gap-7 p-8 sm:p-10">
                      <Icon className="mt-1 h-10 w-10 shrink-0 text-[#2f7cff]" aria-hidden="true" />
                      <div>
                        <h3 className="text-xl font-semibold leading-tight sm:text-2xl">{item.title}</h3>
                        <p className="mt-6 text-lg leading-8 text-black/58">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 lg:py-24">
          <div className={contentShellClass}>
            <h2 className="text-center text-3xl font-semibold sm:text-4xl">
              常见问题
            </h2>
            <div className="mt-12 space-y-6">
              {faqItems.map((item) => (
                <Card key={item.question} className="rounded-[18px] border-0 bg-[#f1f2f5] shadow-none">
                  <CardContent className="p-8 sm:p-10">
                    <div className="flex items-start justify-between gap-8">
                      <div>
                        <h3 className="text-lg font-semibold">{item.question}</h3>
                        <p className="mt-6 text-lg leading-8 text-black/62">{item.answer}</p>
                      </div>
                      <span className="shrink-0 text-3xl font-semibold leading-none text-[#2f45ee]">
                        +
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
