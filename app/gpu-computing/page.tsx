import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Check,
  Cpu,
  Database,
  Gauge,
  Network,
  Server,
  Sparkles,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'GPU 计算 | 算力租赁',
  description: '快速获取面向 AI 优化的 NVIDIA GPU，支撑训练、推理和生成式 AI 工作负载。',
};

const heroVideo = '/videos/基础架构/终版.mp4';
const bottomVideo = '/videos/基础架构/底部.mp4';

const gb200Features = [
  {
    title: '性能大幅提升',
    description:
      '相比 H100 架构，训练性能最高提升 4 倍；实时万亿参数大模型推理速度最高提升 30 倍。',
    icon: Gauge,
  },
  {
    title: '更强算力接入',
    description:
      '单服务器集成 72 块 NVIDIA Blackwell GPU 与 36 颗 NVIDIA Grace CPU，提供更高密度算力。',
    icon: Cpu,
  },
  {
    title: '超大规模集群',
    description:
      '可在单站点连接数万套 NVIDIA Blackwell 系统，释放 100K+ GPU 超大集群能力。',
    icon: Network,
  },
  {
    title: '面向未来的可持续设计',
    description:
      '采用液冷 GPU 设计，支持高达 130 kW 机柜功率，满足高密度 AI 基础设施需求。',
    icon: Sparkles,
  },
];

const h200Features = [
  {
    title: '卓越性能',
    description: '相比 H100 Tensor Core GPU，性能最高提升 1.9 倍。',
    icon: Gauge,
  },
  {
    title: '扩展显存容量',
    description:
      '单服务器提供 1,128 GB GPU 总显存，足以承载生成式 AI 工作负载所需的大规模数据。',
    icon: Database,
  },
  {
    title: '超高速互联',
    description:
      '通过 3200Gbps NVIDIA Quantum-2 InfiniBand 网络，实现 GPU 间低延迟连接。',
    icon: Network,
  },
  {
    title: '优化 GPU 计算效率',
    description:
      '利用 NVIDIA BlueField-3 DPU 卸载网络与存储任务，提高模型构建过程中的 GPU 利用率。',
    icon: Zap,
  },
];

const h100Features = [
  {
    title: '更强训练性能',
    description:
      '相比 NVIDIA A100 Tensor Core GPU，训练性能最高提升 4 倍。',
    icon: Gauge,
  },
  {
    title: '破纪录训练结果',
    description:
      '平台曾使用 3,500 块 H100，在 11 分钟内完成完整 GPT-3 大语言模型训练工作负载。',
    icon: Network,
  },
  {
    title: '释放更多 GPU 能力',
    description:
      '使用 NVIDIA BlueField-3 DPU 卸载处理任务，让 GPU 更专注于训练、实验和更多计算任务。',
    icon: Server,
  },
];

const l40sFeatures = [
  {
    title: '更低价格下的优秀性能',
    description:
      '相比 A40 实例，性能最高提升 2 倍，提供 733 TFLOPs 算力，并通过 NVIDIA BlueField-3 DPU 卸载任务。',
    icon: Gauge,
  },
  {
    title: '更灵活的算力接入',
    description:
      '每套系统可使用 8 块 L40S GPU，并搭配 Platinum Intel Emerald Rapids 处理器，适配生成式 AI 工作负载。',
    icon: Server,
  },
  {
    title: '灵活配置',
    description:
      '可接入 NVIDIA L40 配置，按照不同工作负载需求选择更合适的算力规模。',
    icon: Sparkles,
  },
];

const fastCards = [
  {
    title: '持续稳定的性能',
    description:
      '规模本身没有意义，稳定性能才是关键。客户可节省 310 万 GPU 小时，并将每日中断减少 50%。',
  },
  {
    title: '高效率基础设施',
    description:
      '系统 MFU 相比基准最高提升 20%，让团队以更少基础设施达到同等性能水平。',
  },
  {
    title: '从开始就具备韧性',
    description:
      '通过自动健康检查和节点生命周期管理，持续维护节点与集群性能，提升恢复能力。',
  },
];

const acceleratorSkus = [
  'GB300 NVL72',
  'B200',
  'A100',
  'RTX PRO 6000 Blackwell Server Edition',
  'L40',
];

