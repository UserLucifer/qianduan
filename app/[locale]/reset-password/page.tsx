"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import LogoCarousel from "@/components/marketing/LogoCarousel";
import Image from "next/image";
import "../login/login.css";
import { sendResetPasswordCode, resetPassword, verifyResetPasswordCode } from "@/api/auth";
import { toErrorMessage, translateErrorMessage } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClientLocale, localizePathname } from "@/i18n/locales";

type Step = "email" | "otp" | "reset";

export default function ResetPasswordPage() {
  const locale = useLocale();
  const t = useTranslations("Auth.resetPassword");
  const common = useTranslations("Common");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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
      const res = await sendResetPasswordCode({ email });
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
      const res = await verifyResetPasswordCode({ email, code });
      if (res && (res.code === 200 || res.code === 0)) {
        setStep("reset");
      } else {
        setError(res?.message ? translateErrorMessage(res.message, locale) : t("errors.invalidCode"));
      }
    } catch (err) {
      setError(toErrorMessage(err, locale));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    if (newPassword !== confirmPassword) {
      setError(t("errors.passwordMismatch"));
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const res = await resetPassword({
        email,
        code: otp.join(""),
        newPassword,
      });
      if (res && (res.code === 200 || res.code === 0)) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = localizePathname("/login", getClientLocale());
        }, 2000);
      } else {
        setError(res?.message ? translateErrorMessage(res.message, locale) : t("errors.resetFailed"));
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
          {success ? (
            <div className="success-container">
              <h1 className="login-title">{t("successTitle")}</h1>
              <p className="login-subtitle">{t("successSubtitle")}</p>
            </div>
          ) : (
            <>
              {step === "email" && (
                <>
                  <h1 className="login-title">{t("emailTitle")}</h1>
                  <p className="login-subtitle">{t("emailSubtitle")}</p>
                  <form style={{ width: "100%" }} onSubmit={handleEmailSubmit}>
                    <Input
                      type="email"
                      className="login-input"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {error && <div className="error-message">{error}</div>}
                    <Button type="submit" className="login-button login-button--primary" disabled={isLoading}>
                      {isLoading ? t("sending") : t("sendResetLink")}
                    </Button>
                  </form>
                  <Link href="/login" className="back-link">{t("backToLogin")}</Link>
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

              {step === "reset" && (
                <>
                  <h1 className="login-title">{t("resetTitle")}</h1>
                  <p className="login-subtitle">{t("resetSubtitle")}</p>
                  <form style={{ width: "100%" }} onSubmit={handleReset}>
                    <Input
                      type="password"
                      className="login-input"
                      placeholder={t("newPasswordPlaceholder")}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError("");
                      }}
                      required
                      autoFocus
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
                      {isLoading ? t("resetting") : t("updatePassword")}
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
