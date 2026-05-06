import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import "@/components/marketing/LegalPage.css";

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "notice"; title: string; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "orderedList"; items: string[] }
  | { type: "contact"; title: string; paragraphs: string[] };

function renderBlock(block: LegalBlock, index: number) {
  switch (block.type) {
    case "paragraph":
      return <p key={index}>{block.text}</p>;
    case "notice":
      return (
        <div key={index} className="legal-page__notice">
          <strong>{block.title}</strong>
          {block.text}
        </div>
      );
    case "heading":
      return <h2 key={index}>{block.text}</h2>;
    case "subheading":
      return <h3 key={index}>{block.text}</h3>;
    case "orderedList":
      return (
        <ol key={index}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
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
}: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });
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
