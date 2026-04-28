"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toErrorMessage } from "@/lib/format";

const notificationSchema = z.object({
  userId: z.number().optional(),
  title: z.string().min(1, "请输入标题"),
  content: z.string().min(1, "请输入内容"),
  type: z.string().min(1, "请选择类型"),
});

interface NotificationFormProps {
  isBroadcast?: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export function NotificationForm({ isBroadcast = false, onSuccess, onCancel }: NotificationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      userId: undefined,
      title: "",
      content: "",
      type: "SYSTEM",
    },
  });

  const onSubmit = async (values: z.infer<typeof notificationSchema>) => {
    setLoading(true);
    setError(null);
    try {
      const { createAdminNotification, broadcastAdminNotification } = await import("@/api/admin");
      if (isBroadcast) {
        await broadcastAdminNotification({
          title: values.title,
          content: values.content,
          type: values.type,
        });
      } else {
        if (values.userId === undefined) {
          throw new Error("请输入接收用户 ID");
        }
        await createAdminNotification({
          userId: values.userId,
          title: values.title,
          content: values.content,
          type: values.type,
        });
      }
      onSuccess();
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        {error && <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium">{error}</div>}
        
        <div className="space-y-4 w-full">
          {!isBroadcast && (
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>接收用户 ID</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="例如: 10001" 
                      className="bg-background"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid grid-cols-2 gap-4 w-full">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full col-span-2">
                  <FormLabel>通知标题</FormLabel>
                  <FormControl>
                    <Input placeholder="输入简明扼要的标题" className="bg-background" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>通知类型</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SYSTEM">系统通知</SelectItem>
                      <SelectItem value="ORDER">订单通知</SelectItem>
                      <SelectItem value="WALLET">资金通知</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>通知内容</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="请输入详细的通知内容..." 
                    className="bg-background min-h-[120px] resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 预览区域 */}
        <div className="mt-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-panel-soft)] p-4">
          <div className="mb-3 text-xs font-medium text-[var(--admin-subtle)] uppercase tracking-wider">
            实时预览 (模拟展示)
          </div>
          <div className="flex gap-3 items-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5e6ad2]/10 text-[#5e6ad2]">
              <Bell className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-[var(--admin-text)] truncate">
                  {form.watch("title") || "在此输入标题..."}
                </p>
                <span className="text-[10px] text-[var(--admin-muted)] whitespace-nowrap">刚刚</span>
              </div>
              <p className="text-xs text-[var(--admin-muted)] break-words whitespace-pre-wrap">
                {form.watch("content") || "通知内容将展示在这里。"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--admin-border)]">
          <Button type="button" variant="ghost" onClick={onCancel}>
            取消
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-[#5e6ad2] hover:bg-[#7170ff] text-white font-semibold min-w-[100px]"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isBroadcast ? "发布广播" : "发送通知"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
