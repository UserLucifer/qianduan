"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAdminMe, type AdminMeResponse } from "@/api/admin";
import { AdminRole } from "@/types/enums";

interface AdminAuthContextType {
  admin: AdminMeResponse | null;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({ admin: null, loading: true });

export const useAdminAuth = () => useContext(AdminAuthContext);

// 基于角色的细粒度路由拦截规则
const roleRoutes: Record<string, AdminRole[]> = {
  "/admins/recharge": [AdminRole.SUPER_ADMIN, AdminRole.FINANCE],
  "/admins/withdraw": [AdminRole.SUPER_ADMIN, AdminRole.FINANCE],
  "/admins/config": [AdminRole.SUPER_ADMIN],
  "/admins/scheduler": [AdminRole.SUPER_ADMIN],
  "/admins/logs": [AdminRole.SUPER_ADMIN],
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminMeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/admins/login") {
      setLoading(false);
      return;
    }

    let mounted = true;
    getAdminMe()
      .then((res) => {
        if (mounted) {
          if (res.code === 200 || res.code === 0) {
            setAdmin(res.data);
            
            // 路由拦截 (Middleware)
            const requiredRoles = Object.entries(roleRoutes).find(([route]) => pathname.startsWith(route))?.[1];
            if (requiredRoles && !requiredRoles.includes(res.data.role as AdminRole)) {
              router.replace("/admins/dashboard"); // 没有权限，拦截并跳回首页
            }
          } else {
            router.replace("/admins/login");
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          router.replace("/admins/login");
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  if (loading && pathname !== "/admins/login") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--admin-bg, #08090a)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5e6ad2] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
