"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const tools = [
  { href: "/json-formatter", key: "jsonFormatter" },
  { href: "/base64-encode-decode", key: "base64" },
  { href: "/url-encode-decode", key: "urlEncode" },
  { href: "/regex-tester", key: "regexTester" },
  { href: "/diff-checker", key: "diffChecker" },
  { href: "/jwt-decoder", key: "jwtDecoder" },
  { href: "/sql-formatter", key: "sqlFormatter" },
  { href: "/hash-generator", key: "hashGenerator" },
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-xl font-bold text-primary"
            >
              CodeNeat
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-2">
          {tools.map((tool) => (
            <Link
              key={tool.key}
              href={tool.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
            >
              {t(tool.key)}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
