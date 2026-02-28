import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

const TOOL_TITLES: Record<string, string> = {
  "json-formatter": "JSON Formatter & Viewer",
  "base64-encode-decode": "Base64 Encode / Decode",
  "url-encode-decode": "URL Encode / Decode",
  "regex-tester": "Regex Tester",
  "diff-checker": "Diff Checker",
  "jwt-decoder": "JWT Decoder",
  "sql-formatter": "SQL Formatter",
  "hash-generator": "Hash Generator",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tool = searchParams.get("tool") || "";
  const blog = searchParams.get("blog") || "";
  const blogTitle = searchParams.get("title") || "";

  const isBlog = !!blog || !!blogTitle;
  const title = isBlog
    ? (blogTitle || "CodeNeat Blog")
    : (TOOL_TITLES[tool] || "Clean Up Your Code");
  const isHome = !tool && !isBlog;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0F172A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            {"</>"}
          </div>
          <span style={{ color: "#94A3B8", fontSize: "28px", fontWeight: 600 }}>
            CodeNeat
          </span>
        </div>

        <h1
          style={{
            color: "white",
            fontSize: isHome ? "64px" : "56px",
            fontWeight: 700,
            textAlign: "center",
            margin: "0 60px",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        <p
          style={{
            color: "#94A3B8",
            fontSize: "24px",
            marginTop: "20px",
          }}
        >
          {isHome
            ? "Free Online Developer Tools"
            : isBlog
              ? "Developer Blog — codeneat.dev"
              : "Free, Fast & Private — codeneat.dev"}
        </p>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#059669",
            }}
          />
          <span style={{ color: "#059669", fontSize: "18px" }}>
            Your data never leaves your browser
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
