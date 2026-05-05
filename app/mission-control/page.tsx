import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  LifeBuoy,
  LockKeyhole,
  ScanSearch,
  type LucideIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mission Control | 算力租赁',
  description:
    'CoreWeave Mission Control 是面向 AI 生产运行的任务控制能力，统一可靠性、透明度和可执行洞察。',
};

const mcBase = '/videos/%E4%BB%BB%E5%8A%A1%E6%8E%A7%E5%88%B6/MC';

const missionAssets = {
  hero: `${mcBase}/1.mp4`,
  security: `${mcBase}/2.mp4`,
  fleet: `${mcBase}/3.mp4`,
  node: `${mcBase}/88.mp4`,
  expert: `${mcBase}/5.mp4`,
  straggler: `${mcBase}/6.mp4`,
  dashboard:
    `${mcBase}/6810f95a9a89796583a40ee0_page-image_observability_more-visibility-fewer-issues-dashboard@2x.avif`,
};

const contentShellClass =
  'mx-auto w-[calc(100%-40px)] max-w-[1200px] max-[720px]:w-[calc(100%-24px)]';

const layerCards: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
    {
      title: '安全',
      description: 'IAM/SAML、合规日志与审计。',
      icon: LockKeyhole,
    },
    {
      title: '专家服务',
      description: '自动化生命周期控制与专家直达支持。',
      icon: LifeBuoy,
    },
    {
      title: '可观测性',
      description: '指标、日志、遥测与系统信号。',
      icon: ScanSearch,
    },
  ];

const featureSections: Array<{
  title: string;
  description: string;
  cta?: string;
  media: string;
  mediaType: 'video' | 'image';
  mediaAlt: string;
  reverse?: boolean;
  id?: string;
}> = [
    {
      title: '安全与审计透明度',
      description:
        'Mission Control 提供对集群访问与活动的实时可见性。Telemetry Relay 将加密审计与安全事件转发到你的 SIEM，支持治理、合规审查和运营信任。',
      cta: '了解更多',
      media: missionAssets.security,
      mediaType: 'video',
      mediaAlt: 'Mission Control 安全与审计透明度',
    },
    {
      title: 'Fleet lifecycle controller',
      id: 'fleet-lifecycle-controller',
      description:
        '每个节点都会被持续评估，以满足现代 AI 工作负载的性能要求。Fleet Lifecycle Controller 跟踪长期 GPU 与节点健康状态，识别细微退化模式，并在不健康节点影响准确性或吞吐前完成替换。',
      media: missionAssets.fleet,
      mediaType: 'video',
      mediaAlt: 'Fleet lifecycle controller 控制台',
      reverse: true,
    },
    {
      title: 'Node lifecycle controller',
      id: 'node-lifecycle-controller',
      description:
        'Mission Control 持续监控节点健康回退，并在达到阈值时自动替换节点。Node Lifecycle Controller 管理从初始部署到完整节点生命周期的健康状态，减少中断、浪费的 GPU 小时和训练偏移。',
      media: missionAssets.node,
      mediaType: 'video',
      mediaAlt: 'Node lifecycle controller 节点生命周期',
    },
    {
      title: '专家直达支持',
      description:
        '当客户需要更深入的协助时，专家直达支持会把请求路由到构建和运营平台的工程师，确保问题得到快速、准确的解决。',
      media: missionAssets.expert,
      mediaType: 'video',
      mediaAlt: 'Mission Control 专家支持',
      reverse: true,
    },
    {
      title: '可观测性与性能可见性',
      description:
        'Mission Control 将 GPU 指标、网络、存储、编排和工作负载行为统一到一致的信号体系中。团队可以用熟悉、直观的仪表盘衡量性能、诊断问题并更快恢复作业。',
      cta: '了解更多',
      media: missionAssets.straggler,
      mediaType: 'video',
      mediaAlt: 'Mission Control 可观测性',
      reverse: true,
    },
    {
      title: '审计与透明度',
      description:
        'Mission Control 的可观测层与 Telemetry Relay 提供访问、活动和系统行为的实时可见性。审计与访问日志可以直接进入 SIEM 或监控工具，支持治理、合规审查和快速运营诊断。',
      cta: '了解更多',
      media: missionAssets.dashboard,
      mediaType: 'image',
      mediaAlt: 'Mission Control 审计仪表盘',
    },
    {
      title: 'GPU Straggler Detection（预览）',
      description:
        '分布式训练不会优雅地失败。一个 GPU 落后时，整个作业都会变慢。GPU Straggler Detection 使用 NVIDIA 集体操作信号识别造成减速的精确 rank、GPU 和节点，让根因定位更快、更准确。',
      cta: '了解更多',
      media: missionAssets.straggler,
      mediaType: 'video',
      mediaAlt: 'GPU Straggler Detection',
      reverse: true,
    },
  ];

