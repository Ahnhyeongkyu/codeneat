import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Code2 } from "lucide-react";

const toolLinks = [
  { href: "/json-formatter", key: "jsonFormatter" },
  { href: "/base64-encode-decode", key: "base64" },
  { href: "/url-encode-decode", key: "urlEncode" },
  { href: "/regex-tester", key: "regexTester" },
  { href: "/diff-checker", key: "diffChecker" },
  { href: "/jwt-decoder", key: "jwtDecoder" },
  { href: "/sql-formatter", key: "sqlFormatter" },
  { href: "/hash-generator", key: "hashGenerator" },
] as const;

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <span className="font-bold">CodeNeat</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">
              {t("footer.tools")}
            </h3>
            <ul className="space-y-2">
              {toolLinks.slice(0, 4).map((tool) => (
                <li key={tool.key}>
                  <Link
                    href={tool.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(`nav.${tool.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Tools */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">
              {t("nav.allTools")}
            </h3>
            <ul className="space-y-2">
              {toolLinks.slice(4).map((tool) => (
                <li key={tool.key}>
                  <Link
                    href={tool.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(`nav.${tool.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">
              {t("footer.product")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Ahnhyeongkyu/codeneat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("footer.github")}
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          {t("footer.copyright", { year: String(year) })}
        </div>
      </div>
    </footer>
  );
}
