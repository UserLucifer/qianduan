import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { normalizeLocale } from "@/i18n/locales";
import { HardwareQuoteFlow } from "./HardwareQuoteFlow";
import { MarketingGlowCard } from "@/components/marketing/MarketingGlowCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";

type HardwarePageProps = {
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

type CertificationCopy = {
  title: string;
  description: string;
};

const hardwareVideo =
  "/videos/yingjian/GPU%20Hardware%20%E2%80%94%20Vast%20Hardware%20Vast.ai.mp4";

const shellClass =
  "mx-auto w-[calc(100%-40px)] max-w-[1220px] max-[720px]:w-[calc(100%-24px)]";

const valueCardIcons = [Gauge, Server, BadgeCheck, ShieldCheck] as const;
const certificationIcons = [Flame, MemoryStick, Gauge, Truck] as const;

function HardwareVideo({
  className = "",
  label = "GPU hardware sourcing background video",
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

export async function generateMetadata({ params }: HardwarePageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Hardware" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function HardwarePage({ params }: HardwarePageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Hardware" });
  const assurances = t.raw("hero.assurances") as string[];
  const steps = t.raw("steps.items") as StepCopy[];
  const valueCards = t.raw("value.cards") as CardCopy[];
  const certificationItems = t.raw("certification.items") as CertificationCopy[];

  return (
    <>
      <Header />
      <main className="bg-[#08090a] text-[#f7f8f8]">
        <section className="border-b border-white/10">
          <div className={`${shellClass} py-20 text-center sm:py-24 lg:py-28`}>
            <h1 className="mx-auto max-w-[900px] text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
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
            <div className="relative isolate overflow-hidden rounded-[8px] border border-white/10 px-7 py-16 sm:px-10 lg:px-16 lg:py-20">
              <HardwareVideo className="absolute inset-0 -z-20 opacity-45" label={t("value.videoLabel")} />
              <div className="absolute inset-0 -z-10 bg-[#08090a]/72" />

              <div className="text-center">
                <h2 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  {t("value.title")}
                </h2>
                <p className="mx-auto mt-5 max-w-[740px] text-base leading-7 text-[#a4acb6] sm:text-lg">
                  {t("value.description")}
                </p>
              </div>

              <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {valueCards.map((card, index) => {
                  const Icon = valueCardIcons[index] as LucideIcon;

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

        <section className="py-16 sm:py-20">
          <div className={shellClass}>
            <div className="rounded-[8px] bg-white/[0.08] px-7 py-16 text-center sm:px-10 lg:px-16 lg:py-20">
              <PackageCheck className="mx-auto h-10 w-10 text-[#9aa2ff]" aria-hidden="true" />
              <h2 className="mx-auto mt-8 max-w-[820px] text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                {t("bottomCta.title")}
              </h2>
              <p className="mx-auto mt-5 max-w-[720px] text-base leading-7 text-[#d0d6e0] sm:text-lg">
                {t("bottomCta.description")}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  className="h-11 rounded-[6px] bg-[#5e6ad2] px-6 text-base font-semibold text-white hover:bg-[#828fff]"
                >
                  <Link href="/financing">{t("bottomCta.primaryCta")}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-[6px] border-white/20 bg-transparent px-6 text-base font-semibold text-[#f7f8f8] hover:bg-white/[0.06] hover:text-white"
                >
                  <Link href="/contact-sales">{t("bottomCta.secondaryCta")}</Link>
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
