import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Headphones,
  LifeBuoy,
  Mail,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { ContactForm } from "@/app/contact/ContactForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "联系我们 | 算力租赁",
  description: "联系算力租赁团队，获取企业 GPU 算力、技术支持、合规资料和合作咨询。",
};

const contactChannels = [
  {
    title: "企业与售前咨询",
    description: "容量预留、批量 GPU、专属网络、采购流程和企业合同支持。",
    action: "发送售前需求",
    href: "mailto:contact@example.com?subject=%E4%BC%81%E4%B8%9A%E4%B8%8E%E5%94%AE%E5%89%8D%E5%92%A8%E8%AF%A2",
    icon: Building2,
  },
  {
    title: "技术支持",
    description: "实例连接、账单订单、部署环境、API 调用和故障升级路径。",
    action: "查看支持说明",
    href: "/docs/support",
    icon: LifeBuoy,
  },
  {
    title: "合规与安全资料",
    description: "申请 SOC 2 报告、NDA 流程、安全问卷和数据处理说明。",
    action: "申请资料",
    href: "mailto:contact@example.com?subject=%E5%90%88%E8%A7%84%E4%B8%8E%E5%AE%89%E5%85%A8%E8%B5%84%E6%96%99%E7%94%B3%E8%AF%B7",
    icon: ShieldCheck,
  },
] as const;

const responseSteps = [
  {
    title: "确认需求",
    description: "梳理 GPU 型号、数量、地域、网络隔离和租赁周期。",
    icon: MessageSquare,
  },
  {
    title: "方案评估",
    description: "由商务或工程团队评估库存、价格、交付窗口和接入方式。",
    icon: FileText,
  },
  {
    title: "上线支持",
    description: "生产问题按支持等级升级，企业客户可获得专属响应路径。",
    icon: Headphones,
  },
] as const;

const preparationItems = [
  "目标 GPU 型号、卡数和预计使用周期",
  "训练、推理、渲染或 API 部署等工作负载类型",
  "是否需要私有网络、固定地域或合规资料",
  "期望上线时间和预算约束",
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)]">
        <section className="relative overflow-hidden border-b border-[var(--line)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30 [mask-image:linear-gradient(to_bottom,#000,transparent_72%)]" />
          <div className="relative mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-14 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:py-20 lg:px-8">
            <div className="flex flex-col justify-center">
              <Badge
                variant="outline"
                className="w-fit rounded-full border-[var(--card-border)] bg-[var(--surface)] px-3 py-1 text-[var(--badge-foreground)]"
              >
                Contact
              </Badge>
              <h1 className="mt-6 max-w-3xl text-4xl font-[510] leading-[1.04] text-[var(--foreground)] md:text-6xl">
                让算力需求直接进入对应团队。
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
                无论是企业 GPU 资源预留、技术支持、合规资料申请，还是合作咨询，请留下清晰背景。我们会按需求类型分配给商务、工程或安全合规团队处理。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="h-10 rounded-lg bg-[var(--accent)] text-white shadow-none hover:bg-[var(--accent-hover)]">
                  <a href="mailto:contact@example.com">
                    contact@example.com
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-10 rounded-lg border-[var(--card-border)] bg-[var(--surface)] shadow-none">
                  <Link href="/docs/faq">
                    常见问题
                    <BookOpen className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <Card className="border-[var(--card-border)] bg-[var(--surface-strong)] shadow-[var(--shadow-soft)]">
              <CardHeader className="border-b border-[var(--line)] p-6">
                <CardTitle className="text-xl font-[590] text-[var(--foreground)]">
                  描述您的需求
                </CardTitle>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  当前表单会生成邮件草稿，方便您保留上下文并确认发送。
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-[510] leading-tight text-[var(--foreground)] md:text-3xl">
              选择最快的联系路径
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)] md:text-base">
              已登录用户的租赁、订单和账务问题也可以从控制台进入对应页面处理。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {contactChannels.map((channel) => {
              const Icon = channel.icon;

              return (
                <Card
                  key={channel.title}
                  className="border-[var(--card-border)] bg-[var(--surface)] shadow-none transition-colors hover:bg-[var(--surface-strong)]"
                >
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--surface-strong)] text-[var(--foreground)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-[590] text-[var(--foreground)]">
                      {channel.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">
                      {channel.description}
                    </p>
                    <Button asChild variant="ghost" className="mt-5 h-9 justify-start px-0 text-[var(--accent)] hover:bg-transparent hover:text-[var(--accent-hover)]">
                      <Link href={channel.href}>
                        {channel.action}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-[var(--surface)]">
          <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 py-14 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:py-20 lg:px-8">
            <div>
              <Badge
                variant="outline"
                className="rounded-full border-[var(--card-border)] bg-[var(--surface-strong)] px-3 py-1 text-[var(--muted)]"
              >
                Support flow
              </Badge>
              <h2 className="mt-5 text-2xl font-[510] leading-tight text-[var(--foreground)] md:text-3xl">
                从需求到交付的响应方式
              </h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)] md:text-base">
                对企业容量、生产故障和合规资料会采用不同的处理路径。信息越完整，团队越容易给出明确时间和下一步动作。
              </p>
            </div>

            <div className="grid gap-3">
              {responseSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="grid grid-cols-[auto_1fr] gap-4 rounded-xl border border-[var(--card-border)] bg-[var(--surface-strong)] p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--badge-background)] text-[var(--badge-foreground)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-xs text-[var(--muted)]">
                          0{index + 1}
                        </span>
                        <h3 className="text-base font-[590] text-[var(--foreground)]">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 py-14 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-20 lg:px-8">
          <div>
            <h2 className="text-2xl font-[510] leading-tight text-[var(--foreground)] md:text-3xl">
              联系前建议准备的信息
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] md:text-base">
              如果您正在评估企业级资源或需要技术支持，把以下信息一起发送，可以减少来回确认。
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {preparationItems.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                  <span className="text-sm leading-6 text-[var(--foreground)]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-[var(--card-border)] bg-[var(--surface-strong)] shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--surface)] text-[var(--foreground)]">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-[590] text-[var(--foreground)]">响应目标</h3>
                  <p className="text-sm text-[var(--muted)]">按问题类型分配处理优先级</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-start justify-between gap-4 border-t border-[var(--line)] pt-4">
                  <span className="text-sm text-[var(--muted)]">售前与企业方案</span>
                  <span className="text-sm font-[590] text-[var(--foreground)]">1 个工作日</span>
                </div>
                <div className="flex items-start justify-between gap-4 border-t border-[var(--line)] pt-4">
                  <span className="text-sm text-[var(--muted)]">生产故障升级</span>
                  <span className="text-sm font-[590] text-[var(--foreground)]">24/7 值守</span>
                </div>
                <div className="flex items-start justify-between gap-4 border-t border-[var(--line)] pt-4">
                  <span className="text-sm text-[var(--muted)]">合规与安全资料</span>
                  <span className="text-sm font-[590] text-[var(--foreground)]">NDA 后提供</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
