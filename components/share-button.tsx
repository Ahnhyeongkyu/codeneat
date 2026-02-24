"use client";

import { useState, useCallback } from "react";
import { Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { buildShareUrl, type ShareState } from "@/lib/share";

interface ShareButtonProps {
  getState: () => ShareState;
  className?: string;
}

export function ShareButton({ getState, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("common");

  const handleShare = useCallback(async () => {
    const state = getState();
    const url = buildShareUrl(state);
    if (!url) return;

    // Update URL hash without page reload
    window.history.replaceState(null, "", url);

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [getState]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className={className}
      aria-label={copied ? "Link copied" : "Share permalink"}
    >
      {copied ? (
        <>
          <Check className="mr-1 h-4 w-4 text-success" />
          {t("copied")}
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
