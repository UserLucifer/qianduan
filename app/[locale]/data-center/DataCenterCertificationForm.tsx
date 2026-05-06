"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const gpuModelKeys = [
  "b200",
  "h200",
  "h100Sxm",
  "h100Pcie",
  "a10080",
  "a10040",
  "l40s",
  "rtx5090",
  "rtx4090",
  "rtx3090",
  "other",
] as const;

const facilityTypeKeys = [
  "colocation",
  "privateDataCenter",
  "gpuFarm",
  "enterpriseLab",
  "otherManagedFacility",
] as const;

const serverCountKeys = [
  "servers5_16",
  "servers17_64",
  "servers65_256",
  "servers257_1000",
  "servers1000Plus",
] as const;

const plannedCapacityKeys = [
  "none",
  "servers1_16",
  "servers17_64",
  "servers65Plus",
] as const;

const connectivityKeys = [
  "gbps10",
  "gbps25",
  "gbps100",
  "gbps400",
  "multipleCarriers",
] as const;

const powerKeys = ["under50kw", "kw50_250", "kw250_1mw", "mw1Plus"] as const;

const supportKeys = [
  "businessHours",
  "onCall247",
  "dedicatedNoc",
  "coloPartner",
] as const;

const certificationKeys = ["soc2", "iso27001", "tier3Plus", "enterpriseSla"] as const;

type CertificationValues = {
  facilityType: string;
  locations: string;
  totalServers: string;
  gpuModels: string[];
  plannedCapacity: string;
  connectivity: string;
  powerCapacity: string;
  supportCoverage: string;
  certifications: string[];
  operationsNotes: string;
  name: string;
  email: string;
  company: string;
  message: string;
};

type SelectOption = {
  value: string;
  label: string;
};

type Step = 1 | 2 | 3;

const stepFields: Record<Step, Array<keyof CertificationValues>> = {
  1: ["facilityType", "locations", "totalServers", "gpuModels", "plannedCapacity"],
  2: ["connectivity", "powerCapacity", "supportCoverage"],
  3: ["name", "email", "company", "message"],
};

const fieldClassName =
  "h-12 rounded-[6px] border-white/12 bg-white/[0.12] text-[#f7f8f8] shadow-none placeholder:text-[#8a8f98] focus-visible:ring-[#5e6ad2]";

const stepBaseClass =
  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors";

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function getOptionLabel(options: SelectOption[], value: string, fallback: string) {
  if (!value) return fallback;

  return options.find((option) => option.value === value)?.label ?? value;
}

function getOptionLabels(options: SelectOption[], values: string[], fallback: string) {
  if (values.length === 0) return fallback;

  return values
    .map((value) => options.find((option) => option.value === value)?.label ?? value)
    .join(", ");
}

