"use client";

import { useEffect, useRef } from "react";

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

interface AdSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

export function AdSlot({ slot, format = "auto", className = "" }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!ADSENSE_ID || !adRef.current) return;
    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] })
        .adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
      }
    } catch {
      // AdSense not loaded or blocked
    }
  }, []);

  if (!ADSENSE_ID) return null;

  return (
    <div className={`my-6 text-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
