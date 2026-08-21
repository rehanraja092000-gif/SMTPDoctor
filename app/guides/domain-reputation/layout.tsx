import type { Metadata } from "next";
import { getGuide } from "../../../lib/guides";
import { SITE } from "../../../lib/tools";
import { buildGuideSchema, SchemaScripts } from "../../../lib/guideSchema";

const guide = getGuide("domain-reputation")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: `/guides/${guide.slug}` },
  openGraph: {
    type: "article",
    title: guide.metaTitle,
    description: guide.metaDescription,
    url: `${SITE.url}/guides/${guide.slug}`,
  },
};

export const faqs = [
  {
    q: "What is a good domain reputation score?",
    a: "Reputation is generally judged as high, medium, or low rather than a single universal number. A domain with valid SPF, DKIM, and an enforced DMARC policy, clean blacklist status, and consistent sending behavior is treated as high reputation. Any blacklisting, authentication failures, or spam complaints push it down.",
  },
  {
    q: "How do I check my domain's reputation?",
    a: "Check the records and signals that mailbox providers use: SPF, DKIM, and DMARC validity, whether your domain or sending IP is on any blacklists, and whether authentication is actually passing. A domain reputation checker combines these into one view so you can see what is helping or hurting you.",
  },
  {
    q: "Why do my emails go to spam even though my domain is fine?",
    a: "A clean domain is only part of the picture. Emails still land in spam when DMARC is set to p=none (no enforcement), when SPF exceeds the 10-lookup limit and silently fails, when DKIM is not configured, or when recipients mark your mail as spam. Content, sending volume, and list quality also matter.",
  },
  {
    q: "How long does it take to improve domain reputation?",
    a: "Fixing authentication records takes effect within hours to a day as DNS propagates. Rebuilding reputation after blacklisting or spam complaints takes longer — typically weeks of consistent, wanted mail — because providers weigh your recent sending history.",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaScripts schemas={buildGuideSchema("domain-reputation", faqs)} />
      {children}
    </>
  );
}
