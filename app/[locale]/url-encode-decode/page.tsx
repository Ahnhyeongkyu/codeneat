import type { Metadata } from "next";
import { generateToolMetadata, buildBreadcrumbJsonLd, buildFaqJsonLd, buildHowToJsonLd } from "@/lib/seo";
import UrlEncodeClient from "./client";

export const metadata: Metadata = generateToolMetadata({
  slug: "url-encode-decode",
  title: "URL Encode / Decode",
  description:
    "Encode or decode URL components instantly. Free online URL encoder and decoder that handles special characters safely. Privacy-first — runs in your browser.",
  keywords: [
    "url encode",
    "url decode",
    "url encoder",
    "url decoder",
    "percent encoding",
    "encodeURIComponent",
    "url encode online",
  ],
});

export default function UrlEncodePage() {
  const breadcrumb = buildBreadcrumbJsonLd("URL Encode / Decode", "url-encode-decode");
  const faq = buildFaqJsonLd([
    {
      question: "What is URL encoding?",
      answer:
        "URL encoding (also called percent-encoding) replaces special characters in a URL with a percent sign (%) followed by two hexadecimal digits. This ensures URLs are transmitted correctly.",
    },
    {
      question: "When should I URL encode?",
      answer:
        "You should URL encode query parameters, form data, and any text that contains special characters like spaces, ampersands, or non-ASCII characters before including them in a URL.",
    },
    {
      question: "What is the difference between encodeURI and encodeURIComponent?",
      answer:
        "encodeURI encodes a full URI but preserves characters like : / ? & =. encodeURIComponent encodes individual components more aggressively, converting those characters too. Our tool uses encodeURIComponent for maximum safety.",
    },
    {
      question: "Why do spaces become %20 or +?",
      answer:
        "In URL encoding, spaces are represented as %20 (standard) or + (form encoding). Our Component mode uses %20, which is the RFC 3986 standard and works universally in URLs.",
    },
    {
      question: "Can I encode entire URLs or just query parameters?",
      answer:
        "Use Component mode for query parameters and individual values. Use Full URL mode for encoding complete URLs while preserving the URL structure (protocol, host, path separators).",
    },
  ]);

  const howTo = buildHowToJsonLd({
    name: "How to URL Encode or Decode Text",
    description: "Encode or decode URL components using CodeNeat's free online URL encoder/decoder.",
    steps: [
      { name: "Enter your text", text: "Paste or type the text you want to encode, or the URL-encoded string you want to decode." },
      { name: "Choose the operation", text: "Click Encode to convert text to URL-safe format, or Decode to convert percent-encoded text back to readable text." },
      { name: "Copy the result", text: "Use the Copy button to copy the result to your clipboard." },
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
      <UrlEncodeClient />
    </>
  );
}
