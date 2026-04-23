"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import LogoCarousel from "../components/LogoCarousel";
import Image from "next/image";
import "./login.css";

type Step = "email" | "otp" | "name";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const otpRef0 = useRef<HTMLInputElement>(null);
  const otpRef1 = useRef<HTMLInputElement>(null);
  const otpRef2 = useRef<HTMLInputElement>(null);
  const otpRef3 = useRef<HTMLInputElement>(null);
  const otpRef4 = useRef<HTMLInputElement>(null);
  const otpRef5 = useRef<HTMLInputElement>(null);

  const otpRefs = useMemo(
    () => [otpRef0, otpRef1, otpRef2, otpRef3, otpRef4, otpRef5],
    [otpRef0, otpRef1, otpRef2, otpRef3, otpRef4, otpRef5]
  );

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }

    // Auto-submit if all filled
    if (newOtp.every((digit) => digit !== "")) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep("name");
      }, 1000);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Dummy success redirect or alert
      alert(`Welcome, ${name}! Redirecting to dashboard...`);
      window.location.href = "/";
    }, 1000);
  };

  // Focus the first OTP input when transitioning to the OTP step
  useEffect(() => {
    if (step === "otp") {
      otpRefs[0].current?.focus();
    }
  }, [step, otpRefs]);

  return (
    <div className="login-layout">
      {/* Left Column: Auth Flow */}
      <div className="login-left">
        {step === "email" && (
          <div className="login-form-container">
            <div className="login-brand-logo" />
            <h1 className="login-title">Welcome to 算力租赁</h1>
            <p className="login-subtitle">Log in or register with your email.</p>

            <form style={{ width: "100%" }} onSubmit={handleEmailSubmit}>
              <input
                type="email"
                className="login-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="login-button login-button--secondary"
                disabled={!email || !email.includes("@") || isLoading}
              >
                {isLoading ? "Loading..." : "Continue"}
              </button>
            </form>

            <div className="login-footer">
              算力租赁 uses Google reCAPTCHA for secure authentication. <br />
              Privacy - Terms
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="login-form-container">
            <div className="login-brand-logo" style={{ width: 48, height: 48 }} />
            <h1 className="login-title">Check your email</h1>
            <p className="login-subtitle" style={{ marginBottom: 16 }}>
              We sent you a sign-in code to: <strong>{email}</strong>
              <br />
              Paste (or type) it below to continue.
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
                />
              ))}
            </div>

            <button className="resend-button">Resend code</button>

            {isLoading && (
              <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 16 }}>
                Loading...
              </div>
            )}
          </div>
        )}

        {step === "name" && (
          <div className="login-form-container">
            <div className="login-brand-logo" style={{ width: 48, height: 48 }} />
            <h1 className="login-title">How shall we call you?</h1>

            <form style={{ width: "100%", marginTop: 24 }} onSubmit={handleNameSubmit}>
              <input
                type="email"
                className="login-input"
                value={email}
                disabled
              />
              <input
                type="text"
                className="login-input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
              <button
                type="submit"
                className="login-button login-button--primary"
                disabled={!name || isLoading}
              >
                {isLoading ? "Loading..." : "Next"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Right Column: Showcase */}
      <div className="login-right">
        <Image
          className="login-right-image"
          src="/images/retool-blocks-login-door.jpg"
          alt="Abstract 3D Shape"
          fill
          priority
        />
        <div className="login-right-footer">
          <LogoCarousel />
        </div>
      </div>
    </div>
  );
}
