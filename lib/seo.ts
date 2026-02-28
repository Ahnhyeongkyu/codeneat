import type { Metadata } from "next";

const BASE_URL = "https://codeneat.dev";

interface ToolSeoConfig {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
}

export function generateToolMetadata(config: ToolSeoConfig): Metadata {
  const url = `${BASE_URL}/${config.slug}`;
  const ogImage = `${BASE_URL}/api/og?tool=${config.slug}`;
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${config.title} | CodeNeat`,
      description: config.description,
      url,
      type: "website",
      siteName: "CodeNeat",
      images: [{ url: ogImage, width: 1200, height: 630, alt: config.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.title} | CodeNeat`,
      description: config.description,
      images: [ogImage],
    },
  };
}

export function buildBreadcrumbJsonLd(toolTitle: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: toolTitle,
        item: `${BASE_URL}/${slug}`,
      },
    ],
  };
}

export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildHowToJsonLd(config: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: config.name,
    description: config.description,
    step: config.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
