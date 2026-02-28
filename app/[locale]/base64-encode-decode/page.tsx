import type { Metadata } from "next";
import { generateToolMetadata, buildBreadcrumbJsonLd, buildFaqJsonLd, buildHowToJsonLd } from "@/lib/seo";
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
    {
      question: "What is the difference between Base64 and Base64URL?",
      answer:
        "Standard Base64 uses + and / characters which are not URL-safe. Base64URL replaces them with - and _ to make the output safe for use in URLs and filenames.",
    },
    {
      question: "Where is Base64 commonly used?",
      answer:
        "Base64 is used in data URIs (embedding images in CSS/HTML), email attachments (MIME), JWT tokens, API authentication headers, and storing binary data in JSON or XML.",
    },
  ]);

  const howTo = buildHowToJsonLd({
    name: "How to Encode or Decode Base64",
    description: "Encode text to Base64 or decode Base64 strings using CodeNeat's free online tool.",
    steps: [
      { name: "Enter your text", text: "Paste or type the text you want to encode, or the Base64 string you want to decode." },
      { name: "Choose the operation", text: "Click Encode to convert text to Base64, or Decode to convert Base64 back to text." },
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
      <Base64Client />
    </>
  );
}
