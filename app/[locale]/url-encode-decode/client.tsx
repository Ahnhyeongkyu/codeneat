"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { DownloadButton } from "@/components/download-button";
import { encodeUrl, decodeUrl, encodeFullUrl, decodeFullUrl } from "@/lib/tools/url-encode";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcut";
import { AiExplainButton, AiExplainPanel } from "@/components/ai-explain";

const MAX_INPUT_SIZE = 5 * 1024 * 1024; // 5MB

export default function UrlEncodeClient() {
  const t = useTranslations();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"component" | "full">("component");
  const [showAiPanel, setShowAiPanel] = useState(false);

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

  const URL_SAMPLE = "https://example.com/search?q=hello world&lang=한국어&page=1#results";
  const handleSample = useCallback(() => {
    setInput(URL_SAMPLE);
    const fn = mode === "component" ? encodeUrl : encodeFullUrl;
    const result = fn(URL_SAMPLE);
    setOutput(result.output);
    setError(result.error);
  }, [mode]);

  const shortcuts = useMemo(() => ({
    "ctrl+enter": handleEncode,
  }), [handleEncode]);
  useKeyboardShortcuts(shortcuts);

  const inputSize = useMemo(() => new TextEncoder().encode(input).length, [input]);
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
          aria-label="Encoding mode"
        >
          <option value="component">{t("common.encodeMode.component")}</option>
          <option value="full">{t("common.encodeMode.fullUrl")}</option>
        </select>
        <AiExplainButton onClick={() => setShowAiPanel(true)} disabled={!input.trim()} />
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={handleSample}>
          {t("common.sample")}
        </Button>
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
            <label htmlFor="url-input" className="text-sm font-medium">{t("common.input")}</label>
            {input && (
              <span className={`text-xs ${isOversize ? "text-destructive" : "text-muted-foreground"}`}>
                {(inputSize / 1024).toFixed(1)} KB
              </span>
            )}
          </div>
          <Textarea
            id="url-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("tools.urlEncode.inputPlaceholder")}
            className="min-h-[300px] font-mono text-sm"
          />
        </div>

        <div aria-live="polite">
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="url-output" className="text-sm font-medium">{t("common.output")}</label>
            {output && <div className="flex gap-1"><CopyButton text={output} /><DownloadButton text={output} filename="url-encoded.txt" /></div>}
          </div>
          {error ? (
            <div role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
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

      {showAiPanel && (
        <AiExplainPanel
          tool="urlEncoder"
          input={input}
          onClose={() => setShowAiPanel(false)}
        />
      )}
    </ToolLayout>
  );
}
