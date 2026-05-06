"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  BookOpen,
  Building2,
  Cpu,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Server,
  Settings,
  Sparkles,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";

import { type UserMeResponse } from "@/api/user";
import { UserAvatar } from "@/components/shared/UserAvatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getAvatarUrl } from "@/lib/avatars";

type MobileMarketingNavProps = {
  user: UserMeResponse | null;
  onLogout: () => void;
};

type NavItem = {
  key: string;
  href: string;
};

type NavGroup = {
  key: string;
  icon: LucideIcon;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    key: "products",
    icon: Cpu,
    items: [
      { key: "gpuComputing", href: "/gpu-computing" },
      { key: "rental", href: "/rental" },
      { key: "infrastructureControl", href: "#" },
      { key: "dataStorage", href: "#" },
    ],
  },
  {
    key: "useCases",
    icon: Sparkles,
    items: [
      { key: "textGeneration", href: "/use-cases/ai-text-generation" },
      { key: "imageVideo", href: "/use-cases/ai-image-video-generation" },
      { key: "agents", href: "/use-cases/ai-agents" },
      { key: "all", href: "/use-cases" },
    ],
  },
  {
    key: "solutions",
    icon: Workflow,
    items: [
      { key: "llmTraining", href: "/solutions/llm-training" },
      { key: "inference", href: "/solutions/high-concurrency-inference" },
      { key: "startups", href: "/solutions/aigc-startups" },
      { key: "enterprise", href: "/enterprise" },
    ],
  },
  {
    key: "hosting",
    icon: Server,
    items: [
      { key: "hosting", href: "/hosting" },
      { key: "dataCenter", href: "/data-center" },
      { key: "financing", href: "/financing" },
      { key: "hardware", href: "/hardware" },
    ],
  },
  {
    key: "company",
    icon: Building2,
    items: [
      { key: "about", href: "/about" },
      { key: "sustainability", href: "/sustainability" },
      { key: "enterprise", href: "/enterprise" },
    ],
  },
];

const directLinks = [
  { titleKey: "directLinks.rental", href: "/rental", icon: Server },
  { titleKey: "directLinks.blog", href: "/blog", icon: BookOpen },
  { titleKey: "directLinks.helpCenter", href: "/help-center", icon: HelpCircle },
  { titleKey: "directLinks.enterprise", href: "/enterprise", icon: Building2 },
];

export default function MobileMarketingNav({ user, onLogout }: MobileMarketingNavProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("MobileMarketingNav");
  const common = useTranslations("Common");

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    closeMenu();
    onLogout();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={t("openMenu")}
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="inset-0 flex h-[100dvh] w-screen max-w-none flex-col border-0 bg-zinc-900 p-0 text-white shadow-none sm:max-w-none lg:hidden [&>button]:hidden"
      >
        <SheetTitle className="sr-only">{t("title")}</SheetTitle>
        <SheetDescription className="sr-only">{t("description")}</SheetDescription>

        <div className="flex h-20 shrink-0 items-center justify-between px-8">
          <Link href="/" onClick={closeMenu} className="text-xl font-bold text-white">
            {common("brand")}
          </Link>
          <SheetClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-11 w-11 text-white hover:bg-white/10 hover:text-white"
              aria-label={t("closeMenu")}
              onClick={closeMenu}
            >
              <X className="h-6 w-6" />
            </Button>
          </SheetClose>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-10 pb-8 pt-1">
          <div className="space-y-3 pb-8">
            {user ? (
              <Button
                asChild
                variant="outline"
                className="h-12 w-full border-white/20 bg-transparent text-base font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/dashboard" onClick={closeMenu}>
                  {t("dashboard")}
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="h-12 w-full border-white/20 bg-transparent text-base font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/login" onClick={closeMenu}>
                  {t("login")}
                </Link>
              </Button>
            )}
          </div>

          <Accordion type="single" collapsible className="w-full border-0">
            {navGroups.map((group) => {
              return (
                <AccordionItem key={group.key} value={group.key} className="border-b-0">
                  <AccordionTrigger className="min-h-12 py-3 text-lg font-semibold text-white hover:no-underline [&>svg]:text-white/80">
                    {t(`groups.${group.key}.title`)}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-1 pb-4">
                    {group.items.map((item) => (
                      <Link
                        key={`${group.key}-${item.key}`}
                        href={item.href}
                        prefetch={false}
                        onClick={closeMenu}
                        className="block rounded-lg px-3 py-3 transition-colors hover:bg-white/10"
                      >
                        <span className="block text-sm font-semibold text-white">
                          {t(`groups.${group.key}.items.${item.key}.name`)}
                        </span>
                        <span className="mt-1 block text-xs leading-snug text-white/60">
                          {t(`groups.${group.key}.items.${item.key}.description`)}
                        </span>
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="mt-4 space-y-2 border-t border-white/10 pt-8">
            {directLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.titleKey}
                  href={item.href}
                  prefetch={false}
                  onClick={closeMenu}
                  className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-lg font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Icon className="h-4 w-4 text-white/60" />
                  {t(item.titleKey)}
                </Link>
              );
            })}
          </div>

          {user && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 pb-4">
                <UserAvatar
                  src={getAvatarUrl(user.avatarKey)}
                  name={user.userName}
                  className="h-10 w-10 shrink-0 border border-white/15"
                />
                <div className="min-w-0">
                  <p className="truncate text-xs text-white/50">{user.email}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-white">
                    {user.userName || t("unnamedUser")}
                  </p>
                </div>
              </div>
              <Button
                asChild
                variant="ghost"
                className="h-11 w-full justify-start text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/dashboard" onClick={closeMenu}>
                  <LayoutDashboard className="h-4 w-4" />
                  {t("dashboard")}
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="h-11 w-full justify-start text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/dashboard/settings" onClick={closeMenu}>
                  <Settings className="h-4 w-4" />
                  {t("accountSettings")}
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-11 w-full justify-start text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {t("logout")}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
