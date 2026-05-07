"use client";

import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { adminLogin } from "@/api/admin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toErrorMessage } from "@/lib/format";

export default function AdminLoginPage() {
  const t = useTranslations("AdminPages.login");
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminLogin({ userName, password });
      localStorage.setItem("admin_access_token", res.data.adminAccessToken);
      router.push("/admins/dashboard");
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t("adminLogin")}</CardTitle>
              <CardDescription>
                {t("signInWithYourAdminAccountAndPassword")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="flex w-full flex-col gap-2">
                    <Label htmlFor="admin-username">{t("adminAccount")}</Label>
                    <Input
                      id="admin-username"
                      value={userName}
                      onChange={(event) => setUserName(event.target.value)}
                      placeholder={t("enterTheAdminAccount")}
                      autoComplete="username"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <Label htmlFor="admin-password">{t("password")}</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {error ? (
                    <p className="text-sm text-destructive">{error}</p>
                  ) : null}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t("signingIn") : t("login")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
