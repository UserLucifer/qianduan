import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from "@/i18n/navigation";
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getBlogPosts } from '@/api/blog';
import type { BlogPostResponse, PageResult } from '@/api/blog';
import { BlogCard } from '@/components/shared/BlogCard';
import {
  HeroVideoFrame,
  TestimonialCarousel,
  type SunkTestimonial,
} from './SunkInteractive';
import {
  ArrowRight,
  CalendarDays,
  Cpu,
  Eye,
  Gauge,
  LifeBuoy,
  Network,
  RadioTower,
  Repeat2,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { normalizeLocale } from '@/i18n/locales';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'SUNK | 算力租赁',
  description: 'CoreWeave SUNK 是面向大规模、长周期 AI 训练任务的统一训练系统。',
};

const emptyBlogPage: PageResult<BlogPostResponse> = {
  records: [],
  total: 0,
  pageNo: 1,
  pageSize: 3,
};

const sunkAssets = {
  heroVideo: '/videos/SUNK/SUNK%20Production-Ready%20AI%20Training%20at%20Massive%20Scale.mp4',
  pattern: '/images/SNK/10002.svg',
  semiLogo: '/images/SNK/10001.png',
  cursorLogo: '/images/SNK/10003.svg',
  dylan: '/images/SNK/69f108d99034a7e0f00b8414_quotee_dylan.jpg',
  brian: '/images/SNK/69a759dff04f5c4150fd41db_headshot_brian-belgodere.png',
  sam: '/images/SNK/69a75a02ab70f0ee6c9f063f_headshot_sam-kottler.png',
};

const productionFeatures: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: '生命周期统一',
    description:
      '统一研究团队运行 Slurm 与平台团队运维集群的方式。SUNK 用户配置自动化安全入驻流程，减少身份与配置漂移，让团队从第一天就保持一致。',
    icon: Repeat2,
  },
  {
    title: '可靠性',
    description:
      '以生产级可靠性运行大规模、长周期训练任务。Mission Control 端到端监控集群健康，检测静默硬件问题和 GPU 拖尾，并在中断扩大前完成缓解。',
    icon: LifeBuoy,
  },
  {
    title: '性能',
    description:
      '通过拓扑感知调度和面向分布式训练调优的可预测集群行为，减少中断、重试和 GPU 资源碎片化，最大化有效训练时间。',
    icon: Gauge,
  },
  {
    title: '可观测性',
    description:
      '从基础设施健康到作业级行为获得运维可见性，将 Slurm 指标与 GPU、网络、存储信号关联，快速发现瓶颈并保持训练在轨。',
    icon: Eye,
  },
];

const offeringCards: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: 'SUNK 自助服务',
    description:
      '更快上线生产就绪的 SUNK 集群。自助服务简化团队部署和管理集群的方式，在训练开始前降低设置摩擦。',
    icon: RadioTower,
  },
  {
    title: 'SUNK Anywhere',
    description:
      '把统一训练系统扩展到 CoreWeave 之外，让团队在基础设施扩展时保留一致的高要求 AI 工作负载运行方式。',
    icon: Sparkles,
  },
  {
    title: 'Mission Control',
    description:
      '端到端监控集群健康与生命周期控制，检测硬件异常和 GPU 拖尾，并自动缓解故障，让长周期训练保持在轨。',
    icon: ShieldCheck,
  },
  {
    title: '统一调度与可观测性',
    description:
      '更紧密地同步 Slurm 与 Kubernetes，内置统一调度和可观测性钩子，随着工作负载扩展减少工具割裂与人工协调。',
    icon: CalendarDays,
  },
];

const infrastructureCards: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: '计算服务',
    description: '在 Kubernetes 原生环境中获取最新 GPU 计算能力，支撑最复杂的 AI 工作负载。',
    icon: Cpu,
  },
  {
    title: '存储服务',
    description: '灵活、专用、高性能的存储服务，为 AI 训练数据与模型资产提供稳定支撑。',
    icon: RadioTower,
  },
  {
    title: '网络服务',
    description: '面向最优集群横向扩展与连接性的高性能网络，让训练任务保持低延迟与高吞吐。',
    icon: Network,
  },
  {
    title: '超算规模与企业级安全',
    description: '通过大规模 GPU 集群、安全能力和可观测性支撑多万亿参数模型训练。',
    icon: ShieldCheck,
  },
];

