"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface ProContextValue {
  isPro: boolean;
  loading: boolean;
  activate: (licenseKey: string) => Promise<{ success: boolean; error?: string }>;
  deactivate: () => Promise<void>;
}

const ProContext = createContext<ProContextValue>({
  isPro: false,
  loading: true,
  activate: async () => ({ success: false }),
  deactivate: async () => {},
});

export function useProStatus() {
  return useContext(ProContext);
}

export function ProProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    fetch("/api/auth/status")
      .then((res) => res.json())
      .then((data) => setIsPro(data.isPro === true))
      .catch(() => setIsPro(false))
      .finally(() => setLoading(false));
  }, []);

  const activate = useCallback(async (licenseKey: string) => {
    try {
      const res = await fetch("/api/auth/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Activation failed" };
      }

      setIsPro(true);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }, []);

  const deactivate = useCallback(async () => {
    await fetch("/api/auth/deactivate", { method: "POST" }).catch(() => {});
    setIsPro(false);
  }, []);

  return (
    <ProContext.Provider value={{ isPro, loading, activate, deactivate }}>
      {children}
    </ProContext.Provider>
  );
}
