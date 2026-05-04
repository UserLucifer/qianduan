import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Cpu,
  Gauge,
  Network,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'CPU 计算 | 算力租赁',
  description: '查看 AMD EPYC 与 Intel Xeon CPU 计算规格，支撑 GPU 加速和生成式 AI 集群工作负载。',
};

const cpuVisualVideo = '/videos/基础架构/底部.mp4';

const processorFamilies = [
  {
    title: 'AMD EPYC Genoa',
    points: [
      '提供高性能、高核心数与通用型配置，灵活适配不同工作负载。',
      '相比通用 Milan 服务器，代际性能最高提升 26%。',
      '单系统最高支持 1.5TB 内存。',
      '配备 NVIDIA BlueField DPU。',
    ],
  },
  {
    title: 'Intel Emerald Rapids',
    points: [
      '相比上一代 Ice Lake 服务器，性能最高提升 28%。',
      '采用铂金级处理器，提供面向关键任务的稳定性能。',
      '单系统提供 512GB 内存。',
      '配备 NVIDIA BlueField DPU。',
    ],
  },
];

const clusterFeatures = [
  {
    title: '获得更高性能',
    description: '消除虚拟化带来的额外开销，发挥裸金属基础设施的性能优势。',
    icon: Zap,
  },
  {
    title: '高速扩展运行',
    description: '在数秒内扩展到数十万 CPU 核心，支持最高 4.3GHz+ 的加速频率。',
    icon: Gauge,
  },
  {
    title: '使用更快网络',
    description: '最高可接入 384 核与 200Gbps 网络速度，支撑超高速数据移动。',
    icon: Network,
  },
];

function VideoBox({
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
      className={`h-full w-full object-cover ${className}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

export default function CpuComputingPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="min-h-[650px] bg-[#f7f8fa]">
          <div className="mx-auto grid min-h-[650px] max-w-[1440px] items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.92fr_1fr] lg:px-16">
            <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
              <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#1f2530] sm:text-6xl lg:text-7xl">
                CPU 计算
              </h1>
              <p className="mt-7 max-w-[560px] text-xl leading-8 text-[#1f2530] sm:text-2xl sm:leading-10">
                从 AI 基础设施中释放更多性能与灵活性。
              </p>
            </div>
            <div className="mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-[24px] bg-white lg:mx-0">
              <VideoBox src={cpuVisualVideo} ariaLabel="CPU 计算首屏动画" />
            </div>
          </div>
        </section>

        <section className="border-y border-black/15 bg-[#f7f8fa]">
          <div className="px-6 py-18 text-center sm:px-10 lg:px-16 lg:py-20">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              新一代 AMD EPYC 与 Intel Xeon
            </h2>
            <p className="mx-auto mt-8 max-w-[760px] text-lg leading-8 text-black/82">
              使用高性能 CPU 支撑 GPU 加速工作负载。
            </p>
          </div>

          <div className="grid border-t border-black/15 lg:grid-cols-2">
            {processorFamilies.map((family, index) => (
              <article
                key={family.title}
                className="border-black/15 px-6 py-14 sm:px-10 lg:px-16 lg:py-18 lg:odd:border-r"
              >
                <div className="mx-auto max-w-[520px]">
                  <div className="flex items-center gap-6">
                    <Cpu className="h-9 w-9 text-[#536dfe]" aria-hidden="true" />
                    <h3 className="text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                      {family.title}
                    </h3>
                  </div>

                  <ul className="mt-14 space-y-10">
                    {family.points.map((point, pointIndex) => (
                      <li key={point} className="flex gap-8 text-lg leading-8">
                        <ChevronRight
                          className="mt-1 h-6 w-6 shrink-0 stroke-[3] text-black"
                          aria-hidden="true"
                        />
                        <span className={pointIndex === 1 ? 'text-black' : 'text-black/88'}>
                          {index === 0 && pointIndex === 1 ? (
                            <>
                              <span className="font-semibold text-[#2557ff] underline underline-offset-4">
                                相比通用 Milan 服务器，代际性能最高提升 26%
                              </span>
                              。
                            </>
                          ) : index === 1 && pointIndex === 1 ? (
                            <>
                              <span className="font-semibold text-[#2557ff] underline underline-offset-4">
                                采用铂金级处理器
                              </span>
                              ，提供面向关键任务的稳定性能。
                            </>
                          ) : (
                            point
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1220px] items-center gap-14 lg:grid-cols-[0.88fr_1fr]">
            <div className="max-w-[520px]">
              <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
                增强 GPU 集群性能
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-8 text-white/88">
                <p>
                  使用强大且高效的 CPU，让 GPU 集群获得更高利用率与更稳定的整体性能。
                </p>
                <p>
                  由 CPU 处理通用计算任务，让 GPU 专注于高强度训练、推理和生成式 AI 工作负载。
                </p>
              </div>
            </div>

            <div className="rounded-[24px] bg-white/[0.09] px-8 py-9 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:px-10 lg:px-12">
              <div className="space-y-10">
                {clusterFeatures.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <article key={feature.title} className="flex items-start gap-8">
                      <Icon className="h-12 w-12 shrink-0 text-white/80" aria-hidden="true" />
                      <div>
                        <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                          {feature.title}
                        </h3>
                        <p className="mt-5 max-w-[520px] text-lg leading-8 text-white/55">
                          {feature.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1180px] items-center gap-16 lg:grid-cols-[0.95fr_1fr] lg:gap-20">
            <div className="aspect-square overflow-hidden rounded-[24px] bg-white">
              <VideoBox src={cpuVisualVideo} ariaLabel="GenAI 集群 CPU 动画" />
            </div>
            <div className="max-w-[560px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                面向 GenAI 集群的 CPU
              </h2>
              <div className="mt-7 space-y-6 text-lg leading-8 text-black/88">
                <p>
                  使用合适的 CPU 作为支撑层，让 GPU 专注于构建和运行大语言模型。
                </p>
                <p>
                  为数据预处理、数据分析和实例中的关键任务获取所需计算能力。
                </p>
              </div>
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
