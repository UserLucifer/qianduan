import Header from '@/components/marketing/Header';
import ProductList from "@/components/marketing/product-list";
import Aurora from "@/components/marketing/Aurora";
import LogoCarousel from "@/components/marketing/LogoCarousel";
import FeatureGrid from '@/components/marketing/FeatureGrid';
import UseCaseSection from '@/components/marketing/UseCaseSection';
import WorkloadSection from '@/components/marketing/WorkloadSection';
import TestimonialSection from '@/components/marketing/TestimonialSection';
import FAQSection from '@/components/marketing/FAQSection';
import HubSection from '@/components/marketing/HubSection';
import EnterpriseSection from '@/components/marketing/EnterpriseSection';
import AccordionSection from '@/components/marketing/AccordionSection';
import BlogPreviewSection from '@/components/marketing/BlogPreviewSection';
import Footer from '@/components/marketing/Footer';
import { getTranslations } from "next-intl/server";

type HomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MarketingHome.hero" });

  return (
    <>
      <Header />

      <main className="shell">
        <section className="hero">
          <div className="hero__background">
            <Aurora
              colorStops={["#7cff67","#B497CF","#5227FF"]}
              blend={0.5}
              amplitude={1.0}
              speed={1}
            />
          </div>
          <div className="hero__content">
            <div className="hero__eyebrow">
              <span className="badge">{t("badge")}</span>
              <span className="hero__label">{t("label")}</span>
            </div>
            <h1 className="hero__title">{t("title")}</h1>
            <p className="hero__description">
              {t("description")}
            </p>
          </div>
        </section>

        <LogoCarousel />

        <ProductList locale={locale} />

        <FeatureGrid locale={locale} />
        <UseCaseSection locale={locale} />
        <AccordionSection />
        <WorkloadSection locale={locale} />
        <TestimonialSection />
        <EnterpriseSection locale={locale} />
        <FAQSection />
        <HubSection locale={locale} />
        <BlogPreviewSection locale={locale} />
      </main>

      <Footer />
    </>
  );
}