function VideoBox({
  src,
  className = '',
  ariaLabel,
}: {
  src: string;
  className?: string;
  ariaLabel: string;
}) {
  return (
    <video
      aria-label={ariaLabel}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className={`h-full w-full object-cover ${className}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

function DarkFeatureSection({
  title,
  description,
  buttonText,
  features,
}: {
  title: string;
  description: string;
  buttonText?: string;
  features: typeof h200Features;
}) {
  return (
    <section className="bg-[#050505] px-5 text-white sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-[1220px] overflow-hidden lg:grid-cols-[0.86fr_1.14fr]">
        <div className="flex items-start justify-center border-white/15 px-6 py-16 lg:border-r lg:px-10 lg:py-20">
          <div className="w-full max-w-[460px]">
            <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
              {title}
            </h2>
            <p className="mt-7 max-w-[460px] text-base font-medium leading-7 text-white/90">
              {description}
            </p>
            {buttonText ? (
              <Button
                asChild
                className="mt-8 h-14 rounded-full bg-[#0b45f5] px-8 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">{buttonText}</Link>
              </Button>
            ) : null}
          </div>
        </div>
        <div>
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="flex min-h-[132px] items-start gap-3 border-t border-white/15 px-6 py-8 first:border-t-0 lg:px-8"
              >
                <Icon className="mt-1 h-7 w-7 shrink-0 text-white/70" aria-hidden="true" />
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="mt-4 max-w-[540px] text-base leading-7 text-white/55">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LightFeatureSection({
  title,
  description,
  buttonText,
  features,
}: {
  title: string;
  description: string;
  buttonText: string;
  features: typeof h100Features;
}) {
  return (
    <section className="bg-[#f7f8fa] px-5 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-[1220px] overflow-hidden border-y border-black/15 text-black lg:grid-cols-[0.86fr_1.14fr]">
        <div className="flex items-start justify-center border-black/15 px-6 py-16 lg:border-r lg:px-10 lg:py-20">
          <div className="w-full max-w-[460px]">
            <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
              {title}
            </h2>
            <p className="mt-7 max-w-[500px] text-base leading-7 text-black/90">
              {description}
            </p>
            <Button
              asChild
              className="mt-8 h-14 rounded-full bg-[#0b45f5] px-8 text-base font-semibold text-white hover:bg-[#2a61ff]"
            >
              <Link href="/contact-sales">{buttonText}</Link>
            </Button>
          </div>
        </div>
        <div>
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="flex min-h-[146px] items-start gap-3 border-t border-black/15 px-6 py-8 first:border-t-0 lg:px-8"
              >
                <Icon className="mt-1 h-7 w-7 shrink-0 text-black/65" aria-hidden="true" />
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="mt-4 max-w-[540px] text-base leading-7 text-black/58">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function GpuComputingPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="min-h-[680px] bg-[#f7f8fa]">
          <div className="mx-auto grid min-h-[680px] max-w-[1440px] items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.92fr_1fr] lg:px-16">
            <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
              <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#1f2530] sm:text-6xl lg:text-7xl">
                GPU 计算
              </h1>
              <p className="mt-7 max-w-[560px] text-xl leading-8 text-[#1f2530] sm:text-2xl sm:leading-10">
                快速获取领先的 AI 优化 NVIDIA GPU，支撑训练、推理和生成式 AI 应用快速上线。
              </p>
            </div>
            <div className="mx-auto aspect-square w-full max-w-[620px] overflow-hidden rounded-[24px] bg-white lg:mx-0">
              <VideoBox src={heroVideo} ariaLabel="GPU 计算首屏动画" />
            </div>
          </div>
        </section>

        <section className="border-y border-black/15 bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1220px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              NVIDIA GB200 NVL72
            </h2>
            <p className="mx-auto mt-8 max-w-[760px] text-xl leading-8 text-black/82">
              面向最新生成式 AI 应用构建和部署的行业领先平台。
            </p>
            <Button
              asChild
              className="mt-7 h-16 rounded-full bg-[#0b45f5] px-12 text-lg font-semibold text-white hover:bg-[#2a61ff]"
            >
              <Link href="/contact-sales">了解 Blackwell</Link>
            </Button>

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {gb200Features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Card
                    key={feature.title}
                    className="min-h-[360px] rounded-[20px] border-[#0b45f5] bg-transparent shadow-none"
                  >
                    <CardContent className="flex h-full flex-col items-center justify-start p-10 text-center">
                      <Icon className="h-9 w-9 text-black/70" aria-hidden="true" />
                      <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {feature.title}
                      </h3>
                      <p className="mt-8 text-lg leading-8 text-black/62">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <DarkFeatureSection
          title="NVIDIA H200 Tensor Core GPU"
          description="我们较早提供 NVIDIA H200 Tensor Core GPU，帮助团队更快将 AI 应用推向市场。"
          buttonText="了解 NVIDIA HGX H200"
          features={h200Features}
        />

        <LightFeatureSection
          title="NVIDIA H100 Tensor Core GPU"
          description="这是一套帮助我们打破 MLPerf 纪录，并构建世界级高速超级计算能力的平台。"
          buttonText="了解 NVIDIA HGX H100"
          features={h100Features}
        />

        <DarkFeatureSection
          title="NVIDIA L40S GPU"
          description="为工作负载匹配恰到好处的算力，避免过度配置或性能不足。"
          features={l40sFeatures}
        />

        <section className="border-y border-black/15 bg-[#f7f8fa] px-6 py-16 sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[0.9fr_0.8fr]">
            <div className="mx-auto max-w-[620px] lg:mx-0">
              <blockquote className="text-2xl font-semibold leading-snug tracking-[-0.03em] text-black sm:text-3xl">
                “训练最先进的模型并进行大规模推理，需要在数十亿参数之间完成数万亿次同步计算。
                这意味着团队需要极其庞大的计算资源。”
              </blockquote>
              <p className="mt-8 text-lg leading-8 text-black/80">
                — Brannin McBee，CoreWeave 联合创始人兼首席开发官
              </p>
            </div>
            <div className="mx-auto aspect-[5/6] w-full max-w-[500px] overflow-hidden rounded-[24px] bg-black">
              <Image
                src="/images/gpu-computing/brannin-mcbee.avif"
                alt="Brannin McBee"
                width={816}
                height={979}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] px-5 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1220px] overflow-hidden border-y border-black/15 lg:grid-cols-2">
            <div className="border-black/15 px-6 py-16 sm:px-10 lg:border-r">
              <div className="mx-auto max-w-[560px]">
                <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                  更多 GPU SKU
                </h2>
                <div className="mt-8 space-y-7 text-lg leading-8 text-black/86">
                  <p>按需配置计算资源，并为不同工作负载选择合适的 GPU。</p>
                  <p>丰富的 GPU 阵容可灵活满足不同复杂度的业务需求。</p>
                  <p>全部配备 DPU，全部基于裸金属交付。</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-16 sm:px-10">
              <div className="mx-auto max-w-[560px]">
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                  加速器
                </h3>
                <ul className="mt-7 list-disc space-y-3 pl-5 text-lg leading-7 text-black/62">
                  {acceleratorSkus.map((sku) => (
                    <li key={sku}>{sku}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1160px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              更快进入市场
            </h2>
            <div className="mx-auto mt-8 max-w-[900px] space-y-6 text-lg leading-8 text-black/86">
              <p>
                我们的平台帮助团队获得前沿计算能力，推动下一次 AI 突破。
              </p>
              <p>
                在<strong>高性能</strong>集群上运行任务，用<strong>更少时间</strong>完成<strong>更多工作</strong>。
              </p>
            </div>
            <Button
              asChild
              className="mt-7 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
            >
              <Link href="/contact-sales">了解更多</Link>
            </Button>

            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {fastCards.map((card) => (
                <Card
                  key={card.title}
                  className="min-h-[320px] rounded-[20px] border-[#0b45f5] bg-transparent shadow-none"
                >
                  <CardContent className="flex h-full flex-col items-center justify-start p-10 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black text-black">
                      <Check className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em]">
                      {card.title}
                    </h3>
                    <p className="mt-7 text-lg leading-8 text-black/65">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] px-6 pb-20 sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1180px] items-center gap-16 lg:grid-cols-[0.95fr_1fr] lg:gap-20">
            <div className="aspect-square overflow-hidden rounded-[24px] bg-white">
              <VideoBox src={bottomVideo} ariaLabel="开始构建 GPU 动画" />
            </div>
            <div className="max-w-[520px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                立即开始构建
              </h2>
              <p className="mt-7 text-lg leading-8 text-black/88">
                获取面向生成式 AI 的增强 GPU 计算能力。
              </p>
              <Button
                asChild
                className="mt-9 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">立即开始</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
