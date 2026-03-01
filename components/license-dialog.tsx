"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useProStatus } from "@/lib/pro-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function LicenseDialog() {
  const t = useTranslations("pro");
  const { isPro, activate, deactivate } = useProStatus();
  const [open, setOpen] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleActivate() {
    if (!licenseKey.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    const result = await activate(licenseKey.trim());

    if (result.success) {
      setStatus("success");
      setTimeout(() => setOpen(false), 1500);
    } else {
      setStatus("error");
      setErrorMessage(result.error || t("activationFailed"));
    }
  }

  async function handleDeactivate() {
    await deactivate();
    setStatus("idle");
    setLicenseKey("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isPro ? (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-emerald-600 dark:text-emerald-400"
          >
            <Crown className="h-4 w-4" />
            Pro
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-emerald-600/30 text-emerald-600 hover:bg-emerald-600/10 dark:border-emerald-400/30 dark:text-emerald-400 dark:hover:bg-emerald-400/10"
          >
            <Crown className="h-4 w-4" />
            {t("upgrade")}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            {isPro ? t("manageTitle") : t("activateTitle")}
          </DialogTitle>
          <DialogDescription>
            {isPro ? t("manageDescription") : t("activateDescription")}
          </DialogDescription>
        </DialogHeader>

        {isPro ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg border border-emerald-600/20 bg-emerald-50/50 p-3 dark:border-emerald-400/20 dark:bg-emerald-950/20">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium">{t("activePlan")}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeactivate}
              className="w-full"
            >
              {t("deactivate")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder={t("licenseKeyPlaceholder")}
                value={licenseKey}
                onChange={(e) => {
                  setLicenseKey(e.target.value);
                  setStatus("idle");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleActivate()}
                disabled={status === "loading"}
              />
              {status === "error" && (
                <div className="flex items-center gap-1.5 text-sm text-destructive" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  {errorMessage}
                </div>
              )}
              {status === "success" && (
                <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  {t("activationSuccess")}
                </div>
              )}
            </div>

            <Button
              onClick={handleActivate}
              disabled={!licenseKey.trim() || status === "loading"}
              className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("activating")}
                </>
              ) : (
                t("activate")
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              {t("noKeyYet")}{" "}
              <a
                href={process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 underline dark:text-emerald-400"
              >
                {t("getPro")}
              </a>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
