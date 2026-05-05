import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/api/blog";
import type { BlogPostResponse } from "@/api/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";

type BlogPreviewPost = {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  image: string;
  href: string;
};

const fallbackPosts: BlogPreviewPost[] = [
  {
    id: "gpu-rental-training",
    title: "GPU 租赁如何缩短模型训练排队时间",
    summary: "从实例规格、显存容量到节点交付节奏，梳理训练任务上线前最需要确认的算力指标。",
    category: "算力实践",
    date: "2026年05月05日",
    image: "/images/home/下载.png",
    href: "/blog",
  },
  {
    id: "inference-readiness",
    title: "推理业务上线前需要确认的基础设施指标",
    summary: "围绕吞吐、延迟、弹性扩缩容和网络稳定性，建立更清晰的 AI 推理资源评估方式。",
    category: "AI 推理",
    date: "2026年04月28日",
    image: "/images/home/3.webp",
    href: "/blog",
  },
  {
    id: "gpu-cluster-reliability",
    title: "构建高稳定 GPU 集群的三条经验",
    summary: "把安全、监控和资源隔离前置到架构设计阶段，让关键工作负载具备持续运行能力。",
    category: "基础设施",
    date: "2026年04月16日",
    image: "/images/home/hub-ml.png",
    href: "/blog",
  },
];

const fallbackImages = fallbackPosts.map((post) => post.image);

function toPreviewPost(post: BlogPostResponse, index: number): BlogPreviewPost {
  const date = formatDate(post.publishedAt ?? post.createdAt);

  return {
    id: String(post.id),
    title: post.title,
    summary: post.summary?.trim() || fallbackPosts[index]?.summary || "阅读更多算力租赁与 AI 基础设施实践。",
    category: post.categoryName || fallbackPosts[index]?.category || "博客",
    date: date === "-" ? fallbackPosts[index]?.date || "" : date,
    image: post.coverImageUrl || fallbackImages[index % fallbackImages.length],
    href: `/blog/${post.id}`,
  };
}

async function loadPreviewPosts(): Promise<BlogPreviewPost[]> {
  try {
    const response = await getBlogPosts(
      {
        pageNo: 1,
        pageSize: 3,
        publish_status: 1,
      },
      { timeout: 2500 },
    );
    const records = response.data?.records ?? [];

    if (records.length === 0) {
      return fallbackPosts;
    }

    return records.slice(0, 3).map(toPreviewPost);
  } catch {
    return fallbackPosts;
  }
}

export default async function BlogPreviewSection() {
  const posts = await loadPreviewPosts();

  return (
    <section className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] border-t border-[var(--line)] bg-[var(--background)] py-20 text-[var(--foreground)] sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-[590] leading-tight tracking-normal md:text-5xl">
              阅读最新博客
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)] md:text-base">
              获取算力租赁、GPU 集群和 AI 基础设施的最新实践与产品洞察。
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="w-fit border-[var(--card-border)] bg-[var(--surface)] text-[var(--foreground)] shadow-none hover:bg-[var(--surface-strong)]"
          >
            <Link href="/blog">
              查看全部
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="group overflow-hidden rounded-[8px] border-[var(--card-border)] bg-[var(--surface)] text-[var(--foreground)] shadow-none transition-colors hover:border-[var(--accent)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[var(--surface-strong)]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={post.image.startsWith("http")}
                />
                <Badge
                  variant="secondary"
                  className="absolute left-3 top-3 rounded-[4px] border border-[var(--line)] bg-[var(--surface-strong)] px-2 py-1 text-[10px] font-[590] uppercase tracking-normal text-[var(--foreground)]"
                >
                  {post.category}
                </Badge>
              </div>
              <CardContent className="p-5 sm:p-6">
                <p className="text-sm text-[var(--muted)]">{post.date}</p>
                <h3 className="mt-4 line-clamp-2 text-xl font-[590] leading-snug tracking-normal">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                  {post.summary}
                </p>
                <Button
                  asChild
                  variant="link"
                  className="mt-5 h-auto justify-start p-0 text-xs font-[590] uppercase tracking-normal text-[var(--foreground)] hover:text-[var(--accent)]"
                >
                  <Link href={post.href}>
                    继续阅读
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
