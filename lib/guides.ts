export interface Guide {
  slug: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  readTime: string;
  date: string;
  updated: string;
  relatedTools: { slug: string; name: string }[];
}

/**
 * Guide articles. These exist to rank for the informational, long-tail
 * queries around each topic and funnel readers into the matching tool.
 * Each targets a keyword cluster the site already appears for in search.
 */
export const GUIDES: Guide[] = [
  {
    slug: "domain-reputation",
    title: "How to Check and Improve Your Domain Reputation",
    description:
      "What domain reputation means, how mailbox providers score it, how to check yours, and the concrete steps that raise it.",
    metaTitle: "How to Check & Improve Domain Reputation (2026 Guide)",
    metaDescription:
      "A practical guide to domain reputation: what it is, how to check your domain's reputation, why emails land in spam, and the exact steps to improve it.",
    readTime: "8 min read",
    date: "2026-01-15",
    updated: "2026-01-15",
    relatedTools: [
      { slug: "reputation-checker", name: "Domain Reputation Checker" },
      { slug: "spf-checker", name: "SPF Checker" },
      { slug: "dmarc-checker", name: "DMARC Checker" },
      { slug: "blacklist-checker", name: "Blacklist Checker" },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
