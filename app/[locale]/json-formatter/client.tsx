"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/copy-button";
import {
  formatJson,
  minifyJson,
  validateJson,
  buildJsonTree,
  JSON_SAMPLE,
  type JsonTreeNode,
} from "@/lib/tools/json";
import { AlertCircle, CheckCircle2, ChevronRight, ChevronDown } from "lucide-react";

function TreeNode({ node, depth = 0 }: { node: JsonTreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);

  if (node.type === "object" || node.type === "array") {
    const label =
      node.type === "object"
        ? `{${node.children.length}}`
        : `[${(node as { length: number }).length}]`;
    return (
      <div style={{ paddingLeft: depth * 16 }}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-sm hover:text-primary"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="font-medium text-foreground">{node.key}</span>
          <span className="text-muted-foreground">{label}</span>
        </button>
        {expanded && node.children.map((child, i) => (
          <TreeNode key={i} node={child} depth={depth + 1} />
        ))}
      </div>
    );
  }

  const valueColor =
    node.type === "string"
      ? "text-emerald-600 dark:text-emerald-400"
      : node.type === "number"
        ? "text-amber-600 dark:text-amber-400"
        : node.type === "boolean"
          ? "text-sky-600 dark:text-sky-400"
          : "text-muted-foreground";

  const displayValue =
    node.type === "string"
      ? `"${node.value}"`
      : node.type === "null"
        ? "null"
        : String((node as { value: string | number | boolean }).value);

  return (
    <div style={{ paddingLeft: depth * 16 }} className="flex items-center gap-2 py-0.5 text-sm">
      <span className="font-medium text-foreground">{node.key}:</span>
      <span className={valueColor}>{displayValue}</span>
    </div>
  );
}

export default function JsonFormatterClient() {
  const t = useTranslations();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"raw" | "tree">("raw");
  const [tree, setTree] = useState<JsonTreeNode | null>(null);

  const validation = input.trim() ? validateJson(input) : null;

  const handleFormat = useCallback(() => {
    const result = formatJson(input);
    setOutput(result.output);
    setError(result.error);
    setViewMode("raw");
  }, [input]);

  const handleMinify = useCallback(() => {
    const result = minifyJson(input);
    setOutput(result.output);
    setError(result.error);
    setViewMode("raw");
  }, [input]);

  const handleTreeView = useCallback(() => {
    const result = buildJsonTree(input);
    setTree(result.tree);
    setError(result.error);
    setViewMode("tree");
  }, [input]);

  const handleSample = useCallback(() => {
    setInput(JSON_SAMPLE);
    const result = formatJson(JSON_SAMPLE);
    setOutput(result.output);
    setError(null);
    setViewMode("raw");
  }, []);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
    setTree(null);
  }, []);

  return (
    <ToolLayout toolKey="jsonFormatter">
      {/* Action bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button onClick={handleFormat}>{t("tools.jsonFormatter.format")}</Button>
        <Button variant="outline" onClick={handleMinify}>
          {t("tools.jsonFormatter.minify")}
        </Button>
        <Button
          variant="outline"
          onClick={handleTreeView}
        >
          {t("tools.jsonFormatter.treeView")}
        </Button>
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={handleSample}>
          {t("common.sample")}
        </Button>
        <Button variant="outline" size="sm" onClick={handleClear}>
          {t("common.clear")}
        </Button>
      </div>

      {/* Validation badge */}
      {validation && (
        <div className="mb-4">
          {validation.valid ? (
            <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary">
              <CheckCircle2 className="h-4 w-4" />
              {t("common.validJson")}
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-4 w-4" />
              {validation.error}
            </Badge>
          )}
        </div>
      )}

      {/* Input / Output */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <div>
          <label className="mb-2 block text-sm font-medium">{t("common.input")}</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("tools.jsonFormatter.inputPlaceholder")}
            className="min-h-[400px] font-mono text-sm"
          />
        </div>

        {/* Output */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">{t("common.output")}</label>
            {output && viewMode === "raw" && <CopyButton text={output} />}
          </div>

          {error && viewMode === "raw" ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : viewMode === "tree" && tree ? (
            <div className="min-h-[400px] overflow-auto rounded-lg border bg-card p-4">
              <TreeNode node={tree} />
            </div>
          ) : (
            <Textarea
              value={output}
              readOnly
              placeholder={t("common.output")}
              className="min-h-[400px] font-mono text-sm"
            />
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
