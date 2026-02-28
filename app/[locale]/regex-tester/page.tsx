import type { Metadata } from "next";
import { generateToolMetadata, buildBreadcrumbJsonLd, buildFaqJsonLd, buildHowToJsonLd } from "@/lib/seo";
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
    {
      question: "What regex engine does this tool use?",
      answer:
        "This tool uses the JavaScript RegExp engine built into your browser. It supports ES2024 features including named groups, lookbehind assertions, and Unicode property escapes.",
    },
    {
      question: "How do I test a regex for email or URL validation?",
      answer:
        "Open the Cheat Sheet section for common patterns including email, URL, IP address, and phone number validation. Paste your test data to verify matches in real-time.",
    },
  ]);

  const howTo = buildHowToJsonLd({
    name: "How to Test Regular Expressions",
    description: "Test and debug regex patterns with real-time matching using CodeNeat's free regex tester.",
    steps: [
      { name: "Enter a pattern", text: "Type your regular expression pattern in the pattern field. Select flags like g, i, or m as needed." },
      { name: "Add test text", text: "Paste or type the text you want to test against. Matches are highlighted in real-time." },
      { name: "Review matches", text: "View highlighted matches, capture groups, and match indices below the test string." },
    ],
  });

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />
      <RegexTesterClient />
    </>
  );
}
