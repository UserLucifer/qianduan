"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { locales, localeLabels, normalizeLocale } from "@/i18n/locales";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("Footer");
  const common = useTranslations("Common");
  const locale = normalizeLocale(useLocale());
  const pathname = usePathname();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand-col">
            <Link href="/" className="site-footer__brand">
              {common("brand")}
            </Link>
            <p className="site-footer__tagline">{t("tagline")}</p>
          </div>

          <div className="site-footer__links-grid">
            <div className="site-footer__col">
              <h3 className="site-footer__title">{t("companyInfo")}</h3>
              <div className="site-footer__links">
                <Link href="/about" className="site-footer__link">{t("about")}</Link>
                <Link href="/sustainability" className="site-footer__link">{t("sustainability")}</Link>
                <Link href="/enterprise" className="site-footer__link">{t("solutions")}</Link>
                <Link href="/financing" className="site-footer__link">{t("financing")}</Link>
                <Link href="/hardware" className="site-footer__link">{t("hardware")}</Link>
              </div>
            </div>

            <div className="site-footer__col">
              <h3 className="site-footer__title">{t("resources")}</h3>
              <div className="site-footer__links">
                <Link href="/use-cases" className="site-footer__link">{t("useCases")}</Link>
              </div>
            </div>

            <div className="site-footer__col">
              <h3 className="site-footer__title">{t("legal")}</h3>
              <div className="site-footer__links">
                <Link href="/terms" className="site-footer__link">{t("terms")}</Link>
                <Link href="/privacy" className="site-footer__link">{t("privacy")}</Link>
                <Link href="/compliance" className="site-footer__link">{t("compliance")}</Link>
                <Link href="/vulnerability-disclosure" className="site-footer__link">{t("vulnerabilityDisclosure")}</Link>
                <Link href="/data-processing" className="site-footer__link">{t("dataProcessing")}</Link>
              </div>
            </div>

            <div className="site-footer__col">
              <h3 className="site-footer__title">{t("help")}</h3>
              <div className="site-footer__links">
                <Link href="/docs" className="site-footer__link">{t("docs")}</Link>
                <Link href="/blog" className="site-footer__link">{t("blog")}</Link>
                <Link href="/contact" className="site-footer__link">{t("contact")}</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <div className="site-footer__copyright">
            {t("copyright", { year: currentYear })}
          </div>
          <div className="site-footer__bottom-meta">
            <nav className="site-footer__locale" aria-label="Language">
              {locales.map((item) => (
                <Link
                  key={item}
                  href={pathname}
                  locale={item}
                  className={
                    item === locale
                      ? "site-footer__locale-link site-footer__locale-link--active"
                      : "site-footer__locale-link"
                  }
                  aria-current={item === locale ? "true" : undefined}
                >
                  {localeLabels[item]}
                </Link>
              ))}
            </nav>
            <div className="site-footer__status">
              <span className="status-dot"></span>
              {t("status")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
