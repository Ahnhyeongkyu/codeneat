"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X, RotateCcw, AlertCircle, Crown } from "lucide-react";
import { useProStatus } from "@/lib/pro-context";

interface AiExplainPanelProps {
  tool: string;
  input: string;
  onClose: () => void;
}

export function AiExplainButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  const t = useTranslations("common");
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="gap-1.5 border-emerald-600/30 text-emerald-600 hover:bg-emerald-600/10 hover:text-emerald-600 dark:border-emerald-400/30 dark:text-emerald-400 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-400"
      aria-label={t("aiExplain")}
    >
      <Sparkles className="h-4 w-4" />
      {t("aiExplain")}
    </Button>
  );
}

export function AiExplainPanel({ tool, input, onClose }: AiExplainPanelProps) {
  const t = useTranslations("common");
  const tPro = useTranslations("pro");
  const locale = useLocale();
  const { isPro } = useProStatus();
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<"loading" | "done" | "error" | "rate-limited">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchExplanation = useCallback(async () => {
    setResponse("");
    setStatus("loading");
    setErrorMessage("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, input, locale }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unknown error" }));
        if (res.status === 429) {
          setErrorMessage(data.error || t("aiDailyLimit"));
          setStatus("rate-limited");
          return;
        }
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let accumulated = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setResponse(accumulated);
      }

      setStatus("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }, [tool, input, locale]);

  useEffect(() => {
    fetchExplanation();
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchExplanation]);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  return (
    <div
      ref={panelRef}
      className="mt-4 rounded-lg border border-emerald-600/20 bg-emerald-50/50 p-4 dark:border-emerald-400/20 dark:bg-emerald-950/20"
      role="region"
      aria-label={t("aiExplain")}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {t("aiExplain")}
          </span>
          {status === "loading" && (
            <Badge variant="secondary" className="text-xs">
              {t("aiExplaining")}
            </Badge>
          )}
          {isPro && status !== "loading" && (
            <Badge variant="secondary" className="text-xs text-emerald-600 dark:text-emerald-400">
              Pro
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            abortRef.current?.abort();
            onClose();
          }}
          aria-label={t("aiClose")}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      {status === "rate-limited" && !isPro ? (
        <div className="flex items-start gap-2">
          <Crown className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-sm font-medium">{t("aiDailyLimit")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{tPro("upgradeHint")}</p>
          </div>
        </div>
      ) : status === "error" || status === "rate-limited" ? (
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div>
            <p className="text-sm text-destructive">{errorMessage}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchExplanation}
              className="mt-2 gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              {t("aiRetry")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="max-w-none">
          {status === "loading" && !response ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 w-3/4 rounded bg-emerald-600/10 dark:bg-emerald-400/10" />
              <div className="h-4 w-full rounded bg-emerald-600/10 dark:bg-emerald-400/10" />
              <div className="h-4 w-5/6 rounded bg-emerald-600/10 dark:bg-emerald-400/10" />
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
              {response}
            </div>
          )}
        </div>
      )}

      {/* Privacy notice */}
      <p className="mt-3 text-xs text-muted-foreground">
        {t("aiPrivacyNotice")}
      </p>
    </div>
  );
}
