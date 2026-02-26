import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Zap,
  Gift,
  Palette,
  Braces,
  Binary,
  Link2,
  Regex,
  GitCompare,
  KeyRound,
  Database,
  Hash,
  ArrowRight,
} from "lucide-react";

const tools = [
  { href: "/json-formatter", key: "jsonFormatter", icon: Braces },
  { href: "/base64-encode-decode", key: "base64", icon: Binary },
  { href: "/url-encode-decode", key: "urlEncode", icon: Link2 },
  { href: "/regex-tester", key: "regexTester", icon: Regex },
  { href: "/diff-checker", key: "diffChecker", icon: GitCompare },
  { href: "/jwt-decoder", key: "jwtDecoder", icon: KeyRound },
  { href: "/sql-formatter", key: "sqlFormatter", icon: Database },
  { href: "/hash-generator", key: "hashGenerator", icon: Hash },
] as const;

const features = [
  { key: "privacy", icon: Shield },
  { key: "fast", icon: Zap },
  { key: "free", icon: Gift },
  { key: "modern", icon: Palette },
] as const;

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CodeNeat",
  url: "https://codeneat.dev",
  description:
    "Free online developer tools. Privacy-first — your data never leaves your browser.",
};

const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is CodeNeat really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! All developer tools are completely free to use with no sign-up required.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. All data processing happens entirely in your browser. We never send your code or data to any server.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, once loaded, most tools work without an internet connection since all processing is client-side.",
      },
    },
    {
      "@type": "Question",
      name: "What tools are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer JSON Formatter, Base64 Encoder/Decoder, URL Encoder/Decoder, Regex Tester, Diff Checker, JWT Decoder, SQL Formatter, and Hash Generator — with more coming soon.",
      },
    },
  ],
};

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />
      {/* Hero — 단색 배경 (그라디언트 금지) */}
      <section className="border-b bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Badge
            variant="secondary"
            className="mb-6 gap-2 bg-success/10 text-success"
          >
            <Shield className="h-4 w-4" />
            {t("home.hero.badge")}
          </Badge>

          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("home.hero.title")}
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            {t("home.hero.subtitle")}
          </p>

          <Button asChild size="lg" className="gap-2">
            <a href="#tools">
              {t("home.hero.cta")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold">
              {t("home.tools.title")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t("home.tools.subtitle")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.key}
                  href={tool.href}
                  className="group relative flex flex-col gap-4 rounded-xl border bg-card p-6 transition-colors hover:border-primary/30 hover:shadow-sm"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary">
                      {t(`tools.${tool.key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t(`tools.${tool.key}.shortDescription`)}
                    </p>
                  </div>
                  <ArrowRight className="absolute right-4 top-6 h-4 w-4 text-muted-foreground/0 transition-colors group-hover:text-primary" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-2xl font-semibold">
            {t("home.features.title")}
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.key}
                  className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">
                    {t(`home.features.${feature.key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`home.features.${feature.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-2xl font-semibold">
            {t("home.faq.title")}
          </h2>

          <div className="space-y-6">
            {(["q1", "q2", "q3", "q4"] as const).map((qKey) => (
              <div key={qKey} className="rounded-lg border p-6">
                <h3 className="font-semibold">
                  {t(`home.faq.${qKey}`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(
                    `home.faq.${qKey.replace("q", "a") as "a1" | "a2" | "a3" | "a4"}`
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
