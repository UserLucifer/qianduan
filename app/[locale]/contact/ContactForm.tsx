"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Send } from "lucide-react";
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

const topicLabels = {
  sales: "企业与售前咨询",
  support: "技术支持",
  compliance: "合规与安全资料",
  partnership: "合作与渠道",
} as const;

const contactSchema = z.object({
  name: z.string().trim().min(2, "请输入联系人姓名"),
  email: z.string().trim().email("请输入有效邮箱"),
  company: z.string().trim().max(80, "公司名称不超过 80 个字").optional(),
  topic: z.enum(["sales", "support", "compliance", "partnership"]),
  message: z
    .string()
    .trim()
    .min(10, "请至少输入 10 个字")
    .max(1000, "请控制在 1000 字以内"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const fieldClassName =
  "h-11 rounded-lg border-[var(--card-border)] bg-[var(--surface)] text-[var(--foreground)] shadow-none placeholder:text-[var(--muted)] focus-visible:ring-[var(--accent)]";

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      topic: "sales",
      message: "",
    },
  });

  function onSubmit(values: ContactFormValues) {
    const topicLabel = topicLabels[values.topic];
    const subject = `[算力租赁] ${topicLabel} - ${values.company || values.name}`;
    const body = [
      `联系人：${values.name}`,
      `邮箱：${values.email}`,
      values.company ? `公司/团队：${values.company}` : null,
      `联系类型：${topicLabel}`,
      "",
      "需求说明：",
      values.message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.assign(`mailto:contact@example.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`);
    toast.success("已生成邮件草稿，请在邮件客户端中确认发送。");
  }

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>联系人</FormLabel>
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
                <FormLabel>工作邮箱</FormLabel>
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

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>公司/团队</FormLabel>
                <FormControl>
                  <Input placeholder="可选" {...field} className={fieldClassName} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>联系类型</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className={fieldClassName}>
                      <SelectValue placeholder="选择需要协助的方向" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-[var(--card-border)] bg-background">
                    {Object.entries(topicLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
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
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>需求说明</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="例如：需要 8 卡 H100 集群、私有网络、季度预留价格，或需要排查实例连接问题。"
                  {...field}
                  className="min-h-[150px] resize-none rounded-lg border-[var(--card-border)] bg-[var(--surface)] text-[var(--foreground)] shadow-none placeholder:text-[var(--muted)] focus-visible:ring-[var(--accent)]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            className="h-11 rounded-lg bg-[var(--accent)] px-5 text-white shadow-none hover:bg-[var(--accent-hover)]"
          >
            <Send className="h-4 w-4" />
            生成联系邮件
          </Button>
          <Button asChild type="button" variant="ghost" className="h-11 justify-start px-0 text-[var(--muted)] hover:bg-transparent hover:text-[var(--foreground)] sm:px-3">
            <a href="mailto:contact@example.com">
              直接发送邮件
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </form>
    </Form>
  );
}
