import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  DollarSign,
  Headphones,
  Monitor,
  Server,
  Settings2,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { normalizeLocale } from "@/i18n/locales";

type HostingPageProps = {
  params: Promise<{ locale: string }>;
};

type StatCopy = {
  value: string;
  label: string;
};

type CardCopy = {
  title: string;
  description: string;
  cta?: string;
};

type StepCopy = {
  step: string;
  title: string;
  description: string;
};

type FaqCopy = {
  question: string;
  answer: string;
};

const heroVideo = "/videos/hostinger/Host%20Your%20GPUs%20on%20Vast.ai.mp4";
const bottomImage = "/videos/hostinger/10001.jpg";
const shellClass =
  "mx-auto w-[calc(100%-40px)] max-w-[1240px] max-[720px]:w-[calc(100%-24px)]";

const platformCardIcons = [Headphones, Server, Settings2] as const;

const hostCardHrefs = ["/contact-sales", "/signup", "#how-it-works"] as const;

const hardwareCardMeta: Array<{
  icon: LucideIcon;
  href: string;
}> = [
  {
    href: "/financing",
    icon: CircleDollarSign,
  },
  {
    href: "/hardware",
    icon: ShieldCheck,
  },
];

const howItWorksIcons = [Monitor, Wrench, DollarSign] as const;

