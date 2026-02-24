import type { MetadataRoute } from "next";

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

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}/${tool}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...toolPages,
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
