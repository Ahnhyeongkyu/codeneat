import type { Metadata } from "next";
import { generateToolMetadata, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo";
import SqlFormatterClient from "./client";

export const metadata: Metadata = generateToolMetadata({
  slug: "sql-formatter",
  title: "SQL Formatter",
  description:
    "Format and beautify SQL queries instantly. Supports MySQL, PostgreSQL, SQLite, SQL Server, and more. Free online SQL formatter. Privacy-first — runs in your browser.",
  keywords: [
    "sql formatter",
    "sql beautifier",
    "format sql",
    "sql pretty print",
    "sql minifier",
    "mysql formatter",
    "postgresql formatter",
    "sql online",
  ],
});

export default function SqlFormatterPage() {
  const breadcrumb = buildBreadcrumbJsonLd("SQL Formatter", "sql-formatter");
  const faq = buildFaqJsonLd([
    {
      question: "What SQL dialects are supported?",
      answer:
        "We support Standard SQL, MySQL, PostgreSQL, SQLite, SQL Server (T-SQL), PL/SQL, and MariaDB. Select your dialect from the dropdown for optimal formatting.",
    },
    {
      question: "Does the formatter change my query logic?",
      answer:
        "No. The formatter only changes whitespace, indentation, and keyword casing. Your query logic, table names, and values remain exactly the same.",
    },
    {
      question: "Can I minify SQL queries?",
      answer:
        "Yes. Use the Minify button to compress your SQL into a single line by removing unnecessary whitespace and comments. This is useful for embedding SQL in application code.",
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
      <SqlFormatterClient />
    </>
  );
}
