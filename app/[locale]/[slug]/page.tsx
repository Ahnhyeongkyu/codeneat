import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Shield, ArrowRight, Lightbulb, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getPseoPage,
  getComparisonPage,
  getAllSlugs,
  type PseoPage,
  type ComparisonPage,
} from "@/lib/pseo-data";
import { routing } from "@/i18n/routing";

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pseo = getPseoPage(slug);
  const comp = getComparisonPage(slug);
  const page = pseo || comp;
  if (!page) return {};

  const url = `https://codeneat.dev/${slug}`;
  return {
    title: page.title,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${page.title} | CodeNeat`,
      description: page.metaDescription,
      url,
      type: "website",
      siteName: "CodeNeat",
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | CodeNeat`,
      description: page.metaDescription,
    },
  };
}

function buildBreadcrumb(page: PseoPage | ComparisonPage) {
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://codeneat.dev" },
  ];
  if ("parentTool" in page) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: page.parentTool.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      item: `https://codeneat.dev/${page.parentTool}`,
    });
    items.push({ "@type": "ListItem", position: 3, name: page.h1, item: `https://codeneat.dev/${page.slug}` });
  } else {
    items.push({ "@type": "ListItem", position: 2, name: page.h1, item: `https://codeneat.dev/${page.slug}` });
  }
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
}

function buildFaq(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// ─── pSEO Page ───
function PseoContent({ page }: { page: PseoPage }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/${page.parentTool}` as never} className="hover:text-foreground">
          {page.parentTool.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{page.h1}</span>
      </nav>

      {/* Header */}
      <h1 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">{page.h1}</h1>
      <Badge variant="secondary" className="mb-6 gap-1.5 bg-success/10 text-success">
        <Shield className="h-3.5 w-3.5" />
        Your data never leaves your browser
      </Badge>

      {/* Intro */}
      <p className="mb-8 text-muted-foreground leading-relaxed">{page.intro}</p>

      {/* Example */}
      <div className="mb-8 rounded-lg border bg-muted/30 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Example</h2>
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-relaxed">{page.exampleInput}</pre>
      </div>

      {/* CTA */}
      <div className="mb-10 flex justify-center">
        <Button asChild size="lg" className="gap-2">
          <Link href={`/${page.parentTool}` as never}>
            Try {page.parentTool.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Tips */}
      <div className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Lightbulb className="h-5 w-5 text-primary" />
          Tips
        </h2>
        <ol className="space-y-3">
          {page.tips.map((tip, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {i + 1}
              </span>
              {tip}
            </li>
          ))}
        </ol>
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {page.faqs.map((faq, i) => (
            <div key={i} className="rounded-lg border p-5">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Comparison Page ───
function ComparisonContent({ page }: { page: ComparisonPage }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{page.h1}</span>
      </nav>

      <h1 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">{page.h1}</h1>
      <p className="mb-8 text-muted-foreground leading-relaxed">{page.intro}</p>

      {/* Sections */}
      {page.sections.map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">{section.heading}</h2>
          <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
            {section.content.split("\n").map((line, j) => {
              if (line.startsWith("|")) {
                // Simple markdown table rendering
                const cells = line.split("|").filter(Boolean).map((c) => c.trim());
                if (line.includes("---")) return null;
                const isHeader = j === 0 || (i === 1 && j === 0);
                return (
                  <div key={j} className={`grid grid-cols-${cells.length} gap-2 border-b py-1 text-sm ${isHeader ? "font-semibold" : ""}`}>
                    {cells.map((cell, k) => <span key={k}>{cell}</span>)}
                  </div>
                );
              }
              if (line.startsWith("**") && line.endsWith("**")) {
                return <p key={j} className="mt-2 font-semibold text-foreground">{line.replace(/\*\*/g, "")}</p>;
              }
              if (line.trim() === "") return <br key={j} />;
              return <p key={j} className="mt-1">{line.replace(/\*\*(.*?)\*\*/g, "$1")}</p>;
            })}
          </div>
        </div>
      ))}

      {/* CTA */}
      <div className="mb-10 flex justify-center">
        <Button asChild size="lg" className="gap-2">
          <Link href="/#tools">
            Try CodeNeat Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {page.faqs.map((faq, i) => (
            <div key={i} className="rounded-lg border p-5">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ───
export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  const pseo = getPseoPage(slug);
  if (pseo) {
    const breadcrumb = buildBreadcrumb(pseo);
    const faq = buildFaq(pseo.faqs);
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
        <PseoContent page={pseo} />
      </>
    );
  }

  const comp = getComparisonPage(slug);
  if (comp) {
    const breadcrumb = buildBreadcrumb(comp);
    const faq = buildFaq(comp.faqs);
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
        <ComparisonContent page={comp} />
      </>
    );
  }

  notFound();
}
