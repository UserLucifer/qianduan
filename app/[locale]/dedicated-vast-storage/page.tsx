import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from "@/i18n/navigation";
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle2,
  ChevronRight,
  Layers3,
  Plus,
  Server,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '专用 VAST 存储 | 算力租赁',
  description: '为专用 AI 工作负载提供独享、高性能的 VAST 存储能力，支持物理隔离、VMS 访问、复制、审计与配额控制。',
};

const vastImages = {
  hero: '/images/专用vast存储/10002.avif',
  cta: '/images/专用vast存储/10001.avif',
};

const metrics = [
  {
    value: '100',
    unit: 'PB',
    label: '可用存储',
    description: '最大可用容量',
  },
  {
    value: '2',
    unit: 'TB/s',
    label: '读取带宽',
    description: '大规模顺序读取吞吐',
  },
  {
    value: 'Millions',
    unit: '',
    label: '读取 IOPS',
    description: '最大规模下的随机 4K 读取性能',
  },
];

const capabilities = [
  {
    title: '物理隔离',
    description: '专用硬件带来完整的物理存储隔离，与其他客户环境分离。',
    icon: Layers3,
  },
  {
    title: '完整 VMS 访问',
    description: '可直接访问 VAST Management System，并获得故障转移、QoS 和配额管理等租户级控制。',
    icon: SlidersHorizontal,
  },
  {
    title: '协议灵活性',
    description: '通过任意 VAST 支持的协议连接，包括 NFS、S3 或 NVMe-over-TCP，并支持标准 VAST CSI 驱动。',
    icon: Server,
  },
  {
    title: '最新 VAST 能力',
    description: '访问 DataBase、DataEngine、快照、审计日志、VAST Catalog 以及持续发布的新能力。',
    icon: Sparkles,
  },
];

const dedicatedReasons = [
  {
    title: 'VAST 全局访问与复制',
    description: '与其他 VAST 集群互通，支持跨集群复制和全局命名空间访问。',
  },
  {
    title: '专属加密密钥',
    description: '集群启动时即可启用静态数据加密，并为每个租户提供独立加密密钥。',
  },
  {
    title: '详细审计日志',
    description: '完整控制 VAST 审计与日志服务，满足合规性与可见性要求。',
  },
  {
    title: 'QoS 与配额控制',
    description: '通过直接 VMS 访问进行租户级服务质量和配额管理。',
  },
  {
    title: 'SSO/SAML 身份提供商支持',
    description: '可与身份提供商集成，实现集中访问控制和单点登录。',
  },
];

const faqs = [
  {
    question: '什么是专用 VAST 存储？',
    answer: '专用 VAST 存储是在专属硬件上部署的单租户 VAST AI Operating System，为工作负载提供完整平台访问能力。',
  },
  {
    question: '何时应选择专用 VAST 存储？',
    answer: '当工作负载需要严格数据隔离、高级安全控制、混合复制，或依赖深度 VAST 生态能力时，专用 VAST 存储更合适。',
  },
  {
    question: '它如何与 GPU 工作负载集成？',
    answer: '专用 VAST 集群可与 GPU 基础设施部署在同一数据中心，并通过标准 VAST CSI 驱动接入，降低数据访问延迟。',
  },
];

