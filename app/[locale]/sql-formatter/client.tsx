"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { DownloadButton } from "@/components/download-button";
import {
  formatSql,
  minifySql,
  SQL_DIALECTS,
  SQL_SAMPLE,
  type SqlDialect,
} from "@/lib/tools/sql";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcut";

const MAX_INPUT_SIZE = 5 * 1024 * 1024; // 5MB

export default function SqlFormatterClient() {
  const t = useTranslations();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dialect, setDialect] = useState<SqlDialect>("sql");
  const [indent, setIndent] = useState<number>(2);
  const [keywordCase, setKeywordCase] = useState<"upper" | "lower" | "preserve">("upper");

  const handleFormat = useCallback(() => {
    const result = formatSql(input, dialect, indent, keywordCase);
    setOutput(result.output);
    setError(result.error);
  }, [input, dialect, indent, keywordCase]);

  const handleMinify = useCallback(() => {
    const result = minifySql(input);
    setOutput(result.output);
    setError(result.error);
  }, [input]);

  const handleSample = useCallback(() => {
    setInput(SQL_SAMPLE);
    const result = formatSql(SQL_SAMPLE, dialect, indent, keywordCase);
    setOutput(result.output);
    setError(null);
  }, [dialect, indent, keywordCase]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
  }, []);

  const shortcuts = useMemo(() => ({
    "ctrl+enter": handleFormat,
  }), [handleFormat]);
  useKeyboardShortcuts(shortcuts);

  const inputSize = new Blob([input]).size;
  const isOversize = inputSize > MAX_INPUT_SIZE;

  return (
    <ToolLayout toolKey="sqlFormatter">
      {/* Action bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button onClick={handleFormat}>{t("tools.sqlFormatter.format")}</Button>
        <Button variant="outline" onClick={handleMinify}>
          {t("tools.sqlFormatter.minify")}
        </Button>

        {/* Dialect selector */}
        <select
          value={dialect}
          onChange={(e) => setDialect(e.target.value as SqlDialect)}
          className="rounded-md border bg-background px-2 py-1.5 text-sm"
        >
          {SQL_DIALECTS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
        <select
          value={indent}
          onChange={(e) => setIndent(Number(e.target.value))}
          className="rounded-md border bg-background px-2 py-1.5 text-sm"
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
        </select>
        <select
          value={keywordCase}
          onChange={(e) => setKeywordCase(e.target.value as "upper" | "lower" | "preserve")}
          className="rounded-md border bg-background px-2 py-1.5 text-sm"
        >
          <option value="upper">UPPER</option>
          <option value="lower">lower</option>
          <option value="preserve">Preserve</option>
        </select>

        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={handleSample}>
          {t("common.sample")}
        </Button>
        <Button variant="outline" size="sm" onClick={handleClear}>
          {t("common.clear")}
        </Button>
      </div>

      {/* Input / Output */}
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
            placeholder={t("tools.sqlFormatter.inputPlaceholder")}
            className="min-h-[350px] font-mono text-sm"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">{t("common.output")}</label>
            {output && <div className="flex gap-1"><CopyButton text={output} /><DownloadButton text={output} filename="formatted.sql" /></div>}
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
              className="min-h-[350px] font-mono text-sm"
            />
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
