/**
 * Single source of truth for the tool catalog. The homepage, category nav,
 * footer, and per-page SEO content all read from here so nothing drifts
 * out of sync when a tool is added or renamed.
 */

export interface ToolMeta {
  tag: string;
  slug: string;
  name: string;
  short: string;
  category: CategoryKey;
}

export type CategoryKey = "auth" | "dns" | "diagnostics" | "security" | "tls" | "web";

export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  short: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { key: "auth", label: "Email Authentication", short: "Email Auth" },
  { key: "dns", label: "DNS Records", short: "DNS" },
  { key: "diagnostics", label: "Diagnostics", short: "Diagnostics" },
  { key: "security", label: "Security", short: "Security" },
  { key: "tls", label: "TLS & Certificates", short: "TLS" },
  { key: "web", label: "Website Security", short: "Web" },
];

export const TOOLS: ToolMeta[] = [
  { tag: "AUTH-01", slug: "spf-checker", name: "SPF Checker", short: "Validate SPF records and syntax", category: "auth" },
  { tag: "AUTH-02", slug: "dkim-checker", name: "DKIM Checker", short: "Find and verify DKIM selectors", category: "auth" },
  { tag: "AUTH-03", slug: "dmarc-checker", name: "DMARC Checker", short: "Check policy, alignment, and reporting", category: "auth" },

  { tag: "DNS-01", slug: "mx-checker", name: "MX Lookup", short: "Mail exchanger priority and hosts", category: "dns" },
  { tag: "DNS-02", slug: "ns-checker", name: "NS Lookup", short: "Authoritative nameservers", category: "dns" },
  { tag: "DNS-03", slug: "a-checker", name: "A / AAAA Lookup", short: "IPv4 and IPv6 address records", category: "dns" },
  { tag: "DNS-04", slug: "cname-checker", name: "CNAME Lookup", short: "Canonical name aliasing", category: "dns" },
  { tag: "DNS-05", slug: "txt-checker", name: "TXT Lookup", short: "Raw TXT record contents", category: "dns" },
  { tag: "DNS-06", slug: "ptr-checker", name: "PTR Lookup", short: "Reverse DNS for an IP address", category: "dns" },

  { tag: "DIAG-01", slug: "propagation-checker", name: "DNS Propagation", short: "Compare answers across 4 public resolvers", category: "diagnostics" },
  { tag: "DIAG-02", slug: "subdomain-checker", name: "Subdomain Scanner", short: "Discover common subdomains", category: "diagnostics" },
  { tag: "DIAG-03", slug: "whois-checker", name: "WHOIS Lookup", short: "Registrar and registration data", category: "diagnostics" },

  { tag: "SEC-01", slug: "blacklist-checker", name: "Blacklist Checker", short: "Check against major RBLs", category: "security" },
  { tag: "SEC-02", slug: "axfr-checker", name: "AXFR Checker", short: "Test for exposed zone transfers", category: "security" },
  { tag: "SEC-03", slug: "port-checker", name: "SMTP Port Tester", short: "Probe mail and web ports", category: "security" },
  { tag: "SEC-04", slug: "reputation-checker", name: "Domain Reputation", short: "Composite deliverability + safety score", category: "security" },
  { tag: "SEC-05", slug: "dnssec-checker", name: "DNSSEC Checker", short: "Verify DNS is cryptographically signed", category: "security" },
  { tag: "SEC-06", slug: "openrelay-checker", name: "Open Relay Test", short: "Detect abusable mail relays", category: "security" },

  { tag: "MAIL-01", slug: "mtasts-checker", name: "MTA-STS Checker", short: "Enforce TLS for inbound mail", category: "auth" },
  { tag: "MAIL-02", slug: "tlsrpt-checker", name: "TLS-RPT Checker", short: "TLS reporting policy", category: "auth" },
  { tag: "MAIL-03", slug: "bimi-checker", name: "BIMI Checker", short: "Brand logo in inbox", category: "auth" },
  { tag: "MAIL-04", slug: "smtp-banner-checker", name: "SMTP Banner", short: "Read a mail server's greeting", category: "diagnostics" },
  { tag: "MAIL-05", slug: "starttls-checker", name: "STARTTLS Checker", short: "Confirm mail encryption support", category: "diagnostics" },

  { tag: "TLS-01", slug: "ssl-checker", name: "SSL / TLS Certificate", short: "Certificate validity and expiry", category: "tls" },
  { tag: "TLS-02", slug: "caa-checker", name: "CAA Checker", short: "Which CAs may issue certificates", category: "tls" },

  { tag: "WEB-01", slug: "headers-checker", name: "Security Headers", short: "Audit HTTP security headers", category: "web" },
  { tag: "WEB-02", slug: "hsts-checker", name: "HSTS Checker", short: "HTTPS enforcement policy", category: "web" },

  { tag: "DIAG-04", slug: "domain-age-checker", name: "Domain Age", short: "Registration date and age", category: "diagnostics" },
];

export function toolsByCategory(key: CategoryKey): ToolMeta[] {
  return TOOLS.filter((t) => t.category === key);
}

export function getTool(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export const SITE = {
  name: "SMTPDoctor",
  url: "https://smtpdoctor.com",
  developer: "RehaVerse Studio",
  developerUrl: "",
  tagline: "Free email deliverability & DNS diagnostics",
};
