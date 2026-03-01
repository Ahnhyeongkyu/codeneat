import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Code2 } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { LicenseDialog } from "@/components/license-dialog";

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

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
        <MobileNav />

        <Link href="/" className="mr-6 flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">CodeNeat</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-2 md:flex">
          {toolLinks.map((tool) => (
            <Link
              key={tool.key}
              href={tool.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t(tool.key)}
            </Link>
          ))}
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {t("allTools")}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LicenseDialog />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
