import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { solutionsData } from "@/lib/solutions-data";
import { CodeSnippetWindow } from "@/components/marketing/solutions/CodeSnippetWindow";
import { LineArtDiagram } from "@/components/marketing/solutions/LineArtDiagram";
import { Button } from "@/components/ui/button";
import { ChevronRight, Cpu } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { normalizeLocale } from "@/i18n/locales";

interface SolutionPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

type SolutionPageCopy = {
  heroTitle: string;
  heroSubtitle: string;
  visualContent?: string;
  features: {
    title: string;
    description: string;
  }[];
  recommendedGpus: {
    model: string;
    specs: string;
  }[];
};

export async function generateStaticParams() {
  return Object.keys(solutionsData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = solutionsData[slug];

  if (!data) {
    return {};
  }

  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "SolutionsDetail" });
  const copy = t.raw(`pages.${slug}`) as SolutionPageCopy;

  return {
    title: t("metadataTitle", { title: copy.heroTitle }),
    description: copy.heroSubtitle,
  };
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { locale, slug } = await params;
  const data = solutionsData[slug];

  if (!data) {
    notFound();
  }

  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "SolutionsDetail" });
  const copy = t.raw(`pages.${slug}`) as SolutionPageCopy;
  const features = data.features.map((feature, index) => ({
    ...feature,
    title: copy.features[index]?.title ?? "",
    description: copy.features[index]?.description ?? "",
  }));
  const recommendedGpus =
    copy.recommendedGpus.length > 0
      ? copy.recommendedGpus
      : data.recommendedGpuModels.map((model) => ({ model, specs: "" }));
  const visualContent =
    data.visualType === "code" ? copy.visualContent ?? data.visualContent : data.visualContent;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow relative">
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
          <div className="shell px-4">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-8">
                <Cpu className="w-3.5 h-3.5" />
                <span>{t("badge")}</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05] mb-8">
                {copy.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
                {copy.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/rental">
                  <Button size="lg" className="rounded-full h-12 px-10 text-base font-semibold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                    {t("primaryCta")}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="rounded-full h-12 px-10 text-base font-semibold border-border/60 hover:bg-muted/50">
                    {t("secondaryCta")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-muted/10 border-y border-border/50">
          <div className="shell px-4 space-y-40">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 space-y-10 order-2 lg:order-1">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {t("infrastructure.title")}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed max-w-lg text-lg">
                    {t("infrastructure.description")}
                  </p>
                </div>

                <div className="space-y-10">
                  {features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex gap-6 group">
                      <div className="mt-1 shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-background border border-border shadow-sm text-primary transition-transform group-hover:scale-110">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 w-full max-w-3xl order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl -z-10" />
                  {data.visualType === "code" && <CodeSnippetWindow code={visualContent} />}
                  {data.visualType === "line-art" && <LineArtDiagram />}
                  {data.visualType === "realistic" && (
                    <div className="aspect-video rounded-2xl border border-border/50 overflow-hidden shadow-2xl bg-muted/30 relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                      <span className="text-muted-foreground/40 text-sm font-mono tracking-widest uppercase italic">
                        {t("visualizationLabel", { name: data.id.replace(/-/g, " ") })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-16 pt-24 border-t border-border/40">
              {features.map((feature, index) => (
                <div key={index} className="space-y-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32">
          <div className="shell px-4 text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              {t("recommendations.title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("recommendations.description")}
            </p>
          </div>

          <div className="shell px-4 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {recommendedGpus.map((gpu, index) => (
              <div key={index} className="group relative p-10 rounded-3xl border border-border/60 bg-background transition-all hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-primary">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight">{gpu.model}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-10 text-sm">{gpu.specs}</p>
                  <div className="mt-auto pt-8 border-t border-border/30 flex items-center justify-between gap-4">
                    <Link href={`/rental?model=${encodeURIComponent(gpu.model)}`} className="text-sm font-bold text-primary flex items-center gap-1 group/link">
                      {t("recommendations.viewInventory")}
                      <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                    <span className="text-[10px] font-mono text-muted-foreground/30 uppercase tracking-widest">
                      {t("recommendations.availableNow")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pb-32">
          <div className="shell">
            <div className="bg-foreground rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
              <Image src="/images/graph.avif" alt="" fill className="object-cover opacity-40 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--ui-primary)_/_0.15),transparent)] pointer-events-none" />
              <div className="relative z-10 space-y-10">
                <h2 className="text-3xl md:text-6xl font-bold tracking-tighter text-background leading-[1.1]">
                  {t("cta.titleLine1")}
                  <br className="hidden md:block" />
                  {t("cta.titleLine2")}
                </h2>
                <p className="text-background/60 text-lg max-w-2xl mx-auto leading-relaxed">
                  {t("cta.description")}
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-6">
                  <Link href="/rental">
                    <Button size="lg" className="rounded-full h-14 px-12 text-base font-bold bg-background text-foreground hover:bg-background/90 transition-all">
                      {t("cta.primary")}
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" size="lg" className="rounded-full h-14 px-12 text-base font-bold border-background/20 hover:bg-background/10 text-background bg-transparent hover:text-background">
                      {t("cta.secondary")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
