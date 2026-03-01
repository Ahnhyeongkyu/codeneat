import type { Metadata } from "next";
import { ProClient } from "./client";

export const metadata: Metadata = {
  title: "Pro",
  description:
    "Upgrade to CodeNeat Pro for unlimited AI explanations and an ad-free experience. $4.99/month.",
};

export default function ProPage() {
  return <ProClient />;
}
