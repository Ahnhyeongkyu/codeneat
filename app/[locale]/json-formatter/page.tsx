import type { Metadata } from "next";
import { generateToolMetadata, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo";
import JsonFormatterClient from "./client";

export const metadata: Metadata = generateToolMetadata({
  slug: "json-formatter",
  title: "JSON Formatter & Viewer",
  description:
    "Format, validate, and beautify JSON data instantly. Free online JSON formatter with tree view, minify, and real-time validation. Privacy-first — runs in your browser.",
  keywords: [
    "json formatter",
    "json beautifier",
    "json viewer",
    "json validator",
    "json minifier",
    "json tree view",
    "format json online",
    "pretty print json",
  ],
});

export default function JsonFormatterPage() {
  const breadcrumb = buildBreadcrumbJsonLd("JSON Formatter & Viewer", "json-formatter");
  const faq = buildFaqJsonLd([
    {
      question: "What is JSON formatting?",
      answer:
        "JSON formatting (or beautifying) adds proper indentation and line breaks to compressed JSON data, making it easier to read and debug.",
    },
    {
      question: "Can I validate JSON online?",
      answer:
        "Yes. Our JSON formatter validates your JSON in real-time as you type, instantly showing syntax errors with line numbers.",
    },
    {
      question: "Is my JSON data sent to a server?",
      answer:
        "No. All JSON formatting, validation, and tree view processing happens entirely in your browser. Your data never leaves your device.",
    },
    {
      question: "Can I convert JSON to YAML or CSV?",
      answer:
        "Yes. Use the JSON → YAML or JSON → CSV buttons to convert your data. You can also convert YAML back to JSON with the YAML → JSON button.",
    },
    {
      question: "What is the maximum file size I can format?",
      answer:
        "You can format JSON files up to 5 MB. You can also upload .json, .yaml, or .csv files directly using the Upload button.",
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
      <JsonFormatterClient />
    </>
  );
}