const faqItems = [
  {
    question: '什么是 CoreWeave SUNK？',
    answer:
      'CoreWeave SUNK 是统一训练系统，面向最苛刻的 AI 工作负载，把 Slurm 的研究工作流与 Kubernetes 原生运维能力结合起来。',
  },
  {
    question: 'SUNK 自助服务如何帮助团队更快上线集群？',
    answer:
      'SUNK 自助服务通过引导式路径捕获 CoreWeave 的运维经验，让客户更快完成集群配置、身份管理和上线准备。',
  },
  {
    question: '什么是 SUNK Anywhere？',
    answer:
      'SUNK Anywhere 将 CoreWeave 的统一训练系统扩展到更多基础设施环境，让团队以一致工作流运行高要求 AI 负载。',
  },
  {
    question: 'Mission Control 如何支持长周期训练？',
    answer:
      'Mission Control 提供持续健康监控、自动化修复和深入运维可见性，帮助大规模训练任务保持可靠运行。',
  },
  {
    question: 'SUNK 已验证哪些性能与可靠性结果？',
    answer:
      'SUNK 旨在提升有效训练时间和训练 goodput，通过拓扑感知调度、健康检查和自动修复减少中断与资源碎片。',
  },
];

const testimonials: SunkTestimonial[] = [
  {
    quote:
      'CoreWeave SUNK 自助服务让客户能够更轻松部署集群。即使已有长期合同，也有很多理由快速启动自助集群。最终，速度就是护城河。',
    name: 'Dylan Patel',
    role: 'SemiAnalysis 创始人、CEO 与首席分析师',
    image: sunkAssets.dylan,
    logo: sunkAssets.semiLogo,
    logoAlt: 'SemiAnalysis',
  },
  {
    quote:
      '在机架级 GB200 系统上，SUNK 的拓扑感知调度和自定义仪表盘让训练运行更快、更高效，集群利用率也更高。',
    name: 'Brian Belgodere',
    role: 'IBM 高级技术人员',
    image: sunkAssets.brian,
    logoText: 'IBM',
  },
  {
    quote:
      '我们需要可以扩展且不会拖慢运维的基础设施。SUNK 开箱即用地提供共享文件系统、自动用户配置和可定制环境，让研究人员专注研究。',
    name: 'Sam Kottler',
    role: 'Cursor ML Infra',
    image: sunkAssets.sam,
    logo: sunkAssets.cursorLogo,
    logoAlt: 'Cursor',
  },
];

type SunkPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SunkPage({ params }: SunkPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);

  const postsRes = await getBlogPosts({
    pageNo: 1,
    pageSize: 3,
    publish_status: 1,
    language,
  }).catch(() => ({ data: emptyBlogPage }));
  const latestPosts = postsRes.data ?? emptyBlogPage;

  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="min-h-[680px] bg-[#f7f8fa]">
          <div className="mx-auto grid min-h-[680px] max-w-[1320px] items-center gap-14 px-6 py-20 sm:px-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-16">
            <div>
              <h1 className="text-5xl font-semibold leading-[1.03] tracking-[-0.05em] text-[#1f2530] sm:text-6xl lg:text-7xl">
                CoreWeave SUNK
              </h1>
              <p className="mt-8 max-w-[620px] text-xl leading-8 text-[#1f2530] sm:text-2xl sm:leading-10">
                面向最严苛 AI 工作负载的统一训练系统，为大规模、长周期训练任务提供生产级可靠性与运维可见性。
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
                  variant="outline"
                  className="h-14 rounded-full border-black bg-transparent px-9 text-base font-semibold text-black hover:bg-black hover:text-white"
                >
                  <Link href="/contact-sales">
                    联系销售
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <HeroVideoFrame
              src={sunkAssets.heroVideo}
              ariaLabel="CoreWeave SUNK 视频"
              className="aspect-[1.78] rounded-[22px] bg-white"
            />
          </div>
        </section>

        <section className="bg-[#e9edf2] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <div className="max-w-[620px]">
              <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                重新定义面向生产级训练的 AI 研究集群
              </h2>
              <p className="mt-8 text-lg leading-8 text-black/82">
                SUNK 为运行大规模、长周期训练任务的 AI 研究团队而构建。在这些任务中，可预测性、可靠性和运维可见性与原始性能同样重要。
              </p>
              <p className="mt-6 text-lg leading-8 text-black/82">
                SUNK 保留研究人员依赖的 Slurm 工作流，同时把 Kubernetes 原生的运维纪律带入集群。
              </p>
            </div>

            <div className="space-y-6">
              {productionFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Card key={feature.title} className="rounded-[20px] border-0 bg-white shadow-none">
                    <CardContent className="grid gap-7 p-8 sm:grid-cols-[42px_1fr] sm:p-10">
                      <Icon className="h-9 w-9 text-[#2f7cff]" aria-hidden="true" />
                      <div>
                        <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                          {feature.title}
                        </h3>
                        <p className="mt-5 text-lg leading-8 text-black/58">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1220px] text-center">
            <h2 className="mx-auto max-w-[820px] text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              市场中最成熟的 Slurm-on-Kubernetes 产品
            </h2>
            <p className="mx-auto mt-8 max-w-[850px] text-lg leading-8 text-black/78">
              SUNK 是面向高要求 AI 工作负载的统一训练系统，为长周期训练任务提供可靠性、性能和运维可见性。
            </p>

            <div className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
              {offeringCards.map((card) => {
                const Icon = card.icon;

                return (
                  <Card key={card.title} className="rounded-[20px] border-0 bg-[#eef1f5] text-left shadow-none">
                    <CardContent className="flex min-h-[360px] flex-col p-9">
                      <Icon className="h-9 w-9 text-[#2f7cff]" aria-hidden="true" />
                      <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {card.title}
                      </h3>
                      <p className="mt-7 text-lg leading-8 text-black/62">{card.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#eef1f5] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1120px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              生产规模先锋团队验证
            </h2>
            <Link
              href="/blog"
              className="mt-7 inline-flex items-center gap-2 text-base font-semibold text-[#0b45f5] underline underline-offset-4"
            >
              查看更多客户故事
              <ArrowRight className="h-4 w-4" />
            </Link>

            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>

        <section className="bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1180px] text-center">
            <h2 className="mx-auto max-w-[820px] text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              运行在行业领先的云基础设施服务之上
            </h2>
            <p className="mx-auto mt-8 max-w-[980px] text-lg leading-8 text-white/86">
              SUNK 运行在为 AI 训练性能、规模和运维一致性构建的 CoreWeave 基础设施服务之上。
            </p>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {infrastructureCards.map((card) => {
                const Icon = card.icon;

                return (
                  <Card key={card.title} className="rounded-[18px] border-0 bg-[#24272b] text-left text-white shadow-none">
                    <CardContent className="min-h-[300px] p-8">
                      <Icon className="h-9 w-9 text-[#62a1ff]" aria-hidden="true" />
                      <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {card.title}
                      </h3>
                      <p className="mt-7 text-lg leading-8 text-white/86">{card.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[780px]">
            <h2 className="text-center text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
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

        <section className="bg-[#eef1f5] px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1220px]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                相关资源
              </h2>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-lg font-semibold text-[#0b45f5] underline underline-offset-4"
              >
                查看全部资源
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-x-8 gap-y-12 lg:grid-cols-3">
              {latestPosts.records.length > 0 ? (
                latestPosts.records.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))
              ) : (
                <div className="col-span-full rounded-[18px] bg-white p-10 text-center text-black/62">
                  暂无已发布博客内容。
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:px-10 lg:px-16">
          <div className="relative mx-auto grid max-w-[1180px] overflow-hidden rounded-[18px] bg-[#eef3f8] p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
            <div className="relative z-10">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                看看 SUNK 能为你做什么
              </h2>
              <p className="mt-8 max-w-[560px] text-lg leading-8 text-black/80">
                获得团队构建、训练和部署新模型所需的资源灵活性。
              </p>
              <Button
                asChild
                className="mt-10 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">立即开始</Link>
              </Button>
            </div>
            <div className="relative z-10 mt-10 lg:mt-0">
              <h3 className="text-3xl font-semibold tracking-[-0.04em]">了解更多</h3>
              <div className="mt-8 space-y-5">
                <Link href="/docs" className="block font-semibold text-[#0b45f5] underline underline-offset-4">
                  文档
                </Link>
                <Link href="/contact-sales" className="block font-semibold text-[#0b45f5] underline underline-offset-4">
                  价格
                </Link>
              </div>
            </div>
            <Image
              src={sunkAssets.pattern}
              alt=""
              fill
              sizes="100vw"
              className="absolute inset-y-0 right-0 object-cover object-right opacity-80"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
