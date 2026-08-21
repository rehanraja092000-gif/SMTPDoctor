import type { Metadata } from "next";
import { getGuide } from "../../../lib/guides";
import { SITE } from "../../../lib/tools";
import { buildGuideSchema, SchemaScripts } from "../../../lib/guideSchema";

const guide = getGuide("spf-dkim-dmarc-setup")!;

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

const faqs = [
  {
    q: "Do I need all three of SPF, DKIM, and DMARC?",
    a: "Yes, for reliable delivery. SPF and DKIM each prove a different aspect of authenticity, and DMARC ties them together and tells receivers how to handle failures. Gmail and Yahoo now require all three for bulk senders. Together they are the baseline for landing in the inbox.",
  },
  {
    q: "What order should I set them up in?",
    a: "Set up SPF and DKIM first, since DMARC depends on them. Publish a valid SPF record, enable DKIM signing with your mail provider, verify both are passing, then add a DMARC record starting at p=none to monitor before moving to enforcement.",
  },
  {
    q: "What is the SPF 10-lookup limit?",
    a: "SPF allows a maximum of 10 DNS lookups when evaluating a record. Each include, a, mx, and similar mechanism counts, and nested includes add up fast. Exceed 10 and SPF returns permerror and fails — even though the record looks correct. This is one of the most common silent SPF failures.",
  },
  {
    q: "Should DMARC be set to none, quarantine, or reject?",
    a: "Start at p=none to monitor without affecting delivery. Once your aggregate reports show legitimate mail is passing SPF or DKIM with alignment, move to p=quarantine, then p=reject for full protection against spoofing. Jumping straight to reject risks blocking your own mail.",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaScripts schemas={buildGuideSchema("spf-dkim-dmarc-setup", faqs)} />
      {children}
    </>
  );
}
