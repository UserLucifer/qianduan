"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import LogoCarousel from "@/components/marketing/LogoCarousel";
import Image from "next/image";
import "./login.css";
import { loginWithPassword } from "@/api/auth";
import { toErrorMessage, translateErrorMessage } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        setError(translateErrorMessage(res?.message || "登录失败，请检查您的凭据。"));
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
          <h1 className="login-title">欢迎回来</h1>
          <p className="login-subtitle">登录您的账号</p>

          <form style={{ width: "100%" }} onSubmit={handleLogin}>
            <div className="input-group">
              <Input
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
              <Input
                type={showPassword ? "text" : "password"}
                className="login-input"
                placeholder="密码"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
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
              </Button>
            </div>

            {error && <div className="error-message" style={{ marginBottom: "16px" }}>{error}</div>}

            <Button
              type="submit"
              className="login-button login-button--primary"
              disabled={isLoading}
            >
              {isLoading ? "登录中..." : "登录"}
            </Button>
          </form>

          <div className="login-footer-links" style={{ marginTop: "24px" }}>
            <div className="footer-subtext">
              还没有账号？ <Link href="/signup" className="footer-link-bold">免费注册</Link>
            </div>
            <div className="footer-subtext">
              需要登录帮助？ <Link href="/reset-password" className="footer-link-bold">重置密码</Link>
            </div>
          </div>

          <div className="login-legal-text">
            通过使用 算力租赁，您承认我们收集并使用 <br />
            您的个人信息，如我们的 <span className="legal-link">隐私政策</span>中所述。
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
