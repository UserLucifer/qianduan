import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { HardwareQuoteFlow } from '@/app/hardware/HardwareQuoteFlow';
import { MarketingGlowCard } from '@/components/marketing/MarketingGlowCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  CircleDollarSign,
  CreditCard,
  Flame,
  Gauge,
  Handshake,
  Landmark,
  LineChart,
  MemoryStick,
  PackageCheck,
  Repeat2,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'GPU 融资 | 算力租赁',
  description:
    '为 GPU 主机与基础设施提供融资匹配，帮助团队用平台收入覆盖还款并扩展可用算力。',
};

const financingVideo =
  '/videos/rongzi/GPU%20Financing%20%E2%80%94%20Vast%20Finance%20Vast.ai.mov';

const shellClass =
  'mx-auto w-[calc(100%-40px)] max-w-[1220px] max-[720px]:w-[calc(100%-24px)]';

const assurances = ['自由调查', '没有信用影响', '无义务'];

const steps = [
  {
    title: '告诉我们你的需求',
    description:
      '分享你的 GPU 需求、时间表和预算。如果你是现有平台主机，我们可以利用你的平台收益历史来强化申请。',
  },
  {
    title: '我们匹配合作伙伴',
    description:
      '融资合作伙伴网络会评估你的资料，并为你的业务进行竞争。平台盈利数据意味着更少文书工作和更快审批。',
  },
  {
    title: '获得资金并开始赚钱',
    description:
      '获得融资后，在平台上部署你的 GPU 硬件，开始创造收入。你的收入甚至可以支持还款。',
  },
];

const structureCards: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
    {
      title: '设备作为抵押品租赁',
      description:
        'GPU 硬件本身提供融资抵押。进入门槛较低，适合正在扩展但还不具备丰富商业信用记录的主机。',
      icon: PackageCheck,
    },
    {
      title: '基于收入的贷款',
      description:
        '还款金额与平台收益挂钩。赚得越多，还款越快；当需求下降时，付款会根据情况灵活调整。',
      icon: LineChart,
    },
    {
      title: '传统设备融资',
      description:
        '固定期限贷款，月供可预测。适合信用稳健、希望保成本确定性的成熟企业。',
      icon: Landmark,
    },
    {
      title: '买卖回租',
      description:
        '已经拥有 GPU 硬件了吗？将设备卖给融资伙伴，然后再出租回收一部分资金用于扩张，同时保持机器运行。',
      icon: Repeat2,
    },
  ];

