"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const gpuOptionMeta = [
  { key: "b200" },
  { key: "h200", hasNote: true },
  { key: "h100Sxm", hasNote: true },
  { key: "h100Pcie" },
  { key: "a10080" },
  { key: "a10040" },
  { key: "l40s" },
  { key: "rtx5090", hasNote: true },
  { key: "rtx4090" },
  { key: "rtx3090" },
  { key: "other" },
] as const;

const selectGroupMeta = [
  {
    key: "quantity",
    required: true,
    options: ["qty1_4", "qty5_16", "qty17_64", "qty64Plus"],
  },
  {
    key: "formFactor",
    options: ["fullServer", "gpuNode", "bareCard", "rackConfig"],
  },
  {
    key: "timeline",
    required: true,
    options: ["immediate", "weeks2_4", "months1_2", "quarterPlanning"],
  },
  {
    key: "useCase",
    options: ["hostingYield", "modelTraining", "inferenceService", "mixedUse"],
  },
  {
    key: "hosting",
    options: ["haveFacility", "needHosting", "evaluating", "other"],
  },
  {
    key: "budget",
    options: ["under100k", "range100k500k", "range500k2m", "above2m"],
    className: "md:col-span-2",
  },
] as const;

type GpuKey = (typeof gpuOptionMeta)[number]["key"];
type SelectKey = (typeof selectGroupMeta)[number]["key"];
type QuoteSelections = Record<SelectKey, string>;

type GpuOption = {
  value: GpuKey;
  label: string;
  note?: string;
};

type SelectOption = {
  value: string;
  label: string;
};

type SelectGroup = {
  key: SelectKey;
  label: string;
  placeholder: string;
  options: SelectOption[];
  required?: boolean;
  className?: string;
};

type ContactValues = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const stepBaseClass =
  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors";

const fieldClassName =
  "h-12 rounded-[6px] border-white/12 bg-white/[0.12] text-[#f7f8f8] shadow-none placeholder:text-[#8a8f98] focus-visible:ring-[#5e6ad2]";

