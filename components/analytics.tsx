import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();

export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return <NextGoogleAnalytics gaId={GA_ID} />;
}

/** Track custom events — call from tool components */
export function trackEvent(action: string, category: string, label?: string) {
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
      "event",
      action,
      {
        event_category: category,
        event_label: label,
      }
    );
  }
}
