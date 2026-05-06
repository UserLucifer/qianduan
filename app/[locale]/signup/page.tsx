"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import LogoCarousel from "@/components/marketing/LogoCarousel";
import Image from "next/image";
import "../login/login.css"; // Reuse login styles
import { sendSignupEmailCode, register, verifySignupEmailCode } from "@/api/auth";
import { toErrorMessage, translateErrorMessage } from "@/lib/format";
import { setUserAccessToken } from "@/lib/auth-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClientLocale, localizePathname } from "@/i18n/locales";

type Step = "email" | "otp" | "profile";

export default function SignupPage() {
  const locale = useLocale();
  const t = useTranslations("Auth.signup");
  const common = useTranslations("Common");
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
        setError(res?.message ? translateErrorMessage(res.message, locale) : t("errors.sendFailed"));
      }
    } catch (err) {
      setError(toErrorMessage(err, locale));
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
        setError(res?.message ? translateErrorMessage(res.message, locale) : t("errors.invalidCode"));
      }
    } catch (err) {
      setError(toErrorMessage(err, locale));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !password) return;
    if (password !== confirmPassword) {
      setError(t("errors.passwordMismatch"));
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
        setUserAccessToken(res.data.accessToken);
        window.location.href = localizePathname("/dashboard", getClientLocale());
      } else {
        setError(res?.message ? translateErrorMessage(res.message, locale) : t("errors.registrationFailed"));
      }
    } catch (err) {
      setError(toErrorMessage(err, locale));
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
          <span className="login-brand-name">{common("brand")}</span>
        </div>

        <div className="login-form-container">
          {step === "email" && (
            <>
              <h1 className="login-title">{t("emailTitle", { brand: common("brand") })}</h1>
              <p className="login-subtitle">{t("emailSubtitle")}</p>

              <form style={{ width: "100%" }} onSubmit={handleEmailSubmit}>
                <Input
                  type="email"
                  className="login-input"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="text"
                  className="login-input"
                  placeholder={t("inviteCodePlaceholder")}
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value);
                    setError("");
                  }}
                  disabled={isLoading}
                />
                {error && <div className="error-message">{error}</div>}
                <Button type="submit" className="login-button login-button--primary" disabled={isLoading}>
                  {isLoading ? t("processing") : t("continue")}
                </Button>
              </form>
              <div className="footer-subtext" style={{ marginTop: 24 }}>
                {t("hasAccount")} <Link href="/login" className="footer-link-bold">{t("login")}</Link>
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <h1 className="login-title">{t("otpTitle")}</h1>
              <p className="login-subtitle">
                {t("otpSubtitle")} <br />
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
                    aria-label={t("otpDigitAria", { index: i + 1 })}
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
                  {countdown > 0 ? t("resendCountdown", { seconds: countdown }) : t("resendCode")}
                </Button>
                <Button type="button" variant="ghost" className="resend-button" style={{ alignSelf: "center" }} onClick={() => setStep("email")}>
                  {t("backToEmail")}
                </Button>
              </div>
            </>
          )}

          {step === "profile" && (
            <>
              <h1 className="login-title">{t("profileTitle")}</h1>
              <p className="login-subtitle">{t("profileSubtitle")}</p>
              <form style={{ width: "100%" }} onSubmit={handleRegister}>
                <Input
                  type="text"
                  className="login-input"
                  placeholder={t("usernamePlaceholder")}
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
                  placeholder={t("passwordPlaceholder")}
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
                  placeholder={t("confirmPasswordPlaceholder")}
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
                  {isLoading ? t("creatingAccount") : t("register")}
                </Button>
                <Button
                  type="button" 
                  variant="ghost"
                  className="resend-button" 
                  style={{ width: "100%", marginTop: 12 }} 
                  onClick={() => setStep("otp")}
                >
                  {t("backToOtp")}
                </Button>
              </form>
            </>
          )}

          <div className="login-legal-text" style={{ marginTop: 40 }}>
            {t("legalPrefix", { brand: common("brand") })} <br />
            <Link href="/privacy" className="legal-link">{t("privacyPolicy")}</Link> {t("and")} <Link href="/terms" className="legal-link">{t("terms")}</Link>{t("legalSuffix")}
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-right-illustration">
          <Image className="login-right-image" src="/images/retool-blocks-login-door.jpg" alt={t("imageAlt")} fill priority />
        </div>
        <div className="login-right-content">
          <div className="login-trusted-section"><LogoCarousel /></div>
        </div>
      </div>
    </div>
  );
}
