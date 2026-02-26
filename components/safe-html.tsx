"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";

interface SafeHtmlProps {
  html: string;
  className?: string;
}

export function SafeHtml({ html, className }: SafeHtmlProps) {
  const sanitized = useMemo(() => DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "h2", "h3", "h4", "p", "ul", "ol", "li", "a",
      "strong", "em", "code", "pre", "table", "thead",
      "tbody", "tr", "th", "td", "br", "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  }), [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