export async function generateMetadata({ params }: HostingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Hosting" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function HostingPage({ params }: HostingPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Hosting" });
  const stats = t.raw("stats") as StatCopy[];
  const platformCards = t.raw("platform.cards") as CardCopy[];
  const hostCards = t.raw("hostTypes.cards") as CardCopy[];
  const vastHandles = t.raw("responsibilities.platformItems") as string[];
  const youHandle = t.raw("responsibilities.hostItems") as string[];
  const hardwareCards = t.raw("hardware.cards") as CardCopy[];
  const howItWorks = t.raw("howItWorks.steps") as StepCopy[];
  const faqs = t.raw("faq.items") as FaqCopy[];

  return (
    <>
      <Header />
      <main className="bg-[#08090a] text-[#f7f8f8]">
        <section className="relative isolate min-h-[640px] overflow-hidden">
          <video
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 -z-10 bg-[#08090a]/68" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,9,10,0.16),rgba(8,9,10,0.18)_55%,#08090a_100%)]" />

          <div
            className={`${shellClass} flex min-h-[640px] flex-col items-center justify-center py-24 text-center sm:py-28`}
          >
            <h1 className="max-w-[900px] text-4xl font-semibold leading-[1.04] text-[#f7f8f8] sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-7 max-w-[760px] text-base leading-7 text-[#d0d6e0] sm:text-lg">
              {t("hero.description")}
            </p>

            <div className="mt-9 grid w-full max-w-[640px] grid-cols-2 gap-5 sm:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="min-w-0">
                  <div className="text-2xl font-semibold leading-tight text-[#f7f8f8] sm:text-3xl">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs font-medium text-[#d0d6e0] sm:text-sm">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <Button
                asChild
                className="h-10 rounded-[6px] bg-[#5e6ad2] px-5 text-sm font-semibold text-white hover:bg-[#7170ff]"
              >
                <Link href="/signup">
                  {t("hero.primaryCta")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-[6px] border-white/25 bg-white/[0.02] px-5 text-sm font-semibold text-[#f7f8f8] hover:bg-white/[0.06] hover:text-[#f7f8f8]"
              >
                <Link href="/contact-sales">{t("hero.secondaryCta")}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className={shellClass}>
            <div className="mx-auto max-w-[760px] text-center">
              <h2 className="text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
                {t("platform.title")}
              </h2>
              <p className="mt-5 text-base leading-7 text-[#d0d6e0] sm:text-lg">
                {t("platform.description")}
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {platformCards.map((item, index) => {
                const Icon = platformCardIcons[index];

                return (
                  <Card
                    key={item.title}
                    className="h-full rounded-[8px] border-white/10 bg-white/[0.035] text-[#f7f8f8] shadow-none"
                  >
                    <CardContent className="p-7">
                      <Icon className="h-7 w-7 text-[#8a8f98]" />
                      <h3 className="mt-7 text-xl font-semibold leading-tight">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-sm leading-6 text-[#d0d6e0]">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className={shellClass}>
            <div className="mx-auto max-w-[760px] text-center">
              <h2 className="text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
                {t("hostTypes.title")}
              </h2>
              <p className="mt-5 text-base leading-7 text-[#d0d6e0]">
                {t("hostTypes.description")}
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {hostCards.map((item, index) => (
                <Card
                  key={item.title}
                  className="h-full rounded-[8px] border-white/10 bg-transparent text-[#f7f8f8] shadow-none"
                >
                  <CardContent className="flex h-full flex-col p-7">
                    <h3 className="text-xl font-semibold leading-tight">
                      {item.title}
                    </h3>
                    <p className="mt-5 flex-1 text-sm leading-6 text-[#d0d6e0]">
                      {item.description}
                    </p>
                    <Button
                      asChild
                      className="mt-7 h-10 w-fit rounded-[6px] bg-[#5e6ad2] px-4 text-sm font-semibold text-white hover:bg-[#7170ff]"
                    >
                      <Link href={hostCardHrefs[index]}>
                        {item.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0f1011] py-20 sm:py-24">
          <div className={shellClass}>
            <div className="mx-auto max-w-[780px] text-center">
              <h2 className="text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
                {t("responsibilities.title")}
              </h2>
              <p className="mt-5 text-base leading-7 text-[#d0d6e0]">
                {t("responsibilities.description")}
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-[920px] gap-6 md:grid-cols-2">
              <Card className="rounded-[8px] border-white/10 bg-white/[0.04] text-[#f7f8f8] shadow-none">
                <CardContent className="p-7">
                  <h3 className="text-lg font-semibold text-[#8d9cff]">
                    {t("responsibilities.platformTitle")}
                  </h3>
                  <ul className="mt-6 space-y-4 text-sm leading-6 text-[#f7f8f8]">
                    {vastHandles.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[#10b981]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="rounded-[8px] border-white/10 bg-white/[0.04] text-[#f7f8f8] shadow-none">
                <CardContent className="p-7">
                  <h3 className="text-lg font-semibold">{t("responsibilities.hostTitle")}</h3>
                  <ul className="mt-6 space-y-4 text-sm leading-6 text-[#f7f8f8]">
                    {youHandle.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border border-white/45" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <p className="mx-auto mt-8 max-w-[760px] text-center text-sm font-medium leading-6 text-[#10b981]">
              {t("responsibilities.note")}
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className={shellClass}>
            <Card className="mx-auto max-w-[760px] rounded-[8px] border-white/10 bg-transparent text-center text-[#f7f8f8] shadow-none">
              <CardContent className="p-8 sm:p-12">
                <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
                  {t("presell.title")}
                </h2>
                <p className="mx-auto mt-5 max-w-[520px] text-sm leading-6 text-[#d0d6e0] sm:text-base">
                  {t("presell.description")}
                </p>
                <Button
                  asChild
                  className="mt-7 h-10 rounded-[6px] bg-[#5e6ad2] px-5 text-sm font-semibold text-white hover:bg-[#7170ff]"
                >
                  <Link href="/contact-sales">
                    {t("presell.cta")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className={shellClass}>
            <div className="mx-auto max-w-[720px] text-center">
              <h2 className="text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
                {t("hardware.title")}
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {hardwareCards.map((item, index) => {
                const Icon = hardwareCardMeta[index].icon;

                return (
                  <Card
                    key={item.title}
                    className="rounded-[8px] border-white/10 bg-transparent text-[#f7f8f8] shadow-none"
                  >
                    <CardContent className="p-7">
                      <Icon className="h-7 w-7 text-[#8a8f98]" />
                      <h3 className="mt-6 text-xl font-semibold leading-tight">
                        {item.title}
                      </h3>
                      <p className="mt-5 text-sm leading-6 text-[#d0d6e0]">
                        {item.description}
                      </p>
                      <Link
                        href={hardwareCardMeta[index].href}
                        className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#8d9cff] hover:text-[#aab4ff]"
                      >
                        {item.cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 sm:py-24">
          <div className={shellClass}>
            <div className="mx-auto max-w-[760px] text-center">
              <h2 className="text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
                {t("howItWorks.title")}
              </h2>
              <p className="mt-5 text-base leading-7 text-[#d0d6e0]">
                {t("howItWorks.description")}
              </p>
            </div>

            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {howItWorks.map((item, index) => {
                const Icon = howItWorksIcons[index];

                return (
                  <div key={item.step} className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.08] text-[#f7f8f8]">
                      <Icon className="h-7 w-7" />
                    </div>
                    <p className="mt-6 text-sm font-semibold text-[#8d9cff]">
                      {item.step}
                    </p>
                    <h3 className="mt-4 text-xl font-semibold leading-tight">
                      {item.title}
                    </h3>
                    <p className="mx-auto mt-4 max-w-[320px] text-sm leading-6 text-[#d0d6e0]">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className={`${shellClass} max-w-[960px]`}>
            <h2 className="text-center text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
              {t("faq.title")}
            </h2>
            <Accordion type="single" collapsible className="mt-12 space-y-3">
              {faqs.map((item) => (
                <AccordionItem
                  key={item.question}
                  value={item.question}
                  className="rounded-[8px] border border-white/10 bg-transparent px-5"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-semibold text-[#f7f8f8] hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-6 text-[#d0d6e0]">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="pb-20 pt-8 sm:pb-24">
          <div className={shellClass}>
            <div
              className="relative isolate overflow-hidden rounded-[8px] border border-white/10 bg-cover bg-center px-6 py-20 text-center sm:px-10 sm:py-24"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(8,9,10,0.44), rgba(8,9,10,0.72)), url("${bottomImage}")`,
              }}
            >
              <h2 className="text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
                {t("bottomCta.title")}
              </h2>
              <p className="mx-auto mt-4 max-w-[760px] text-base leading-7 text-[#f7f8f8]">
                {t("bottomCta.description")}
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-10 rounded-[6px] bg-[#5e6ad2] px-5 text-sm font-semibold text-white hover:bg-[#7170ff]"
                >
                  <Link href="/signup">{t("bottomCta.primaryCta")}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-[6px] border-white/25 bg-white/[0.02] px-5 text-sm font-semibold text-[#f7f8f8] hover:bg-white/[0.06] hover:text-[#f7f8f8]"
                >
                  <Link href="/contact-sales">
                    {t("bottomCta.secondaryCta")}
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
