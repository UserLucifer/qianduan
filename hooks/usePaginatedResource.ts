"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PageResult } from "@/api/types";
import { toErrorMessage } from "@/lib/format";

export function usePaginatedResource<T, P extends { pageNo?: number; pageSize?: number }>(
  loader: (params: P) => Promise<PageResult<T>>,
  initialParams: P,
) {
  const [params, setParams] = useState<P>(initialParams);
  const [page, setPage] = useState<PageResult<T>>({
    records: [],
    total: 0,
    pageNo: initialParams.pageNo ?? 1,
    pageSize: initialParams.pageSize ?? 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  const reload = useCallback(async (nextParams: P = params) => {
    setLoading(true);
    setError(null);
    try {
      const next = await loader(nextParams);
      setPage(next);
      return next;
    } catch (err) {
      setError(toErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [loader, params]);

  const updateParams = useCallback((next: P) => {
    setParams(next);
    void reload(next);
  }, [reload]);

  const changePage = useCallback((pageNo: number) => {
    const next = { ...params, pageNo } as P;
    setParams(next);
    void reload(next);
  }, [params, reload]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    void reload(initialParams);
  }, [initialParams, reload]);

  return {
    page,
    params,
    loading,
    error,
    reload,
    updateParams,
    changePage,
  };
}
