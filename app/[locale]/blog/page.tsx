import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | CodeNeat",
  description:
    "Developer tips, tutorials, and best practices for JSON formatting, regex, hashing, JWT tokens, and more.",
  alternates: { canonical: "https://codeneat.dev/blog" },
  openGraph: {
    title: "Blog | CodeNeat",
    description:
      "Developer tips, tutorials, and best practices for JSON formatting, regex, hashing, JWT tokens, and more.",
    url: "https://codeneat.dev/blog",
    type: "website",
    siteName: "CodeNeat",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://codeneat.dev" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://codeneat.dev/blog" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold">Blog</h1>
        <p className="mb-8 text-muted-foreground">
          Developer tips, tutorials, and best practices.
        </p>

        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link
                href={`/blog/${post.slug}`}
                className="block rounded-lg border p-6 transition-colors hover:border-primary/50 hover:bg-muted/30"
              >
                <div className="mb-2 flex items-center gap-3 text-sm text-muted-foreground">
                  <time dateTime={post.date}>{post.date}</time>
                  <span>{post.readTime} read</span>
                </div>
                <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="text-muted-foreground">{post.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
