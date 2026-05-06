import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from "@/i18n/navigation";
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Cable,
  ChevronsRight,
  CloudRain,
  Gauge,
  LockKeyhole,
  Maximize2,
  Server,
  Sparkles,
  Zap,
} from 'lucide-react';
import DirectConnectMap from './DirectConnectMap';

export const metadata: Metadata = {
  title: '网络服务 | 算力租赁',
  description: '面向 AI 的高性能网络连接，覆盖 InfiniBand 集群网络、VPC、Direct Connect 与多云连接能力。',
};

const networkingImages = {
  hero: '/images/网络/6764a9d70efb2906a77beb24_hero_networking.avif',
  cta: '/images/网络/第5.avif',
};

const infinibandFeatures = [
  {
    title: '领先性能',
    description: '为多节点训练和推理提供高带宽、低延迟互联能力。',
    icon: Gauge,
  },
  {
    title: '超大规模',
    description: '面向超级计算规模的集群网络，支撑大规模 GPU 节点扩展。',
    icon: Maximize2,
  },
  {
    title: '极速连接',
    description: '通过 NVIDIA Quantum InfiniBand 提供超高速节点间通信。',
    icon: Zap,
  },
  {
    title: '优秀吞吐',
    description: '为数据密集型 AI 工作负载提供稳定、可预测的传输吞吐。',
    icon: Cable,
  },
  {
    title: '更快进入市场',
    description: '减少网络调优和部署阻力，让团队更快启动 GenAI 集群。',
    icon: ChevronsRight,
  },
];

const vpcFeatures = [
  {
    title: '增强安全性',
    description: '部署 VPC 网络，确保客户网络流量保持私有。',
    icon: LockKeyhole,
  },
  {
    title: '优化 GPU 计算',
    description: '从 GPU 节点卸载、加速并隔离网络任务，让计算能力专注于 AI 工作负载。',
    icon: Server,
  },
  {
    title: '一致性能',
    description: '在 GPU 节点和存储集群之间获得稳定、可预测的带宽。',
    icon: Gauge,
  },
  {
    title: '混合云与多云策略',
    description: '通过 Direct Connect 连接本地网络或传统云资源。',
    icon: CloudRain,
  },
];

const directConnectFeatures = [
  {
    title: '闪电般快速',
    description: '端口速度最高可达 400Gbps。',
    icon: Zap,
  },
  {
    title: '灵活选项',
    description: '可通过专用端口连接，也可通过 Equinix 等现有运营商接入。',
    icon: Sparkles,
  },
  {
    title: '成本友好',
    description: '无数据传输或出站流量费用，帮助团队控制网络成本。',
    icon: CloudRain,
  },
];

export default function NetworkingServicesPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="min-h-[660px] bg-[#f7f8fa]">
          <div className="mx-auto grid min-h-[660px] max-w-[1440px] items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.92fr_1fr] lg:px-16">
            <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
              <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#1f2530] sm:text-6xl lg:text-7xl">
                网络服务
              </h1>
              <p className="mt-7 max-w-[560px] text-xl leading-8 text-[#1f2530] sm:text-2xl sm:leading-10">
                专为 AI 打造的高性能连接能力。
              </p>
            </div>
            <div className="mx-auto aspect-[1.18] w-full max-w-[620px] lg:mx-0">
              <Image
                src={networkingImages.hero}
                alt="网络服务机房连接示意图"
                width={922}
                height={780}
                priority
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#050505] px-5 text-white sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1220px] overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex items-start justify-center border-white/15 px-6 py-16 lg:border-r lg:px-10 lg:py-20">
              <div className="w-full max-w-[520px]">
                <h2 className="text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl sm:tracking-[-0.04em]">
                  NVIDIA Quantum InfiniBand 集群网络
                </h2>
                <div className="mt-8 space-y-6 text-lg leading-8 text-white/88">
                  <p>
                    获得面向超级计算规模的高性能多节点互联能力。
                  </p>
                  <p>
                    我们与 NVIDIA 合作部署基于 NVIDIA Quantum InfiniBand 的集群网络，为 GenAI 提供行业领先性能。
                  </p>
                </div>
              </div>
            </div>

            <div>
              {infinibandFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="flex min-h-[118px] items-start gap-6 border-t border-white/15 px-6 py-7 first:border-t-0 lg:px-8"
                  >
                    <Icon className="mt-1 h-8 w-8 shrink-0 text-white/75" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                        {feature.title}
                      </h3>
                      <p className="mt-3 max-w-[560px] text-base leading-7 text-white/55">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-black/15 bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1160px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              虚拟私有云
            </h2>
            <div className="mx-auto mt-8 max-w-[900px] space-y-6 text-lg leading-8 text-black/86">
              <p>
                创建虚拟化、加速型网络，用于管理由 NVIDIA BlueField-3 DPU 驱动的云资源。
              </p>
              <p>
                为 GenAI 安全、高效地连接计算、存储和更多资源。
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {vpcFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Card
                    key={feature.title}
                    className="min-h-[320px] rounded-[20px] border-[#0b45f5] bg-transparent shadow-none"
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

        <section className="bg-[#050505] px-5 text-white sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1220px] overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
            <div className="border-white/15 px-6 py-16 lg:border-r lg:px-10 lg:py-20">
              <div className="mx-auto max-w-[580px]">
                <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
                  Direct Connect
                </h2>
                <p className="mt-7 text-lg leading-8 text-white/88">
                  专线连接和接入点覆盖主要地理市场与多个网络 POP。获取私有、高性能连接，快速、安全地访问数据。
                </p>
                <DirectConnectMap />
              </div>
            </div>

            <div>
              {directConnectFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="flex min-h-[190px] items-start gap-6 border-t border-white/15 px-6 py-10 first:border-t-0 lg:px-8 lg:py-12"
                  >
                    <Icon className="mt-1 h-8 w-8 shrink-0 text-white/75" aria-hidden="true" />
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                        {feature.title}
                      </h3>
                      <p className="mt-5 max-w-[560px] text-base leading-7 text-white/55">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-black/15 bg-[#f7f8fa] px-6 py-20 text-center sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[900px]">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              多云支持
            </h2>
            <p className="mx-auto mt-8 max-w-[760px] text-lg leading-8 text-black/84">
              我们的网络服务面向多云需求构建。查看文档，了解更多连接方式与配置细节。
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-8 h-14 rounded-full border-[#0b45f5] bg-transparent px-9 text-base font-semibold text-[#0b45f5] hover:bg-[#0b45f5] hover:text-white"
            >
              <Link href="/docs">查看文档</Link>
            </Button>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-[#101010] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28">
          <Image
            src={networkingImages.cta}
            alt=""
            fill
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-88"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/72 to-black/20" />
          <div className="mx-auto max-w-[1180px]">
            <div className="max-w-[680px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                面向 GenAI 的高速网络服务
              </h2>
              <p className="mt-7 text-lg leading-8 text-white/78">
                不要让低效网络拖慢 GPU。获得稳定、低延迟、高吞吐的 AI 网络连接能力。
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
