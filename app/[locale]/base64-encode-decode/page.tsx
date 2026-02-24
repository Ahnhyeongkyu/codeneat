import type { Metadata } from "next";
import { generateToolMetadata, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo";
import Base64Client from "./client";

export const metadata: Metadata = generateToolMetadata({
  slug: "base64-encode-decode",
  title: "Base64 Encode / Decode",
  description:
    "Encode text to Base64 or decode Base64 to text instantly. Free online Base64 encoder and decoder with UTF-8 support. Privacy-first — runs in your browser.",
  keywords: [
    "base64 encode",
    "base64 decode",
    "base64 encoder",
    "base64 decoder",
    "base64 converter",
    "encode base64 online",
    "decode base64 online",
  ],
});

export default function Base64Page() {
  const breadcrumb = buildBreadcrumbJsonLd("Base64 Encode / Decode", "base64-encode-decode");
  const faq = buildFaqJsonLd([
    {
      question: "What is Base64 encoding?",
      answer:
        "Base64 is a binary-to-text encoding scheme that converts binary data into ASCII characters. It is commonly used for embedding images in HTML, encoding email attachments, and transmitting data in URLs.",
    },
    {
      question: "Does Base64 encoding encrypt my data?",
      answer:
        "No. Base64 is an encoding, not encryption. It transforms data into a different format but does not protect it. Anyone can decode Base64 back to the original data.",
    },
    {
      question: "Does this tool support UTF-8?",
      answer:
        "Yes. Our Base64 tool fully supports UTF-8 encoded text, including special characters, emojis, and non-Latin scripts.",
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
      <Base64Client />
    </>
  );
}
