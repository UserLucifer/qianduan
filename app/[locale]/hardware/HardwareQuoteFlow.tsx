"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Send } from "lucide-react";
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

type GpuOption = {
  label: string;
  note?: string;
};

type SelectGroup = {
  key: "quantity" | "formFactor" | "timeline" | "useCase" | "hosting" | "budget";
  label: string;
  placeholder: string;
  options: string[];
  required?: boolean;
  className?: string;
};

const gpuOptions: GpuOption[] = [
  { label: "B200" },
  { label: "H200 高", note: "需求" },
  { label: "H100 SXM", note: "高需求" },
  { label: "H100 PCIe" },
  { label: "A100 80GB" },
  { label: "A100 40GB" },
  { label: "L40S" },
  { label: "RTX 5090", note: "有限供应" },
  { label: "RTX 4090" },
  { label: "RTX 3090" },
  { label: "其他" },
];

const selectGroups: SelectGroup[] = [
  {
    key: "quantity",
    label: "数量 *",
    placeholder: "精选",
    options: ["1-4 台", "5-16 台", "17-64 台", "64 台以上"],
    required: true,
  },
  {
    key: "formFactor",
    label: "形态规格",
    placeholder: "精选",
    options: ["整机服务器", "GPU 节点", "裸卡", "机柜级配置"],
  },
  {
    key: "timeline",
    label: "时间线 *",
    placeholder: "什么时候需要硬件",
    options: ["立即", "2-4 周", "1-2 个月", "季度规划"],
    required: true,
  },
  {
    key: "useCase",
    label: "主要使用场景",
    placeholder: "精选",
    options: ["托管收益", "模型训练", "推理服务", "混合用途"],
  },
  {
    key: "hosting",
    label: "现有的潜在主机",
    placeholder: "精选",
    options: ["已有机房", "需要托管", "正在评估", "其他"],
  },
  {
    key: "budget",
    label: "预算范围",
    placeholder: "精选",
    options: ["10 万以内", "10-50 万", "50-200 万", "200 万以上"],
    className: "md:col-span-2",
  },
];

type SelectKey = SelectGroup["key"];
type QuoteSelections = Record<SelectKey, string>;

const contactSchema = z.object({
  name: z.string().trim().min(2, "请输入联系人姓名"),
  email: z.string().trim().email("请输入有效邮箱"),
  company: z.string().trim().max(80, "公司名称不超过 80 个字").optional(),
  message: z
    .string()
    .trim()
    .min(10, "请至少输入 10 个字")
    .max(1000, "请控制在 1000 字以内"),
});

type ContactValues = z.infer<typeof contactSchema>;

const stepBaseClass =
  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors";

const fieldClassName =
  "h-12 rounded-[6px] border-white/12 bg-white/[0.12] text-[#f7f8f8] shadow-none placeholder:text-[#8a8f98] focus-visible:ring-[#5e6ad2]";

export function HardwareQuoteFlow() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedGpu, setSelectedGpu] = useState(gpuOptions[0].label);
  const [selections, setSelections] = useState<QuoteSelections>({
    quantity: "",
    formFactor: "",
    timeline: "",
    useCase: "",
    hosting: "",
    budget: "",
  });

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const summaryItems = useMemo(
    () => [
      ["GPU 型号", selectedGpu],
      ...selectGroups.map((group) => [
        group.label.replace(" *", ""),
        selections[group.key] || "未填写",
      ]),
    ],
    [selectedGpu, selections],
  );

  function updateSelection(key: SelectKey, value: string) {
    setSelections((current) => ({ ...current, [key]: value }));
  }

  function goNext() {
    if (!selectedGpu || !selections.quantity || !selections.timeline) {
      toast.error("请先选择 GPU 型号、数量和时间线。");
      return;
    }

    setStep(2);
  }

  function onSubmit(values: ContactValues) {
    const subject = `[算力租赁] GPU 硬件报价 - ${values.company || values.name}`;
    const body = [
      `联系人：${values.name}`,
      `邮箱：${values.email}`,
      values.company ? `公司/团队：${values.company}` : null,
      "",
      "硬件需求：",
      ...summaryItems.map(([label, value]) => `${label}：${value}`),
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
    <div className="p-8 sm:p-12 lg:p-14">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          获取报价
        </h2>
        <p className="mx-auto mt-4 max-w-[520px] text-base leading-7 text-[#a4acb6]">
          先整理硬件需求，再生成邮件草稿。我们会基于型号、数量和交付窗口给出报价。
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`${stepBaseClass} ${step === 1 ? "bg-[#5e6ad2] text-white" : "bg-white/10 text-[#8a8f98]"}`}>
            1
          </span>
          <span className={`${stepBaseClass} ${step === 2 ? "bg-[#5e6ad2] text-white" : "bg-white/10 text-[#8a8f98]"}`}>
            2
          </span>
        </div>
      </div>

      {step === 1 ? (
        <div className="mt-9">
          <h3 className="text-xl font-semibold tracking-[-0.03em]">
            硬件需求
          </h3>
          <div className="mt-6">
            <p className="text-sm font-semibold text-[#f7f8f8]">GPU 型号 *</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {gpuOptions.map((gpu) => {
                const isSelected = selectedGpu === gpu.label;

                return (
                  <Button
                    key={gpu.label}
                    type="button"
                    variant="outline"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedGpu(gpu.label)}
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
                      <SelectItem key={option} value={option}>
                        {option}
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
            继续
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
                    <FormLabel className="text-[#f7f8f8]">联系人</FormLabel>
                    <FormControl>
                      <Input placeholder="您的姓名" {...field} className={fieldClassName} />
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
                    <FormLabel className="text-[#f7f8f8]">工作邮箱</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="name@company.com" {...field} className={fieldClassName} />
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
                  <FormLabel className="text-[#f7f8f8]">公司/团队</FormLabel>
                  <FormControl>
                    <Input placeholder="可选" {...field} className={fieldClassName} />
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
                  <FormLabel className="text-[#f7f8f8]">补充说明</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例如：目标机房、是否需要托管、期望交付日期、付款方式或其他硬件要求。"
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
                返回修改
              </Button>
              <Button
                type="submit"
                className="h-12 flex-1 rounded-[6px] bg-[#5e6ad2] text-base font-semibold text-white hover:bg-[#828fff]"
              >
                <Send className="h-4 w-4" />
                生成报价邮件
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
