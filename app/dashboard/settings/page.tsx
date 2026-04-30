"use client";

import { useEffect, useState, useRef } from "react";
import { Lock, Mail, UserRound, Check, Loader2, Send, X, Save, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { getCurrentUser, updateUserAvatar } from "@/api/user";
import { sendResetPasswordCode, resetPassword } from "@/api/auth";
import type { UserMeResponse } from "@/api/types";
import { toErrorMessage } from "@/lib/format";
import { getAvatarUrl, SYSTEM_AVATARS } from "@/lib/avatars";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Avatar State
  const [tempAvatarKey, setTempAvatarKey] = useState<string | null>(null);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  
  // Password Reset Progressive State
  const [codeSent, setCodeSent] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [resetForm, setResetForm] = useState({
    code: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Global Status State
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCurrentUser();
      setUser(res.data);
      setTempAvatarKey(res.data.avatarKey || null);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown]);

  const handleSendCode = async () => {
    if (!user?.email || countdown > 0) return;
    setIsSendingCode(true);
    setError(null);
    try {
      const res = await sendResetPasswordCode({ email: user.email });
      if (res.code === 200 || res.code === 0) {
        setSuccess("验证码已发送至您的邮箱");
        setCodeSent(true);
        setResetForm(prev => ({ ...prev, code: "" }));
        setCountdown(60);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleAvatarClick = (key: string) => {
    setTempAvatarKey(key);
  };

  const handleSaveAvatar = async () => {
    if (!tempAvatarKey || tempAvatarKey === user?.avatarKey) return;
    setUpdatingAvatar(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await updateUserAvatar({ avatarKey: tempAvatarKey });
      if (res.code === 200 || res.code === 0) {
        setUser(res.data);
        setSuccess("头像更新成功");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const handleCancelAvatar = () => {
    setTempAvatarKey(user?.avatarKey || null);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setError("两次输入的新密码不一致");
      return;
    }
    setIsUpdatingPassword(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await resetPassword({
        email: user.email,
        code: resetForm.code,
        newPassword: resetForm.newPassword
      });
      if (res.code === 200 || res.code === 0) {
        setSuccess("密码重置成功，请重新登录...");
        setCodeSent(false);
        setResetForm({ code: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          localStorage.removeItem("user_access_token");
          router.push("/login");
        }, 2000);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  useEffect(() => {
    void fetchUser();
  }, []);

  if (loading && !user) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasAvatarChange = tempAvatarKey !== user?.avatarKey;

  return (
    <div className="space-y-8 pb-20">
      <PageHeader
        eyebrow="SETTINGS"
        title="账户设置"
        description="管理个人资料与安全选项。所有设置将实时同步至云端。"
      />

      <AnimatePresence>
        {(error || success) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sticky top-20 z-20 space-y-2"
          >
            {error && <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-500">{error}</div>}
            {success && <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-500">{success}</div>}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-10">
        {/* Section 1: 个人资料与头像选择 */}
        <section className="space-y-6">
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserRound className="w-5 h-5 text-primary" />
                个人档案
              </h3>
              <p className="text-sm text-muted-foreground mt-1">定制您的账户外观，头像将同步显示在控制台与导航栏。</p>
            </div>
            
            <div className="p-6 space-y-10">
              {/* 增强型预览区域 */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
                <div className="space-y-3">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">实时预览</Label>
                  <div className="flex items-center gap-6 p-4 rounded-2xl bg-muted/20 border border-border/50">
                    <div className="text-center space-y-2">
                      <UserAvatar 
                        src={getAvatarUrl(user?.avatarKey)}
                        name={user?.userName}
                        className="h-20 w-20 rounded-2xl shadow-sm border border-border"
                      />
                      <p className="text-[10px] text-muted-foreground font-medium">当前</p>
                    </div>
                    
                    {hasAvatarChange && (
                      <>
                        <ArrowRight className="w-5 h-5 text-muted-foreground animate-pulse" />
                        <div className="text-center space-y-2">
                          <UserAvatar 
                            src={getAvatarUrl(tempAvatarKey)}
                            name={user?.userName}
                            className="h-20 w-20 rounded-2xl shadow-xl border-2 border-primary ring-4 ring-primary/10 transition-all"
                          />
                          <p className="text-[10px] text-primary font-bold">预览</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">选择系统内置角色</Label>
                    <AnimatePresence>
                      {hasAvatarChange && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex gap-2"
                        >
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleCancelAvatar}
                            className="h-8 text-xs hover:bg-rose-500/10 hover:text-rose-500"
                          >
                            <X className="w-3 h-3 mr-1" /> 重置
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleSaveAvatar}
                            disabled={updatingAvatar}
                            className="h-8 text-xs shadow-lg shadow-primary/20"
                          >
                            {updatingAvatar ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
                            应用更改
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2.5">
                    {SYSTEM_AVATARS.map((avatar) => {
                      const isTempActive = tempAvatarKey === avatar.key;
                      const isRealActive = user?.avatarKey === avatar.key;
                      return (
                        <button
                          key={avatar.key}
                          onClick={() => handleAvatarClick(avatar.key)}
                          className={cn(
                            "relative aspect-square rounded-xl overflow-hidden transition-all duration-300",
                            isTempActive 
                              ? "ring-2 ring-primary ring-offset-2 scale-105 z-10" 
                              : "opacity-40 hover:opacity-100 hover:scale-105",
                            isRealActive && "border-2 border-primary/40"
                          )}
                        >
                          <UserAvatar src={avatar.url} className="w-full h-full" />
                          {isRealActive && !isTempActive && (
                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 只读信息区块 */}
              <div className="grid gap-6 md:grid-cols-2 pt-10 border-t border-border/50">
                <div className="space-y-2 text-left">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">注册邮箱</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={user?.email} readOnly className="pl-9 bg-muted/50 cursor-not-allowed border-border/50" />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">显示昵称</Label>
                  <Input readOnly value={user?.nickname || user?.userName || ""} className="bg-muted/50 cursor-not-allowed border-border/50" />
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-muted/30 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-wider">
              <span>UID: {user?.userId}</span>
              {user?.createdAt && <span>注册时间：{user.createdAt}</span>}
            </div>
          </div>
        </section>

        {/* Section 2: 安全验证 */}
        <section className="space-y-6">
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-500" />
                安全验证
              </h3>
              <p className="text-sm text-muted-foreground mt-1">为保障账户安全，修改密码需验证注册邮箱 {user?.email}。</p>
            </div>

            <div className="p-6 space-y-8">
              {!codeSent ? (
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">重置登录密码</p>
                    <p className="text-xs text-muted-foreground">系统将向您的注册邮箱发送 6 位数字验证码。</p>
                  </div>
                  <Button onClick={handleSendCode} disabled={isSendingCode || countdown > 0} className="min-w-[120px]">
                    {isSendingCode ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    {countdown > 0 ? `重新发送 (${countdown}s)` : "获取验证码"}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 text-left">
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">邮箱验证码</Label>
                      <div className="flex gap-4">
                        <Input required value={resetForm.code} onChange={(e) => setResetForm({...resetForm, code: e.target.value})} placeholder="请输入 6 位验证码" className="w-full" maxLength={6} autoComplete="one-time-code" />
                        <Button type="button" variant="outline" onClick={handleSendCode} disabled={isSendingCode || countdown > 0} className="shrink-0">{countdown > 0 ? `${countdown}s` : "重新发送"}</Button>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">新登录密码</Label>
                        <Input type="password" required value={resetForm.newPassword} onChange={(e) => setResetForm({...resetForm, newPassword: e.target.value})} placeholder="至少 8 位字符" className="w-full" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">确认新密码</Label>
                        <Input type="password" required value={resetForm.confirmPassword} onChange={(e) => setResetForm({...resetForm, confirmPassword: e.target.value})} placeholder="再次输入以确认" className="w-full" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
                    <Button type="button" variant="ghost" onClick={() => setCodeSent(false)} className="text-muted-foreground">取消重置</Button>
                    <Button type="submit" disabled={isUpdatingPassword} className="min-w-[140px]">
                      {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                      {isUpdatingPassword ? "更新中..." : "确认更新密码"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
