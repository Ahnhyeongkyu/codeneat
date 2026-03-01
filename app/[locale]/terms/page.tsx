import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "CodeNeat terms of service.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Terms of Service</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <p className="text-lg">
          <strong className="text-foreground">Last updated:</strong> March 2026
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Acceptance</h2>
          <p>
            By using CodeNeat, you agree to these terms. If you do not agree, please do not use
            the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Service Description</h2>
          <p>
            CodeNeat provides developer tools in two tiers:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-foreground">Free:</strong> All 8 developer tools with unlimited use,
              AI Explain (10 requests/day), and advertisements.
            </li>
            <li>
              <strong className="text-foreground">Pro ($4.99/month):</strong> All Free features plus unlimited
              AI Explain requests, ad-free experience, and priority support.
            </li>
          </ul>
          <p>
            All data processing (formatting, encoding, hashing, etc.) occurs in your browser.
            We do not store, transmit, or have access to any data you process using our tools.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Pro Subscription</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Pro subscriptions are billed monthly at $4.99 USD through Lemon Squeezy.</li>
            <li>You may cancel at any time. Cancellation takes effect at the end of the current billing period.</li>
            <li>Refunds are available within 14 days of purchase if you have not exceeded 50 AI requests.</li>
            <li>License keys are for individual use only and may not be shared or resold.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">AI Feature</h2>
          <p>
            The &ldquo;Explain with AI&rdquo; feature sends your input to Anthropic&rsquo;s API for
            processing. By using this feature, you acknowledge that your input data will be sent
            to a third-party service. Do not submit sensitive, confidential, or proprietary data
            to the AI feature.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Acceptable Use</h2>
          <p>
            You agree not to abuse the service, including but not limited to:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Circumventing rate limits or usage restrictions.</li>
            <li>Using automated tools to make excessive API requests.</li>
            <li>Sharing or reselling Pro license keys.</li>
            <li>Using the service for any illegal purpose.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Disclaimer</h2>
          <p>
            The service is provided &ldquo;as is&rdquo; without warranties of any kind. We are not
            responsible for any data loss, errors in processing, or any damages arising from the
            use of our tools. AI-generated explanations are for informational purposes only and
            should not be considered professional advice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Intellectual Property</h2>
          <p>
            CodeNeat is open source under the MIT License. You retain all rights to any data
            you process using our tools.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the service constitutes
            acceptance of the updated terms.
          </p>
        </section>
      </div>
    </div>
  );
}
