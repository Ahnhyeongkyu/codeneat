import type { Metadata } from "next";
import { generateToolMetadata, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo";
import JwtDecoderClient from "./client";

export const metadata: Metadata = generateToolMetadata({
  slug: "jwt-decoder",
  title: "JWT Decoder",
  description:
    "Decode and inspect JWT tokens instantly. View header, payload, and check expiration status. Free online JWT decoder. Privacy-first — runs in your browser.",
  keywords: [
    "jwt decoder",
    "jwt token decoder",
    "decode jwt",
    "jwt parser",
    "json web token",
    "jwt viewer",
    "jwt online",
    "jwt expiration",
  ],
});

export default function JwtDecoderPage() {
  const breadcrumb = buildBreadcrumbJsonLd("JWT Decoder", "jwt-decoder");
  const faq = buildFaqJsonLd([
    {
      question: "What is a JWT token?",
      answer:
        "A JSON Web Token (JWT) is a compact, URL-safe token format used for authentication and information exchange. It consists of three parts: a header (algorithm info), payload (claims/data), and signature.",
    },
    {
      question: "Can this tool verify JWT signatures?",
      answer:
        "This tool decodes and inspects JWT tokens, showing the header, payload, and expiration status. Signature verification requires the secret key, which we intentionally do not ask for to protect your security.",
    },
    {
      question: "Is it safe to paste my JWT here?",
      answer:
        "Yes. All decoding happens in your browser — your token is never sent to any server. However, never share JWT tokens publicly as they may contain sensitive claims.",
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
      <JwtDecoderClient />
    </>
  );
}
