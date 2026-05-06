"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
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

const gpuModels = [
  "B200",
  "H200",
  "H100 SXM",
  "H100 PCIe",
  "A100 80GB",
  "A100 40GB",
  "L40S",
  "RTX 5090",
  "RTX 4090",
  "RTX 3090",
  "Other",
];

const facilityTypes = [
  "Colocation data center",
  "Private data center",
  "GPU farm",
  "Enterprise lab",
  "Other managed facility",
];

const serverCounts = ["5-16", "17-64", "65-256", "257-1000", "1000+"];
const plannedCapacity = ["No current plan", "1-16 servers", "17-64 servers", "65+ servers"];
const connectivityOptions = ["10 Gbps", "25 Gbps", "100 Gbps", "400 Gbps", "Multiple carriers"];
const powerOptions = ["Under 50 kW", "50-250 kW", "250 kW-1 MW", "1 MW+"];
const supportOptions = ["Business hours", "24/7 on-call", "Dedicated NOC", "Managed by colo partner"];

const certificationSchema = z.object({
  facilityType: z.string().min(1, "请选择设施类型"),
  locations: z.string().trim().min(2, "请输入机房位置"),
  totalServers: z.string().min(1, "请选择当前 GPU 服务器数量"),
  gpuModels: z.array(z.string()).min(1, "请选择已部署的 GPU 型号"),
  plannedCapacity: z.string().min(1, "请选择未来 6 个月新增容量"),
  connectivity: z.string().min(1, "请选择网络能力"),
  powerCapacity: z.string().min(1, "请选择供电容量"),
  supportCoverage: z.string().min(1, "请选择支持覆盖"),
  certifications: z.array(z.string()).optional(),
  operationsNotes: z.string().trim().max(800, "说明请控制在 800 字以内").optional(),
  name: z.string().trim().min(2, "请输入联系人姓名"),
  email: z.string().trim().email("请输入有效邮箱"),
  company: z.string().trim().min(2, "请输入公司名称"),
  message: z
    .string()
    .trim()
    .min(10, "请至少输入 10 个字")
    .max(1000, "说明请控制在 1000 字以内"),
});

type CertificationValues = z.infer<typeof certificationSchema>;
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

