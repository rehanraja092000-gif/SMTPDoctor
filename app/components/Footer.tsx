import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, toolsByCategory, SITE } from "../../lib/tools";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-raised)] mt-24">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr_1.4fr]">
          {/* Brand + developer */}
          <div>
            <p className="font-display font-semibold text-lg text-[var(--text-primary)] flex items-center gap-2.5">
              <Image
                src="/brand/icon.png"
                alt="SMTPDoctor logo"
                width={28}
                height={28}
                className="h-7 w-7"
              />
              {SITE.name}
            </p>
            <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-[32ch] leading-relaxed">
              A free, no-signup toolkit for diagnosing email deliverability, DNS
              health, and domain security. 16 tools that run directly against
              live DNS and mail infrastructure.
            </p>

            <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Designed & built by
              </p>
              <p className="mt-1 font-display font-semibold text-[var(--text-primary)]">
                {SITE.developer}
              </p>
              <p className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                Independent studio building fast, privacy-respecting web tools
                and SaaS products. Available for freelance and collaboration.
              </p>
            </div>
          </div>

          {/* Tool catalog */}
          <div className="grid gap-8 sm:grid-cols-2">
            {CATEGORIES.map((cat) => (
              <div key={cat.key}>
                <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  {cat.label}
                </p>
                <ul className="mt-3 space-y-2">
                  {toolsByCategory(cat.key).map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Resources
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                  All tools
                </Link>
              </li>
              <li>
                <Link href="/tools/reputation-checker" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                  Full reputation scan
                </Link>
              </li>
              <li>
                <Link href="/tools/propagation-checker" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                  DNS propagation
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)] font-mono">
            © {year} {SITE.name} · Built by {SITE.developer}
          </p>
          <p className="text-xs text-[var(--text-muted)] max-w-[52ch] sm:text-right">
            Results are for diagnostic purposes and may not reflect every mail
            provider&apos;s exact behavior.
          </p>
        </div>
      </div>
    </footer>
  );
}
