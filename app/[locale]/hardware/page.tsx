import type { Metadata } from 'next';
import { Link } from "@/i18n/navigation";
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { HardwareQuoteFlow } from './HardwareQuoteFlow';
import { MarketingGlowCard } from '@/components/marketing/MarketingGlowCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  BadgeCheck,
  Check,
  Flame,
  Gauge,
  MemoryStick,
  PackageCheck,
  Server,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'GPU 硬件 | 算力租赁',
  description:
    '通过经过审核的供应商网络采购全新或认证翻新 GPU 服务器，并预配置为平台可用状态。',
};

const hardwareVideo =
  '/videos/yingjian/GPU%20Hardware%20%E2%80%94%20Vast%20Hardware%20Vast.ai.mp4';

const shellClass =
  'mx-auto w-[calc(100%-40px)] max-w-[1220px] max-[720px]:w-[calc(100%-24px)]';

const assurances = ['新建与翻新', '烧入测试', '平台准备'];

const steps = [
  {
    title: '告诉我们你需要什么',
    description:
      '分享你的 GPU 需求、偏好的状态、数量和时间安排。我们会为你匹配合适的供应商。',
  },
  {
    title: '我们负责获取和测试',
    description:
      '我们的团队从多个供应商处采购选项，无论是全新还是翻新设备。每块 GPU 在到达你手中之前，都通过我们的认证流程。',
  },
  {
    title: '部署与赚取',
    description:
      '获得认证硬件，安装我们的客户端，开始托管。你的 GPU 从第一天起就已经准备好支持平台。',
  },
];

const valueCards: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: '批量定价',
    description:
      '我们的采购量和供应商关系转化为你无法自行获取的价格。你买得越多，价格就越好。',
    icon: Gauge,
  },
  {
    title: '平台准备',
    description:
      '硬件到达时已预配置为平台使用。安装客户端，列出机器，从第一天起开始赚取收入。',
    icon: Server,
  },
  {
    title: 'Vast 认证',
    description:
      '每个设备都经过我们的 GPU 验证流程。你会收到一份认证报告，包含烧屏、显存、基准测试和散热结果。',
    icon: BadgeCheck,
  },
  {
    title: '融资整合',
    description:
      '将硬件采购与融资结合，加快扩展速度。你的平台收益甚至能帮助你获得更好的条款。',
    icon: ShieldCheck,
  },
];

const certificationItems: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: '烧入测试',
    description: '满载 72 小时压力测试',
    icon: Flame,
  },
  {
    title: '显存验证',
    description: '完整的内存检查，无缺陷',
    icon: MemoryStick,
  },
  {
    title: '基准评分',
    description: '性能与参考验证',
    icon: Gauge,
  },
  {
    title: '热剖面',
    description: '持续负载下冷却已确认',
    icon: Truck,
  },
];

function HardwareVideo({
  className = '',
  label = 'GPU 硬件采购背景视频',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <video
      aria-label={label}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className={`h-full w-full object-cover ${className}`}
    >
      <source src={hardwareVideo} type="video/mp4" />
    </video>
  );
}

