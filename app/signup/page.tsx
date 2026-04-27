"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import LogoCarousel from "../components/LogoCarousel";
import Image from "next/image";
import "../login/login.css"; // Reuse login styles
import { sendSignupEmailCode, register, verifySignupEmailCode } from "@/api/auth";
import { toErrorMessage } from "@/lib/format";

type Step = "email" | "otp" | "profile";

export default function SignupPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
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
        setError(res?.message || "Failed to send code");
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
        setError(res?.message || "Invalid verification code");
      }
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !password) return;
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setError("");
    try {
      const res = await register({
        email,
        code: otp.join(""),
        username: nickname,
        password,
      });
      if (res && (res.code === 200 || res.code === 0) && res.data) {
        localStorage.setItem("accessToken", res.data.accessToken);
        window.location.href = "/dashboard";
      } else {
        setError(res?.message || "Registration failed");
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
              <h1 className="login-title">Welcome to 算力租赁.</h1>
              <p className="login-subtitle">Sign up to continue building.</p>

              <form style={{ width: "100%" }} onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  className="login-input"
                  placeholder="Work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login-button login-button--primary" disabled={isLoading}>
                  {isLoading ? "Continuing..." : "Continue"}
                </button>
              </form>
              <div className="footer-subtext" style={{ marginTop: 24 }}>
                Have an account already? <Link href="/login" className="footer-link-bold">Sign in</Link>
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <h1 className="login-title">Verify your email</h1>
              <p className="login-subtitle">
                We've sent a 6-digit code to <br />
                <span style={{ color: "#000", fontWeight: 600 }}>{email}</span>
              </p>
              <div className="otp-container">
                {otp.map((digit, i) => (
                  <input
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
                <button 
                  className="login-button login-button--secondary"
                  onClick={() => handleEmailSubmit()}
                  disabled={isLoading || countdown > 0}
                >
                  {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
                </button>
                <button className="resend-button" style={{ alignSelf: "center" }} onClick={() => setStep("email")}>
                  Back to email
                </button>
              </div>
            </>
          )}

          {step === "profile" && (
            <>
              <h1 className="login-title">Almost there.</h1>
              <p className="login-subtitle">Set your display name and password.</p>
              <form style={{ width: "100%" }} onSubmit={handleRegister}>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Username"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setError("");
                  }}
                  required
                  autoFocus
                  disabled={isLoading}
                />
                <input
                  type="password"
                  className="login-input"
                  placeholder="Set password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  disabled={isLoading}
                />
                <input
                  type="password"
                  className="login-input"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  required
                  disabled={isLoading}
                />
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login-button login-button--primary" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign up"}
                </button>
                <button 
                  type="button" 
                  className="resend-button" 
                  style={{ width: "100%", marginTop: 12 }} 
                  onClick={() => setStep("otp")}
                >
                  Back to verification
                </button>
              </form>
            </>
          )}

          <div className="login-legal-text" style={{ marginTop: 40 }}>
            By using 算力租赁, you are agreeing to <br />
            our <span className="legal-link">privacy policy</span> and <span className="legal-link">terms of service</span>.
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
