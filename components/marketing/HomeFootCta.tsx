import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { normalizeLocale } from "@/i18n/locales";

const backgroundImage = "/images/home-foot-image.avif";

export default async function HomeFootCta({ locale }: { locale?: string }) {
  const language = normalizeLocale(locale);
  const t = await getTranslations({
    locale: language,
    namespace: "MarketingHome.homeFootCta",
  });

  return (
    <section className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] bg-[var(--background)] px-6 pb-24 pt-8 sm:pb-28 md:pt-12">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="relative isolate overflow-hidden rounded-[8px] bg-[#eef1f5] px-8 py-16 text-[#05070a] sm:px-10 sm:py-20 md:px-14 md:py-24">
          <div
            className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full bg-right-top bg-no-repeat opacity-95 sm:w-[58%]"
            style={{
              backgroundImage: `url("${backgroundImage}")`,
              backgroundSize: "auto 100%",
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#eef1f5_0%,#eef1f5_48%,rgba(238,241,245,0.62)_68%,rgba(238,241,245,0)_100%)]" />

          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
            <div className="relative z-10">
              <h2 className="max-w-[520px] text-3xl font-[590] leading-tight tracking-normal text-[#05070a] sm:text-4xl">
                {t("title")}
              </h2>
              <Button
                asChild
                className="mt-8 h-12 rounded-full bg-[#0f4cf6] px-8 text-sm font-[590] text-white shadow-none hover:bg-[#2e64ff]"
              >
                <Link href="/contact-sales">{t("primaryCta")}</Link>
              </Button>
            </div>

            <div className="relative z-10 md:pl-8">
              <h3 className="text-2xl font-[590] leading-tight text-[#05070a]">
                {t("learnMore")}
              </h3>
              <div className="mt-6 flex flex-col items-start gap-5 text-sm font-[590]">
                <Link
                  href="/rental"
                  className="inline-flex items-center gap-1 border-b border-[#05070a] leading-tight text-[#05070a] hover:text-[#0f4cf6] hover:border-[#0f4cf6]"
                >
                  {t("pricing")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/terms"
                  className="inline-flex items-center gap-1 border-b border-[#05070a] leading-tight text-[#05070a] hover:text-[#0f4cf6] hover:border-[#0f4cf6]"
                >
                  {t("terms")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
