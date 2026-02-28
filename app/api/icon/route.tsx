import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const size = Number(req.nextUrl.searchParams.get("size") || "512");
  const s = Math.min(Math.max(size, 48), 1024);
  const fontSize = Math.round(s * 0.38);
  const borderRadius = Math.round(s * 0.22);

  return new ImageResponse(
    (
      <div
        style={{
          width: s,
          height: s,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #059669 0%, #34D399 100%)",
          borderRadius,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span
          style={{
            fontSize,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}
        >
          CN
        </span>
      </div>
    ),
    { width: s, height: s },
  );
}
