"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import LogoCarousel from "@/components/marketing/LogoCarousel";
import Image from "next/image";
import "../login/login.css"; // Reuse login styles
import { sendSignupEmailCode, register, verifySignupEmailCode } from "@/api/auth";
import { toErrorMessage, translateErrorMessage } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "email" | "otp" | "profile";

export default function SignupPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Countdown timer for resending code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleEmailSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !email.includes("@")) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await sendSignupEmailCode({ email });
      if (res && (res.code === 200 || res.code === 0)) {
        setStep("otp");
        setCountdown(60);
      } else {
        setError(translateErrorMessage(res?.message || "发送失败"));
      }
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpComplete = async (code: string) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await verifySignupEmailCode({ email, code });
      if (res && (res.code === 200 || res.code === 0)) {
        setStep("profile");
      } else {
        setError(translateErrorMessage(res?.message || "验证码无效"));
      }
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !password) return;
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }
    
    setIsLoading(true);
    setError("");
    try {
      const trimmedInviteCode = inviteCode.trim();
      const res = await register({
        email,
        code: otp.join(""),
        userName: userName,
        password,
        ...(trimmedInviteCode ? { inviteCode: trimmedInviteCode } : {}),
      });
      if (res && (res.code === 200 || res.code === 0) && res.data) {
        localStorage.setItem("user_access_token", res.data.accessToken);
        window.location.href = "/dashboard";
      } else {
        setError(translateErrorMessage(res?.message || "注册失败"));
      }
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Handle paste
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (i < 6 && /^\d$/.test(char)) newOtp[i] = char;
      });
      setOtp(newOtp);
      if (pastedData.length === 6) handleOtpComplete(pastedData.join(""));
      return;
    }

    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(""); // Clear error when typing
    
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
    
    if (newOtp.every((digit) => digit !== "")) {
      handleOtpComplete(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs[index - 1].current?.focus();
  };

  useEffect(() => {
    const inviteCodeFromUrl = new URLSearchParams(window.location.search).get("inviteCode");
    if (inviteCodeFromUrl) setInviteCode(inviteCodeFromUrl);
  }, []);

  useEffect(() => {
    if (step === "otp") otpRefs[0].current?.focus();
  }, [step]);

  return (
    <div className="login-layout">
      <div className="login-left">
        <div className="login-brand-header">
          <div className="login-brand-logo-mini" />
          <span className="login-brand-name">算力租赁</span>
        </div>

        <div className="login-form-container">
          {step === "email" && (
            <>
              <h1 className="login-title">欢迎来到 算力租赁</h1>
              <p className="login-subtitle">注册以继续使用</p>

              <form style={{ width: "100%" }} onSubmit={handleEmailSubmit}>
                <Input
                  type="email"
                  className="login-input"
                  placeholder="工作邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="text"
                  className="login-input"
                  placeholder="邀请码（选填）"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value);
                    setError("");
                  }}
                  disabled={isLoading}
                />
                {error && <div className="error-message">{error}</div>}
                <Button type="submit" className="login-button login-button--primary" disabled={isLoading}>
                  {isLoading ? "处理中..." : "继续"}
                </Button>
              </form>
              <div className="footer-subtext" style={{ marginTop: 24 }}>
                已经有账号了？ <Link href="/login" className="footer-link-bold">登录</Link>
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <h1 className="login-title">验证您的邮箱</h1>
              <p className="login-subtitle">
                我们已向以下地址发送了 6 位验证码 <br />
                <span style={{ color: "#000", fontWeight: 600 }}>{email}</span>
              </p>
              <div className="otp-container">
                {otp.map((digit, i) => (
                  <Input
                    key={i}
                    ref={otpRefs[i]}
                    className="otp-input"
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    disabled={isLoading}
                  />
                ))}
              </div>
              
              {error && <div className="error-message">{error}</div>}

              <div className="otp-actions" style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                <Button
                  type="button"
                  variant="secondary"
                  className="login-button login-button--secondary"
                  onClick={() => handleEmailSubmit()}
                  disabled={isLoading || countdown > 0}
                >
                  {countdown > 0 ? `${countdown}s 后重新发送` : "重新发送验证码"}
                </Button>
                <Button type="button" variant="ghost" className="resend-button" style={{ alignSelf: "center" }} onClick={() => setStep("email")}>
                  返回邮箱输入
                </Button>
              </div>
            </>
          )}

          {step === "profile" && (
            <>
              <h1 className="login-title">即将完成</h1>
              <p className="login-subtitle">设置您的用户名和密码。</p>
              <form style={{ width: "100%" }} onSubmit={handleRegister}>
                <Input
                  type="text"
                  className="login-input"
                  placeholder="用户名"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    setError("");
                  }}
                  required
                  autoFocus
                  disabled={isLoading}
                />
                <Input
                  type="password"
                  className="login-input"
                  placeholder="设置密码"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  disabled={isLoading}
                />
                <Input
                  type="password"
                  className="login-input"
                  placeholder="确认密码"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  required
                  disabled={isLoading}
                />
                {error && <div className="error-message">{error}</div>}
                <Button type="submit" className="login-button login-button--primary" disabled={isLoading}>
                  {isLoading ? "创建账号中..." : "注册"}
                </Button>
                <Button
                  type="button" 
                  variant="ghost"
                  className="resend-button" 
                  style={{ width: "100%", marginTop: 12 }} 
                  onClick={() => setStep("otp")}
                >
                  返回验证码输入
                </Button>
              </form>
            </>
          )}

          <div className="login-legal-text" style={{ marginTop: 40 }}>
            通过使用 算力租赁，即表示您同意我们的 <br />
            <span className="legal-link">隐私政策</span> 和 <span className="legal-link">服务条款</span>。
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-right-illustration">
          <Image className="login-right-image" src="/images/retool-blocks-login-door.jpg" alt="Showcase" fill priority />
        </div>
        <div className="login-right-content">
          <div className="login-trusted-section"><LogoCarousel /></div>
        </div>
      </div>
    </div>
  );
}
