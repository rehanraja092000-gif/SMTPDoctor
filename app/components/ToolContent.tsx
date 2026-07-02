import { getToolContent } from "../../lib/toolContent";
import { getTool, SITE } from "../../lib/tools";

/**
 * Renders the SEO/GEO body content beneath a tool (intro, how-it-works, FAQ)
 * and injects JSON-LD structured data: a FAQPage for the questions and a
 * SoftwareApplication describing the tool. Both are machine-readable, which
 * is what AI answer engines and Google rich results consume.
 */
export default function ToolContent({ slug }: { slug: string }) {
  const content = getToolContent(slug);
  const tool = getTool(slug);
  if (!content || !tool) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${tool.name} — ${SITE.name}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: SITE.developer,
    },
  };

  return (
    <section className="mx-auto max-w-3xl px-6 pb-16" aria-labelledby="about-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <div className="border-t border-[var(--border)] pt-10">
        <h2 id="about-heading" className="font-display text-2xl font-semibold text-[var(--text-primary)]">
          About the {tool.name}
        </h2>
        <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">{content.intro}</p>

        {content.what.map((section) => (
          <div key={section.heading} className="mt-8">
            <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              {section.heading}
            </h3>
            <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">{section.body}</p>
          </div>
        ))}

        <div className="mt-10">
          <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            Frequently asked questions
          </h3>
          <div className="mt-4 space-y-3">
            {content.faq.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 font-medium text-[var(--text-primary)]">
                  {item.q}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    className="shrink-0 text-[var(--text-muted)] transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
