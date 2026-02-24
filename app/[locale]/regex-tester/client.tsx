"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ToolLayout } from "@/components/tool-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { testRegex, REGEX_CHEAT_SHEET } from "@/lib/tools/regex";

const MAX_INPUT_SIZE = 5 * 1024 * 1024; // 5MB

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

  const inputSize = new Blob([testString]).size;
  const isOversize = inputSize > MAX_INPUT_SIZE;

  return (
    <ToolLayout toolKey="regexTester">
      {/* Pattern + Flags */}
      <div className="mb-4 flex gap-2">
        <div className="flex-1">
          <Input
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
            >
              {flag}
            </Button>
          ))}
        </div>
      </div>

      {/* Error */}
      {result.error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{result.error}</p>
        </div>
      )}

      {/* Test string */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium">{t("common.testString")}</label>
          {testString && (
            <span className={`text-xs ${isOversize ? "text-destructive" : "text-muted-foreground"}`}>
              {(inputSize / 1024).toFixed(1)} KB
            </span>
          )}
        </div>
        <Textarea
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
      <div className="mb-4">
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
                    <div key={item.pattern} className="flex gap-4 text-sm">
                      <code className="w-20 shrink-0 font-mono text-primary">
                        {item.pattern}
                      </code>
                      <span className="text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
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
