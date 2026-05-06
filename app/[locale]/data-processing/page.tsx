import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import "@/components/marketing/LegalPage.css";

type DataProcessingPageProps = {
  params: Promise<{ locale: string }>;
};

type LabeledText = {
  term: string;
  text: string;
};

type Field = {
  label: string;
  value: string;
};

function TextList({
  items,
  ordered = false,
}: {
  items: string[];
  ordered?: boolean;
}) {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <ListTag>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ListTag>
  );
}

function LabeledList({ items }: { items: LabeledText[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.term}>
          <strong>{item.term}</strong>
          {item.text}
        </li>
      ))}
    </ul>
  );
}

export async function generateMetadata({
  params,
}: DataProcessingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DataProcessing" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function DataProcessingPage({
  params,
}: DataProcessingPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DataProcessing" });
  const definitions = t.raw("definitions.items") as LabeledText[];
  const annexFields = t.raw("appendix.annexOne.fields") as Field[];

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
            {(t.raw("intro") as string[]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <h2>{t("definitions.title")}</h2>
            <p>{t("definitions.intro")}</p>
            <LabeledList items={definitions} />
            <p>{t("definitions.gdprTerms")}</p>

            <h2>{t("processing.title")}</h2>
            <h3>{t("processing.processorObligations.title")}</h3>
            <p>{t("processing.processorObligations.intro")}</p>
            <TextList items={t.raw("processing.processorObligations.items") as string[]} />

            <h3>{t("processing.controllerObligations.title")}</h3>
            <p>{t("processing.controllerObligations.intro")}</p>
            <TextList items={t.raw("processing.controllerObligations.items") as string[]} />

            <h3>{t("processing.confidentiality.title")}</h3>
            <p>{t("processing.confidentiality.text")}</p>

            <h3>{t("processing.usageLimits.title")}</h3>
            <p>{t("processing.usageLimits.text")}</p>

            <h3>{t("processing.anonymizedData.title")}</h3>
            <p>{t("processing.anonymizedData.text")}</p>

            <h3>{t("processing.controllerRepresentations.title")}</h3>
            <p>{t("processing.controllerRepresentations.intro")}</p>
            <TextList
              ordered
              items={t.raw("processing.controllerRepresentations.items") as string[]}
            />

            <h2>{t("personnel.title")}</h2>
            <p>{t("personnel.text")}</p>

            <h2>{t("security.title")}</h2>
            <TextList ordered items={t.raw("security.items") as string[]} />

            <h2>{t("restrictedTransfers.title")}</h2>
            <TextList ordered items={t.raw("restrictedTransfers.items") as string[]} />

            <h2>{t("subprocessing.title")}</h2>
            <ol>
              {(t.raw("subprocessing.items") as string[]).map((item) => (
                <li key={item}>{item}</li>
              ))}
              <li>
                {t("subprocessing.responsibilitiesIntro")}
                <TextList items={t.raw("subprocessing.responsibilities") as string[]} />
              </li>
            </ol>

            <h2>{t("dataSubjectRights.title")}</h2>
            <ol>
              <li>{t("dataSubjectRights.assistance")}</li>
              <li>
                {t("dataSubjectRights.processorIntro")}
                <TextList items={t.raw("dataSubjectRights.processorItems") as string[]} />
              </li>
              <li>{t("dataSubjectRights.controller")}</li>
            </ol>

            <h2>{t("controllerAssistance.title")}</h2>
            <p>{t("controllerAssistance.text")}</p>

            <h2>{t("personalDataBreach.title")}</h2>
            <p>{t("personalDataBreach.text")}</p>

            <h2>{t("audit.title")}</h2>
            <p>{t("audit.text")}</p>
            <TextList items={t.raw("audit.items") as string[]} />

            <h2>{t("returnDeletion.title")}</h2>
            <TextList ordered items={t.raw("returnDeletion.items") as string[]} />

            <h2>{t("governingLaw.title")}</h2>
            <TextList items={t.raw("governingLaw.items") as string[]} />

            <div className="legal-page__divider" />

            <h2>{t("appendix.title")}</h2>
            {(t.raw("appendix.paragraphs") as string[]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <h3>{t("appendix.annexOne.title")}</h3>
            {annexFields.map((field) => (
              <p key={field.label}>
                <strong>{field.label}</strong>
                {field.value}
              </p>
            ))}
            <p>
              <strong>{t("appendix.annexOne.dataCategoriesLabel")}</strong>
            </p>
            <TextList items={t.raw("appendix.annexOne.dataCategories") as string[]} />
            <p>
              <strong>{t("appendix.annexOne.processingOperationsLabel")}</strong>
            </p>
            <TextList
              items={t.raw("appendix.annexOne.processingOperations") as string[]}
            />

            <h3>{t("appendix.annexTwo.title")}</h3>
            <p>{t("appendix.annexTwo.text")}</p>
            <LabeledList items={t.raw("appendix.annexTwo.measures") as LabeledText[]} />
            <p>{t("appendix.annexTwo.customerSecurity")}</p>

            <h3>{t("appendix.annexThree.title")}</h3>
            <p>{t("appendix.annexThree.text")}</p>
            <TextList items={t.raw("appendix.annexThree.items") as string[]} />

            <div className="legal-page__contact">
              <h2>{t("contact.title")}</h2>
              <p>{t("contact.text")}</p>
              <p>
                <strong>{t("contact.company")}</strong>
                <br />
                {t("contact.emailLabel")}
                {t("contact.email")}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
