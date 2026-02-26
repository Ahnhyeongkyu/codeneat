"use client";

import { ReactNode, useState, useEffect } from "react";
import { PrivacyBadge } from "@/components/privacy-badge";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Braces,
  Binary,
  Link2,
  Regex,
  GitCompare,
  KeyRound,
  Database,
  Hash,
} from "lucide-react";

const allTools = [
  { href: "/json-formatter", key: "jsonFormatter", icon: Braces },
  { href: "/base64-encode-decode", key: "base64", icon: Binary },
  { href: "/url-encode-decode", key: "urlEncode", icon: Link2 },
  { href: "/regex-tester", key: "regexTester", icon: Regex },
  { href: "/diff-checker", key: "diffChecker", icon: GitCompare },
  { href: "/jwt-decoder", key: "jwtDecoder", icon: KeyRound },
  { href: "/sql-formatter", key: "sqlFormatter", icon: Database },
  { href: "/hash-generator", key: "hashGenerator", icon: Hash },
] as const;

// Semantic relevance mapping: each tool maps to its most related tools (by use case)
const relatedToolMap: Record<string, string[]> = {
  jsonFormatter: ["diffChecker", "sqlFormatter", "base64"],
  base64: ["urlEncode", "hashGenerator", "jwtDecoder"],
  urlEncode: ["base64", "hashGenerator", "regexTester"],
  regexTester: ["diffChecker", "jsonFormatter", "sqlFormatter"],
  diffChecker: ["jsonFormatter", "sqlFormatter", "regexTester"],
  jwtDecoder: ["base64", "hashGenerator", "jsonFormatter"],
  sqlFormatter: ["jsonFormatter", "diffChecker", "regexTester"],
  hashGenerator: ["base64", "jwtDecoder", "urlEncode"],
};

interface ToolLayoutProps {
  toolKey: string;
  children: ReactNode;
}

function ShortcutHint() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(navigator.platform?.toLowerCase().includes("mac") || navigator.userAgent?.includes("Mac"));
  }, []);
  return (
    <span className="hidden text-xs text-muted-foreground sm:inline">
      <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">{isMac ? "\u2318" : "Ctrl"}</kbd>
      {" + "}
      <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd>
      {" to run"}
    </span>
  );
}

export function ToolLayout({ toolKey, children }: ToolLayoutProps) {
  const t = useTranslations();
  const relatedKeys = relatedToolMap[toolKey] ?? [];
  const relatedTools = relatedKeys
    .map((key) => allTools.find((tool) => tool.key === key))
    .filter(Boolean) as typeof allTools[number][];

  const faqKeys = ["q1", "q2", "q3", "q4", "q5"] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          {t("nav.home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">
          {t(`tools.${toolKey}.title`)}
        </span>
      </nav>

      {/* Title + Badge */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t(`tools.${toolKey}.title`)}
        </h1>
        <p className="text-muted-foreground">
          {t(`tools.${toolKey}.description`)}
        </p>
        <div className="flex items-center gap-4">
          <PrivacyBadge />
          <ShortcutHint />
        </div>
      </div>

      {/* Tool Content */}
      <div className="mb-12">{children}</div>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">
          {t("common.faq")}
        </h2>
        <div className="space-y-4">
          {faqKeys.map((qKey) => (
            <div key={qKey} className="rounded-lg border p-6">
              <h3 className="font-semibold">
                {t(`tools.${toolKey}.faq.${qKey}`)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`tools.${toolKey}.faq.${qKey.replace("q", "a")}`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("common.relatedTools")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {relatedTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.key}
                href={tool.href}
                className="group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                <Icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium group-hover:text-primary">
                    {t(`tools.${tool.key}.title`)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t(`tools.${tool.key}.shortDescription`)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
