"use client";

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
} from "lucide-react";

export function ProClient() {
  const t = useTranslations("pro");
  const { isPro } = useProStatus();

  const checkoutUrl =
    process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || "#";

  const plans = [
    {
      name: t("freePlan"),
      price: "$0",
      period: "",
      current: !isPro,
      features: [
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
      ],
    },
    {
      name: t("proPlan"),
      price: "$4.99",
      period: "/mo",
      current: isPro,
      features: [
        { text: t("features.allTools"), icon: Braces, included: true },
        {
          text: t("features.aiLimit", { limit: t("features.proAiLimit") }),
          icon: Sparkles,
          included: true,
        },
        {
          text: t("features.ads") + ": " + t("features.adsNo"),
          icon: ShieldOff,
          included: true,
        },
        { text: t("features.priority"), icon: Headphones, included: true },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
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
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-8 ${
              plan.name === t("proPlan")
                ? "border-emerald-600/40 shadow-lg dark:border-emerald-400/40"
                : ""
            }`}
          >
            {plan.current && (
              <Badge
                variant="secondary"
                className="absolute -top-3 left-6 text-xs"
              >
                {t("currentPlan")}
              </Badge>
            )}

            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">
                {plan.price}
              </span>
              {plan.period && (
                <span className="text-muted-foreground">{plan.period}</span>
              )}
            </div>

            <ul className="mt-8 space-y-4">
              {plan.features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <li key={feature.text} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground/40" />
                    )}
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span
                      className={
                        feature.included ? "" : "text-muted-foreground"
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8">
              {plan.name === t("proPlan") && !isPro ? (
                <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                    {t("getStarted")}
                  </Button>
                </a>
              ) : plan.current ? (
                <Button variant="outline" className="w-full" disabled>
                  {t("currentPlan")}
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