const faqItems = [
  {
    question: 'Mission Control 如何提升可靠性？',
    answer:
      'Mission Control 通过生命周期控制器、CloudOps 监控和专家直达支持，自动化节点与集群健康管理。',
  },
  {
    question: 'Telemetry Relay 是否只支持审计日志？',
    answer:
      '不是。Telemetry Relay 可以转发审计与访问日志，并在启用时将更多遥测类型转发到客户端点。',
  },
  {
    question: 'GPU Straggler Detection 可以用于推理作业吗？',
    answer:
      'GPU Straggler Detection 针对分布式训练优化。推理可见性由更广泛的 Mission Control 可观测性指标提供。',
  },
  {
    question: 'Mission Control 是否包含可观测性工具？',
    answer:
      '包含。Mission Control 包括用于集群级指标和仪表盘的 CoreWeave Observe，以及用于审计和访问可见性的 Telemetry Relay。',
  },
  {
    question: 'CoreWeave Mission Control Agent 是什么？',
    answer:
      'Mission Control Agent 帮助团队实时解读系统行为，可以回答 GPU 性能、训练变慢或集群健康相关问题。',
  },
  {
    question: 'Mission Control 是否额外收费？',
    answer:
      'Mission Control 作为 CoreWeave Cloud 的一部分提供。Telemetry Relay 可以在不额外增加日志转发成本的情况下转发审计与访问日志。',
  },
  {
    question: '它如何与现有可观测性和安全工具集成？',
    answer:
      'Mission Control 可通过 Telemetry Relay 和 CoreWeave Observe 与现有 SIEM、日志和监控系统协同工作。',
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

function MissionControlDiagram() {
  return (
    <div className="mx-auto mt-14 max-w-[1040px] text-center">
      <div className="text-3xl font-semibold text-black sm:text-4xl">
        CoreWeave Mission Control
      </div>
      <div className="mt-10 rounded-[30px] border border-black/25 bg-white p-5 shadow-[0_18px_70px_rgba(32,42,70,0.08)] sm:p-8">
        <div className="rounded-[24px] bg-[#1728ee] p-6 text-white sm:p-10">
          <div className="rounded-[20px] border border-dashed border-white/65 bg-[#3f8df6] p-5 sm:p-8">
            <div className="grid gap-5 md:grid-cols-3">
              {layerCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article key={card.title} className="rounded-[16px] bg-white px-6 py-7 text-center text-[#080923]">
                    <Icon className="mx-auto h-9 w-9" aria-hidden="true" />
                    <h3 className="mt-6 text-xl font-semibold">{card.title}</h3>
                    <p className="mt-4 text-base leading-7 text-[#080923]/78">{card.description}</p>
                  </article>
                );
              })}
            </div>
            <p className="mt-8 text-2xl font-semibold">可靠性</p>
          </div>
          <p className="mt-7 text-2xl font-semibold">透明度</p>
          <p className="mt-8 text-2xl font-semibold">洞察</p>
        </div>
        <p className="mt-7 text-2xl font-semibold">CoreWeave Mission Control Agent</p>
      </div>
    </div>
  );
}

