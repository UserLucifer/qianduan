import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import "@/components/marketing/LegalPage.css";

type CompliancePageProps = {
  params: Promise<{ locale: string }>;
};

type TextBlock = {
  title: string;
  text: string;
};

type ListSection = {
  title: string;
  intro?: string;
  items: string[];
};

function TextList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function SectionList({ sections }: { sections: ListSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.title}>
          <h3>{section.title}</h3>
          {section.intro ? <p>{section.intro}</p> : null}
          <TextList items={section.items} />
        </section>
      ))}
    </>
  );
}

export async function generateMetadata({
  params,
}: CompliancePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Compliance" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function CompliancePage({ params }: CompliancePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Compliance" });
  const certifications = t.raw("certifications.items") as TextBlock[];
  const architectureSections = t.raw("securityArchitecture.sections") as ListSection[];
  const secureCloudSections = t.raw("securityTiers.secureCloud.sections") as ListSection[];

  return (
    <>
      <Header />
      <main className="legal-page">
        <div className="legal-page__inner">
          <header className="legal-page__header">
            <h1 className="legal-page__title">{t("title")}</h1>
            <p className="legal-page__date">{t("subtitle")}</p>
          </header>

          <div className="legal-page__body">
            <p>{t("intro.description")}</p>
            <p>
              {t("intro.contactPrefix")}
              <strong>{t("intro.contactTeam")}</strong>
              {t("intro.contactSuffix")}
            </p>

            <h2>{t("certifications.title")}</h2>
            {certifications.map((item) => (
              <section key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </section>
            ))}

            <h2>{t("securityArchitecture.title")}</h2>
            <SectionList sections={architectureSections} />

            <h2>{t("securityTiers.title")}</h2>
            <p>{t("securityTiers.description")}</p>

            <h3>{t("securityTiers.certifiedHost.title")}</h3>
            <p>{t("securityTiers.certifiedHost.description")}</p>
            <TextList items={t.raw("securityTiers.certifiedHost.items") as string[]} />

            <h3>{t("securityTiers.secureCloud.title")}</h3>
            <p>{t("securityTiers.secureCloud.description")}</p>
            <SectionList sections={secureCloudSections} />

            <h2>{t("legalProtections.title")}</h2>
            <TextList items={t.raw("legalProtections.items") as string[]} />

            <h2>{t("securityRecord.title")}</h2>
            <p>{t("securityRecord.text")}</p>

            <div className="legal-page__contact">
              <h2>{t("contact.title")}</h2>
              <p>{t("contact.description")}</p>
              <p>
                <strong>{t("contact.complianceLabel")}</strong>
                {t("contact.complianceEmail")}
                <br />
                <strong>{t("contact.salesLabel")}</strong>
                {t("contact.salesText")}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
