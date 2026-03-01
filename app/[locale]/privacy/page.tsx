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
          <strong className="text-foreground">Last updated:</strong> March 2026
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
          <h2 className="text-2xl font-semibold text-foreground">AI Feature (Explain with AI)</h2>
          <p>
            When you use the &ldquo;Explain with AI&rdquo; feature, your input data is sent to
            Anthropic&rsquo;s API for analysis. This data is processed in real-time and is not
            stored by CodeNeat. Please refer to{" "}
            <a
              href="https://www.anthropic.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Anthropic&rsquo;s privacy policy
            </a>{" "}
            for their data handling practices.
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
              <strong className="text-foreground">Session Cookie:</strong> If you activate a Pro license,
              we store a session cookie ({`"codeneat-session"`}) to maintain your Pro status. This cookie
              contains an encrypted token and no personal data.
            </li>
            <li>
              <strong className="text-foreground">No Tracking Cookies:</strong> We only use
              localStorage for your preferences (e.g., dark mode, recent tools).
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Pro Subscriptions &amp; Payments</h2>
          <p>
            Pro subscriptions are processed through Lemon Squeezy, our payment provider. When you
            purchase a Pro plan, Lemon Squeezy collects your email address and payment information.
            CodeNeat does not store your payment details. Please refer to{" "}
            <a
              href="https://www.lemonsqueezy.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Lemon Squeezy&rsquo;s privacy policy
            </a>{" "}
            for their data handling practices.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Advertising</h2>
          <p>
            Free users may see advertisements served by Google AdSense. Google may use cookies to
            serve ads based on your browsing history. Pro users do not see any advertisements.
            Learn more about Google&rsquo;s advertising practices at{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Google&rsquo;s Privacy &amp; Terms
            </a>
            .
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Third-Party Services</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Google Analytics — anonymous usage statistics</li>
            <li>Google AdSense — advertising (free tier)</li>
            <li>Anthropic — AI analysis (Explain with AI feature)</li>
            <li>Lemon Squeezy — payment processing (Pro subscriptions)</li>
            <li>Upstash — rate limiting and caching (no personal data stored)</li>
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
