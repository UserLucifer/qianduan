import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  DollarSign,
  Headphones,
  Monitor,
  Server,
  Settings2,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'GPU 托管 | 算力租赁',
  description:
    '将 GPU 硬件托管到平台，获得客户、支持、账单和交易流能力，同时保留定价控制权。',
};

const heroVideo =
  '/videos/hostinger/Host%20Your%20GPUs%20on%20Vast.ai.mp4';
const bottomImage = '/videos/hostinger/10001.jpg';
const shellClass =
  'mx-auto w-[calc(100%-40px)] max-w-[1240px] max-[720px]:w-[calc(100%-24px)]';

const stats = [
  { value: '120K+', label: 'Active developers' },
  { value: '20K+', label: 'GPUs on platform' },
  { value: '24/7', label: 'Customer support' },
  { value: 'You', label: 'Set your prices' },
];

const platformCards: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: 'Customers & Support',
    description:
      '120K+ developers actively searching for compute. We handle 24/7 support, billing, and discovery so you never talk to a customer unless you want to.',
    icon: Headphones,
  },
  {
    title: 'Hardware & Financing',
    description:
      "Source GPUs through our vetted suppliers. Finance them with partners who use your platform earnings as qualification. Presell capacity before it's live.",
    icon: Server,
  },
  {
    title: 'Your Terms, Your Control',
    description:
      "Set your own prices. Choose on-demand, interruptible, or reserved. Configure GPU, CPU, storage, and bandwidth billing. You're the operator, we're the platform.",
    icon: Settings2,
  },
];

const hostCards = [
  {
    title: 'Data Centers & Colo Operators',
    description:
      'Run flagship GPUs with verified trust, priority placement, and enterprise deal flow. Apply for our trust label and connect directly with enterprise customers.',
    cta: 'Apply for Certification',
    href: '/contact-sales',
  },
  {
    title: 'GPU Farm Operators',
    description:
      'Turn dedicated GPU infrastructure into a profitable compute business. Presell upcoming capacity to our sales team and have customers ready before hardware arrives.',
    cta: 'Start Hosting',
    href: '/signup',
  },
  {
    title: 'Getting Started',
    description:
      'From a single workstation to your first rack, Vast handles customer acquisition, support, and billing. Source hardware, explore financing, or just list what you have.',
    cta: 'Explore How It Works',
    href: '#how-it-works',
  },
];

const vastHandles = [
  'Customer acquisition & platform exposure',
  '24/7 customer support',
  'Billing, invoicing, payments',
  'Job scheduling & resource optimization',
  'Marketing & demand generation',
  'Compliance (SOC 2 Type I)',
];

const youHandle = [
  'Hardware uptime & maintenance',
  'Network connectivity',
  'Physical infrastructure',
  'Initial hardware setup',
];

const hardwareCards = [
  {
    title: 'Vast Finance',
    description:
      'Finance GPU hardware with partners who factor in your Vast platform earnings. Submit once, get multiple offers.',
    cta: 'Explore Financing',
    href: '/financing',
    icon: CircleDollarSign,
  },
  {
    title: 'Vast Hardware',
    description:
      'Source new or certified refurbished GPUs through our vetted supplier network. Every unit is stress-tested and platform-ready.',
    cta: 'Get a Hardware Quote',
    href: '/hardware',
    icon: ShieldCheck,
  },
];

const howItWorks: Array<{
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    step: 'Step 1',
    title: 'List Your Hardware',
    description:
      'Install our lightweight client. Your machines appear on the platform in minutes.',
    icon: Monitor,
  },
  {
    step: 'Step 2',
    title: 'Set Your Terms',
    description:
      'Price your GPUs, choose rental types, and configure billing.',
    icon: Wrench,
  },
  {
    step: 'Step 3',
    title: 'We Bring the Customers',
    description:
      '120K+ developers discover your GPUs. Revenue flows automatically. We handle support 24/7.',
    icon: DollarSign,
  },
];

const faqs = [
  {
    question: 'How do I start hosting on Vast?',
    answer:
      'Create an account, install the client on your GPU machine, verify hardware availability, and publish your pricing terms.',
  },
  {
    question: 'How do I get data center certified?',
    answer:
      'Contact the host team with your facility profile, network details, inventory, and support processes so they can review certification fit.',
  },
  {
    question: 'How long does verification take?',
    answer:
      'Single machines can usually be listed quickly after software setup. Larger or certified deployments require a deeper operations review.',
  },
  {
    question: 'How do I track my earnings?',
    answer:
      'Hosts can monitor utilization, jobs, rates, payments, and customer demand from the platform dashboard.',
  },
  {
    question: 'How does Vast pricing work?',
    answer:
      'You set host pricing and availability terms. The platform handles discovery, scheduling, support, and payment collection.',
  },
  {
    question: 'What GPUs can I host?',
    answer:
      'Common NVIDIA data center and workstation GPUs can be listed when they meet platform reliability, driver, memory, and network requirements.',
  },
  {
    question: 'Can I finance GPU hardware through Vast?',
    answer:
      'Financing partners can evaluate platform earnings and deployment plans to help operators source or expand GPU inventory.',
  },
];

