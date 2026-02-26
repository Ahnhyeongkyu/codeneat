"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ToolLayout } from "@/components/tool-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { testRegex, REGEX_CHEAT_SHEET } from "@/lib/tools/regex";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcut";
import { CopyButton } from "@/components/copy-button";

const MAX_INPUT_SIZE = 5 * 1024 * 1024; // 5MB

const FLAG_LABELS: Record<string, string> = {
  g: "Global — find all matches",
  i: "Case insensitive",
  m: "Multiline — ^ and $ match line boundaries",
  s: "DotAll — dot matches newlines",
};

export default function RegexTesterClient() {
  const t = useTranslations();
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  const result = useMemo(
    () => testRegex(pattern, testString, flags),
    [pattern, testString, flags]
  );

  const highlightedText = useMemo(() => {
    if (!testString || !result.matches.length) return null;

    const segments: { text: string; highlighted: boolean }[] = [];
    let lastIndex = 0;

    for (const match of result.matches) {
      if (match.index > lastIndex) {
        segments.push({ text: testString.slice(lastIndex, match.index), highlighted: false });
      }
      segments.push({ text: match.match, highlighted: true });
      lastIndex = match.index + match.length;
    }
    if (lastIndex < testString.length) {
      segments.push({ text: testString.slice(lastIndex), highlighted: false });
    }

    return segments;
  }, [testString, result.matches]);

  const toggleFlag = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, "") : prev + flag
    );
  };

  const REGEX_SAMPLE = { pattern: "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", flags: "gi", test: "Contact us at support@example.com or sales@company.org for more info." };

  const handleSample = useCallback(() => {
    setPattern(REGEX_SAMPLE.pattern);
    setFlags(REGEX_SAMPLE.flags);
    setTestString(REGEX_SAMPLE.test);
  }, []);

  const handleCheatSheetClick = useCallback((pat: string) => {
    setPattern(pat);
  }, []);

  const shortcuts = useMemo(() => ({
    "ctrl+enter": () => {}, // Regex auto-matches; shortcut is no-op for consistency
  }), []);
  useKeyboardShortcuts(shortcuts);

  const inputSize = useMemo(() => new TextEncoder().encode(testString).length, [testString]);
  const isOversize = inputSize > MAX_INPUT_SIZE;

  return (
    <ToolLayout toolKey="regexTester">
      {/* Action bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex-1">
          <Input
            id="regex-pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder={t("tools.regexTester.patternPlaceholder")}
            className="font-mono"
          />
        </div>
        <div className="flex items-center gap-1">
          {["g", "i", "m", "s"].map((flag) => (
            <Button
              key={flag}
              variant={flags.includes(flag) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFlag(flag)}
              className="w-8 font-mono"
              aria-label={FLAG_LABELS[flag]}
              aria-pressed={flags.includes(flag)}
              title={FLAG_LABELS[flag]}
            >
              {flag}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={handleSample}>
          {t("common.sample")}
        </Button>
      </div>

      {/* Error */}
      {result.error && (
        <div role="alert" className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{result.error}</p>
        </div>
      )}

      {/* Test string */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="regex-test" className="text-sm font-medium">{t("common.testString")}</label>
          {testString && (
            <span className={`text-xs ${isOversize ? "text-destructive" : "text-muted-foreground"}`}>
              {(inputSize / 1024).toFixed(1)} KB
            </span>
          )}
        </div>
        <Textarea
          id="regex-test"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder={t("tools.regexTester.testStringPlaceholder")}
          className="min-h-[200px] font-mono text-sm"
        />
      </div>

      {/* Highlighted result */}
      {highlightedText && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">{t("common.highlighted")}</label>
          <div className="min-h-[100px] whitespace-pre-wrap rounded-lg border bg-card p-4 font-mono text-sm">
            {highlightedText.map((seg, i) =>
              seg.highlighted ? (
                <mark key={i} className="rounded bg-primary/20 px-0.5 text-foreground">
                  {seg.text}
                </mark>
              ) : (
                <span key={i}>{seg.text}</span>
              )
            )}
          </div>
        </div>
      )}

      {/* Matches */}
      <div className="mb-4" aria-live="polite">
        <div className="mb-2 flex items-center gap-2">
          <label className="text-sm font-medium">{t("tools.regexTester.matches")}</label>
          <Badge variant="secondary">{result.matches.length}</Badge>
        </div>
        {result.matches.length > 0 ? (
          <div className="space-y-2">
            {result.matches.map((match, i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-mono text-primary">{match.match}</span>
                  <span className="text-muted-foreground">
                    {t("common.index")}: {match.index}
                  </span>
                </div>
                {match.groups.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {match.groups.map((g, j) => (
                      <Badge key={j} variant="secondary" className="font-mono">
                        {g.name}: {g.value}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          testString && pattern && !result.error && (
            <p className="text-sm text-muted-foreground">
              {t("tools.regexTester.noMatch")}
            </p>
          )
        )}
      </div>

      {/* Cheat Sheet */}
      <div>
        <Button
          variant="outline"
          onClick={() => setShowCheatSheet(!showCheatSheet)}
        >
          {t("tools.regexTester.cheatSheet")}
        </Button>
        {showCheatSheet && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {REGEX_CHEAT_SHEET.map((category) => (
              <div key={category.category} className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">{category.category}</h3>
                <div className="space-y-1">
                  {category.items.map((item) => (
                    <button
                      key={item.pattern}
                      onClick={() => handleCheatSheetClick(item.pattern)}
                      className="flex w-full gap-4 rounded px-1 py-0.5 text-left text-sm hover:bg-accent"
                      title="Click to try"
                    >
                      <code className="w-20 shrink-0 font-mono text-primary">
                        {item.pattern}
                      </code>
                      <span className="text-muted-foreground">
                        {item.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
