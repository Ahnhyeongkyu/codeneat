"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import {
  generateHash,
  generateAllHashes,
  HASH_ALGORITHMS,
  type HashAlgorithm,
} from "@/lib/tools/hash";

export default function HashGeneratorClient() {
  const t = useTranslations();
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [singleHash, setSingleHash] = useState("");
  const [allHashes, setAllHashes] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    const result = await generateHash(input, algorithm);
    setSingleHash(result.hash);
    setAllHashes(null);
    setError(result.error);
  }, [input, algorithm]);

  const handleGenerateAll = useCallback(async () => {
    if (!input) return;
    const results = await generateAllHashes(input);
    setAllHashes(results);
    setSingleHash("");
    setError(null);
  }, [input]);

  const handleClear = useCallback(() => {
    setInput("");
    setSingleHash("");
    setAllHashes(null);
    setError(null);
  }, []);

  return (
    <ToolLayout toolKey="hashGenerator">
      {/* Action bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button onClick={handleGenerate}>{t("tools.hashGenerator.generate")}</Button>
        <Button variant="outline" onClick={handleGenerateAll}>
          Generate All
        </Button>

        {/* Algorithm selector */}
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as HashAlgorithm)}
          className="rounded-md border bg-background px-2 py-1.5 text-sm"
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
        <label className="mb-2 block text-sm font-medium">{t("common.input")}</label>
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
            <CopyButton text={singleHash} />
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
