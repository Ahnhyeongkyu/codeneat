"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useProStatus } from "@/lib/pro-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Check,
  X,
  Sparkles,
  ShieldOff,
  Headphones,
  Braces,
  Zap,
} from "lucide-react";

type BillingCycle = "monthly" | "annual";

export function ProClient() {
  const t = useTranslations("pro");
  const { isPro } = useProStatus();
  const [billing, setBilling] = useState<BillingCycle>("annual");

  const checkoutUrl =
    process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || "#";
  const annualCheckoutUrl =
    process.env.NEXT_PUBLIC_LEMONSQUEEZY_ANNUAL_CHECKOUT_URL || checkoutUrl;
  const lifetimeCheckoutUrl =
    process.env.NEXT_PUBLIC_LEMONSQUEEZY_LIFETIME_CHECKOUT_URL || checkoutUrl;

  const features = [
    { text: t("features.allTools"), icon: Braces },
    { text: t("features.aiLimit", { limit: t("features.proAiLimit") }), icon: Sparkles },
    { text: t("features.adsNo"), icon: ShieldOff },
    { text: t("features.priority"), icon: Headphones },
  ];

  const freeFeatures = [
    { text: t("features.allTools"), icon: Braces, included: true },
    {
      text: t("features.aiLimit", { limit: t("features.freeAiLimit") }),
      icon: Sparkles,
      included: true,
    },
    {
      text: t("features.ads") + ": " + t("features.adsYes"),
      icon: ShieldOff,
      included: false,
    },
    { text: t("features.priority"), icon: Headphones, included: false },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-12 text-center">
        <div className="mb-4 flex justify-center">
          <Crown className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {t("pageSubtitle")}
        </p>

        {/* Billing toggle */}
        <div className="mt-8 inline-flex items-center gap-1 rounded-full border bg-muted/50 p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              billing === "monthly"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("monthly")}
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              billing === "annual"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("annual")}
            <span className="ml-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {t("savePercent")}
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Free Plan */}
        <div className="relative rounded-2xl border p-8">
          {!isPro && (
            <Badge variant="secondary" className="absolute -top-3 left-6 text-xs">
              {t("currentPlan")}
            </Badge>
          )}
          <h2 className="text-xl font-semibold">{t("freePlan")}</h2>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight">$0</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{t("freeDescription")}</p>

          <ul className="mt-8 space-y-4">
            {freeFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.text} className="flex items-center gap-3">
                  {feature.included ? (
                    <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground/40" />
                  )}
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className={feature.included ? "" : "text-muted-foreground"}>
                    {feature.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="relative rounded-2xl border-2 border-emerald-600/40 p-8 shadow-lg dark:border-emerald-400/40">
          <Badge className="absolute -top-3 left-6 bg-emerald-600 text-xs text-white hover:bg-emerald-600">
            {isPro ? t("currentPlan") : t("popular")}
          </Badge>
          <h2 className="text-xl font-semibold">{t("proPlan")}</h2>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight">
              {billing === "monthly" ? "$4.99" : "$3.33"}
            </span>
            <span className="text-muted-foreground">/mo</span>
          </div>
          {billing === "annual" && (
            <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
              {t("billedAnnually")}
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">{t("proDescription")}</p>

          <ul className="mt-8 space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.text} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{feature.text}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            {!isPro ? (
              <a
                href={billing === "annual" ? annualCheckoutUrl : checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                  {t("getStarted")}
                </Button>
              </a>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                {t("currentPlan")}
              </Button>
            )}
          </div>
        </div>

        {/* Lifetime Plan */}
        <div className="relative rounded-2xl border p-8">
          <Badge variant="secondary" className="absolute -top-3 left-6 text-xs">
            {t("limitedOffer")}
          </Badge>
          <h2 className="text-xl font-semibold">{t("lifetimePlan")}</h2>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight">$79</span>
            <span className="text-muted-foreground">{t("oneTime")}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{t("lifetimeDescription")}</p>

          <ul className="mt-8 space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.text} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{feature.text}</span>
                </li>
              );
            })}
            <li className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium">{t("lifetimeAccess")}</span>
            </li>
          </ul>

          <div className="mt-8">
            {!isPro ? (
              <a href={lifetimeCheckoutUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  {t("getLifetime")}
                </Button>
              </a>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                {t("currentPlan")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
