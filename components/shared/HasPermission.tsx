"use client";

import type { ReactNode } from "react";
import { useAdminAuth } from "@/app/contexts/AdminAuthContext";
import type { AdminRole } from "@/types/enums";

interface HasPermissionProps {
  role: AdminRole | AdminRole[] | string | string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function HasPermission({ role, children, fallback = null }: HasPermissionProps) {
  const { admin, loading } = useAdminAuth();

  if (loading || !admin) return <>{fallback}</>;

  const requiredRoles = Array.isArray(role) ? role : [role];
  const hasAuth = requiredRoles.includes(admin.role);

  return hasAuth ? <>{children}</> : <>{fallback}</>;
}
