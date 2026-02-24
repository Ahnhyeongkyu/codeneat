import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://codeneat.dev"),
  title: {
    default: "CodeNeat — Clean Up Your Code",
    template: "%s | CodeNeat",
  },
  description:
    "Free online developer tools: JSON Formatter, Base64 Encoder, Regex Tester, Diff Checker & more. Privacy-first — your data never leaves your browser.",
  keywords: [
    "json formatter",
    "base64 encode decode",
    "regex tester",
    "diff checker",
    "jwt decoder",
    "sql formatter",
    "hash generator",
    "developer tools",
    "online tools",
  ],
  authors: [{ name: "CodeNeat" }],
  creator: "CodeNeat",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codeneat.dev",
    siteName: "CodeNeat",
    title: "CodeNeat — Clean Up Your Code",
    description:
      "Free online developer tools. Privacy-first — your data never leaves your browser.",
    images: [{ url: "https://codeneat.dev/api/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeNeat — Clean Up Your Code",
    description:
      "Free online developer tools. Privacy-first — your data never leaves your browser.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
