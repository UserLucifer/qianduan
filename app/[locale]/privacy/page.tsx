import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import "@/components/marketing/LegalPage.css";

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

type LabeledText = {
  term: string;
  text: string;
};

type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "notice"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "labeledList"; items: LabeledText[] }
  | { type: "contact"; title: string; paragraphs: string[] };

function renderBlock(block: LegalBlock, index: number) {
  switch (block.type) {
    case "paragraph":
      return <p key={index}>{block.text}</p>;
    case "notice":
      return (
        <div key={index} className="legal-page__notice">
          <strong>{block.text}</strong>
        </div>
      );
    case "heading":
      return <h2 key={index}>{block.text}</h2>;
    case "subheading":
      return <h3 key={index}>{block.text}</h3>;
    case "list":
      return (
        <ul key={index}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "labeledList":
      return (
        <ul key={index}>
          {block.items.map((item) => (
            <li key={item.term}>
              <strong>{item.term}</strong>
              {item.text}
            </li>
          ))}
        </ul>
      );
    case "contact":
      return (
        <div key={index} className="legal-page__contact">
          <h2>{block.title}</h2>
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  const blocks = t.raw("blocks") as LegalBlock[];

  return (
    <>
      <Header />
      <main className="legal-page">
        <div className="legal-page__inner">
          <header className="legal-page__header">
            <h1 className="legal-page__title">{t("title")}</h1>
            <p className="legal-page__date">{t("date")}</p>
          </header>

          <div className="legal-page__body">
            {blocks.map((block, index) => renderBlock(block, index))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
