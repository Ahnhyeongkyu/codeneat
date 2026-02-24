import type { Metadata } from "next";
import { generateToolMetadata, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo";
import DiffCheckerClient from "./client";

export const metadata: Metadata = generateToolMetadata({
  slug: "diff-checker",
  title: "Diff Checker",
  description:
    "Compare two texts and see the differences highlighted inline. Free online diff checker for code, text, and documents. Privacy-first — runs in your browser.",
  keywords: [
    "diff checker",
    "text diff",
    "compare text",
    "text comparison",
    "diff tool",
    "code diff",
    "find differences",
    "online diff",
  ],
});

export default function DiffCheckerPage() {
  const breadcrumb = buildBreadcrumbJsonLd("Diff Checker", "diff-checker");
  const faq = buildFaqJsonLd([
    {
      question: "How does the diff checker work?",
      answer:
        "Our diff checker uses the diff-match-patch algorithm to find the minimum set of changes between two texts. Additions are highlighted in green, deletions in red, and unchanged text is shown normally.",
    },
    {
      question: "Can I compare code with this tool?",
      answer:
        "Yes. You can compare any text including source code, configuration files, SQL queries, or plain text documents. The tool preserves formatting and whitespace.",
    },
    {
      question: "Is there a size limit?",
      answer:
        "There is no hard limit. Since all processing happens in your browser, performance depends on your device. Texts up to several megabytes work smoothly on modern devices.",
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <DiffCheckerClient />
    </>
  );
}
