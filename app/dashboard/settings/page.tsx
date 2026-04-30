"use client";

import { useEffect, useState } from "react";
import { Bell, KeyRound, Lock, Mail, Shield, UserRound, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { CopyableSecret } from "@/components/shared/CopyableSecret";
import { getCurrentUser, updateUserAvatar } from "@/api/user";
import type { UserMeResponse } from "@/api/types";
import { toErrorMessage } from "@/lib/format";
import { UserAvatar, avatarOptions } from "@/lib/avatars";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingAvatar, setUpdatingAvatar] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCurrentUser();
      setUser(res.data);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = async (avatarKey: string) => {
    if (user?.avatarKey === avatarKey) return;
    
    setUpdatingAvatar(avatarKey);
    setSuccess(null);
    try {
      const res = await updateUserAvatar({ avatarKey });
      if (res.code === 200 || res.code === 0) {
        setUser(res.data);
        setSuccess("头像更新成功");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(res.message || "更新失败");
      }
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setUpdatingAvatar(null);
    }
  };

  useEffect(() => {
    void fetchUser();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="ACCOUNT"
        title="账户设置"
        description="管理您的个人资料、头像及安全首选项。"
        actions={
          <Button
            type="button"
            variant="outline"
            className="border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06]"
            onClick={() => void fetchUser()}
          >
            刷新
          </Button>
        }
      />

      {error ? (
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
          {success}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {/* Base Info */}
          <Card className="border-white/10 bg-[#18181b]/80 text-zinc-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <UserRound className="h-4 w-4 text-[#9aa2ff]" />
                基础信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <UserAvatar 
                  avatarKey={user?.avatarKey} 
                  userName={user?.userName} 
                  size="xl" 
                />
                <div>
                  <div className="text-base font-medium text-zinc-50">{loading ? "加载中" : user?.userName || "未设置用户名"}</div>
                  <div className="mt-1 text-xs text-zinc-500">UID：{user?.userId ?? "-"}</div>
                </div>
                <div className="ml-auto">
                  <StatusBadge status={user?.status ?? null} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-500">邮箱</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                    <Input
                      readOnly
                      value={user?.email ?? ""}
                      placeholder="-"
                      className="border-white/10 bg-white/[0.03] pl-9 text-zinc-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-500">用户名</Label>
                  <Input
                    readOnly
                    value={user?.userName ?? ""}
                    placeholder="-"
                    className="border-white/10 bg-white/[0.03] text-zinc-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avatar Selection */}
          <Card className="border-white/10 bg-[#18181b]/80 text-zinc-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <UserRound className="h-4 w-4 text-[#9aa2ff]" />
                选择头像
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
                {avatarOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleAvatarSelect(option.key)}
                    disabled={updatingAvatar !== null}
                    className={cn(
                      "group relative flex flex-col items-center gap-2 transition-all",
                      updatingAvatar === option.key && "opacity-50"
                    )}
                  >
                    <div className={cn(
                      "relative rounded-xl transition-all duration-200 group-hover:scale-110",
                      user?.avatarKey === option.key ? "ring-2 ring-primary ring-offset-2 ring-offset-[#18181b]" : "opacity-70 group-hover:opacity-100"
                    )}>
                      <UserAvatar 
                        avatarKey={option.key} 
                        size="lg" 
                      />
                      {user?.avatarKey === option.key && (
                        <div className="absolute -right-1 -top-1 rounded-full bg-primary p-0.5 text-white shadow-sm">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 truncate w-full text-center">{option.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Info */}
        <Card className="border-white/10 bg-[#18181b]/80 text-zinc-100 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Shield className="h-4 w-4 text-emerald-300" />
              安全状态
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
              <div className="mb-1 flex items-center gap-2 text-sm text-zinc-200">
                <Lock className="h-4 w-4 text-zinc-500" />
                登录凭证
              </div>
              <p className="text-xs leading-5 text-zinc-500">密码修改接口未在当前 API 文档中提供，前端不虚构入口。</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
              <div className="mb-1 flex items-center gap-2 text-sm text-zinc-200">
                <KeyRound className="h-4 w-4 text-zinc-500" />
                本地登录 Token
              </div>
              <CopyableSecret value={typeof window === "undefined" ? "" : localStorage.getItem("user_access_token") ?? ""} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.025] p-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-zinc-200">
                  <Bell className="h-4 w-4 text-zinc-500" />
                  通知提醒
                </div>
                <p className="mt-1 text-xs text-zinc-500">通知偏好接口暂未提供，开关仅展示当前能力边界。</p>
              </div>
              <Switch checked disabled />
            </div>
            <div className="text-xs text-zinc-500">
              注册时间：<DateTimeText value={null} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
