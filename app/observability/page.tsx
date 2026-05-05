import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Cpu,
  Gauge,
  LifeBuoy,
  Network,
  RadioTower,
  SearchCheck,
  ServerCog,
  ShieldCheck,
  SquareActivity,
  type LucideIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Observability | 算力租赁',
  description:
    '任务控制下的 Observability 能力，统一 GPU、网络、日志、指标和训练作业信号，帮助团队快速定位问题并提升资源利用率。',
};

const obBase = '/videos/%E4%BB%BB%E5%8A%A1%E6%8E%A7%E5%88%B6/OB';

const obAssets = {
  hero: `${obBase}/23.avif`,
  dashboard:
    `${obBase}/6810f95a9a89796583a40ee0_page-image_observability_more-visibility-fewer-issues-dashboard@2x.avif`,
  debugging: `${obBase}/686ebd62cc389d2e83698bcc_Website_-_Dark-p-1600.webp`,
  testimonial:
    `${obBase}/6810fb771671576a60bcdb39_6ddf69138f3189fe3c3336f101041c05_page-image_observability_responsive-and-collaborative_jay-shin@2x.avif`,
  logos: [
    `${obBase}/10002.avif`,
    `${obBase}/10003.avif`,
    `${obBase}/10004.avif`,
    `${obBase}/10005.avif`,
    `${obBase}/10006.avif`,
    `${obBase}/10007.avif`,
    `${obBase}/10008.avif`,
    `${obBase}/10009.avif`,
    `${obBase}/10010.avif`,
    `${obBase}/10011.avif`,
  ],
};

const shellClass =
  'mx-auto w-[calc(100%-40px)] max-w-[1220px] max-[720px]:w-[calc(100%-24px)]';

const insightItems: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: '全量硬件仪表盘',
    description:
      '集中查看 GPU 温度、功耗、XID 错误、PCIe 纠错、网络吞吐和节点健康，快速识别异常节点。',
    icon: BarChart3,
  },
  {
    title: 'SUNK 作业关联',
    description:
      '把硬件、Kubernetes、Slurm 与训练作业信号叠加在同一视图中，缩短问题定位路径。',
    icon: SquareActivity,
  },
  {
    title: '集群健康管理',
    description:
      '持续跟踪节点退化、网络超时和资源漂移，让平台团队在故障影响训练前完成处置。',
    icon: ServerCog,
  },
  {
    title: '骨干网络可见性',
    description:
      '查看每个节点的入口、出口和跨集群吞吐，定位数据源、模型权重和训练通信瓶颈。',
    icon: Network,
  },
  {
    title: '快速可视化',
    description:
      '将训练中断一路下钻到网络、存储或基础设施信号，帮助团队把诊断结论转化为行动。',
    icon: SearchCheck,
  },
];

const transparencyCards: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: 'GPU 性能指标',
    description:
      '按单卡和节点查看温度、功耗、显存、纠错与利用率，减少对零散日志和手工脚本的依赖。',
    icon: Gauge,
  },
  {
    title: '日志与指标统一',
    description:
      '从软件栈、编排层和硬件层收集指标与日志，构建完整的训练运行视图。',
    icon: Activity,
  },
  {
    title: '所见即所得',
    description:
      '客户看到的底层指标与平台运维团队保持一致，便于协作排障和透明复盘。',
    icon: ShieldCheck,
  },
];

const resourceCards: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: 'CoreWeave Grafana',
    description:
      '托管式 Grafana 体验，提供按超算规模运维经验整理的集群、节点和 GPU 仪表盘。',
    icon: BarChart3,
  },
  {
    title: 'CoreWeave Metrics',
    description:
      '托管式 VictoriaMetrics API，支撑大规模指标写入、查询和长期趋势分析。',
    icon: Gauge,
  },
  {
    title: 'CoreWeave Logs',
    description:
      '托管式 Loki API，日志可立即访问，无需等待从冷存储回补或重新水合。',
    icon: SearchCheck,
  },
  {
    title: 'Telemetry Relay',
    description:
      '将遥测转发到外部数据平台或本地端点，让团队沿用既有监控与安全工作流。',
    icon: RadioTower,
  },
];