export default function HostingPage() {
  return (
    <>
      <Header />
      <main className="bg-[#08090a] text-[#f7f8f8]">
        <section className="relative isolate min-h-[640px] overflow-hidden">
          <video
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 -z-10 bg-[#08090a]/68" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,9,10,0.16),rgba(8,9,10,0.18)_55%,#08090a_100%)]" />

          <div
            className={`${shellClass} flex min-h-[640px] flex-col items-center justify-center py-24 text-center sm:py-28`}
          >
            <h1 className="max-w-[900px] text-4xl font-semibold leading-[1.04] text-[#f7f8f8] sm:text-5xl lg:text-6xl">
              120,000 AI Developers Need Your GPUs
            </h1>
            <p className="mt-7 max-w-[760px] text-base leading-7 text-[#d0d6e0] sm:text-lg">
              List your hardware on the world&apos;s largest GPU cloud. We
              handle customers, support, billing, and deal flow; you control
              pricing and earn.
            </p>

            <div className="mt-9 grid w-full max-w-[640px] grid-cols-2 gap-5 sm:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="min-w-0">
                  <div className="text-2xl font-semibold leading-tight text-[#f7f8f8] sm:text-3xl">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs font-medium text-[#d0d6e0] sm:text-sm">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <Button
                asChild
                className="h-10 rounded-[6px] bg-[#5e6ad2] px-5 text-sm font-semibold text-white hover:bg-[#7170ff]"
              >
                <Link href="/signup">
                  Start Hosting
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-[6px] border-white/25 bg-white/[0.02] px-5 text-sm font-semibold text-[#f7f8f8] hover:bg-white/[0.06] hover:text-[#f7f8f8]"
              >
                <Link href="/contact-sales">Talk to Our Host Team</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className={shellClass}>
            <div className="mx-auto max-w-[760px] text-center">
              <h2 className="text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
                Everything You Need to Run a GPU Business
              </h2>
              <p className="mt-5 text-base leading-7 text-[#d0d6e0] sm:text-lg">
                A full-stack platform for GPU operators.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {platformCards.map((item) => {
                const Icon = item.icon;

                return (
                  <Card
                    key={item.title}
                    className="h-full rounded-[8px] border-white/10 bg-white/[0.035] text-[#f7f8f8] shadow-none"
                  >
                    <CardContent className="p-7">
                      <Icon className="h-7 w-7 text-[#8a8f98]" />
                      <h3 className="mt-7 text-xl font-semibold leading-tight">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-sm leading-6 text-[#d0d6e0]">
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
          <div className={shellClass}>
            <div className="mx-auto max-w-[760px] text-center">
              <h2 className="text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
                Who Hosts on Vast
              </h2>
              <p className="mt-5 text-base leading-7 text-[#d0d6e0]">
                From data center operators to first-time hosts, Vast supports
                every scale.
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {hostCards.map((item) => (
                <Card
                  key={item.title}
                  className="h-full rounded-[8px] border-white/10 bg-transparent text-[#f7f8f8] shadow-none"
                >
                  <CardContent className="flex h-full flex-col p-7">
                    <h3 className="text-xl font-semibold leading-tight">
                      {item.title}
                    </h3>
                    <p className="mt-5 flex-1 text-sm leading-6 text-[#d0d6e0]">
                      {item.description}
                    </p>
                    <Button
                      asChild
                      className="mt-7 h-10 w-fit rounded-[6px] bg-[#5e6ad2] px-4 text-sm font-semibold text-white hover:bg-[#7170ff]"
                    >
                      <Link href={item.href}>
                        {item.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0f1011] py-20 sm:py-24">
          <div className={shellClass}>
            <div className="mx-auto max-w-[780px] text-center">
              <h2 className="text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
                What We Handle vs. What You Handle
              </h2>
              <p className="mt-5 text-base leading-7 text-[#d0d6e0]">
                You focus on hardware. We focus on everything else.
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-[920px] gap-6 md:grid-cols-2">
              <Card className="rounded-[8px] border-white/10 bg-white/[0.04] text-[#f7f8f8] shadow-none">
                <CardContent className="p-7">
                  <h3 className="text-lg font-semibold text-[#8d9cff]">
                    Vast Handles
                  </h3>
                  <ul className="mt-6 space-y-4 text-sm leading-6 text-[#f7f8f8]">
                    {vastHandles.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[#10b981]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="rounded-[8px] border-white/10 bg-white/[0.04] text-[#f7f8f8] shadow-none">
                <CardContent className="p-7">
                  <h3 className="text-lg font-semibold">You Handle</h3>
                  <ul className="mt-6 space-y-4 text-sm leading-6 text-[#f7f8f8]">
                    {youHandle.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border border-white/45" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <p className="mx-auto mt-8 max-w-[760px] text-center text-sm font-medium leading-6 text-[#10b981]">
              Our 24/7 support team resolves customer issues so you don&apos;t
              have to. This is the #1 thing hosts tell us they value.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className={shellClass}>
            <Card className="mx-auto max-w-[760px] rounded-[8px] border-white/10 bg-transparent text-center text-[#f7f8f8] shadow-none">
              <CardContent className="p-8 sm:p-12">
                <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
                  Sell Capacity Before Your Hardware Arrives
                </h2>
                <p className="mx-auto mt-5 max-w-[520px] text-sm leading-6 text-[#d0d6e0] sm:text-base">
                  Planning a new deployment? Share your upcoming GPU
                  availability and timeline with our sales team. We&apos;ll
                  match you with enterprise customers looking for reserved
                  compute.
                </p>
                <Button
                  asChild
                  className="mt-7 h-10 rounded-[6px] bg-[#5e6ad2] px-5 text-sm font-semibold text-white hover:bg-[#7170ff]"
                >
                  <Link href="/contact-sales">
                    Contact Our Sales Team
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className={shellClass}>
            <div className="mx-auto max-w-[720px] text-center">
              <h2 className="text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
                Finance & Source Hardware Through Vast
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {hardwareCards.map((item) => {
                const Icon = item.icon;

                return (
                  <Card
                    key={item.title}
                    className="rounded-[8px] border-white/10 bg-transparent text-[#f7f8f8] shadow-none"
                  >
                    <CardContent className="p-7">
                      <Icon className="h-7 w-7 text-[#8a8f98]" />
                      <h3 className="mt-6 text-xl font-semibold leading-tight">
                        {item.title}
                      </h3>
                      <p className="mt-5 text-sm leading-6 text-[#d0d6e0]">
                        {item.description}
                      </p>
                      <Link
                        href={item.href}
                        className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#8d9cff] hover:text-[#aab4ff]"
                      >
                        {item.cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 sm:py-24">
          <div className={shellClass}>
            <div className="mx-auto max-w-[760px] text-center">
              <h2 className="text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
                How It Works
              </h2>
              <p className="mt-5 text-base leading-7 text-[#d0d6e0]">
                Three steps from hardware to revenue.
              </p>
            </div>

            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {howItWorks.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.step} className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.08] text-[#f7f8f8]">
                      <Icon className="h-7 w-7" />
                    </div>
                    <p className="mt-6 text-sm font-semibold text-[#8d9cff]">
                      {item.step}
                    </p>
                    <h3 className="mt-4 text-xl font-semibold leading-tight">
                      {item.title}
                    </h3>
                    <p className="mx-auto mt-4 max-w-[320px] text-sm leading-6 text-[#d0d6e0]">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className={`${shellClass} max-w-[960px]`}>
            <h2 className="text-center text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="mt-12 space-y-3">
              {faqs.map((item) => (
                <AccordionItem
                  key={item.question}
                  value={item.question}
                  className="rounded-[8px] border border-white/10 bg-transparent px-5"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-semibold text-[#f7f8f8] hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-6 text-[#d0d6e0]">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="pb-20 pt-8 sm:pb-24">
          <div className={shellClass}>
            <div
              className="relative isolate overflow-hidden rounded-[8px] border border-white/10 bg-cover bg-center px-6 py-20 text-center sm:px-10 sm:py-24"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(8,9,10,0.44), rgba(8,9,10,0.72)), url("${bottomImage}")`,
              }}
            >
              <h2 className="text-3xl font-semibold leading-tight text-[#f7f8f8] sm:text-5xl">
                Ready to Start Earning?
              </h2>
              <p className="mx-auto mt-4 max-w-[760px] text-base leading-7 text-[#f7f8f8]">
                Join hundreds of hosts already earning revenue on the
                world&apos;s largest GPU cloud.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-10 rounded-[6px] bg-[#5e6ad2] px-5 text-sm font-semibold text-white hover:bg-[#7170ff]"
                >
                  <Link href="/signup">Start Hosting</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-[6px] border-white/25 bg-white/[0.02] px-5 text-sm font-semibold text-[#f7f8f8] hover:bg-white/[0.06] hover:text-[#f7f8f8]"
                >
                  <Link href="/contact-sales">
                    Apply for Data Center Certification
                  </Link>
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
