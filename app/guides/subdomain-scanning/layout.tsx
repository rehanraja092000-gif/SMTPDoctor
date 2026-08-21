import type { Metadata } from "next";
import { getGuide } from "../../../lib/guides";
import { SITE } from "../../../lib/tools";
import { buildGuideSchema, SchemaScripts } from "../../../lib/guideSchema";

const guide = getGuide("subdomain-scanning")!;

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
    q: "What is a subdomain scanner?",
    a: "A subdomain scanner is a tool that discovers the subdomains associated with a domain — for example mail.example.com or blog.example.com. It works by querying DNS and public sources to enumerate hostnames under the main domain, which is useful for security audits, asset inventory, and finding forgotten or exposed services.",
  },
  {
    q: "Why does finding subdomains matter?",
    a: "Every subdomain is a potential entry point. Forgotten or misconfigured subdomains often run outdated software, expose staging environments, or are vulnerable to subdomain takeover. Mapping all of a domain's subdomains is a basic step in securing it and understanding your full attack surface.",
  },
  {
    q: "Is scanning subdomains legal?",
    a: "Discovering subdomains through public DNS and public data sources is passive and generally fine, since that information is already published. However, actively probing or attacking the services you find is different — only test systems you own or have explicit permission to assess.",
  },
  {
    q: "What is subdomain takeover?",
    a: "Subdomain takeover happens when a subdomain points (via CNAME) to an external service that has been deleted or unclaimed, letting an attacker claim it and serve content from your domain. Scanning for subdomains and checking where each one points is how you catch this before an attacker does.",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaScripts schemas={buildGuideSchema("subdomain-scanning", faqs)} />
      {children}
    </>
  );
}
