import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { normalizeLocale } from "@/i18n/locales";
import { HardwareQuoteFlow } from "../hardware/HardwareQuoteFlow";
import { MarketingGlowCard } from "@/components/marketing/MarketingGlowCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";

type FinancingPageProps = {
  params: Promise<{ locale: string }>;
};

type StepCopy = {
  title: string;
  description: string;
};

type CardCopy = {
  title: string;
  description: string;
};

type FlywheelCopy = {
  title: string;
  description: string;
};

type CtaCardCopy = {
  title: string;
  description: string;
  cta: string;
};

const financingVideo =
  "/videos/rongzi/GPU%20Financing%20%E2%80%94%20Vast%20Finance%20Vast.ai.mov";

const shellClass =
  "mx-auto w-[calc(100%-40px)] max-w-[1220px] max-[720px]:w-[calc(100%-24px)]";

const structureIcons = [PackageCheck, LineChart, Landmark, Repeat2] as const;
const flywheelIcons = [CircleDollarSign, PackageCheck, LineChart, CreditCard] as const;
const certificationIcons = [Flame, MemoryStick, Gauge, Truck] as const;

function FinancingVideo({
  className = "",
  label = "GPU financing explainer video",
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

export async function generateMetadata({ params }: FinancingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Financing" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function FinancingPage({ params }: FinancingPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Financing" });
  const assurances = t.raw("hero.assurances") as string[];
  const steps = t.raw("steps.items") as StepCopy[];
  const structureCards = t.raw("structures.cards") as CardCopy[];
  const flywheelItems = t.raw("flywheel.items") as FlywheelCopy[];
  const certificationItems = t.raw("certification.items") as CardCopy[];
  const ctaCards = t.raw("cta.cards") as CtaCardCopy[];

  return (
    <>
      <Header />
      <main className="bg-[#08090a] text-[#f7f8f8]">
        <section className="border-b border-white/10">
          <div className={`${shellClass} py-20 text-center sm:py-24 lg:py-28`}>
            <h1 className="mx-auto max-w-[980px] text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              {t("hero.title")}
            </h1>
            <p className="mx-auto mt-7 max-w-[720px] text-base leading-7 text-[#d0d6e0] sm:text-lg sm:leading-8">
              {t("hero.description")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              {assurances.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#d0d6e0]"
                >
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
                {t("steps.title")}
              </h2>
              <p className="mt-5 text-base leading-7 text-[#8a8f98] sm:text-lg">
                {t("steps.description")}
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
                  {t("flywheel.title")}
                </h2>
                <p className="mt-6 max-w-[440px] text-base leading-7 text-[#a4acb6] sm:text-lg sm:leading-8">
                  {t("flywheel.description")}
                </p>
              </div>

              <div className="grid items-center gap-5 sm:grid-cols-[1fr_auto_1fr]">
                <FlywheelCard item={flywheelItems[0]} icon={flywheelIcons[0]} />
                <ArrowRight className="hidden h-6 w-6 text-[#8a8f98] sm:block" aria-hidden="true" />
                <FlywheelCard item={flywheelItems[1]} icon={flywheelIcons[1]} />
                <ArrowUp className="mx-auto hidden h-6 w-6 text-[#8a8f98] sm:block" aria-hidden="true" />
                <div className="hidden sm:block" />
                <ArrowDown className="mx-auto hidden h-6 w-6 text-[#8a8f98] sm:block" aria-hidden="true" />
                <FlywheelCard item={flywheelItems[3]} icon={flywheelIcons[3]} />
                <ArrowLeft className="hidden h-6 w-6 text-[#8a8f98] sm:block" aria-hidden="true" />
                <FlywheelCard item={flywheelItems[2]} icon={flywheelIcons[2]} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className={shellClass}>
            <div className="relative isolate overflow-hidden rounded-[8px] border border-white/10 px-7 py-16 sm:px-10 lg:px-16 lg:py-20">
              <FinancingVideo
                label={t("structures.videoLabel")}
                className="absolute inset-0 -z-20 opacity-35 blur-[1px]"
              />
              <div className="absolute inset-0 -z-10 bg-[#08090a]/78" />

              <div className="text-center">
                <h2 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  {t("structures.title")}
                </h2>
                <p className="mx-auto mt-5 max-w-[660px] text-base leading-7 text-[#a4acb6] sm:text-lg">
                  {t("structures.description")}
                </p>
              </div>

              <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {structureCards.map((card, index) => {
                  const Icon = structureIcons[index] as LucideIcon;

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
                  {t("certification.title")}
                </h2>
                <p className="mt-7 max-w-[560px] text-base leading-7 text-[#a4acb6] sm:text-lg">
                  {t("certification.description")}
                </p>

                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                  {certificationItems.map((item, index) => {
                    const Icon = certificationIcons[index] as LucideIcon;

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
                  {ctaCards[0].title}
                </h2>
                <p className="mt-7 max-w-[520px] text-base leading-7 text-[#a4acb6] sm:text-lg">
                  {ctaCards[0].description}
                </p>
                <Button
                  asChild
                  className="mt-8 h-11 rounded-[6px] bg-[#5e6ad2] px-6 text-base font-semibold text-white hover:bg-[#828fff]"
                >
                  <Link href="/contact-sales">
                    {ctaCards[0].cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="p-8 sm:p-12 lg:p-16">
                <ShieldCheck className="h-9 w-9 text-[#d0d6e0]" aria-hidden="true" />
                <h2 className="mt-9 text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                  {ctaCards[1].title}
                </h2>
                <p className="mt-7 max-w-[520px] text-base leading-7 text-[#a4acb6] sm:text-lg">
                  {ctaCards[1].description}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-8 h-11 rounded-[6px] border-white/20 bg-transparent px-6 text-base font-semibold text-[#f7f8f8] hover:bg-white/[0.06] hover:text-white"
                >
                  <Link href="/contact-sales">
                    {ctaCards[1].cta}
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
  icon: Icon,
}: {
  item: FlywheelCopy;
  icon: LucideIcon;
}) {
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