function FeatureSection({
  title,
  description,
  cta,
  media,
  mediaType,
  mediaAlt,
  reverse,
  id,
}: {
  title: string;
  description: string;
  cta?: string;
  media: string;
  mediaType: 'video' | 'image';
  mediaAlt: string;
  reverse?: boolean;
  id?: string;
}) {
  const mediaElement =
    mediaType === 'image' ? (
      <Image
        src={media}
        alt={mediaAlt}
        width={1232}
        height={750}
        unoptimized
        className="h-full w-full object-contain"
      />
    ) : (
      <VideoVisual src={media} ariaLabel={mediaAlt} />
    );

  return (
    <section id={id} className="scroll-mt-24 border-t border-black/12 bg-[#f7f8fa] py-16 lg:py-20">
      <div
        className={`${contentShellClass} grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''
          }`}
      >
        <div className="max-w-[620px]">
          <h2 className="text-3xl font-semibold leading-[1.1] sm:text-4xl">
            {title}
          </h2>
          <p className="mt-7 text-base leading-7 text-black/84 sm:text-lg sm:leading-8">{description}</p>
          {cta ? (
            <Button
              asChild
              className="mt-9 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
            >
              <Link href="/contact-sales">{cta}</Link>
            </Button>
          ) : null}
        </div>
        <div className="min-h-[320px] overflow-hidden rounded-[22px] bg-white">
          {mediaElement}
        </div>
      </div>
    </section>
  );
}

export default function MissionControlPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="bg-[#f7f8fa] py-20 lg:py-28">
          <div className={`${contentShellClass} grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]`}>
            <div className="max-w-[660px]">
              <h1 className="text-4xl font-semibold leading-[1.06] text-[#1f2530] sm:text-5xl lg:text-6xl">
                CoreWeave Mission Control™
              </h1>
              <p className="mt-8 max-w-[620px] text-lg leading-8 text-[#1f2530] sm:text-xl sm:leading-9">
                面向 CoreWeave Cloud 上 AI 生产运行的运营标准，提供
                <strong>可靠性、透明度和可执行洞察</strong>。
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  className="h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
                >
                  <Link href="/contact-sales">下载方案简报</Link>
                </Button>
                <Button
                  asChild
                  className="h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
                >
                  <Link href="#mission-control-standard">观看讲解视频</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto aspect-[1.58] w-full max-w-[720px] lg:mx-0">
              <VideoVisual src={missionAssets.hero} ariaLabel="Mission Control 概览动画" />
            </div>
          </div>
        </section>

        <section className="bg-[#050505] py-20 text-center text-white lg:py-24">
          <div className={contentShellClass}>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              可靠-透明-洞察明确
            </h2>
            <p className="mx-auto mt-8 max-w-[920px] text-base leading-7 text-white/86 sm:text-lg sm:leading-8">
              Mission Control 是 CoreWeave 以生产规模运行 AI 的核心方式。它将安全、专家运营和可观测性统一为一个运营标准，让团队能看得更清楚、行动更精确，并更有信心地运行大规模 AI。
            </p>
          </div>
        </section>

        <section id="mission-control-standard" className="bg-white py-20 lg:py-24">
          <div className={`${contentShellClass} text-center`}>
            <h2 className="mx-auto max-w-[840px] text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              一个运营标准，统一每一层的收益
            </h2>
            <p className="mx-auto mt-8 max-w-[960px] text-base leading-7 sm:text-lg sm:leading-8">
              Mission Control 将<strong>安全、专家服务和可观测性</strong>整合到 CoreWeave Cloud 上运行 AI 的一致方式中，共同交付三项核心收益：
              <strong>可靠性、透明度和洞察</strong>。
            </p>
            <MissionControlDiagram />
          </div>
        </section>

        {featureSections.slice(0, 4).map((section) => (
          <FeatureSection key={section.title} {...section} />
        ))}

        <section className="border-t border-black/12 bg-[#f7f8fa] py-20 text-center lg:py-24">
          <div className={contentShellClass}>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              看见一切-获得洞察-立即行动。
            </h2>
            <p className="mx-auto mt-8 max-w-[980px] text-base leading-7 sm:text-lg sm:leading-8">
              Mission Control 统一最重要的信号，包括性能指标、审计活动、工作负载行为和 GPU 级异常，并将它们转化为即时、可执行的洞察。
            </p>
          </div>
        </section>

        {featureSections.slice(4).map((section) => (
          <FeatureSection key={section.title} {...section} />
        ))}

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
                        <p className="mt-5 text-base leading-7 text-black/62">{item.answer}</p>
                      </div>
                      <span className="shrink-0 text-2xl font-semibold leading-none text-[#2f45ee]">
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
