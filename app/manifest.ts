import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CodeNeat — Clean Up Your Code",
    short_name: "CodeNeat",
    description:
      "Free online developer tools: JSON Formatter, Base64 Encoder, Regex Tester & more. Privacy-first.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    icons: [
      {
        src: "/api/icon?size=192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/api/icon?size=512",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/api/icon?size=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