export function DataCenterCertificationForm() {
  const [step, setStep] = useState<Step>(1);

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

  const watchedValues = form.watch();
  const summaryItems = useMemo(
    () => [
      ["Facility type", watchedValues.facilityType || "Not provided"],
      ["Locations", watchedValues.locations || "Not provided"],
      ["GPU servers", watchedValues.totalServers || "Not provided"],
      ["GPU models", watchedValues.gpuModels?.join(", ") || "Not provided"],
      ["Planned capacity", watchedValues.plannedCapacity || "Not provided"],
      ["Connectivity", watchedValues.connectivity || "Not provided"],
      ["Power", watchedValues.powerCapacity || "Not provided"],
      ["Support", watchedValues.supportCoverage || "Not provided"],
    ],
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
    const subject = `[算力租赁] 数据中心认证申请 - ${values.company}`;
    const body = [
      `联系人：${values.name}`,
      `邮箱：${values.email}`,
      `公司：${values.company}`,
      "",
      "设施信息：",
      `设施类型：${values.facilityType}`,
      `位置：${values.locations}`,
      `当前 GPU 服务器数量：${values.totalServers}`,
      `已部署 GPU 型号：${values.gpuModels.join(", ")}`,
      `未来 6 个月新增容量：${values.plannedCapacity}`,
      "",
      "运维与合规：",
      `网络能力：${values.connectivity}`,
      `供电容量：${values.powerCapacity}`,
      `支持覆盖：${values.supportCoverage}`,
      `已有认证：${values.certifications?.join(", ") || "未填写"}`,
      values.operationsNotes ? `运维说明：${values.operationsNotes}` : null,
      "",
      "补充说明：",
      values.message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.assign(
      `mailto:contact@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
    toast.success("已生成邮件草稿，请在邮件客户端中确认发送。");
  }

  return (
    <div className="rounded-[8px] border border-white/12 bg-[#010102]/88 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold leading-tight text-[#f7f8f8]">
          Apply for Certification
        </h2>
        <p className="mx-auto mt-3 max-w-[520px] text-sm leading-6 text-[#a4acb6]">
          Tell us about your facility. We review applications within 2 business
          days.
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
              <h3 className="text-lg font-semibold text-[#f7f8f8]">Your Facility</h3>

              <FormField
                control={form.control}
                name="facilityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f7f8f8]">Facility Type *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className={fieldClassName}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-white/12 bg-[#191a1b] text-[#f7f8f8]">
                        {facilityTypes.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
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
                    <FormLabel className="text-[#f7f8f8]">Location(s) *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Dallas, TX / Frankfurt, DE"
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
                      Total GPU Servers (current) *
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className={fieldClassName}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-white/12 bg-[#191a1b] text-[#f7f8f8]">
                        {serverCounts.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
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
                      GPU Models Deployed *
                    </FormLabel>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {gpuModels.map((model) => {
                        const selected = field.value.includes(model);

                        return (
                          <Button
                            key={model}
                            type="button"
                            variant="outline"
                            aria-pressed={selected}
                            onClick={() => field.onChange(toggleValue(field.value, model))}
                            className={`h-11 rounded-[6px] px-3 text-sm font-semibold transition-colors ${
                              selected
                                ? "border-[#5e6ad2] bg-[#5e6ad2]/16 text-[#9aa2ff] hover:bg-[#5e6ad2]/20 hover:text-white"
                                : "border-white/16 bg-transparent text-[#a4acb6] hover:bg-white/[0.06] hover:text-white"
                            }`}
                          >
                            {model}
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
                      Additional Capacity Planned (next 6 months)
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className={fieldClassName}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-white/12 bg-[#191a1b] text-[#f7f8f8]">
                        {plannedCapacity.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
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
                Operations & Standards
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="connectivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#f7f8f8]">Connectivity *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className={fieldClassName}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-white/12 bg-[#191a1b] text-[#f7f8f8]">
                          {connectivityOptions.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
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
                      <FormLabel className="text-[#f7f8f8]">Power Capacity *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className={fieldClassName}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-white/12 bg-[#191a1b] text-[#f7f8f8]">
                          {powerOptions.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
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
                    <FormLabel className="text-[#f7f8f8]">Support Coverage *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className={fieldClassName}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-white/12 bg-[#191a1b] text-[#f7f8f8]">
                        {supportOptions.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
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
                      Certifications in Place
                    </FormLabel>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["SOC 2", "ISO 27001", "Tier III+", "Enterprise SLA"].map(
                        (item) => (
                          <label
                            key={item}
                            className="flex min-h-11 items-center gap-3 rounded-[6px] border border-white/12 bg-white/[0.04] px-3 text-sm text-[#d0d6e0]"
                          >
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                const current = field.value ?? [];
                                field.onChange(
                                  checked
                                    ? [...current, item]
                                    : current.filter((value) => value !== item),
                                );
                              }}
                              className="border-white/30 data-[state=checked]:border-[#5e6ad2] data-[state=checked]:bg-[#5e6ad2]"
                            />
                            {item}
                          </label>
                        ),
                      )}
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
                    <FormLabel className="text-[#f7f8f8]">Operational Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Cooling redundancy, carrier mix, remote hands, incident response, or any other facility details."
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
                Contact & Email Draft
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
                      <FormLabel className="text-[#f7f8f8]">Contact Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} className={fieldClassName} />
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
                      <FormLabel className="text-[#f7f8f8]">Work Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@company.com"
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
                    <FormLabel className="text-[#f7f8f8]">Company *</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name" {...field} className={fieldClassName} />
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
                    <FormLabel className="text-[#f7f8f8]">Message *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us what you want certified, target launch timing, and anything the review team should know."
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
                Back
              </Button>
            ) : null}

            {step < 3 ? (
              <Button
                type="button"
                className="h-12 flex-1 rounded-[6px] bg-[#5e6ad2] text-base font-semibold text-white hover:bg-[#828fff]"
                onClick={goNext}
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="h-12 flex-1 rounded-[6px] bg-[#5e6ad2] text-base font-semibold text-white hover:bg-[#828fff]"
              >
                <Send className="h-4 w-4" />
                Email Us
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
