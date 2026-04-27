"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, User } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLogin } from "@/api/admin";
import { toErrorMessage } from "@/lib/format";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminLogin({ username, password });
      localStorage.setItem("adminAccessToken", res.data.adminAccessToken);
      localStorage.setItem("accessToken", res.data.adminAccessToken);
      router.push("/admins/dashboard");
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="z-10 w-full max-w-[400px] px-6"
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-3xl">
          <div className="mb-8 flex flex-col items-center">
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-[#5e6ad2]/20 blur-xl" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#09090b] shadow-[0_0_22px_rgba(94,106,210,0.32)]">
                <ShieldCheck className="h-8 w-8 text-[#9aa2ff]" />
              </div>
            </div>
            <h1 className="mt-6 text-2xl font-medium tracking-tight text-white">管理员登录</h1>
            <p className="mt-2 text-sm text-zinc-500">进入平台运营、财务审核与系统调度后台</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-username" className="text-sm font-medium text-zinc-200">
                管理员账号
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                <Input
                  id="admin-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  className="h-11 border-white/10 bg-white/[0.04] pl-10 text-white placeholder:text-zinc-600 focus:border-[#5e6ad2]/60"
                  placeholder="请输入管理员账号"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-sm font-medium text-zinc-200">
                密码
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="h-11 border-white/10 bg-white/[0.04] pl-10 text-white placeholder:text-zinc-600 focus:border-[#5e6ad2]/60"
                  placeholder="请输入登录密码"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-lg bg-[#5e6ad2] text-sm font-medium text-white hover:bg-[#7170ff]"
            >
              {isLoading ? "登录中..." : "登录"}
            </Button>
          </form>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
