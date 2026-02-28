import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { SafeHtml } from "@/components/safe-html";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `https://codeneat.dev/blog/${slug}`;
  const ogImage = `https://codeneat.dev/api/og?blog=${slug}&title=${encodeURIComponent(post.title)}`;
  return {
    title: `${post.title} | CodeNeat Blog`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      siteName: "CodeNeat",
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | CodeNeat Blog`,
      description: post.description,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://codeneat.dev" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://codeneat.dev/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://codeneat.dev/blog/${slug}` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "CodeNeat" },
    publisher: { "@type": "Organization", name: "CodeNeat" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/blog"
          className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary"
        >
          &larr; Back to Blog
        </Link>

        <header className="mb-8">
          <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={post.date}>{post.date}</time>
            <span>{post.readTime} read</span>
          </div>
          <h1 className="mb-4 text-3xl font-bold leading-tight lg:text-4xl">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground">{post.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <SafeHtml
          html={post.content}
          className="prose prose-neutral dark:prose-invert max-w-none"
        />

        {post.relatedTool && (
          <div className="mt-12 rounded-lg border bg-muted/30 p-6">
            <p className="mb-2 text-sm font-medium">Try the tool mentioned in this article:</p>
            <Link
              href={`/${
                post.relatedTool === "jsonFormatter" ? "json-formatter"
                : post.relatedTool === "regexTester" ? "regex-tester"
                : post.relatedTool === "jwtDecoder" ? "jwt-decoder"
                : post.relatedTool === "hashGenerator" ? "hash-generator"
                : post.relatedTool
              }`}
              className="text-primary hover:underline"
            >
              Open Tool &rarr;
            </Link>
          </div>
        )}
      </article>
    </>
  );
}
