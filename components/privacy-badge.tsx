"use client";

import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export function PrivacyBadge() {
  const t = useTranslations("common");

  return (
    <Badge
      variant="secondary"
      className="gap-1.5 bg-success/10 text-success hover:bg-success/15"
    >
      <Shield className="h-3.5 w-3.5" />
      {t("privacyBadge")}
    </Badge>
  );
}
