import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "CodeNeat privacy policy. Your data never leaves your browser.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <p className="text-lg">
          <strong className="text-foreground">Last updated:</strong> February 2026
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Your Data Never Leaves Your Browser</h2>
          <p>
            CodeNeat is designed with privacy as a core principle. All data processing — formatting,
            encoding, decoding, hashing, and validation — happens entirely in your browser using
            client-side JavaScript. We never send your code or data to any server.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">What We Collect</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-foreground">Analytics:</strong> We use Google Analytics to collect
              anonymous usage data (page views, tool usage counts). This helps us improve our tools.
              No personally identifiable information is collected.
            </li>
            <li>
              <strong className="text-foreground">No Accounts:</strong> We do not require sign-up or
              collect any personal information.
            </li>
            <li>
              <strong className="text-foreground">No Cookies (for tracking):</strong> We only use
              localStorage for your preferences (e.g., dark mode).
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Third-Party Services</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Google Analytics — anonymous usage statistics</li>
            <li>Vercel — hosting provider</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Contact</h2>
          <p>
            Questions about this policy? Open an issue on our{" "}
            <a
              href="https://github.com/Ahnhyeongkyu/codeneat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              GitHub repository
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
