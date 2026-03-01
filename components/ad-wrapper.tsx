"use client";

import { type ReactNode } from "react";
import { useProStatus } from "@/lib/pro-context";

interface AdWrapperProps {
  children: ReactNode;
}

/** Renders children (ad slots) only for free users */
export function AdWrapper({ children }: AdWrapperProps) {
  const { isPro, loading } = useProStatus();

  // Don't render ads while checking status or for Pro users
  if (loading || isPro) return null;

  return <>{children}</>;
}
