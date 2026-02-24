import type { Metadata } from "next";
import { generateToolMetadata, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo";
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
      <UrlEncodeClient />
    </>
  );
}
