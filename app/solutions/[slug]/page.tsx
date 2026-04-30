import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { solutionsData } from '@/lib/solutions-data';
import { CodeSnippetWindow } from '@/app/components/solutions/CodeSnippetWindow';
import { LineArtDiagram } from '@/app/components/solutions/LineArtDiagram';
import { HeroBackground } from '@/app/components/solutions/HeroBackgrounds';
import { Button } from '@/components/ui/button';
import { ChevronRight, Cpu } from 'lucide-react';
import Link from 'next/link';

interface SolutionPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(solutionsData).map((slug) => ({
    slug,
  }));
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = params;
  const data = solutionsData[slug];

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow relative">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
          <HeroBackground type={data.heroSvgPattern} />
          
          <div className="shell px-4">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-8">
                <Cpu className="w-3.5 h-3.5" />
                <span>Premium GPU Solutions</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05] mb-8">
                {data.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
                {data.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/rental">
                  <Button size="lg" className="rounded-full h-12 px-10 text-base font-semibold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                    开始使用 <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="rounded-full h-12 px-10 text-base font-semibold border-border/60 hover:bg-muted/50">
                    咨询架构师
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Sections (Interleaved) */}
        <section className="py-24 bg-muted/10 border-y border-border/50">
          <div className="shell px-4 space-y-40">
            {/* Core Visual Segment */}
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 space-y-10 order-2 lg:order-1">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    下一代算力基础设施
                  </h2>
                  <p className="text-muted-foreground leading-relaxed max-w-lg text-lg">
                    我们提供全栈优化的算力环境，从裸金属硬件层到容器虚拟化调度，每一层都为高性能计算量身打造。
                  </p>
                </div>
                
                <div className="space-y-10">
                  {data.features.slice(0, 2).map((feature, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="mt-1 shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-background border border-border shadow-sm text-primary transition-transform group-hover:scale-110">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 w-full max-w-3xl order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl -z-10" />
                  {data.visualType === 'code' && <CodeSnippetWindow code={data.visualContent} />}
                  {data.visualType === 'line-art' && <LineArtDiagram />}
                  {data.visualType === 'realistic' && (
                    <div className="aspect-video rounded-2xl border border-border/50 overflow-hidden shadow-2xl bg-muted/30 relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                      <span className="text-muted-foreground/40 text-sm font-mono tracking-widest uppercase italic">
                        {data.id.replace('-', ' ')} visualization
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-16 pt-24 border-t border-border/40">
              {data.features.map((feature, i) => (
                <div key={i} className="space-y-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GPU Recommendations Section */}
        <section className="py-32">
          <div className="shell px-4 text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">推荐算力规格</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">针对当前业务场景，我们精选了以下机型，旨在提供最佳的性能功耗比。</p>
          </div>
          
          <div className="shell px-4 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {data.recommendedGpus.map((gpu, i) => (
              <div key={i} className="group relative p-10 rounded-3xl border border-border/60 bg-background transition-all hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-primary">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight">{gpu.model}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-10 text-sm">{gpu.specs}</p>
                  <div className="mt-auto pt-8 border-t border-border/30 flex items-center justify-between">
                    <Link href={`/rental?model=${encodeURIComponent(gpu.model)}`} className="text-sm font-bold text-primary flex items-center gap-1 group/link">
                      查看实时库存 
                      <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                    <span className="text-[10px] font-mono text-muted-foreground/30 uppercase tracking-widest">Available Now</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="px-4 pb-32">
          <div className="shell">
            <div className="bg-foreground rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--ui-primary),0.15),transparent)] pointer-events-none" />
              <div className="relative z-10 space-y-10">
                <h2 className="text-3xl md:text-6xl font-bold tracking-tighter text-background leading-[1.1]">
                  立即开启您的<br className="hidden md:block" />高性能计算之旅
                </h2>
                <p className="text-background/60 text-lg max-w-2xl mx-auto leading-relaxed">
                  全球 1000+ 顶尖 AI 实验室与企业的一致选择。从单个节点到万卡集群，我们随需而动。
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-6">
                  <Link href="/rental">
                    <Button size="lg" variant="secondary" className="rounded-full h-14 px-12 text-base font-bold">
                      立即开始
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" size="lg" className="rounded-full h-14 px-12 text-base font-bold border-background/20 hover:bg-background/10 text-background">
                      预约技术演示
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
