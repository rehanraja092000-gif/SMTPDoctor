import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg-raised)]/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-semibold text-lg tracking-tight text-[var(--text-primary)] flex items-center gap-2.5"
        >
          <Image
            src="/brand/icon.png"
            alt="SMTPDoctor logo"
            width={28}
            height={28}
            priority
            className="h-7 w-7"
          />
          SMTPDoctor
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-6 text-sm">
          <Link
            href="/#tools"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            All tools
          </Link>
          <Link
            href="/tools/reputation-checker"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors hidden sm:inline"
          >
            Reputation score
          </Link>
        </nav>
      </div>
    </header>
  );
}
