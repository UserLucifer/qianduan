import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import {
  Cpu,
  Search,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '裸金属服务器 | 算力租赁',
  description: '获取快速、可靠、高性能的裸金属服务器，直接访问 GPU、CPU、网络和存储资源。',
};

const bareMetalImages = {
  hero: '/images/裸金属/第1.avif',
  stack: '/images/裸金属/第2.avif',
  observability: '/images/裸金属/第4.avif',
  cta: '/images/裸金属/第5.avif',
};

const hypervisorFeatures = [
  {
    title: '释放更高性能',
    description: '无需虚拟化层限制，直接访问 NVIDIA GPU 与 x86 或 Arm CPU 的完整性能。',
    icon: Zap,
  },
  {
    title: '最大化可靠性',
    description: '更简洁的软件栈减少潜在问题暴露面，提升可靠性与在线时间。',
    icon: ShieldCheck,
  },
  {
    title: '释放计算资源',
    description: '通过 NVIDIA BlueField DPU 卸载网络、安全与存储处理任务，让算力资源发挥更大价值。',
    icon: Cpu,
  },
  {
    title: '获得深入洞察',
    description: '查看集群健康与性能指标，获得更细粒度的可观测性体验。',
    icon: Search,
  },
];

export default function BareMetalServersPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="relative isolate flex min-h-[360px] items-center justify-center overflow-hidden bg-[#050505] px-6 py-20 text-center text-white sm:px-10 lg:px-16">
          <Image
            src={bareMetalImages.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 -z-10 bg-black/35" />
          <div className="mx-auto max-w-[860px]">
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              裸金属服务器
            </h1>
            <p className="mx-auto mt-7 max-w-[600px] text-xl leading-8 text-white/86 sm:text-2xl">
              快速、可靠、高性能。
            </p>
          </div>
        </section>

        <section className="bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
            <div className="max-w-[520px] lg:justify-self-end">
              <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                获得裸金属性能优势
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-8 text-white/88">
                <p>
                  大多数生成式 AI 工作负载并不需要虚拟化，它们需要直接访问资源，以最大性能和低延迟运行训练、推理和实验。
                </p>
                <p>
                  直接运行在裸金属服务器上，让新模型构建更快、更稳定。
                </p>
              </div>
              <Button
                asChild
                className="mt-9 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">立即开始</Link>
              </Button>
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-[22px] bg-[#111] lg:min-h-[540px]">
              <Image
                src={bareMetalImages.stack}
                alt="裸金属服务器软件栈示意图"
                fill
                sizes="(min-width: 1024px) 760px, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] px-5 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1220px] overflow-hidden border-y border-black/15 text-black lg:grid-cols-[0.86fr_1.14fr]">
            <div className="flex items-start justify-center border-black/15 px-6 py-16 lg:border-r lg:px-10 lg:py-20">
              <div className="w-full max-w-[520px]">
                <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
                  去掉 Hypervisor 层
                </h2>
                <div className="mt-8 space-y-7 text-lg leading-8 text-black/86">
                  <p>
                    虚拟化通常会限制性能、削弱可观测性，并让环境管理变得更复杂。
                  </p>
                  <p>
                    Kubernetes 直接运行在裸金属服务器上，让你同时获得云式交付灵活性与专用硬件性能。
                  </p>
                  <p>
                    更好地观察工作负载，并充分使用 GPU、CPU、网络和存储资源。
                  </p>
                </div>
              </div>
            </div>

            <div>
              {hypervisorFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="flex min-h-[150px] items-start gap-6 border-t border-black/15 px-6 py-8 first:border-t-0 lg:px-8"
                  >
                    <Icon className="mt-1 h-8 w-8 shrink-0 text-black/70" aria-hidden="true" />
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                        {feature.title}
                      </h3>
                      <p className="mt-4 max-w-[560px] text-base leading-7 text-black/58">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[0.9fr_1fr] lg:gap-20">
            <div className="max-w-[560px]">
              <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
                前沿可观测性
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-8 text-white/88">
                <p>
                  虚拟化会让团队更难获得追踪性能所需的数据。
                </p>
                <p>
                  裸金属栈提供低层级、高分辨率指标访问能力，让团队始终掌握关键运行细节。
                </p>
              </div>
            </div>

            <div className="relative aspect-[1.78] overflow-hidden rounded-[24px] bg-[#101113] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
              <Image
                src={bareMetalImages.observability}
                alt="GPU 集群可观测性仪表盘"
                fill
                sizes="(min-width: 1024px) 620px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-[#101010] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28">
          <Image
            src={bareMetalImages.cta}
            alt=""
            fill
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-88"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/72 to-black/20" />
          <div className="mx-auto max-w-[1180px]">
            <div className="max-w-[520px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                裸金属更适合 AI
              </h2>
              <p className="mt-7 text-lg leading-8 text-white/78">
                准备开始构建更快、更可靠的 AI 基础设施。
              </p>
              <Button
                asChild
                className="mt-9 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">联系我们</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
