"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import LogoCarousel from "../components/LogoCarousel";
import Image from "next/image";
import "./login.css";
import { loginWithPassword } from "@/api/auth";
import { toErrorMessage, translateErrorMessage } from "@/lib/format";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await loginWithPassword({ email, password });
      if (res && (res.code === 200 || res.code === 0) && res.data) {
        localStorage.setItem("user_access_token", res.data.accessToken);
        router.push("/dashboard");
      } else {
        setError(translateErrorMessage(res?.message || "Login failed. Please check your credentials."));
      }
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("user_access_token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="login-layout">
      {/* Left Column: Auth Flow */}
      <div className="login-left">
        <div className="login-brand-header">
          <div className="login-brand-logo-mini" />
          <span className="login-brand-name">算力租赁</span>
        </div>

        <div className="login-form-container">
          <h1 className="login-title">Welcome back.</h1>
          <p className="login-subtitle">Log in to your account below.</p>

          <form style={{ width: "100%" }} onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                className="login-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
                disabled={isLoading}
              />
            </div>

            <div className="input-group" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="login-input"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px"
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <div className="error-message" style={{ marginBottom: "16px" }}>{error}</div>}

            <button
              type="submit"
              className="login-button login-button--primary"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="login-footer-links" style={{ marginTop: "24px" }}>
            <div className="footer-subtext">
              Don't have an account? <Link href="/signup" className="footer-link-bold">Sign up for free</Link>
            </div>
            <div className="footer-subtext">
              Need help logging in? <Link href="/reset-password" className="footer-link-bold">Reset your password</Link>
            </div>
          </div>

          <div className="login-legal-text">
            By using 算力租赁, you acknowledge that we collect and use <br />
            your personal information as described in our <span className="legal-link">Privacy Policy</span>.
          </div>
        </div>
      </div>

      {/* Right Column: Showcase */}
      <div className="login-right">
        <div className="login-right-illustration">
          <Image
            className="login-right-image"
            src="/images/retool-blocks-login-door.jpg"
            alt="Abstract 3D Shape"
            fill
            priority
          />
        </div>
        <div className="login-right-content">
          <div className="login-trusted-section">
            <LogoCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}