export default function HardwarePage() {
  return (
    <>
      <Header />
      <main className="bg-[#08090a] text-[#f7f8f8]">
        <section className="border-b border-white/10">
          <div className={`${shellClass} py-20 text-center sm:py-24 lg:py-28`}>
            <h1 className="mx-auto max-w-[900px] text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              寻找准备好赚钱的显卡
            </h1>
            <p className="mx-auto mt-7 max-w-[720px] text-base leading-7 text-[#d0d6e0] sm:text-lg sm:leading-8">
              来自我们经过审核的供应商网络提供的全新认证翻新 GPU 服务器。每一台设备都经过压力测试、基准验证，并预配置支持平台，因此你的硬件从第一天起就开始获得收益。
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              {assurances.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 text-sm font-semibold text-[#d0d6e0]">
                  <Check className="h-4 w-4 text-[#27a644]" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-20 sm:py-24">
          <div className={shellClass}>
            <div className="text-center">
              <h2 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                工作原理
              </h2>
              <p className="mt-5 text-base leading-7 text-[#8a8f98] sm:text-lg">
                提交一次。我们从多个供应商那里采购，并提供多种选择。
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {steps.map((step, index) => (
                <MarketingGlowCard
                  key={step.title}
                  contentClassName="min-h-[230px] p-7 sm:p-8"
                >
                  <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em]">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="mt-6 text-base leading-7 text-[#a4acb6]">
                    {step.description}
                  </p>
                </MarketingGlowCard>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className={shellClass}>
            <div className="relative isolate overflow-hidden rounded-[8px] border border-white/10 px-7 py-16 sm:px-10 lg:px-16 lg:py-20">
              <HardwareVideo className="absolute inset-0 -z-20 opacity-45" />
              <div className="absolute inset-0 -z-10 bg-[#08090a]/72" />

              <div className="text-center">
                <h2 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  为什么选择通过 Vast
                </h2>
                <p className="mx-auto mt-5 max-w-[740px] text-base leading-7 text-[#a4acb6] sm:text-lg">
                  你的 GPU 硬件采购合作伙伴不是经销商，而是可信赖的中介，拥有跨新建和翻新渠道的供应商关系。
                </p>
              </div>

              <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {valueCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <MarketingGlowCard
                      key={card.title}
                      backgroundColor="rgba(5,5,6,0.9)"
                      contentClassName="min-h-[260px] p-7"
                    >
                      <Icon className="h-8 w-8 text-[#8a8f98]" aria-hidden="true" />
                      <h3 className="mt-7 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {card.title}
                      </h3>
                      <p className="mt-6 text-base leading-7 text-[#a4acb6]">
                        {card.description}
                      </p>
                    </MarketingGlowCard>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className={`${shellClass} rounded-[8px] border border-white/12`}>
            <div className="grid lg:grid-cols-[0.88fr_1fr]">
              <div className="border-white/12 p-8 sm:p-12 lg:border-r lg:p-14">
                <h2 className="text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                  你获得的服务：Vast 认证
                </h2>
                <p className="mt-7 max-w-[560px] text-base leading-7 text-[#a4acb6] sm:text-lg">
                  每台设备在发货前都会通过我们的 GPU 验证流程。每笔订单都会收到一份认证报告。
                </p>

                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                  {certificationItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Card
                        key={item.title}
                        className="rounded-[8px] border-white/12 bg-white/[0.02] text-[#f7f8f8] shadow-none"
                      >
                        <CardContent className="p-6">
                          <Icon className="h-7 w-7 text-[#8a8f98]" aria-hidden="true" />
                          <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">
                            {item.title}
                          </h3>
                          <p className="mt-3 text-sm leading-6 text-[#a4acb6]">
                            {item.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <HardwareQuoteFlow />
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className={shellClass}>
            <div className="rounded-[8px] bg-white/[0.08] px-7 py-16 text-center sm:px-10 lg:px-16 lg:py-20">
              <PackageCheck className="mx-auto h-10 w-10 text-[#9aa2ff]" aria-hidden="true" />
              <h2 className="mx-auto mt-8 max-w-[820px] text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                准备好组建你的 GPU 车队了吗？
              </h2>
              <p className="mx-auto mt-5 max-w-[720px] text-base leading-7 text-[#d0d6e0] sm:text-lg">
                通过我们经过审核的供应商网络采购硬件，或探索融资以加快规模化。
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  className="h-11 rounded-[6px] bg-[#5e6ad2] px-6 text-base font-semibold text-white hover:bg-[#828fff]"
                >
                  <Link href="/financing">探索融资</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-[6px] border-white/20 bg-transparent px-6 text-base font-semibold text-[#f7f8f8] hover:bg-white/[0.06] hover:text-white"
                >
                  <Link href="/contact-sales">开始托管</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
