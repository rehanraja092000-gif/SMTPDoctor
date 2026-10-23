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
  {
    slug: "why-emails-go-to-spam",
    title: "Why Your Emails Go to Spam (and How to Fix It)",
    description:
      "The real reasons legitimate email lands in the spam folder — authentication, reputation, content, and list quality — plus how to fix each.",
    metaTitle: "Why Do My Emails Go to Spam? Causes & Fixes (2026)",
    metaDescription:
      "Emails landing in spam? Here are the real reasons — SPF/DKIM/DMARC failures, blacklisting, poor reputation, spammy content — and exactly how to fix each one.",
    readTime: "9 min read",
    date: "2026-01-16",
    updated: "2026-01-16",
    relatedTools: [
      { slug: "spf-checker", name: "SPF Checker" },
      { slug: "dkim-checker", name: "DKIM Checker" },
      { slug: "dmarc-checker", name: "DMARC Checker" },
      { slug: "blacklist-checker", name: "Blacklist Checker" },
      { slug: "reputation-checker", name: "Domain Reputation Checker" },
    ],
  },
  {
    slug: "spf-dkim-dmarc-setup",
    title: "How to Set Up SPF, DKIM, and DMARC Correctly",
    description:
      "A step-by-step walkthrough of email authentication: what each record does, how to configure them, and how to avoid the mistakes that silently break them.",
    metaTitle: "How to Set Up SPF, DKIM & DMARC (Step-by-Step, 2026)",
    metaDescription:
      "A clear, step-by-step guide to setting up SPF, DKIM, and DMARC correctly — what each record does, how to publish them, and the common mistakes to avoid.",
    readTime: "11 min read",
    date: "2026-01-17",
    updated: "2026-01-17",
    relatedTools: [
      { slug: "spf-checker", name: "SPF Checker" },
      { slug: "dkim-checker", name: "DKIM Checker" },
      { slug: "dmarc-checker", name: "DMARC Checker" },
      { slug: "mtasts-checker", name: "MTA-STS Checker" },
    ],
  },
  {
    slug: "php2shell-vulnerability-explained",
    title: "PHP2Shell (CVE-2026-109618 & 109619): What Happened and How to Check If You're Affected",
    description:
      "The October 2026 PHP vulnerability that took government sites offline, explained — what PHP2Shell is, who's affected, how to check your site, and how to patch.",
    metaTitle: "PHP2Shell Vulnerability Explained: Are You Affected? (2026)",
    metaDescription:
      "The PHP2Shell flaws (CVE-2026-109618 & CVE-2026-109619) took websites offline worldwide in October 2026. Learn what happened, how to check if your site is affected, and how to patch.",
    readTime: "9 min read",
    date: "2026-10-23",
    updated: "2026-10-23",
    relatedTools: [
      { slug: "headers-checker", name: "HTTP Headers Checker" },
      { slug: "ssl-checker", name: "SSL / TLS Checker" },
      { slug: "reputation-checker", name: "Domain Reputation Checker" },
      { slug: "blacklist-checker", name: "Blacklist Checker" },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
