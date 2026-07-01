import Link from "next/link";

const categories = [
  {
    label: "Email authentication",
    links: [
      { name: "SPF Checker", href: "/tools/spf-checker" },
      { name: "DKIM Checker", href: "/tools/dkim-checker" },
      { name: "DMARC Checker", href: "/tools/dmarc-checker" },
    ],
  },
  {
    label: "DNS tools",
    links: [
      { name: "MX Lookup", href: "/tools/mx-checker" },
      { name: "DNS Propagation", href: "/tools/propagation-checker" },
      { name: "Subdomain Scanner", href: "/tools/subdomain-checker" },
    ],
  },
  {
    label: "Security",
    links: [
      { name: "Blacklist Checker", href: "/tools/blacklist-checker" },
      { name: "AXFR Checker", href: "/tools/axfr-checker" },
      { name: "Port Tester", href: "/tools/port-checker" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-raised)] mt-24">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 sm:grid-cols-4">
        <div>
          <p className="font-display font-semibold text-[var(--text-primary)]">
            SMTPDoctor
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-[22ch]">
            Free diagnostics for email deliverability and DNS health.
          </p>
        </div>

        {categories.map((cat) => (
          <div key={cat.label}>
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              {cat.label}
            </p>
            <ul className="mt-3 space-y-2">
              {cat.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 py-4 text-xs text-[var(--text-muted)] font-mono">
          Results are provided for diagnostic purposes and may not reflect every mail provider&apos;s exact behavior.
        </div>
      </div>
    </footer>
  );
}