export default function DedicatedVastStoragePage() {
  return (
    <>
      <Header />
      <main className="bg-white text-black">
        <section className="relative isolate overflow-hidden bg-[#0826b7] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28">
          <Image
            src={vastImages.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            unoptimized
            className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071a86]/85 via-[#092dc5]/28 to-transparent" />

          <div className="mx-auto max-w-[1220px]">
            <div className="max-w-[620px]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6db4ff] sm:text-base">
                CoreWeave 专用存储
              </p>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                专用 VAST 存储
              </h1>
              <p className="mt-8 max-w-[620px] text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-10">
                为专用工作负载构建的独享高性能 AI 存储。
              </p>
              <p className="mt-8 max-w-[760px] text-base leading-7 text-white/88 sm:text-lg sm:leading-8">
                面向需要访问 VAST 生态的混合与专用工作负载，提供直接 VMS 访问、专用硬件物理隔离，以及 DataBase、DataEngine、快照、复制等完整 VAST 平台能力。
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  className="h-14 rounded-full bg-[#2c82ff] px-9 text-base font-semibold text-white hover:bg-[#4f99ff]"
                >
                  <Link href="/contact-sales">联系销售</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-14 rounded-full border-white/80 bg-transparent px-9 text-base font-semibold text-white hover:bg-white hover:text-[#0826b7]"
                >
                  <Link href="/docs">
                    了解更多
                    <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-24 rounded-[18px] bg-[#071f9d]/72 p-8 backdrop-blur-sm sm:p-10 lg:p-14">
              <div className="grid gap-10 md:grid-cols-3">
                {metrics.map((metric) => (
                  <article key={metric.label}>
                    <p className="text-5xl font-semibold leading-none tracking-[-0.05em] sm:text-6xl">
                      {metric.value}
                      {metric.unit ? (
                        <span className="ml-1 text-2xl tracking-[-0.03em] sm:text-3xl">
                          {metric.unit}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#77b7ff]">
                      {metric.label}
                    </p>
                    <p className="mt-9 text-base leading-7 text-white">
                      {metric.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1220px] text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0b45f5]">
              核心能力
            </p>
            <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              完整 VAST 能力，零共享环境。
            </h2>
            <p className="mx-auto mt-7 max-w-[760px] text-lg leading-8 text-black/72">
              专用 VAST 让你的工作负载独享专用硬件，获得完整 VAST AI Operating System 的能力。
            </p>

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {capabilities.map((item) => {
                const Icon = item.icon;

                return (
                  <Card
                    key={item.title}
                    className="min-h-[290px] rounded-[18px] border-0 bg-[#f0f2f5] text-left shadow-none"
                  >
                    <CardContent className="p-9">
                      <Icon className="h-9 w-9 text-[#2d7dff]" aria-hidden="true" />
                      <h3 className="mt-10 text-xl font-semibold tracking-[-0.03em]">
                        {item.title}
                      </h3>
                      <p className="mt-8 text-base leading-7 text-black/62">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#e9edf2] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1220px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div className="max-w-[560px]">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0b45f5]">
                为什么选择专用 VAST 存储？
              </p>
              <h2 className="mt-7 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                当标准存储无法满足需求
              </h2>
              <div className="mt-8 space-y-7 text-lg leading-8 text-black/78">
                <p>
                  对多数 AI 工作负载来说，AI 对象存储与分布式文件存储是推荐起点。它们面向 GPU 加速流水线构建，具备零流出计价与 Kubernetes 集成能力。
                </p>
                <p>
                  但混合环境、严格合规或深度 VAST 生态依赖是另一回事。此时需要只有专用集群才能提供的隔离、控制与扩展能力。
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {dedicatedReasons.map((reason) => (
                <Card key={reason.title} className="rounded-[18px] border-0 bg-white shadow-none">
                  <CardContent className="flex gap-6 p-8 sm:p-10">
                    <CheckCircle2
                      className="mt-0.5 h-9 w-9 shrink-0 text-[#5b9dff]"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {reason.title}
                      </h3>
                      <p className="mt-7 text-lg leading-8 text-black/58">
                        {reason.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[880px]">
            <h2 className="text-center text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              常见问题
            </h2>
            <div className="mt-14 space-y-8">
              {faqs.map((faq) => (
                <Card key={faq.question} className="rounded-[18px] border-0 bg-[#f4f5f7] shadow-none">
                  <CardContent className="flex gap-6 p-8 sm:p-10">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-semibold leading-tight tracking-[-0.03em]">
                        {faq.question}
                      </h3>
                      <p className="mt-7 text-lg leading-8 text-black/58">
                        {faq.answer}
                      </p>
                    </div>
                    <Plus className="mt-0.5 h-6 w-6 shrink-0 text-[#0b45f5]" aria-hidden="true" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 pb-20 sm:px-10 lg:px-16 lg:pb-24">
          <div className="relative isolate mx-auto grid max-w-[1220px] overflow-hidden rounded-[20px] bg-[#f1f3f7] p-8 sm:p-12 lg:grid-cols-[1.08fr_0.92fr] lg:p-14">
            <Image
              src={vastImages.cta}
              alt=""
              fill
              sizes="100vw"
              unoptimized
              className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#f1f3f7] via-[#f1f3f7]/92 to-[#f1f3f7]/22" />
            <div className="max-w-[560px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                准备开始使用专用 VAST 存储？
              </h2>
              <p className="mt-10 text-lg leading-8 text-black/72">
                与我们的团队沟通容量、价格和集群部署方案。
              </p>
              <Button
                asChild
                className="mt-10 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">联系销售</Link>
              </Button>
            </div>
            <div className="mt-12 max-w-[360px] lg:mt-0 lg:justify-self-center">
              <h3 className="text-3xl font-semibold leading-tight tracking-[-0.04em]">
                了解更多
              </h3>
              <Link
                href="/docs"
                className="mt-8 inline-flex items-center border-b border-[#0b45f5] text-base font-semibold text-[#0b45f5]"
              >
                查看文档
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
