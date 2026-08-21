import Link from "next/link";
import { Guide } from "../../lib/guides";

export function ToolLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <Link href={`/tools/${slug}`} className="text-[var(--accent)] hover:underline">
      {children}
    </Link>
  );
}

export function GuideLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <Link href={`/guides/${slug}`} className="text-[var(--accent)] hover:underline">
      {children}
    </Link>
  );
}

export function ToolCTA({ slug, label, text }: { slug: string; label: string; text: string }) {
  return (
    <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="font-display font-semibold text-[var(--text-primary)]">{label}</p>
      <p className="mt-1.5 text-sm">{text}</p>
      <Link
        href={`/tools/${slug}`}
        className="mt-4 inline-flex items-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] hover:opacity-90 transition-opacity"
      >
        Open the tool →
      </Link>
    </div>
  );
}

export default function GuideArticle({
  guide,
  eyebrow,
  children,
}: {
  guide: Guide;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <Link href="/guides" className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)]">
        ← All guides
      </Link>

      <p className="mt-6 font-mono text-xs text-[var(--accent)] tracking-wider">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] leading-tight">
        {guide.title}
      </h1>
      <p className="mt-3 font-mono text-xs text-[var(--text-muted)]">{guide.readTime}</p>

      <div className="mt-8 space-y-6 text-[var(--text-secondary)] leading-relaxed guide-body">
        {children}
      </div>

      {guide.relatedTools.length > 0 && (
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Related tools
          </p>
          <div className="flex flex-wrap gap-2">
            {guide.relatedTools.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:border-[var(--accent-dim)] hover:text-[var(--accent)] transition-colors"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
