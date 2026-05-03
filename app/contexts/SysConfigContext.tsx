"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAdminSysConfigs } from "@/api/admin";

interface SysConfigState {
  configs: Record<string, string>;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getConfig: (key: string, fallback?: string) => string;
}

const SysConfigContext = createContext<SysConfigState | null>(null);

export function SysConfigProvider({ children }: { children: ReactNode }) {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all configs, max 100 for global usage
      const res = await getAdminSysConfigs({ pageNo: 1, pageSize: 100 });
      const map: Record<string, string> = {};
      res.data.records.forEach((c) => {
        map[c.configKey] = c.configValue;
      });
      setConfigs(map);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load system configurations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchConfigs();
  }, []);

  const getConfig = (key: string, fallback: string = ""): string => {
    return configs[key] ?? fallback;
  };

  return (
    <SysConfigContext.Provider value={{ configs, loading, error, refresh: fetchConfigs, getConfig }}>
      {children}
    </SysConfigContext.Provider>
  );
}

export function useSysConfig() {
  const ctx = useContext(SysConfigContext);
  if (!ctx) {
    throw new Error("useSysConfig must be used within a SysConfigProvider");
  }
  return ctx;
}
