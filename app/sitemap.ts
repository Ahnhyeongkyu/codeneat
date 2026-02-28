import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const tools = [
  "json-formatter",
  "base64-encode-decode",
  "url-encode-decode",
  "regex-tester",
  "diff-checker",
  "jwt-decoder",
  "sql-formatter",
  "hash-generator",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://codeneat.dev";

  const alternates = (path: string) => ({
    languages: {
      en: `${baseUrl}${path}`,
      ko: `${baseUrl}/ko${path}`,
      ja: `${baseUrl}/ja${path}`,
    },
  });

  const toolPages: MetadataRoute.Sitemap = tools.flatMap((tool) => [
    {
      url: `${baseUrl}/${tool}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: alternates(`/${tool}`),
    },
    {
      url: `${baseUrl}/ko/${tool}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ja/${tool}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ]);

  const blogPages: MetadataRoute.Sitemap = getAllPosts().flatMap((post) => [
    {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: alternates(`/blog/${post.slug}`),
    },
    {
      url: `${baseUrl}/ko/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ja/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]);

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      alternates: alternates(""),
    },
    {
      url: `${baseUrl}/ko`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/ja`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...toolPages,
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: alternates("/blog"),
    },
    {
      url: `${baseUrl}/ko/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ja/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogPages,
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
