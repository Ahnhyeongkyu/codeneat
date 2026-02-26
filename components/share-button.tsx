"use client";

import { useState, useCallback } from "react";
import { Link2, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { buildShareUrl, type ShareState } from "@/lib/share";

interface ShareButtonProps {
  getState: () => ShareState;
  className?: string;
}

export function ShareButton({ getState, className }: ShareButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "tooLarge">("idle");
  const t = useTranslations("common");

  const handleShare = useCallback(async () => {
    const state = getState();
    const url = buildShareUrl(state);
    if (!url) {
      setStatus("tooLarge");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    window.history.replaceState(null, "", url);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setStatus("copied");
    setTimeout(() => setStatus("idle"), 2000);
  }, [getState]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className={className}
      aria-label={status === "copied" ? "Link copied" : status === "tooLarge" ? "Input too large to share" : "Share permalink"}
    >
      {status === "copied" ? (
        <>
          <Check className="mr-1 h-4 w-4 text-success" />
          {t("copied")}
        </>
      ) : status === "tooLarge" ? (
        <>
          <AlertTriangle className="mr-1 h-4 w-4 text-destructive" />
          {t("shareTooLarge")}
        </>
      ) : (
        <>
          <Link2 className="mr-1 h-4 w-4" />
          {t("share")}
        </>
      )}
    </Button>
  );
}
