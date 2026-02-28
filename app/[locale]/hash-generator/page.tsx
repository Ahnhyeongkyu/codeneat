import type { Metadata } from "next";
import { generateToolMetadata, buildBreadcrumbJsonLd, buildFaqJsonLd, buildHowToJsonLd } from "@/lib/seo";
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
    {
      question: "Can I generate all hashes at once?",
      answer:
        "Yes. Click the Generate All button to compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes simultaneously. This is useful for comparing hash outputs across algorithms.",
    },
    {
      question: "Is hashing the same as encryption?",
      answer:
        "No. Hashing is a one-way function — you cannot reverse a hash to get the original data. Encryption is two-way — encrypted data can be decrypted with the correct key. Hashing is used for verification, encryption for confidentiality.",
    },
  ]);

  const howTo = buildHowToJsonLd({
    name: "How to Generate Hash Values",
    description: "Generate SHA-256, SHA-512, and other hash values using CodeNeat's free online hash generator.",
    steps: [
      { name: "Enter your text", text: "Type or paste the text you want to hash into the input field. You can also upload a file using the Upload button." },
      { name: "Select algorithm", text: "Choose a hash algorithm (SHA-1, SHA-256, SHA-384, SHA-512) or click Generate All for all algorithms at once." },
      { name: "Copy the hash", text: "Click the Copy button next to any hash value to copy it to your clipboard." },
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
      <HashGeneratorClient />
    </>
  );
}
