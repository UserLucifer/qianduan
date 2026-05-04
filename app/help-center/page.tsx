import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, FileQuestion, LifeBuoy } from "lucide-react";
import { getBlogCategories, getBlogPosts } from "@/api/blog";
import type { BlogPostResponse, PageResult } from "@/api/blog";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { BlogCard } from "@/components/shared/BlogCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "帮助中心 | 算力租赁",
  description: "查看算力租赁平台的帮助文档、产品指引和服务支持内容。",
};

const emptyPage: PageResult<BlogPostResponse> = {
  records: [],
  total: 0,
  pageNo: 1,
  pageSize: 6,
};

const helpCategoryKeywords = [
  "帮助",
  "文档",
  "指南",
  "教程",
  "常见问题",
  "FAQ",
  "支持",
];

const helpCards = [
  {
    title: "使用文档",
    description: "阅读平台使用、租赁流程和账户管理相关内容。",
    href: "/docs",
    icon: BookOpen,
  },
  {
    title: "常见问题",
    description: "快速查找计费、实例、充值、提现和 API 相关说明。",
    href: "/docs/faq",
    icon: FileQuestion,
  },
  {
    title: "服务支持",
    description: "如需人工协助，可先查看支持说明或联系服务团队。",
    href: "/docs/support",
    icon: LifeBuoy,
  },
];

export default async function HelpCenterPage() {
  const [categoriesRes, postsRes] = await Promise.all([
    getBlogCategories().catch(() => ({ data: [] })),
    getBlogPosts({ pageNo: 1, pageSize: 6, publish_status: 1 }).catch(() => ({
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
              Help Center
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              帮助中心
            </h1>
            <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg">
              查看平台使用说明、产品指引和服务支持内容。文档内容由后台文档系统统一维护。
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
              <h2 className="text-xl font-semibold text-foreground">帮助分类</h2>
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
                  最新帮助内容
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  从后端内容接口读取已发布文章。
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/blog">查看全部文章</Link>
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
                  暂无帮助内容
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  当前后端没有返回已发布内容，或内容接口暂时不可用。
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
