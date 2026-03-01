"use client";

import { useEffect, useRef, useState } from "react";

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

interface AdSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

export function AdSlot({ slot, format = "auto", className = "" }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const pushed = useRef(false);

  // IntersectionObserver lazy loading
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !ADSENSE_ID) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Push ad when visible
  useEffect(() => {
    if (!visible || pushed.current || !ADSENSE_ID) return;
    pushed.current = true;

    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] })
        .adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
      }
    } catch {
      // AdSense not loaded or blocked
    }
  }, [visible]);

  if (!ADSENSE_ID) return null;

  return (
    <div ref={containerRef} className={`my-6 min-h-[90px] text-center ${className}`}>
      {visible && (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
