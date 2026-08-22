import type { Metadata } from "next";
import { getGuide } from "../../../lib/guides";
import { SITE } from "../../../lib/tools";
import { buildGuideSchema, SchemaScripts } from "../../../lib/guideSchema";

const guide = getGuide("cname-records-explained")!;

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
    q: "What is a CNAME record?",
    a: "A CNAME (Canonical Name) record is a DNS record that points one hostname to another hostname instead of to an IP address. For example, www.example.com might have a CNAME pointing to example.com. When a resolver looks up the alias, it follows the CNAME to the target and then resolves that target's address.",
  },
  {
    q: "What is the difference between a CNAME and an A record?",
    a: "An A record points a hostname directly to an IP address. A CNAME points a hostname to another hostname, which is then resolved to an IP. Use an A record when you have an IP to point to, and a CNAME when you want an alias to follow another name — such as pointing a subdomain at a hosting provider's domain.",
  },
  {
    q: "Can the root domain have a CNAME record?",
    a: "Traditionally no. The DNS specification does not allow a CNAME at the zone apex (the root domain, like example.com) because it conflicts with required records such as NS and SOA. Many DNS providers offer workarounds like CNAME flattening or ALIAS/ANAME records to achieve the same effect at the root.",
  },
  {
    q: "How do I check a CNAME record?",
    a: "Enter the hostname into a CNAME lookup tool, which queries DNS and returns the target the CNAME points to. This confirms the alias is configured correctly, reveals where a subdomain actually points, and helps diagnose issues like misconfigured aliases or dangling records.",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaScripts schemas={buildGuideSchema("cname-records-explained", faqs)} />
      {children}
    </>
  );
}
