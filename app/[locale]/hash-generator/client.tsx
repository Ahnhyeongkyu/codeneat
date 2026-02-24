"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { DownloadButton } from "@/components/download-button";
import {
  generateHash,
  generateAllHashes,
  HASH_ALGORITHMS,
  type HashAlgorithm,
} from "@/lib/tools/hash";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcut";

const MAX_INPUT_SIZE = 5 * 1024 * 1024; // 5MB

export default function HashGeneratorClient() {
  const t = useTranslations();
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [singleHash, setSingleHash] = useState("");
  const [allHashes, setAllHashes] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-generate hash on input change
  useEffect(() => {
    if (!input) {
      setSingleHash("");
      setAllHashes(null);
      return;
    }
    let cancelled = false;
    generateHash(input, algorithm).then((result) => {
      if (!cancelled) {
        setSingleHash(result.hash);
        setError(result.error);
      }
    });
    return () => { cancelled = true; };
  }, [input, algorithm]);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    const result = await generateHash(input, algorithm);
    setSingleHash(result.hash);
    setAllHashes(null);
    setError(result.error);
    setLoading(false);
  }, [input, algorithm]);

  const handleGenerateAll = useCallback(async () => {
    if (!input) return;
    setLoading(true);
    const results = await generateAllHashes(input);
    setAllHashes(results);
    setSingleHash("");
    setError(null);
    setLoading(false);
  }, [input]);

  const handleClear = useCallback(() => {
    setInput("");
    setSingleHash("");
    setAllHashes(null);
    setError(null);
  }, []);

  const shortcuts = useMemo(() => ({
    "ctrl+enter": handleGenerate,
  }), [handleGenerate]);
  useKeyboardShortcuts(shortcuts);

  const inputSize = new Blob([input]).size;
  const isOversize = inputSize > MAX_INPUT_SIZE;

  return (
    <ToolLayout toolKey="hashGenerator">
      {/* Action bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? t("common.loading") : t("tools.hashGenerator.generate")}
        </Button>
        <Button variant="outline" onClick={handleGenerateAll}>
          {t("common.generateAll")}
        </Button>

        {/* Algorithm selector */}
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as HashAlgorithm)}
          className="rounded-md border bg-background px-2 py-1.5 text-sm"
          aria-label="Hash algorithm"
        >
          {HASH_ALGORITHMS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>

        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={handleClear}>
          {t("common.clear")}
        </Button>
      </div>

      {/* Input */}
      <div className="mb-6">
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
          placeholder={t("tools.hashGenerator.inputPlaceholder")}
          className="min-h-[200px] font-mono text-sm"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Single hash result */}
      {singleHash && (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">
              {algorithm} {t("tools.hashGenerator.result")}
            </label>
            <div className="flex gap-1"><CopyButton text={singleHash} /><DownloadButton text={singleHash} filename="hash.txt" /></div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="break-all font-mono text-sm">{singleHash}</p>
          </div>
        </div>
      )}

      {/* All hashes result */}
      {allHashes && (
        <div className="space-y-4">
          {HASH_ALGORITHMS.map((algo) => (
            <div key={algo.value}>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium">{algo.label}</label>
                <CopyButton text={allHashes[algo.value]} />
              </div>
              <div className="rounded-lg border bg-card p-4">
                <p className="break-all font-mono text-sm">{allHashes[algo.value]}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
