import Link from "next/link";
import { CATEGORIES, toolsByCategory, SITE } from "../lib/tools";

export const metadata = {
  alternates: { canonical: "/" },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE.name,
  url: SITE.url,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  creator: { "@type": "Organization", name: SITE.developer },
  description:
    "Free email deliverability and DNS diagnostic tools: SPF, DKIM, DMARC, MX, blacklist, WHOIS, and more.",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <section className="relative overflow-hidden border-b border-[var(--border)] scan-line">
        <div className="mx-auto max-w-5xl px-6 py-24 sm:py-28 text-center relative z-10">
          <p className="font-mono text-xs text-[var(--accent)] tracking-[0.2em] uppercase animate-result">
            16 tools · no signup · runs in seconds
          </p>
          <h1
            className="mt-4 font-display text-4xl sm:text-6xl font-semibold leading-[1.05] text-[var(--text-primary)] animate-result"
            style={{ animationDelay: "60ms" }}
          >
            Fix email deliverability
            <br />
            before it breaks trust.
          </h1>
          <p
            className="mt-6 text-lg text-[var(--text-secondary)] max-w-[52ch] mx-auto animate-result"
            style={{ animationDelay: "120ms" }}
          >
            Validate SPF, DKIM, and DMARC, trace DNS propagation, and catch
            security exposures — the diagnostics MXToolbox charges for, free.
          </p>
          <div
            className="mt-9 flex flex-wrap items-center justify-center gap-3 animate-result"
            style={{ animationDelay: "180ms" }}
          >
            <Link
              href="/tools/reputation-checker"
              className="rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-[#05130c] hover:bg-[var(--accent)]/90 hover:-translate-y-0.5 transition-all"
            >
              Run a full reputation scan
            </Link>
            <Link
              href="#tools"
              className="rounded-xl border border-[var(--border-strong)] px-6 py-3 font-semibold text-[var(--text-primary)] hover:border-[var(--accent-dim)] transition-colors"
            >
              Browse all tools
            </Link>
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-6xl px-6 py-20 scroll-mt-32">
        {CATEGORIES.map((category) => (
          <div key={category.key} className="mb-14 last:mb-0">
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-xs text-[var(--text-muted)]" aria-hidden="true">
                {"//"}
              </span>
              <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)]">
                {category.label}
              </h2>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {toolsByCategory(category.key).map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent-dim)] hover:bg-[var(--surface-hover)] hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">
                      {tool.tag}
                    </span>
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] status-dot"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-3 font-display font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {tool.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                    {tool.short}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
