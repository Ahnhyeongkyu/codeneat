"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { computeDiff, type DiffResult } from "@/lib/tools/diff";

export default function DiffCheckerClient() {
  const t = useTranslations();
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [result, setResult] = useState<DiffResult | null>(null);

  const handleCompare = useCallback(() => {
    setResult(computeDiff(original, modified));
  }, [original, modified]);

  const handleClear = useCallback(() => {
    setOriginal("");
    setModified("");
    setResult(null);
  }, []);

  return (
    <ToolLayout toolKey="diffChecker">
      {/* Action bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button onClick={handleCompare}>{t("tools.diffChecker.compare")}</Button>
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={handleClear}>
          {t("common.clear")}
        </Button>
      </div>

      {/* Input panels */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            {t("tools.diffChecker.original")}
          </label>
          <Textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder={t("tools.diffChecker.originalPlaceholder")}
            className="min-h-[250px] font-mono text-sm"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">
            {t("tools.diffChecker.modified")}
          </label>
          <Textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder={t("tools.diffChecker.modifiedPlaceholder")}
            className="min-h-[250px] font-mono text-sm"
          />
        </div>
      </div>

      {/* Result */}
      {result && (
        <div>
          {/* Stats */}
          <div className="mb-4 flex gap-2">
            <Badge variant="secondary" className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              +{result.stats.additions} added
            </Badge>
            <Badge variant="secondary" className="gap-1 bg-red-500/10 text-red-600 dark:text-red-400">
              -{result.stats.deletions} removed
            </Badge>
            <Badge variant="secondary">
              {result.stats.unchanged} unchanged
            </Badge>
          </div>

          {/* Inline diff */}
          <div className="overflow-auto rounded-lg border bg-card p-4">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {result.diffs.map((segment, i) => {
                if (segment.type === "insert") {
                  return (
                    <span
                      key={i}
                      className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                    >
                      {segment.text}
                    </span>
                  );
                }
                if (segment.type === "delete") {
                  return (
                    <span
                      key={i}
                      className="bg-red-500/20 text-red-700 line-through dark:text-red-300"
                    >
                      {segment.text}
                    </span>
                  );
                }
                return <span key={i}>{segment.text}</span>;
              })}
            </pre>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
