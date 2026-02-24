import type { Metadata } from "next";
import { generateToolMetadata, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo";
import HashGeneratorClient from "./client";

export const metadata: Metadata = generateToolMetadata({
  slug: "hash-generator",
  title: "Hash Generator",
  description:
    "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text. Free online hash generator using Web Crypto API. Privacy-first — runs in your browser.",
  keywords: [
    "hash generator",
    "sha256 generator",
    "sha1 hash",
    "sha512 hash",
    "hash online",
    "generate hash",
    "text to hash",
    "checksum generator",
  ],
});

export default function HashGeneratorPage() {
  const breadcrumb = buildBreadcrumbJsonLd("Hash Generator", "hash-generator");
  const faq = buildFaqJsonLd([
    {
      question: "What is a hash function?",
      answer:
        "A hash function converts input data of any size into a fixed-size string of characters. The same input always produces the same hash, but you cannot reverse a hash back to the original data.",
    },
    {
      question: "Which algorithm should I use?",
      answer:
        "SHA-256 is the most commonly recommended. SHA-1 is considered weak for security purposes. SHA-384 and SHA-512 provide longer hashes for higher security requirements.",
    },
    {
      question: "Does this tool support MD5?",
      answer:
        "This tool uses the Web Crypto API which supports SHA-1, SHA-256, SHA-384, and SHA-512. MD5 is not included as it is considered cryptographically broken and should not be used for security purposes.",
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
      <HashGeneratorClient />
    </>
  );
}
