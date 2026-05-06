import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Headphones,
  LineChart,
  Lock,
  Server,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { DataCenterCertificationForm } from "@/app/data-center/DataCenterCertificationForm";
import Footer from "@/components/marketing/Footer";
import Header from "@/components/marketing/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "数据中心认证 | 算力租赁",
  description:
    "申请数据中心认证，为专业托管 GPU 服务器获得信任标签、优先展示和专属支持。",
};

const requirementsVideo =
  "/videos/%E6%95%B0%E6%8D%AE%E4%B8%AD%E5%BF%83/Data%20Center%20Application%20%E2%80%94%20Vast.ai%20(2).mp4";
const ctaImage =
  "/videos/%E6%95%B0%E6%8D%AE%E4%B8%AD%E5%BF%83/08088421-02ba-4285-b237-ce74a1ca87d7.avif";

const shellClass =
  "mx-auto w-[calc(100%-40px)] max-w-[1240px] max-[720px]:w-[calc(100%-24px)]";

const assurances = ["Blue trust label", "Priority placement", "Dedicated support"];

const benefits: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Blue Trust Label",
    description:
      "Your offers display a verified blue label on the platform, signaling professional-grade infrastructure to renters.",
    icon: BadgeCheck,
  },
  {
    title: "Priority Placement",
    description:
      "Certified machines are auto-sorted higher in search results, so enterprise customers find you first.",
    icon: TrendingUp,
  },
  {
    title: "Increased Traffic",
    description:
      "We actively direct more user flow to certified hosts because of the quality and reliability of their equipment.",
    icon: LineChart,
  },
  {
    title: "Dedicated Support",
    description:
      "Get direct access to the operations team for onboarding, troubleshooting, and day-to-day support.",
    icon: Headphones,
  },
];

const requirements: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Professional Environment",
    description:
      "Servers housed in a professionally managed data center facility with reliable power, cooling, and network infrastructure.",
    icon: Server,
  },
  {
    title: "Minimum 5 GPU Servers",
    description:
      "At least 5 servers equipped with flagship-class GPU hardware such as A100, H100, H200, RTX 4090 or RTX 5090.",
    icon: BadgeCheck,
  },
  {
    title: "Verified Business",
    description:
      "Equipment owned by a registered business. Owners complete identity verification and sign the Data Center Hosting Agreement.",
    icon: ShieldCheck,
  },
  {
    title: "Security Standards",
    description:
      "Certifications like ISO 27001, SOC 2, or equivalent are encouraged and strengthen the application.",
    icon: Lock,
  },
];

export default function DataCenterPage() {
  return (
    <>
      <Header />
      <main className="bg-[#08090a] text-[#f7f8f8]">
        <section className="py-12 sm:py-16 lg:py-20">
          <div
            className={`${shellClass} relative isolate overflow-hidden rounded-[8px] border border-white/10 bg-[#0f1011]`}
          >
            <div className="absolute inset-0 -z-20 bg-[#0f1011]" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(67,24,96,0.78),rgba(8,9,10,0.54)_50%,rgba(15,33,82,0.82))]" />
            <div className="absolute inset-0 -z-10 opacity-[0.16] [background-image:repeating-linear-gradient(135deg,rgba(247,248,248,0.7)_0_1px,transparent_1px_9px)]" />

            <div className="grid gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[0.95fr_1fr] lg:px-14 lg:py-20">
              <div className="flex flex-col justify-center">
                <h1 className="max-w-[620px] text-4xl font-semibold leading-[1.05] text-[#f7f8f8] sm:text-5xl lg:text-6xl">
                  Become a Certified Data Center
                </h1>
                <p className="mt-7 max-w-[660px] text-base leading-7 text-[#d0d6e0] sm:text-lg">
                  Run 5+ GPU servers in a professionally managed facility?
                  Apply for Certified Data Center status to earn a blue trust
                  label, priority platform placement, and increased customer
                  traffic.
                </p>

                <ul className="mt-8 space-y-4 text-sm font-semibold text-[#d0d6e0]">
                  {assurances.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-[#10b981]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <DataCenterCertificationForm />
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className={shellClass}>
            <div className="mx-auto max-w-[780px] text-center">
              <h2 className="text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
                Why Get Certified?
              </h2>
              <p className="mt-5 text-base leading-7 text-[#d0d6e0]">
                Certified Data Centers receive visible trust signals and
                algorithmic advantages on the platform.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((item) => {
                const Icon = item.icon;

                return (
                  <Card
                    key={item.title}
                    className="h-full rounded-[8px] border-white/10 bg-transparent text-[#f7f8f8] shadow-none"
                  >
                    <CardContent className="p-7">
                      <Icon className="h-7 w-7 text-[#8a8f98]" />
                      <h3 className="mt-7 text-xl font-semibold leading-tight">
                        {item.title}
                      </h3>
                      <p className="mt-5 text-sm leading-6 text-[#d0d6e0]">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div
            className={`${shellClass} relative isolate overflow-hidden rounded-[8px] border border-white/10 bg-[#0f1011] px-6 py-16 sm:px-10 lg:px-16`}
          >
            <video
              className="absolute inset-0 -z-20 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source src={requirementsVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 -z-10 bg-[#08090a]/62" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,9,10,0.34),rgba(8,9,10,0.82))]" />
            <div className="mx-auto max-w-[780px] text-center">
              <h2 className="text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
                What It Takes
              </h2>
              <p className="mt-5 text-base leading-7 text-[#d0d6e0]">
                You provide GPU hardware in a professional environment. We list
                your machines with a blue trust label and prioritize them on the
                platform. Clients rent your GPUs, and you earn based on usage.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {requirements.map((item) => {
                const Icon = item.icon;

                return (
                  <Card
                    key={item.title}
                    className="h-full rounded-[8px] border-white/10 bg-[#010102]/88 text-[#f7f8f8] shadow-none"
                  >
                    <CardContent className="p-7">
                      <Icon className="h-7 w-7 text-[#8a8f98]" />
                      <h3 className="mt-7 text-xl font-semibold leading-tight">
                        {item.title}
                      </h3>
                      <p className="mt-5 text-sm font-semibold leading-6 text-[#d0d6e0]">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="pb-20 pt-8 sm:pb-24">
          <div className={shellClass}>
            <div
              className="relative isolate overflow-hidden rounded-[8px] border border-white/10 bg-[#191a1b] bg-cover bg-center px-6 py-20 text-center sm:px-10 sm:py-24"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(8,9,10,0.48), rgba(8,9,10,0.76)), url("${ctaImage}")`,
              }}
            >

              <h2 className="text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
                准备好扩展您的托管业务了吗？
              </h2>
              <p className="mx-auto mt-5 max-w-[760px] text-base leading-7 text-[#d0d6e0]">
                探索融资以扩大您的 GPU 车队，或通过我们经过审核的供应商网络采购认证硬件。
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-10 rounded-[6px] bg-[#5e6ad2] px-5 text-sm font-semibold text-white hover:bg-[#7170ff]"
                >
                  <Link href="/financing">
                    探索融资
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-[6px] border-white/25 bg-white/[0.02] px-5 text-sm font-semibold text-[#f7f8f8] hover:bg-white/[0.06] hover:text-[#f7f8f8]"
                >
                  <Link href="/hardware">源硬件</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
