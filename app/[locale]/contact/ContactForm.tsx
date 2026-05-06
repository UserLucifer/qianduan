"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
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

const contactTopics = ["sales", "support", "compliance", "partnership"] as const;

type ContactTopic = (typeof contactTopics)[number];

type ContactFormValues = {
  name: string;
  email: string;
  company: string;
  topic: ContactTopic;
  message: string;
};

const fieldClassName =
  "h-11 rounded-lg border-[var(--card-border)] bg-[var(--surface)] text-[var(--foreground)] shadow-none placeholder:text-[var(--muted)] focus-visible:ring-[var(--accent)]";

export function ContactForm() {
  const t = useTranslations("Contact.form");
  const topicLabels: Record<ContactTopic, string> = {
    sales: t("topics.sales"),
    support: t("topics.support"),
    compliance: t("topics.compliance"),
    partnership: t("topics.partnership"),
  };
  const contactSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t("validation.name")),
        email: z.string().trim().email(t("validation.email")),
        company: z.string().trim().max(80, t("validation.company")),
        topic: z.enum(contactTopics),
        message: z
          .string()
          .trim()
          .min(10, t("validation.messageMin"))
          .max(1000, t("validation.messageMax")),
      }),
    [t],
  );
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
    const subject = t("email.subject", {
      topic: topicLabel,
      name: values.company || values.name,
    });
    const body = [
      t("email.name", { name: values.name }),
      t("email.email", { email: values.email }),
      values.company ? t("email.company", { company: values.company }) : null,
      t("email.topic", { topic: topicLabel }),
      "",
      t("email.messageTitle"),
      values.message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.assign(
      `mailto:contact@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
    toast.success(t("toast.emailDraft"));
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
                <FormLabel>{t("fields.name.label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("fields.name.placeholder")} {...field} className={fieldClassName} />
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
                <FormLabel>{t("fields.email.label")}</FormLabel>
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
                <FormLabel>{t("fields.company.label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("fields.company.placeholder")} {...field} className={fieldClassName} />
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
                <FormLabel>{t("fields.topic.label")}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className={fieldClassName}>
                      <SelectValue placeholder={t("fields.topic.placeholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-[var(--card-border)] bg-background">
                    {contactTopics.map((value) => (
                      <SelectItem key={value} value={value}>
                        {topicLabels[value]}
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
              <FormLabel>{t("fields.message.label")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("fields.message.placeholder")}
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
            {t("submit")}
          </Button>
          <Button asChild type="button" variant="ghost" className="h-11 justify-start px-0 text-[var(--muted)] hover:bg-transparent hover:text-[var(--foreground)] sm:px-3">
            <a href="mailto:contact@example.com">
              {t("directEmail")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </form>
    </Form>
  );
}