const specRows = [
  ['硬件信号', 'GPU 温度、功耗、XID、显存、PCIe 纠错、InfiniBand 与 NVLink 吞吐'],
  ['编排信号', 'Kubernetes、Slurm、SUNK 作业、节点生命周期和集群健康状态'],
  ['可用接口', 'Grafana 仪表盘、Metrics API、Logs API、Telemetry Relay 转发'],
  ['适用场景', '训练中断定位、资源利用率分析、网络瓶颈排查、平台协作复盘'],
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9aa2ff]">
      {children}
    </p>
  );
}

export default function ObservabilityPage() {
  return (
    <>
      <Header />
      <main className="bg-[#08090a] text-[#f7f8f8]">
        <section className="relative isolate overflow-hidden">
          <Image
            src={obAssets.hero}
            alt="AI 基础设施团队协作会议"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#08090a] via-[#08090a]/88 to-[#08090a]/28" />

          <div className={`${shellClass} flex min-h-[590px] items-center py-20 sm:min-h-[640px] lg:min-h-[680px]`}>
            <div className="max-w-[680px]">
              <SectionLabel>Mission Control / Observability</SectionLabel>
              <h1 className="mt-6 text-5xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Observability
              </h1>
              <p className="mt-7 max-w-[620px] text-lg leading-8 text-[#d0d6e0] sm:text-xl sm:leading-9">
                统一 GPU、网络、存储、编排与训练作业信号，让团队更快看清问题来源，减少中断并提升有效训练时间。
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  className="h-12 rounded-[6px] bg-[#5e6ad2] px-7 text-base font-semibold text-white hover:bg-[#828fff]"
                >
                  <Link href="/contact-sales">联系销售</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-[6px] border-white/12 bg-white/[0.03] px-7 text-base font-semibold text-[#f7f8f8] hover:bg-white/[0.06] hover:text-white"
                >
                  <Link href="#resources">
                    查看规格与资源
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#101113] py-8">
          <div className={`${shellClass} overflow-hidden`}>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8f98]">
              Trusted by AI labs, platforms, and enterprises
            </p>
            <div className="mt-7 flex gap-10 overflow-x-auto pb-2 scrollbar-none">
              {obAssets.logos.map((logo) => (
                <Image
                  key={logo}
                  src={logo}
                  alt=""
                  width={180}
                  height={50}
                  className="h-8 w-auto shrink-0 object-contain opacity-75 grayscale"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] py-20 text-black sm:py-24">
          <div className={`${shellClass} grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16`}>
            <div className="max-w-[600px]">
              <h2 className="text-4xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-5xl">
                更高可见性，更少中断
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-8 text-black/76">
                <p>
                  集群越大，中断、性能下降和资源漂移就越容易隐藏在不同层级的日志与指标之间。
                </p>
                <p>
                  Observability 将基础设施指标、作业行为和平台告警关联起来，帮助 AI 工程团队快速判断问题来自模型训练流程还是底层资源。
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-[12px] bg-[#15171a] shadow-[0_28px_90px_rgba(15,23,42,0.18)]">
              <Image
                src={obAssets.dashboard}
                alt="Observability GPU 指标仪表盘"
                width={1232}
                height={750}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#08090a] py-20 sm:py-24">
          <div className={`${shellClass} grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16`}>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionLabel>Actionable insights</SectionLabel>
              <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl">
                可执行洞察
              </h2>
              <p className="mt-7 max-w-[480px] text-lg leading-8 text-[#d0d6e0]">
                开箱即可获得集群的关键指标和数据，无需额外搭建监控栈或重复整理仪表盘。
              </p>
              <Button
                asChild
                className="mt-9 h-12 rounded-[6px] bg-[#5e6ad2] px-7 text-base font-semibold text-white hover:bg-[#828fff]"
              >
                <Link href="/contact-sales">了解更多</Link>
              </Button>
            </div>

            <div className="border-t border-white/10">
              {insightItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="grid gap-5 border-b border-white/10 py-9 sm:grid-cols-[44px_1fr] sm:py-10"
                  >
                    <Icon className="h-8 w-8 text-[#8a8f98]" aria-hidden="true" />
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                        {item.title}
                      </h3>
                      <p className="mt-5 max-w-[620px] text-base leading-7 text-[#8a8f98] sm:text-lg sm:leading-8">
                        {item.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#010102] py-20 sm:py-24">
          <div className={shellClass}>
            <h2 className="text-center text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
              前所未有的透明度
            </h2>
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {transparencyCards.map((card) => {
                const Icon = card.icon;

                return (
                  <Card
                    key={card.title}
                    className="min-h-[310px] rounded-[8px] border-white/8 bg-white/[0.04] text-[#f7f8f8] shadow-none"
                  >
                    <CardContent className="flex h-full flex-col items-center p-8 text-center sm:p-10">
                      <Icon className="h-9 w-9 text-[#d0d6e0]" aria-hidden="true" />
                      <h3 className="mt-9 text-2xl font-semibold tracking-[-0.03em]">
                        {card.title}
                      </h3>
                      <p className="mt-7 text-base leading-7 text-[#a4acb6]">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="resources" className="bg-[#f7f8fa] py-20 text-black sm:py-24">
          <div className={`${shellClass} text-center`}>
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
              快速访问细粒度指标
            </h2>
            <p className="mx-auto mt-7 max-w-[760px] text-lg leading-8 text-black/72">
              Observability 提供托管式仪表盘、指标、日志与遥测转发能力，帮助团队查看相关规格与可用资源。
            </p>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {resourceCards.map((card) => {
                const Icon = card.icon;

                return (
                  <Card
                    key={card.title}
                    className="min-h-[320px] rounded-[8px] border-[#5e6ad2] bg-transparent shadow-none"
                  >
                    <CardContent className="flex h-full flex-col items-center p-8 text-center">
                      <Icon className="h-9 w-9 text-black/70" aria-hidden="true" />
                      <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {card.title}
                      </h3>
                      <p className="mt-7 text-base leading-7 text-black/62">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-14 overflow-hidden rounded-[8px] border border-black/10 bg-white text-left">
              {specRows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-3 border-b border-black/10 px-6 py-5 last:border-b-0 sm:grid-cols-[180px_1fr] sm:px-8"
                >
                  <div className="text-sm font-semibold text-black/58">{label}</div>
                  <div className="text-base leading-7 text-black/80">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#08090a] py-20 sm:py-24">
          <div className={`${shellClass} grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16`}>
            <div className="max-w-[610px]">
              <SectionLabel>Faster debugging</SectionLabel>
              <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl">
                更快调试训练作业
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-8 text-[#d0d6e0]">
                <p>
                  当训练中断或性能意外下降时，团队通常需要在集群日志、平台工程师反馈和训练曲线之间来回切换。
                </p>
                <p>
                  Observability 将基础设施告警嵌入训练指标和运行表中，让工程师更快判断是否需要重启作业、替换节点或调整工作负载。
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-[12px] border border-white/8 bg-[#15171a]">
              <Image
                src={obAssets.debugging}
                alt="训练作业调试界面"
                width={1600}
                height={1000}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#010102] py-20 sm:py-24">
          <div className={`${shellClass} grid items-center gap-12 lg:grid-cols-[0.9fr_1fr] lg:gap-16`}>
            <div>
              <h2 className="max-w-[520px] text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl">
                响应迅速，协作透明
              </h2>
              <p className="mt-7 text-lg italic leading-8 text-[#d0d6e0]">
                “Observability 让平台团队和模型团队围绕同一组事实协作，问题定位不再依赖猜测。”
              </p>
              <p className="mt-5 text-base font-semibold text-[#8a8f98]">
                Jay Shin，Trillion Labs CEO 与联合创始人
              </p>
            </div>
            <div className="mx-auto aspect-square w-full max-w-[430px] overflow-hidden rounded-full bg-[#191a1b]">
              <Image
                src={obAssets.testimonial}
                alt="Jay Shin"
                width={800}
                height={800}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden border-t border-white/8 py-20 sm:py-24">
          <Image
            src={obAssets.debugging}
            alt=""
            fill
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#08090a] via-[#08090a]/92 to-[#08090a]/68" />
          <div className={shellClass}>
            <div className="max-w-[560px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                准备好看得更清楚了吗？
              </h2>
              <p className="mt-7 text-lg leading-8 text-[#d0d6e0]">
                用 Observability 获得集群、作业和基础设施的一致可见性。
              </p>
              <Button
                asChild
                className="mt-9 h-12 rounded-[6px] bg-[#5e6ad2] px-7 text-base font-semibold text-white hover:bg-[#828fff]"
              >
                <Link href="/contact-sales">立即联系</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
