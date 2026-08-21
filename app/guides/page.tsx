import Link from "next/link";
import { GUIDES } from "../../lib/guides";

export default function GuidesIndex() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <p className="font-mono text-xs text-[var(--accent)] tracking-wider">GUIDES</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
        Email &amp; DNS guides
      </h1>
      <p className="mt-3 text-[var(--text-secondary)] leading-relaxed max-w-2xl">
        Practical, no-fluff guides to the things that break email deliverability and
        domain security — with the tools to check each one as you go.
      </p>

      <ul className="mt-10 divide-y divide-[var(--border)]">
        {GUIDES.map((g) => (
          <li key={g.slug} className="py-5">
            <Link href={`/guides/${g.slug}`} className="group block">
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                {g.title}
              </h2>
              <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                {g.description}
              </p>
              <p className="mt-2 font-mono text-xs text-[var(--text-muted)]">{g.readTime}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