const flywheelItems = [
  { title: '财务', description: '与融资合作伙伴匹配', icon: CircleDollarSign },
  { title: '部署', description: '硬件将在平台上线', icon: PackageCheck },
  { title: '扩展', description: '收入可让你获得更多融资', icon: LineChart },
  { title: '赚取', description: '来自开发者的收入', icon: CreditCard },
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

function FinancingVideo({
  className = '',
  label = 'GPU 融资说明视频',
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
      <source src={financingVideo} />
    </video>
  );
}

export default function FinancingPage() {
  return (
    <>
      <Header />
      <main className="bg-[#08090a] text-[#f7f8f8]">
        <section className="border-b border-white/10">
          <div className={`${shellClass} py-20 text-center sm:py-24 lg:py-28`}>
            <h1 className="mx-auto max-w-[980px] text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              为你的 GPU 融资.让你的收入来支付还款.
            </h1>
            <p className="mx-auto mt-7 max-w-[720px] text-base leading-7 text-[#d0d6e0] sm:text-lg sm:leading-8">
              我们将主机与专注 GPU 基础设施的融资合作伙伴连接起来。你的平台收益能帮助你获得资格，一提交一次，让合作伙伴竞争。
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
                从调查到获得资金的硬件有三个步骤。
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
            <div className="grid gap-12 rounded-[8px] border border-white/12 bg-white/[0.02] p-8 sm:p-10 lg:grid-cols-[0.78fr_1.22fr] lg:p-14">
              <div className="flex flex-col justify-center">
                <h2 className="text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                  GPU 融资飞轮
                </h2>
                <p className="mt-6 max-w-[440px] text-base leading-7 text-[#a4acb6] sm:text-lg sm:leading-8">
                  融资硬件、部署、赚取收入，并用这些收益来融资更多设备。
                </p>
              </div>

              <div className="grid items-center gap-5 sm:grid-cols-[1fr_auto_1fr]">
                <FlywheelCard item={flywheelItems[0]} />
                <ArrowRight className="hidden h-6 w-6 text-[#8a8f98] sm:block" aria-hidden="true" />
                <FlywheelCard item={flywheelItems[1]} />
                <ArrowUp className="mx-auto hidden h-6 w-6 text-[#8a8f98] sm:block" aria-hidden="true" />
                <div className="hidden sm:block" />
                <ArrowDown className="mx-auto hidden h-6 w-6 text-[#8a8f98] sm:block" aria-hidden="true" />
                <FlywheelCard item={flywheelItems[3]} />
                <ArrowLeft className="hidden h-6 w-6 text-[#8a8f98] sm:block" aria-hidden="true" />
                <FlywheelCard item={flywheelItems[2]} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className={shellClass}>
            <div className="relative isolate overflow-hidden rounded-[8px] border border-white/10 px-7 py-16 sm:px-10 lg:px-16 lg:py-20">
              <FinancingVideo
                label="融资结构背景视频"
                className="absolute inset-0 -z-20 opacity-35 blur-[1px]"
              />
              <div className="absolute inset-0 -z-10 bg-[#08090a]/78" />

              <div className="text-center">
                <h2 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  融资结构
                </h2>
                <p className="mx-auto mt-5 max-w-[660px] text-base leading-7 text-[#a4acb6] sm:text-lg">
                  融资合作伙伴可针对 GPU 基础设施投资量身定制结构。
                </p>
              </div>

              <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {structureCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <MarketingGlowCard
                      key={card.title}
                      backgroundColor="rgba(5,5,6,0.9)"
                      contentClassName="min-h-[270px] p-7"
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

        <section className="py-20 sm:py-24">
          <div className={`${shellClass} overflow-hidden rounded-[8px] border border-white/12`}>
            <div className="grid lg:grid-cols-2">
              <div className="bg-white/[0.08] p-8 sm:p-12 lg:p-16">
                <Handshake className="h-9 w-9 text-[#9aa2ff]" aria-hidden="true" />
                <h2 className="mt-9 text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                  需要先买硬件吗？
                </h2>
                <p className="mt-7 max-w-[520px] text-base leading-7 text-[#a4acb6] sm:text-lg">
                  不仅仅融资 GPU，也可以通过我们采购。全新且经过认证的翻新硬件，可预配置为平台主机。
                </p>
                <Button
                  asChild
                  className="mt-8 h-11 rounded-[6px] bg-[#5e6ad2] px-6 text-base font-semibold text-white hover:bg-[#828fff]"
                >
                  <Link href="/contact-sales">
                    洽谈硬件
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="p-8 sm:p-12 lg:p-16">
                <ShieldCheck className="h-9 w-9 text-[#d0d6e0]" aria-hidden="true" />
                <h2 className="mt-9 text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                  准备好扩展你的主机了吗？
                </h2>
                <p className="mt-7 max-w-[520px] text-base leading-7 text-[#a4acb6] sm:text-lg">
                  通过经过审核的供应商网络，匹配融资合作伙伴或采购 GPU 硬件。
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-8 h-11 rounded-[6px] border-white/20 bg-transparent px-6 text-base font-semibold text-[#f7f8f8] hover:bg-white/[0.06] hover:text-white"
                >
                  <Link href="/contact-sales">
                    联系销售
                    <ArrowRight className="h-4 w-4" />
                  </Link>
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

function FlywheelCard({
  item,
}: {
  item: {
    title: string;
    description: string;
    icon: LucideIcon;
  };
}) {
  const Icon = item.icon;

  return (
    <MarketingGlowCard backgroundColor="rgba(5,5,6,1)" contentClassName="p-6">
      <Icon className="h-7 w-7 text-[#8a8f98]" aria-hidden="true" />
      <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">
        {item.title}
      </h3>
      <p className="mt-3 text-base leading-7 text-[#a4acb6]">
        {item.description}
      </p>
    </MarketingGlowCard>
  );
}
