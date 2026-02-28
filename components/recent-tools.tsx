"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { getRecentTools } from "@/lib/recent-tools";
import { Clock, ArrowRight } from "lucide-react";
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

const toolMeta: Record<string, { href: string; icon: typeof Braces }> = {
  jsonFormatter: { href: "/json-formatter", icon: Braces },
  base64: { href: "/base64-encode-decode", icon: Binary },
  urlEncode: { href: "/url-encode-decode", icon: Link2 },
  regexTester: { href: "/regex-tester", icon: Regex },
  diffChecker: { href: "/diff-checker", icon: GitCompare },
  jwtDecoder: { href: "/jwt-decoder", icon: KeyRound },
  sqlFormatter: { href: "/sql-formatter", icon: Database },
  hashGenerator: { href: "/hash-generator", icon: Hash },
};

export function RecentTools() {
  const t = useTranslations();
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(getRecentTools());
  }, []);

  if (recent.length === 0) return null;

  return (
    <section className="py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{t("home.recentTools")}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((key) => {
            const meta = toolMeta[key];
            if (!meta) return null;
            const Icon = meta.icon;
            return (
              <Link
                key={key}
                href={meta.href}
                className="group flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium group-hover:text-primary">
                  {t(`tools.${key}.title`)}
                </span>
                <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground/0 transition-colors group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
