"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { encodeBase64, decodeBase64 } from "@/lib/tools/base64";

export default function Base64Client() {
  const t = useTranslations();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleEncode = useCallback(() => {
    const result = encodeBase64(input);
    setOutput(result.output);
    setError(result.error);
  }, [input]);

  const handleDecode = useCallback(() => {
    const result = decodeBase64(input);
    setOutput(result.output);
    setError(result.error);
  }, [input]);

  const handleSwap = useCallback(() => {
    setInput(output);
    setOutput("");
    setError(null);
  }, [output]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
  }, []);

  return (
    <ToolLayout toolKey="base64">
      {/* Action bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button onClick={handleEncode}>{t("tools.base64.encode")}</Button>
        <Button variant="outline" onClick={handleDecode}>
          {t("tools.base64.decode")}
        </Button>
        <div className="flex-1" />
        {output && (
          <Button variant="outline" size="sm" onClick={handleSwap}>
            Swap
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleClear}>
          {t("common.clear")}
        </Button>
      </div>

      {/* Input / Output */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">{t("common.input")}</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("tools.base64.inputPlaceholder")}
            className="min-h-[300px] font-mono text-sm"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">{t("common.output")}</label>
            {output && <CopyButton text={output} />}
          </div>
          {error ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : (
            <Textarea
              value={output}
              readOnly
              placeholder={t("common.output")}
              className="min-h-[300px] font-mono text-sm"
            />
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