export function DataCenterCertificationForm() {
  const t = useTranslations("DataCenter.certificationForm");
  const [step, setStep] = useState<Step>(1);

  const gpuModels = useMemo<SelectOption[]>(
    () =>
      gpuModelKeys.map((key) => ({
        value: key,
        label: t(`options.gpuModels.${key}`),
      })),
    [t],
  );

  const facilityTypes = useMemo<SelectOption[]>(
    () =>
      facilityTypeKeys.map((key) => ({
        value: key,
        label: t(`options.facilityTypes.${key}`),
      })),
    [t],
  );

  const serverCounts = useMemo<SelectOption[]>(
    () =>
      serverCountKeys.map((key) => ({
        value: key,
        label: t(`options.serverCounts.${key}`),
      })),
    [t],
  );

  const plannedCapacity = useMemo<SelectOption[]>(
    () =>
      plannedCapacityKeys.map((key) => ({
        value: key,
        label: t(`options.plannedCapacity.${key}`),
      })),
    [t],
  );

  const connectivityOptions = useMemo<SelectOption[]>(
    () =>
      connectivityKeys.map((key) => ({
        value: key,
        label: t(`options.connectivity.${key}`),
      })),
    [t],
  );

  const powerOptions = useMemo<SelectOption[]>(
    () =>
      powerKeys.map((key) => ({
        value: key,
        label: t(`options.power.${key}`),
      })),
    [t],
  );

  const supportOptions = useMemo<SelectOption[]>(
    () =>
      supportKeys.map((key) => ({
        value: key,
        label: t(`options.support.${key}`),
      })),
    [t],
  );

  const certificationOptions = useMemo<SelectOption[]>(
    () =>
      certificationKeys.map((key) => ({
        value: key,
        label: t(`options.certifications.${key}`),
      })),
    [t],
  );

  const certificationSchema = useMemo(
    (): z.ZodType<CertificationValues> =>
      z.object({
        facilityType: z.string().min(1, t("validation.facilityType")),
        locations: z.string().trim().min(2, t("validation.locations")),
        totalServers: z.string().min(1, t("validation.totalServers")),
        gpuModels: z.array(z.string()).min(1, t("validation.gpuModels")),
        plannedCapacity: z.string().min(1, t("validation.plannedCapacity")),
        connectivity: z.string().min(1, t("validation.connectivity")),
        powerCapacity: z.string().min(1, t("validation.powerCapacity")),
        supportCoverage: z.string().min(1, t("validation.supportCoverage")),
        certifications: z.array(z.string()),
        operationsNotes: z.string().trim().max(800, t("validation.operationsNotes")),
        name: z.string().trim().min(2, t("validation.name")),
        email: z.string().trim().email(t("validation.email")),
        company: z.string().trim().min(2, t("validation.company")),
        message: z
          .string()
          .trim()
          .min(10, t("validation.messageMin"))
          .max(1000, t("validation.messageMax")),
      }),
    [t],
  );

  const form = useForm<CertificationValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      facilityType: "",
      locations: "",
      totalServers: "",
      gpuModels: [],
      plannedCapacity: "",
      connectivity: "",
      powerCapacity: "",
      supportCoverage: "",
      certifications: [],
      operationsNotes: "",
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  function buildSummary(values: CertificationValues): Array<[string, string]> {
    const notProvided = t("summary.notProvided");

    return [
      [
        t("summary.facilityType"),
        getOptionLabel(facilityTypes, values.facilityType, notProvided),
      ],
      [t("summary.locations"), values.locations || notProvided],
      [
        t("summary.totalServers"),
        getOptionLabel(serverCounts, values.totalServers, notProvided),
      ],
      [
        t("summary.gpuModels"),
        getOptionLabels(gpuModels, values.gpuModels ?? [], notProvided),
      ],
      [
        t("summary.plannedCapacity"),
        getOptionLabel(plannedCapacity, values.plannedCapacity, notProvided),
      ],
      [
        t("summary.connectivity"),
        getOptionLabel(connectivityOptions, values.connectivity, notProvided),
      ],
      [
        t("summary.powerCapacity"),
        getOptionLabel(powerOptions, values.powerCapacity, notProvided),
      ],
      [
        t("summary.supportCoverage"),
        getOptionLabel(supportOptions, values.supportCoverage, notProvided),
      ],
    ];
  }

  const watchedValues = form.watch();
  const summaryItems = useMemo(
    () => buildSummary(watchedValues),
    [watchedValues],
  );

  async function goNext() {
    const isValid = await form.trigger(stepFields[step]);

    if (!isValid) return;

    setStep((current) => (current < 3 ? ((current + 1) as Step) : current));
  }

  function goBack() {
    setStep((current) => (current > 1 ? ((current - 1) as Step) : current));
  }

  function onSubmit(values: CertificationValues) {
    const certificationSummary = getOptionLabels(
      certificationOptions,
      values.certifications,
      t("summary.notProvided"),
    );
    const summary = buildSummary(values);
    const subject = t("email.subject", { company: values.company });
    const bodyLines: Array<string | null> = [
      t("email.name", { value: values.name }),
      t("email.email", { value: values.email }),
      t("email.company", { value: values.company }),
      "",
      t("email.facilityTitle"),
      ...summary.slice(0, 5).map(([label, value]) =>
        t("email.summaryLine", { label, value }),
      ),
      "",
      t("email.operationsTitle"),
      ...summary.slice(5).map(([label, value]) =>
        t("email.summaryLine", { label, value }),
      ),
      t("email.summaryLine", {
        label: t("fields.certifications.label"),
        value: certificationSummary,
      }),
      values.operationsNotes
        ? t("email.summaryLine", {
            label: t("fields.operationsNotes.label"),
            value: values.operationsNotes,
          })
        : null,
      "",
      t("email.messageTitle"),
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
    <div className="rounded-[8px] border border-white/12 bg-[#010102]/88 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold leading-tight text-[#f7f8f8]">
          {t("title")}
        </h2>
        <p className="mx-auto mt-3 max-w-[520px] text-sm leading-6 text-[#a4acb6]">
          {t("description")}
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          {[1, 2, 3].map((item) => (
            <span
              key={item}
              className={`${stepBaseClass} ${
                step === item ? "bg-[#5e6ad2] text-white" : "bg-white/10 text-[#8a8f98]"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form className="mt-8" onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#f7f8f8]">
                {t("sections.facility")}
              </h3>

              <FormField
                control={form.control}
                name="facilityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f7f8f8]">
                      {t("fields.facilityType.label")} {t("requiredMark")}
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className={fieldClassName}>
                          <SelectValue placeholder={t("fields.facilityType.placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-white/12 bg-[#191a1b] text-[#f7f8f8]">
                        {facilityTypes.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f7f8f8]">
                      {t("fields.locations.label")} {t("requiredMark")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("fields.locations.placeholder")}
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
                name="totalServers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f7f8f8]">
                      {t("fields.totalServers.label")} {t("requiredMark")}
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className={fieldClassName}>
                          <SelectValue placeholder={t("fields.totalServers.placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-white/12 bg-[#191a1b] text-[#f7f8f8]">
                        {serverCounts.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gpuModels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f7f8f8]">
                      {t("fields.gpuModels.label")} {t("requiredMark")}
                    </FormLabel>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {gpuModels.map((model) => {
                        const current = field.value ?? [];
                        const selected = current.includes(model.value);

                        return (
                          <Button
                            key={model.value}
                            type="button"
                            variant="outline"
                            aria-pressed={selected}
                            onClick={() => field.onChange(toggleValue(current, model.value))}
                            className={`h-11 rounded-[6px] px-3 text-sm font-semibold transition-colors ${
                              selected
                                ? "border-[#5e6ad2] bg-[#5e6ad2]/16 text-[#9aa2ff] hover:bg-[#5e6ad2]/20 hover:text-white"
                                : "border-white/16 bg-transparent text-[#a4acb6] hover:bg-white/[0.06] hover:text-white"
                            }`}
                          >
                            {model.label}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plannedCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f7f8f8]">
                      {t("fields.plannedCapacity.label")}
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className={fieldClassName}>
                          <SelectValue placeholder={t("fields.plannedCapacity.placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-white/12 bg-[#191a1b] text-[#f7f8f8]">
                        {plannedCapacity.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#f7f8f8]">
                {t("sections.operations")}
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="connectivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#f7f8f8]">
                        {t("fields.connectivity.label")} {t("requiredMark")}
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className={fieldClassName}>
                            <SelectValue placeholder={t("fields.connectivity.placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-white/12 bg-[#191a1b] text-[#f7f8f8]">
                          {connectivityOptions.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="powerCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#f7f8f8]">
                        {t("fields.powerCapacity.label")} {t("requiredMark")}
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className={fieldClassName}>
                            <SelectValue placeholder={t("fields.powerCapacity.placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-white/12 bg-[#191a1b] text-[#f7f8f8]">
                          {powerOptions.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="supportCoverage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f7f8f8]">
                      {t("fields.supportCoverage.label")} {t("requiredMark")}
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className={fieldClassName}>
                          <SelectValue placeholder={t("fields.supportCoverage.placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-white/12 bg-[#191a1b] text-[#f7f8f8]">
                        {supportOptions.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f7f8f8]">
                      {t("fields.certifications.label")}
                    </FormLabel>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {certificationOptions.map((item) => {
                        const current = field.value ?? [];

                        return (
                          <label
                            key={item.value}
                            className="flex min-h-11 items-center gap-3 rounded-[6px] border border-white/12 bg-white/[0.04] px-3 text-sm text-[#d0d6e0]"
                          >
                            <Checkbox
                              checked={current.includes(item.value)}
                              onCheckedChange={(checked) => {
                                field.onChange(
                                  checked
                                    ? [...current, item.value]
                                    : current.filter((value) => value !== item.value),
                                );
                              }}
                              className="border-white/30 data-[state=checked]:border-[#5e6ad2] data-[state=checked]:bg-[#5e6ad2]"
                            />
                            {item.label}
                          </label>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="operationsNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f7f8f8]">
                      {t("fields.operationsNotes.label")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("fields.operationsNotes.placeholder")}
                        {...field}
                        className="min-h-[130px] resize-none rounded-[6px] border-white/12 bg-white/[0.12] text-[#f7f8f8] shadow-none placeholder:text-[#8a8f98] focus-visible:ring-[#5e6ad2]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#f7f8f8]">
                {t("sections.contact")}
              </h3>

              <div className="rounded-[8px] border border-white/12 bg-white/[0.04] p-4">
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  {summaryItems.map(([label, value]) => (
                    <div key={label}>
                      <span className="block text-xs font-semibold text-[#62666d]">
                        {label}
                      </span>
                      <span className="mt-1 block font-semibold text-[#f7f8f8]">
                        {value}
                      </span>
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
                        {t("fields.name.label")} {t("requiredMark")}
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
                        {t("fields.email.label")} {t("requiredMark")}
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
                      {t("fields.company.label")} {t("requiredMark")}
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
                      {t("fields.message.label")} {t("requiredMark")}
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
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-[6px] border-white/16 bg-transparent px-4 text-[#a4acb6] hover:bg-white/[0.06] hover:text-white"
                onClick={goBack}
              >
                <ArrowLeft className="h-4 w-4" />
                {t("buttons.back")}
              </Button>
            ) : null}

            {step < 3 ? (
              <Button
                type="button"
                className="h-12 flex-1 rounded-[6px] bg-[#5e6ad2] text-base font-semibold text-white hover:bg-[#828fff]"
                onClick={goNext}
              >
                {t("buttons.continue")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="h-12 flex-1 rounded-[6px] bg-[#5e6ad2] text-base font-semibold text-white hover:bg-[#828fff]"
              >
                <Send className="h-4 w-4" />
                {t("buttons.submit")}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
