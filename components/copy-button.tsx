"use client";

import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("common");

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className={className}
    >
      {copied ? (
        <>
          <Check className="mr-1 h-4 w-4 text-success" />
          {t("copied")}
        </>
      ) : (
        <>
          <Copy className="mr-1 h-4 w-4" />
          {t("copy")}
        </>
      )}
    </Button>
  );
}
