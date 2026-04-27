"use client";

import { useCallback, useEffect, useState } from "react";
import { toErrorMessage } from "@/lib/format";

export function useAsyncResource<T>(
  loader: () => Promise<T>,
  options: { immediate?: boolean } = {},
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(options.immediate ?? true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await loader();
      setData(next);
      return next;
    } catch (err) {
      setError(toErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    if (options.immediate === false) return;
    void reload();
  }, [options.immediate, reload]);

  return { data, loading, error, reload, setData };
}
