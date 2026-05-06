"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Lock, Mail, UserRound, Check, Loader2, Send, X, Save, ArrowRight, LayoutGrid, Ghost, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { getCurrentUser, updateUserAvatar } from "@/api/user";
import { sendResetPasswordCode, resetPassword } from "@/api/auth";
import type { UserMeResponse } from "@/api/types";
import { getAvatarUrl, AVATAR_STYLES, getAvatarsByStyle } from "@/lib/avatars";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { clearUserAuthSession } from "@/lib/auth-session";

type ResetStep = 'idle' | 'countdown';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Avatar Selection States
  const [activeStyle, setActiveStyle] = useState(AVATAR_STYLES[0].id);
  const [tempAvatarKey, setTempAvatarKey] = useState<string | null>(null);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  
  // Password Reset Progressive State
  const [step, setStep] = useState<ResetStep>('idle');
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [resetForm, setResetForm] = useState({
    code: "",
    newPassword: "",
    confirmPassword: ""
  });

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await getCurrentUser();
      setUser(res.data);
      setTempAvatarKey(res.data.avatarKey || null);
      if (res.data.avatarKey) {
        const matchedStyle = AVATAR_STYLES.find(s => res.data.avatarKey?.startsWith(s.prefix));
        if (matchedStyle) setActiveStyle(matchedStyle.id);
      }
    } catch {
      // 错误由拦截器接管
    } finally {
      setLoading(false);
    }
  };

  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && step === 'countdown' && !timerRef.current) {
      // 倒计时结束但仍保持在 countdown 模式（允许用户再次发送）
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown, step]);

  const handleSendCode = async () => {
    if (!user?.email || (step === 'countdown' && countdown > 0)) return;
    setIsLoading(true);
    try {
      const res = await sendResetPasswordCode({ email: user.email });
      if (res.code === 200 || res.code === 0) {
        toast.success("验证码已发送至您的邮箱");
        setStep('countdown');
        setCountdown(60);
        setResetForm(prev => ({ ...prev, code: "" }));
      }
    } catch {
      // 错误由拦截器接管
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = (key: string) => {
    setTempAvatarKey(key);
  };

  const handleSaveAvatar = async () => {
    if (!tempAvatarKey || tempAvatarKey === user?.avatarKey) return;
    setUpdatingAvatar(true);
    try {
      const res = await updateUserAvatar({ avatarKey: tempAvatarKey });
      if (res.code === 200 || res.code === 0) {
        setUser(res.data);
        toast.success("账户头像更新成功");
      }
    } catch {
      // 错误由拦截器接管
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const handleCancelAvatar = () => {
    setTempAvatarKey(user?.avatarKey || null);
    const matchedStyle = AVATAR_STYLES.find(s => user?.avatarKey?.startsWith(s.prefix));
    if (matchedStyle) setActiveStyle(matchedStyle.id);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      toast.error("两次输入的新密码不一致");
      return;
    }
    setIsLoading(true);
    try {
      const res = await resetPassword({
        email: user.email,
        code: resetForm.code,
        newPassword: resetForm.newPassword
      });
      if (res.code === 200 || res.code === 0) {
        toast.success("密码重置成功，请重新登录...");
        setStep('idle');
        setResetForm({ code: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          clearUserAuthSession();
          router.push("/login");
        }, 2000);
      }
    } catch {
      // 错误由拦截器接管
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchUser();
  }, []);

  const currentAvatars = useMemo(() => getAvatarsByStyle(activeStyle), [activeStyle]);

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
        description="管理个人资料与安全选项。提供多种风格的内置头像供您选择。"
      />

      <div className="flex flex-col gap-10">
        {/* Section 1: 个人资料 */}
        <section className="space-y-6">
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserRound className="w-5 h-5 text-primary" />
                个人档案
              </h3>
              <p className="text-sm text-muted-foreground mt-1">定制您的账户外观，支持极简几何、萌系动物及科技机器人多种风格。</p>
            </div>
            
            <div className="p-6 space-y-10">
              <div className="flex flex-col xl:flex-row items-start gap-10">
                <div className="space-y-4 w-full xl:w-auto text-left">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">实时预览对比</Label>
                  <div className="flex items-center justify-between xl:justify-start gap-6 p-5 rounded-2xl bg-muted/20 border border-border/50">
                    <div className="text-center space-y-2">
                      <UserAvatar src={getAvatarUrl(user?.avatarKey)} name={user?.userName} className="h-20 w-20 rounded-2xl shadow-sm border border-border" />
                      <p className="text-[10px] text-muted-foreground font-medium">当前</p>
                    </div>
                    {hasAvatarChange && (
                      <>
                        <ArrowRight className="w-5 h-5 text-muted-foreground animate-pulse" />
                        <div className="text-center space-y-2">
                          <UserAvatar src={getAvatarUrl(tempAvatarKey)} name={user?.userName} className="h-20 w-20 rounded-2xl shadow-xl border-2 border-primary ring-4 ring-primary/10" />
                          <p className="text-[10px] text-primary font-bold">预览</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-1 w-full space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex p-1 rounded-lg bg-muted/50 border border-border/50 w-fit">
                      {AVATAR_STYLES.map((style) => (
                        <Button key={style.id} variant={activeStyle === style.id ? "secondary" : "ghost"} size="sm" onClick={() => setActiveStyle(style.id)} className={cn("h-8 px-4 text-xs font-medium transition-all flex items-center gap-2", activeStyle === style.id && "bg-background shadow-sm")}>
                          {style.id === "shapes" && <LayoutGrid className="w-3.5 h-3.5" />}
                          {style.id === "bigears" && <Ghost className="w-3.5 h-3.5" />}
                          {style.id === "bottts" && <Cpu className="w-3.5 h-3.5" />}
                          {style.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-4">
                      {currentAvatars.map((avatar) => {
                        const isTempActive = tempAvatarKey === avatar.key;
                        const isRealActive = user?.avatarKey === avatar.key;
                        return (
                          <Button
                            key={avatar.key}
                            variant="ghost"
                            onClick={() => handleAvatarClick(avatar.key)}
                            className={cn(
                              "relative p-0 h-auto aspect-square rounded-xl overflow-hidden transition-all duration-300 bg-muted/10 hover:scale-110 hover:shadow-md hover:z-10",
                              isTempActive 
                                ? "ring-2 ring-primary ring-offset-2 scale-105 z-10 opacity-100 shadow-lg" 
                                : "opacity-50 hover:opacity-100",
                              isRealActive && "border-2 border-primary/40 shadow-inner"
                            )}
                          >
                            <UserAvatar src={avatar.url} className="w-full h-full" />
                            {isRealActive && (
                              <div className="absolute top-1 right-1">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              </div>
                            )}
                          </Button>
                        );
                      })}
                    </div>

                    <AnimatePresence>
                      {hasAvatarChange && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: 10 }} 
                          className="flex justify-end gap-3 pt-4"
                        >
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleCancelAvatar}
                            className="text-muted-foreground hover:text-rose-500"
                          >
                            <X className="w-4 h-4 mr-1" /> 重置选择
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleSaveAvatar}
                            disabled={updatingAvatar}
                            className="min-w-[120px] shadow-lg shadow-primary/20"
                          >
                            {updatingAvatar ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                            保存头像
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 pt-10 border-t border-border/50 text-left">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">注册邮箱</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={user?.email} readOnly className="pl-9 bg-muted/50 cursor-not-allowed" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">显示昵称</Label>
                  <Input readOnly value={user?.nickname || user?.userName || ""} className="bg-muted/50 cursor-not-allowed" />
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-muted/30 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-wider">
              <span>UID: {user?.userId}</span>
              {user?.createdAt && <span>注册时间：{user.createdAt}</span>}
            </div>
          </div>
        </section>

        {/* Section 2: 安全验证 (渐进式重置逻辑) */}
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
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1 text-left">
                  <p className="text-sm font-medium">重置登录密码</p>
                  <p className="text-xs text-muted-foreground">系统将向您的注册邮箱发送 6 位数字验证码。</p>
                </div>
                <Button 
                  onClick={handleSendCode} 
                  disabled={isLoading || countdown > 0} 
                  variant={step === 'countdown' ? "secondary" : "default"}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    step === 'idle' ? <Send className="w-4 h-4 mr-2" /> : null
                  )}
                  {step === 'idle' 
                    ? "发送验证码" 
                    : (countdown > 0 ? `重新发送 (${countdown}s)` : "重新发送")
                  }
                </Button>
              </div>

              <AnimatePresence>
                {step === 'countdown' && (
                  <motion.form 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleResetPassword} 
                    className="space-y-6 pt-6 border-t border-border text-left overflow-hidden"
                  >
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">邮箱验证码</Label>
                        <Input required value={resetForm.code} onChange={(e) => setResetForm({...resetForm, code: e.target.value})} placeholder="请输入 6 位验证码" className="w-full" maxLength={6} autoComplete="one-time-code" />
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
                    <div className="flex items-center justify-end gap-4">
                      <Button type="button" variant="ghost" onClick={() => setStep('idle')} className="text-muted-foreground">取消</Button>
                      <Button type="submit" disabled={isLoading} className="min-w-[140px]">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                        确认更新密码
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
