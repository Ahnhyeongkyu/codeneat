"use client";

import { useState, useCallback, useMemo, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { DownloadButton } from "@/components/download-button";
import { Badge } from "@/components/ui/badge";
import { computeDiff, computeLineDiff, DIFF_SAMPLE, type DiffResult, type LineDiff } from "@/lib/tools/diff";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcut";

const MAX_INPUT_SIZE = 5 * 1024 * 1024; // 5MB

export default function DiffCheckerClient() {
  const t = useTranslations();
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [result, setResult] = useState<DiffResult | null>(null);
  const [diffView, setDiffView] = useState<"inline" | "side">("inline");
  const [lineDiffs, setLineDiffs] = useState<LineDiff[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleCompare = useCallback(() => {
    startTransition(() => {
      setResult(computeDiff(original, modified));
      setLineDiffs(computeLineDiff(original, modified));
    });
  }, [original, modified]);

  const handleClear = useCallback(() => {
    setOriginal("");
    setModified("");
    setResult(null);
  }, []);

  const handleSample = useCallback(() => {
    setOriginal(DIFF_SAMPLE.original);
    setModified(DIFF_SAMPLE.modified);
    setResult(computeDiff(DIFF_SAMPLE.original, DIFF_SAMPLE.modified));
    setLineDiffs(computeLineDiff(DIFF_SAMPLE.original, DIFF_SAMPLE.modified));
  }, []);

  const handleSwap = useCallback(() => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
    setResult(null);
    setLineDiffs([]);
  }, [original, modified]);

  const shortcuts = useMemo(() => ({
    "ctrl+enter": handleCompare,
  }), [handleCompare]);
  useKeyboardShortcuts(shortcuts);

  const originalSize = useMemo(() => new TextEncoder().encode(original).length, [original]);
  const originalOversize = originalSize > MAX_INPUT_SIZE;
  const modifiedSize = useMemo(() => new TextEncoder().encode(modified).length, [modified]);
  const modifiedOversize = modifiedSize > MAX_INPUT_SIZE;

  return (
    <ToolLayout toolKey="diffChecker">
      {/* Action bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button onClick={handleCompare} disabled={isPending}>
          {isPending ? t("common.loading") : t("tools.diffChecker.compare")}
        </Button>
        <div className="flex gap-1">
          <Button
            variant={diffView === "inline" ? "default" : "outline"}
            size="sm"
            onClick={() => setDiffView("inline")}
          >
            {t("tools.diffChecker.inline")}
          </Button>
          <Button
            variant={diffView === "side" ? "default" : "outline"}
            size="sm"
            onClick={() => setDiffView("side")}
          >
            {t("tools.diffChecker.sideBySide")}
          </Button>
        </div>
        <div className="flex-1" />
        {(original || modified) && (
          <Button variant="outline" size="sm" onClick={handleSwap}>
            {t("common.swap")}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleSample}>
          {t("common.sample")}
        </Button>
        <Button variant="outline" size="sm" onClick={handleClear}>
          {t("common.clear")}
        </Button>
      </div>

      {/* Input panels */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="diff-original" className="text-sm font-medium">
              {t("tools.diffChecker.original")}
            </label>
            {original && (
              <span className={`text-xs ${originalOversize ? "text-destructive" : "text-muted-foreground"}`}>
                {(originalSize / 1024).toFixed(1)} KB
              </span>
            )}
          </div>
          <Textarea
            id="diff-original"
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder={t("tools.diffChecker.originalPlaceholder")}
            className="min-h-[250px] font-mono text-sm"
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="diff-modified" className="text-sm font-medium">
              {t("tools.diffChecker.modified")}
            </label>
            {modified && (
              <span className={`text-xs ${modifiedOversize ? "text-destructive" : "text-muted-foreground"}`}>
                {(modifiedSize / 1024).toFixed(1)} KB
              </span>
            )}
          </div>
          <Textarea
            id="diff-modified"
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder={t("tools.diffChecker.modifiedPlaceholder")}
            className="min-h-[250px] font-mono text-sm"
          />
        </div>
      </div>

      {/* Result */}
      {result && (
        <div aria-live="polite">
          {/* Stats */}
          <div className="mb-4 flex gap-2">
            <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary">
              +{t("common.added", { count: result.stats.additions })}
            </Badge>
            <Badge variant="secondary" className="gap-1 bg-destructive/10 text-destructive">
              -{t("common.removed", { count: result.stats.deletions })}
            </Badge>
            <Badge variant="secondary">
              {t("common.unchanged", { count: result.stats.unchanged })}
            </Badge>
          </div>

          {diffView === "inline" ? (
            /* Inline diff */
            <div className="overflow-auto rounded-lg border bg-card p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {result.diffs.map((segment, i) => {
                  if (segment.type === "insert") {
                    return (
                      <span
                        key={i}
                        className="bg-primary/20 text-primary"
                      >
                        {segment.text}
                      </span>
                    );
                  }
                  if (segment.type === "delete") {
                    return (
                      <span
                        key={i}
                        className="bg-destructive/20 text-destructive line-through"
                      >
                        {segment.text}
                      </span>
                    );
                  }
                  return <span key={i}>{segment.text}</span>;
                })}
              </pre>
            </div>
          ) : (
            /* Side-by-Side diff */
            <div className="overflow-auto rounded-lg border">
              <div className="grid grid-cols-2 divide-x">
                {/* Left header */}
                <div className="bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                  {t("tools.diffChecker.original")}
                </div>
                {/* Right header */}
                <div className="bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                  {t("tools.diffChecker.modified")}
                </div>
              </div>
              <div className="divide-y">
                {lineDiffs.map((row, i) => (
                  <div key={i} className="grid grid-cols-2 divide-x font-mono text-sm">
                    <div
                      className={`flex ${
                        row.left.type === "delete"
                          ? "bg-destructive/10"
                          : row.left.type === "empty"
                            ? "bg-muted/30"
                            : ""
                      }`}
                    >
                      <span className="w-10 shrink-0 select-none border-r px-2 py-0.5 text-right text-xs text-muted-foreground">
                        {row.left.lineNo ?? ""}
                      </span>
                      <span
                        className={`flex-1 whitespace-pre-wrap px-2 py-0.5 ${
                          row.left.type === "delete" ? "text-destructive" : ""
                        }`}
                      >
                        {row.left.text}
                      </span>
                    </div>
                    <div
                      className={`flex ${
                        row.right.type === "insert"
                          ? "bg-primary/10"
                          : row.right.type === "empty"
                            ? "bg-muted/30"
                            : ""
                      }`}
                    >
                      <span className="w-10 shrink-0 select-none border-r px-2 py-0.5 text-right text-xs text-muted-foreground">
                        {row.right.lineNo ?? ""}
                      </span>
                      <span
                        className={`flex-1 whitespace-pre-wrap px-2 py-0.5 ${
                          row.right.type === "insert" ? "text-primary" : ""
                        }`}
                      >
                        {row.right.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
