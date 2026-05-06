"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import LogoCarousel from "@/components/marketing/LogoCarousel";
import Image from "next/image";
import "./login.css";
import { loginWithPassword } from "@/api/auth";
import { toErrorMessage, translateErrorMessage } from "@/lib/format";
import { getUserAccessToken, setUserAccessToken } from "@/lib/auth-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Auth.login");
  const common = useTranslations("Common");
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
        setUserAccessToken(res.data.accessToken);
        router.push("/dashboard");
      } else {
        setError(res?.message ? translateErrorMessage(res.message, locale) : t("errors.loginFailed"));
      }
    } catch (err) {
      setError(toErrorMessage(err, locale));
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    const token = getUserAccessToken();
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
          <span className="login-brand-name">{common("brand")}</span>
        </div>

        <div className="login-form-container">
          <h1 className="login-title">{t("title")}</h1>
          <p className="login-subtitle">{t("subtitle")}</p>

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
                placeholder={t("passwordPlaceholder")}
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
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
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
              {isLoading ? t("submitting") : t("submit")}
            </Button>
          </form>

          <div className="login-footer-links" style={{ marginTop: "24px" }}>
            <div className="footer-subtext">
              {t("noAccount")} <Link href="/signup" className="footer-link-bold">{t("signUp")}</Link>
            </div>
            <div className="footer-subtext">
              {t("needHelp")} <Link href="/reset-password" className="footer-link-bold">{t("resetPassword")}</Link>
            </div>
          </div>

          <div className="login-legal-text">
            {t("legalPrefix", { brand: common("brand") })} <br />
            {t("legalSuffixBefore")} <Link href="/privacy" className="legal-link">{t("privacyPolicy")}</Link>{t("legalSuffixAfter")}
          </div>
        </div>
      </div>

      {/* Right Column: Showcase */}
      <div className="login-right">
        <div className="login-right-illustration">
          <Image
            className="login-right-image"
            src="/images/retool-blocks-login-door.jpg"
            alt={t("imageAlt")}
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
