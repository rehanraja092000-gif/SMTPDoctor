import Link from "next/link";

interface Tool {
  tag: string;
  name: string;
  description: string;
  href: string;
}

interface Category {
  label: string;
  tools: Tool[];
}

const categories: Category[] = [
  {
    label: "Email authentication",
    tools: [
      { tag: "AUTH-01", name: "SPF Checker", description: "Validate SPF records and syntax", href: "/tools/spf-checker" },
      { tag: "AUTH-02", name: "DKIM Checker", description: "Find and verify DKIM selectors", href: "/tools/dkim-checker" },
      { tag: "AUTH-03", name: "DMARC Checker", description: "Check policy, alignment, and reporting", href: "/tools/dmarc-checker" },
    ],
  },
  {
    label: "DNS records",
    tools: [
      { tag: "DNS-01", name: "MX Lookup", description: "Mail exchanger priority and hosts", href: "/tools/mx-checker" },
      { tag: "DNS-02", name: "NS Lookup", description: "Authoritative nameservers", href: "/tools/ns-checker" },
      { tag: "DNS-03", name: "A / AAAA Lookup", description: "IPv4 and IPv6 address records", href: "/tools/a-checker" },
      { tag: "DNS-04", name: "CNAME Lookup", description: "Canonical name aliasing", href: "/tools/cname-checker" },
      { tag: "DNS-05", name: "TXT Lookup", description: "Raw TXT record contents", href: "/tools/txt-checker" },
      { tag: "DNS-06", name: "PTR Lookup", description: "Reverse DNS for an IP address", href: "/tools/ptr-checker" },
    ],
  },
  {
    label: "Diagnostics",
    tools: [
      { tag: "DIAG-01", name: "DNS Propagation", description: "Compare answers across 4 public resolvers", href: "/tools/propagation-checker" },
      { tag: "DIAG-02", name: "Subdomain Scanner", description: "Discover common subdomains", href: "/tools/subdomain-checker" },
      { tag: "DIAG-03", name: "WHOIS Lookup", description: "Registrar and registration data", href: "/tools/whois-checker" },
    ],
  },
  {
    label: "Security",
    tools: [
      { tag: "SEC-01", name: "Blacklist Checker", description: "Check against major RBLs", href: "/tools/blacklist-checker" },
      { tag: "SEC-02", name: "AXFR Checker", description: "Test for exposed zone transfers", href: "/tools/axfr-checker" },
      { tag: "SEC-03", name: "SMTP Port Tester", description: "Probe mail and web ports", href: "/tools/port-checker" },
      { tag: "SEC-04", name: "Domain Reputation", description: "Composite deliverability + safety score", href: "/tools/reputation-checker" },
    ],
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-6 py-24 sm:py-28 text-center">
          <p className="font-mono text-xs text-[var(--accent)] tracking-[0.2em] uppercase">
            16 tools · no signup · runs in seconds
          </p>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl font-semibold leading-[1.05] text-[var(--text-primary)]">
            Fix email deliverability
            <br />
            before it breaks trust.
          </h1>
          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-[52ch] mx-auto">
            Validate SPF, DKIM, and DMARC, trace DNS propagation, and catch
            security exposures — the diagnostics MXToolbox charges for, free.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tools/reputation-checker"
              className="rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-[#05130c] hover:bg-[var(--accent)]/90 transition-colors"
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

      <section id="tools" className="mx-auto max-w-6xl px-6 py-20 scroll-mt-20">
        {categories.map((category) => (
          <div key={category.label} className="mb-14 last:mb-0">
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
              {category.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent-dim)] hover:bg-[var(--surface-hover)] transition-colors"
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
                    {tool.description}
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
