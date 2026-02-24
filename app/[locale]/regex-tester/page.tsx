import type { Metadata } from "next";
import { generateToolMetadata, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo";
import RegexTesterClient from "./client";

export const metadata: Metadata = generateToolMetadata({
  slug: "regex-tester",
  title: "Regex Tester",
  description:
    "Test regular expressions with real-time matching, group highlighting, and a cheat sheet. Free online regex tester. Privacy-first — runs in your browser.",
  keywords: [
    "regex tester",
    "regex checker",
    "regular expression tester",
    "regex online",
    "regex debugger",
    "test regex",
    "regex match",
    "regex groups",
  ],
});

export default function RegexTesterPage() {
  const breadcrumb = buildBreadcrumbJsonLd("Regex Tester", "regex-tester");
  const faq = buildFaqJsonLd([
    {
      question: "What are regex flags?",
      answer:
        "Regex flags modify how a pattern is matched. Common flags include: g (global - find all matches), i (case-insensitive), m (multiline - ^ and $ match line boundaries), and s (dotAll - dot matches newlines).",
    },
    {
      question: "How do I use capture groups?",
      answer:
        "Wrap part of your pattern in parentheses to create a capture group. For example, (\\d+)-(\\d+) captures two groups of digits separated by a dash. Named groups use the syntax (?<name>pattern).",
    },
    {
      question: "Is the regex tested in real-time?",
      answer:
        "Yes. Matches are highlighted instantly as you type both the pattern and test string. No button click needed for matching — results update automatically.",
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
      <RegexTesterClient />
    </>
  );
}
