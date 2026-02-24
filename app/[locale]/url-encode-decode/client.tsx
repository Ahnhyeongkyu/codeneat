"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { encodeUrl, decodeUrl, encodeFullUrl, decodeFullUrl } from "@/lib/tools/url-encode";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcut";

const MAX_INPUT_SIZE = 5 * 1024 * 1024; // 5MB

export default function UrlEncodeClient() {
  const t = useTranslations();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"component" | "full">("component");

  const handleEncode = useCallback(() => {
    const fn = mode === "component" ? encodeUrl : encodeFullUrl;
    const result = fn(input);
    setOutput(result.output);
    setError(result.error);
  }, [input, mode]);

  const handleDecode = useCallback(() => {
    const fn = mode === "component" ? decodeUrl : decodeFullUrl;
    const result = fn(input);
    setOutput(result.output);
    setError(result.error);
  }, [input, mode]);

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

  const shortcuts = useMemo(() => ({
    "ctrl+enter": handleEncode,
  }), [handleEncode]);
  useKeyboardShortcuts(shortcuts);

  const inputSize = new Blob([input]).size;
  const isOversize = inputSize > MAX_INPUT_SIZE;

  return (
    <ToolLayout toolKey="urlEncode">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button onClick={handleEncode}>{t("tools.urlEncode.encode")}</Button>
        <Button variant="outline" onClick={handleDecode}>
          {t("tools.urlEncode.decode")}
        </Button>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "component" | "full")}
          className="rounded-md border bg-background px-2 py-1.5 text-sm"
        >
          <option value="component">Component</option>
          <option value="full">Full URL</option>
        </select>
        <div className="flex-1" />
        {output && (
          <Button variant="outline" size="sm" onClick={handleSwap}>
            {t("common.swap")}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleClear}>
          {t("common.clear")}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">{t("common.input")}</label>
            {input && (
              <span className={`text-xs ${isOversize ? "text-destructive" : "text-muted-foreground"}`}>
                {(inputSize / 1024).toFixed(1)} KB
              </span>
            )}
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("tools.urlEncode.inputPlaceholder")}
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
