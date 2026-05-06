import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BookOpen, FileQuestion, LifeBuoy } from "lucide-react";
import { getBlogCategories, getBlogPosts } from "@/api/blog";
import type { BlogPostResponse, PageResult } from "@/api/blog";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { BlogCard } from "@/components/shared/BlogCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { normalizeLocale } from "@/i18n/locales";

export const revalidate = 600;

type HelpCenterPageProps = {
  params: Promise<{ locale: string }>;
};

type HelpCardCopy = {
  title: string;
  description: string;
};

const emptyPage: PageResult<BlogPostResponse> = {
  records: [],
  total: 0,
  pageNo: 1,
  pageSize: 6,
};

const helpCardIcons = [BookOpen, FileQuestion, LifeBuoy] as const;
const helpCardRoutes = ["/docs", "/docs/faq", "/docs/support"] as const;

export async function generateMetadata({
  params,
}: HelpCenterPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HelpCenter" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function HelpCenterPage({ params }: HelpCenterPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HelpCenter" });
  const language = normalizeLocale(locale);
  const helpCategoryKeywords = t.raw("categoryKeywords") as string[];
  const helpCards = (t.raw("cards") as HelpCardCopy[]).map((card, index) => ({
    ...card,
    href: helpCardRoutes[index] ?? "/docs",
    icon: helpCardIcons[index] ?? BookOpen,
  }));

  const [categoriesRes, postsRes] = await Promise.all([
    getBlogCategories({ language }).catch(() => ({ data: [] })),
    getBlogPosts({ pageNo: 1, pageSize: 6, publish_status: 1, language }).catch(() => ({
      data: emptyPage,
    })),
  ]);

  const categories = categoriesRes.data ?? [];
  const posts = postsRes.data ?? emptyPage;
  const helpCategories = categories.filter((category) =>
    helpCategoryKeywords.some((keyword) => category.categoryName?.includes(keyword))
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="shell pb-16 pt-16 md:pb-24 md:pt-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              <LifeBuoy className="h-3.5 w-3.5" />
              {t("badge")}
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg">
              {t("hero.description")}
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {helpCards.map((card) => (
              <Link key={card.title} href={card.href} className="group block focus:outline-none">
                <Card className="h-full transition-colors group-hover:border-emerald-500/40 group-focus-visible:ring-2 group-focus-visible:ring-ring">
                  <CardContent className="flex h-full flex-col gap-3 p-6">
                    <card.icon className="h-5 w-5 text-primary" />
                    <h2 className="text-base font-semibold text-foreground">{card.title}</h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {helpCategories.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold text-foreground">
                {t("categories.title")}
              </h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {helpCategories.map((category) => (
                  <Button key={category.id} asChild variant="outline" size="sm">
                    <Link href={`/blog?category_id=${category.id}`}>
                      {category.categoryName}
                    </Link>
                  </Button>
                ))}
              </div>
            </section>
          )}

          <section className="mt-16">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {t("latest.title")}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("latest.description")}
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/blog">{t("latest.cta")}</Link>
              </Button>
            </div>

            {posts.records.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {posts.records.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="mt-8 flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-border p-10 text-center">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {t("latest.emptyTitle")}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  {t("latest.emptyDescription")}
                </p>
              </div>
            )}
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
