"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/copy-button";
import { DownloadButton } from "@/components/download-button";
import { ShareButton } from "@/components/share-button";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcut";
import { readShareState } from "@/lib/share";
import {
  formatJson,
  minifyJson,
  validateJson,
  buildJsonTree,
  jsonToYaml,
  yamlToJson,
  jsonToCsv,
  highlightJson,
  queryJsonPath,
  JSON_SAMPLE,
  type JsonTreeNode,
  type HighlightToken,
} from "@/lib/tools/json";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, ChevronRight, ChevronDown, Upload } from "lucide-react";

const MAX_INPUT_SIZE = 5 * 1024 * 1024; // 5MB

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
          aria-expanded={expanded}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${node.key}`}
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
          ? "text-primary dark:text-primary"
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
  const [viewMode, setViewMode] = useState<"raw" | "tree" | "highlighted">("raw");
  const [tree, setTree] = useState<JsonTreeNode | null>(null);
  const [indent, setIndent] = useState<number | string>(2);
  const [highlightTokens, setHighlightTokens] = useState<HighlightToken[]>([]);
  const [jsonPath, setJsonPath] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore state from URL hash on mount
  useEffect(() => {
    const shared = readShareState();
    if (shared?.input) {
      setInput(shared.input);
      const result = formatJson(shared.input, indent);
      setOutput(result.output);
      setError(result.error);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getShareState = useCallback(() => ({ input }), [input]);

  const validation = useMemo(() => input.trim() ? validateJson(input) : null, [input]);

  const handleFormat = useCallback(() => {
    const result = formatJson(input, indent);
    setOutput(result.output);
    setError(result.error);
    setViewMode("raw");
  }, [input, indent]);

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
    const result = formatJson(JSON_SAMPLE, indent);
    setOutput(result.output);
    setError(null);
    setViewMode("raw");
  }, [indent]);

  const handleToYaml = useCallback(() => {
    const result = jsonToYaml(input);
    setOutput(result.output);
    setError(result.error);
    setViewMode("raw");
  }, [input]);

  const handleFromYaml = useCallback(() => {
    const result = yamlToJson(input, indent);
    setOutput(result.output);
    setError(result.error);
    setViewMode("raw");
  }, [input, indent]);

  const handleToCsv = useCallback(() => {
    const result = jsonToCsv(input);
    setOutput(result.output);
    setError(result.error);
    setViewMode("raw");
  }, [input]);

  const handleJsonPath = useCallback(() => {
    const result = queryJsonPath(input, jsonPath);
    setOutput(result.output);
    setError(result.error);
    setViewMode("raw");
  }, [input, jsonPath]);

  const handleHighlight = useCallback(() => {
    const result = formatJson(input, indent);
    if (result.error) {
      setError(result.error);
      setOutput("");
      setViewMode("raw");
    } else {
      setOutput(result.output);
      setHighlightTokens(highlightJson(result.output));
      setError(null);
      setViewMode("highlighted");
    }
  }, [input, indent]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_INPUT_SIZE) {
      setError(t("common.oversizeWarning"));
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
      const result = formatJson(text, indent);
      setOutput(result.output);
      setError(result.error);
      setViewMode("raw");
    };
    reader.readAsText(file);
    // Reset file input so same file can be re-uploaded
    e.target.value = "";
  }, [indent, t]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (!pasted.trim()) return;
    // Let the paste happen normally, then auto-format
    setTimeout(() => {
      const result = formatJson(pasted, indent);
      if (!result.error) {
        setOutput(result.output);
        setHighlightTokens(highlightJson(result.output));
        setError(null);
        setViewMode("highlighted");
      }
    }, 0);
  }, [indent]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
    setTree(null);
    setHighlightTokens([]);
  }, []);

  const shortcuts = useMemo(() => ({
    "ctrl+enter": handleFormat,
    "ctrl+shift+m": handleMinify,
  }), [handleFormat, handleMinify]);
  useKeyboardShortcuts(shortcuts);

  const inputSize = useMemo(() => new TextEncoder().encode(input).length, [input]);
  const isOversize = inputSize > MAX_INPUT_SIZE;

  return (
    <ToolLayout toolKey="jsonFormatter">
      {/* Action bar — row 1: core actions */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Button onClick={handleFormat}>{t("tools.jsonFormatter.format")}</Button>
        <Button variant="outline" onClick={handleMinify}>
          {t("tools.jsonFormatter.minify")}
        </Button>
        <Button variant="outline" onClick={handleTreeView}>
          {t("tools.jsonFormatter.treeView")}
        </Button>
        <Button variant="outline" onClick={handleHighlight}>
          {t("tools.jsonFormatter.syntaxHighlight")}
        </Button>
        <select
          value={indent}
          onChange={(e) => {
            const v = e.target.value;
            setIndent(v === "\t" ? "\t" : Number(v));
          }}
          className="rounded-md border bg-background px-2 py-1.5 text-sm"
          aria-label="Indentation"
        >
          <option value={2}>{t("common.indent.twoSpaces")}</option>
          <option value={4}>{t("common.indent.fourSpaces")}</option>
          <option value={"\t"}>{t("common.indent.tab")}</option>
        </select>
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={handleSample}>
          {t("common.sample")}
        </Button>
        <Button variant="outline" size="sm" onClick={handleClear}>
          {t("common.clear")}
        </Button>
      </div>

      {/* Action bar — row 2: conversions & upload & JSON Path */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleToYaml}>
          {t("tools.jsonFormatter.toYaml")}
        </Button>
        <Button variant="outline" size="sm" onClick={handleFromYaml}>
          {t("tools.jsonFormatter.fromYaml")}
        </Button>
        <Button variant="outline" size="sm" onClick={handleToCsv}>
          {t("tools.jsonFormatter.toCsv")}
        </Button>
        <div className="flex items-center gap-1">
          <Input
            value={jsonPath}
            onChange={(e) => setJsonPath(e.target.value)}
            placeholder={t("tools.jsonFormatter.jsonPathPlaceholder")}
            className="h-8 w-48 font-mono text-sm"
            aria-label="JSON Path"
          />
          <Button variant="outline" size="sm" onClick={handleJsonPath} disabled={!jsonPath}>
            {t("tools.jsonFormatter.queryPath")}
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.yaml,.yml,.csv,.txt"
          onChange={handleFileUpload}
          className="hidden"
          aria-label="Upload file"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-1 h-4 w-4" />
          {t("tools.jsonFormatter.uploadFile")}
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
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="json-input" className="text-sm font-medium">{t("common.input")}</label>
            {input && (
              <span className={`text-xs ${isOversize ? "text-destructive" : "text-muted-foreground"}`}>
                {(inputSize / 1024).toFixed(1)} KB
              </span>
            )}
          </div>
          {isOversize && (
            <p className="mb-2 text-xs text-destructive">
              {t("common.oversizeWarning")}
            </p>
          )}
          <Textarea
            id="json-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPaste={handlePaste}
            placeholder={t("tools.jsonFormatter.inputPlaceholder")}
            className="min-h-[400px] font-mono text-sm"
          />
        </div>

        {/* Output */}
        <div aria-live="polite">
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="json-output" className="text-sm font-medium">{t("common.output")}</label>
            <div className="flex gap-1">
              {input && <ShareButton getState={getShareState} />}
              {output && viewMode === "raw" && <><CopyButton text={output} /><DownloadButton text={output} filename="formatted.json" /></>}
            </div>
          </div>

          {error ? (
            <div role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : viewMode === "tree" && tree ? (
            <div className="min-h-[400px] overflow-auto rounded-lg border bg-card p-4">
              <TreeNode node={tree} />
            </div>
          ) : viewMode === "highlighted" && highlightTokens.length > 0 ? (
            <div className="min-h-[400px] overflow-auto rounded-lg border bg-card p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {highlightTokens.map((token, i) => {
                  const colorClass =
                    token.type === "key"
                      ? "text-primary"
                      : token.type === "string"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : token.type === "number"
                          ? "text-amber-600 dark:text-amber-400"
                          : token.type === "boolean"
                            ? "text-primary"
                            : token.type === "null"
                              ? "text-muted-foreground"
                              : token.type === "brace"
                                ? "text-foreground/70"
                                : "";
                  return colorClass ? (
                    <span key={i} className={colorClass}>{token.text}</span>
                  ) : (
                    <span key={i}>{token.text}</span>
                  );
                })}
              </pre>
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
