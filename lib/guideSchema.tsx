import { getGuide } from "./guides";
import { SITE } from "./tools";

/**
 * Builds Article + FAQPage JSON-LD for a guide. Centralizing this keeps the
 * structured data consistent across every article — which is what makes the
 * content eligible for rich results in Google and citable by AI answer engines
 * (they lean heavily on clean, well-structured Q&A markup).
 */
export function buildGuideSchema(slug: string, faqs: { q: string; a: string }[]) {
  const guide = getGuide(slug);
  if (!guide) return [];

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: guide.date,
    dateModified: guide.updated,
    author: { "@type": "Organization", name: SITE.developer, url: SITE.url },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/brand/icon-512.png` },
    },
    mainEntityOfPage: `${SITE.url}/guides/${guide.slug}`,
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return [article, faqPage];
}

export function SchemaScripts({ schemas }: { schemas: object[] }) {
  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
}
