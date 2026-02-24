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
          <strong className="text-foreground">Last updated:</strong> February 2026
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
            CodeNeat provides free, client-side developer tools. All data processing occurs in
            your browser. We do not store, transmit, or have access to any data you process
            using our tools.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Disclaimer</h2>
          <p>
            The service is provided &ldquo;as is&rdquo; without warranties of any kind. We are not
            responsible for any data loss, errors in processing, or any damages arising from the
            use of our tools.
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