export function HardwareQuoteFlow() {
  const t = useTranslations("Hardware.quote");
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedGpu, setSelectedGpu] = useState<GpuKey>(gpuOptionMeta[0].key);
  const [selections, setSelections] = useState<QuoteSelections>({
    quantity: "",
    formFactor: "",
    timeline: "",
    useCase: "",
    hosting: "",
    budget: "",
  });

  const gpuOptions = useMemo<GpuOption[]>(
    () =>
      gpuOptionMeta.map((gpu) => ({
        value: gpu.key,
        label: t(`gpu.options.${gpu.key}.label`),
        note: "hasNote" in gpu ? t(`gpu.options.${gpu.key}.note`) : undefined,
      })),
    [t],
  );

  const selectGroups = useMemo<SelectGroup[]>(
    () =>
      selectGroupMeta.map((group) => ({
        key: group.key,
        label: t(`selectGroups.${group.key}.label`),
        placeholder: t(`selectGroups.${group.key}.placeholder`),
        required: "required" in group ? group.required : false,
        className: "className" in group ? group.className : undefined,
        options: group.options.map((option) => ({
          value: option,
          label: t(`selectGroups.${group.key}.options.${option}`),
        })),
      })),
    [t],
  );

  const contactSchema = useMemo(
    (): z.ZodType<ContactValues> =>
      z.object({
        name: z.string().trim().min(2, t("validation.name")),
        email: z.string().trim().email(t("validation.email")),
        company: z.string().trim().max(80, t("validation.company")),
        message: z
          .string()
          .trim()
          .min(10, t("validation.messageMin"))
          .max(1000, t("validation.messageMax")),
      }),
    [t],
  );

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const selectedGpuLabel =
    gpuOptions.find((gpu) => gpu.value === selectedGpu)?.label ?? selectedGpu;

  const summaryItems = useMemo<Array<[string, string]>>(
    () => [
      [t("summary.gpuModel"), selectedGpuLabel],
      ...selectGroups.map((group): [string, string] => [
        group.label,
        group.options.find((option) => option.value === selections[group.key])?.label ??
          t("summary.notProvided"),
      ]),
    ],
    [selectedGpuLabel, selectGroups, selections, t],
  );

  function updateSelection(key: SelectKey, value: string) {
    setSelections((current) => ({ ...current, [key]: value }));
  }

  function goNext() {
    if (!selectedGpu || !selections.quantity || !selections.timeline) {
      toast.error(t("validation.requiredSelection"));
      return;
    }

    setStep(2);
  }

  function onSubmit(values: ContactValues) {
    const subject = t("email.subject", { name: values.company || values.name });
    const bodyLines: Array<string | null> = [
      t("email.name", { value: values.name }),
      t("email.email", { value: values.email }),
      values.company ? t("email.company", { value: values.company }) : null,
      "",
      t("email.requirementsTitle"),
      ...summaryItems.map(([label, value]) =>
        t("email.summaryLine", { label, value }),
      ),
      "",
      t("email.extraTitle"),
      values.message,
    ];
    const body = bodyLines
      .filter((line): line is string => line !== null)
      .join("\n");

    window.location.assign(
      `mailto:contact@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
    toast.success(t("toast.emailDraft"));
  }

  return (
    <div className="p-8 sm:p-12 lg:p-14">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-[520px] text-base leading-7 text-[#a4acb6]">
          {t("description")}
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className={`${stepBaseClass} ${
              step === 1 ? "bg-[#5e6ad2] text-white" : "bg-white/10 text-[#8a8f98]"
            }`}
          >
            1
          </span>
          <span
            className={`${stepBaseClass} ${
              step === 2 ? "bg-[#5e6ad2] text-white" : "bg-white/10 text-[#8a8f98]"
            }`}
          >
            2
          </span>
        </div>
      </div>

      {step === 1 ? (
        <div className="mt-9">
          <h3 className="text-xl font-semibold tracking-[-0.03em]">
            {t("requirementsTitle")}
          </h3>
          <div className="mt-6">
            <p className="text-sm font-semibold text-[#f7f8f8]">
              {t("gpuModelLabel")} <span aria-hidden="true">{t("requiredMark")}</span>
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {gpuOptions.map((gpu) => {
                const isSelected = selectedGpu === gpu.value;

                return (
                  <Button
                    key={gpu.value}
                    type="button"
                    variant="outline"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedGpu(gpu.value)}
                    className={`h-11 rounded-[6px] px-3 text-sm font-semibold transition-colors ${
                      isSelected
                        ? "border-[#5e6ad2] bg-[#5e6ad2]/12 text-[#9aa2ff] hover:bg-[#5e6ad2]/18 hover:text-white"
                        : "border-white/16 bg-transparent text-[#a4acb6] hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {gpu.label}
                    {gpu.note ? (
                      <span className="ml-1 text-xs text-[#27a644]">{gpu.note}</span>
                    ) : null}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {selectGroups.map((group) => (
              <div key={group.key} className={group.className ?? ""}>
                <label className="text-sm font-semibold text-[#f7f8f8]">
                  {group.label}
                  {group.required ? (
                    <span aria-hidden="true"> {t("requiredMark")}</span>
                  ) : null}
                </label>
                <Select
                  value={selections[group.key]}
                  onValueChange={(value) => updateSelection(group.key, value)}
                >
                  <SelectTrigger className={fieldClassName}>
                    <SelectValue placeholder={group.placeholder} />
                  </SelectTrigger>
                  <SelectContent className="border-white/12 bg-[#191a1b] text-[#f7f8f8]">
                    {group.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <Button
            type="button"
            className="mt-7 h-12 w-full rounded-[6px] bg-[#5e6ad2] text-base font-semibold text-white hover:bg-[#828fff]"
            onClick={goNext}
          >
            {t("continue")}
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form className="mt-9 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="rounded-[8px] border border-white/12 bg-white/[0.04] p-4">
              <div className="grid gap-3 text-sm text-[#a4acb6] sm:grid-cols-2">
                {summaryItems.map(([label, value]) => (
                  <div key={label}>
                    <span className="block text-xs font-semibold text-[#62666d]">{label}</span>
                    <span className="mt-1 block font-semibold text-[#f7f8f8]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f7f8f8]">
                      {t("fields.name.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("fields.name.placeholder")}
                        {...field}
                        className={fieldClassName}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f7f8f8]">
                      {t("fields.email.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("fields.email.placeholder")}
                        {...field}
                        className={fieldClassName}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#f7f8f8]">
                    {t("fields.company.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("fields.company.placeholder")}
                      {...field}
                      className={fieldClassName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#f7f8f8]">
                    {t("fields.message.label")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("fields.message.placeholder")}
                      {...field}
                      className="min-h-[140px] resize-none rounded-[6px] border-white/12 bg-white/[0.12] text-[#f7f8f8] shadow-none placeholder:text-[#8a8f98] focus-visible:ring-[#5e6ad2]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-[6px] border-white/16 bg-transparent px-4 text-[#a4acb6] hover:bg-white/[0.06] hover:text-white"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="h-4 w-4" />
                {t("back")}
              </Button>
              <Button
                type="submit"
                className="h-12 flex-1 rounded-[6px] bg-[#5e6ad2] text-base font-semibold text-white hover:bg-[#828fff]"
              >
                <Send className="h-4 w-4" />
                {t("submit")}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
