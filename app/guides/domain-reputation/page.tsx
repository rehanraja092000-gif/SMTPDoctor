import Link from "next/link";
import { getGuide } from "../../../lib/guides";

const guide = getGuide("domain-reputation")!;

function ToolLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <Link href={`/tools/${slug}`} className="text-[var(--accent)] hover:underline">
      {children}
    </Link>
  );
}

export default function DomainReputationGuide() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <Link href="/guides" className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)]">
        ← All guides
      </Link>

      <p className="mt-6 font-mono text-xs text-[var(--accent)] tracking-wider">DELIVERABILITY</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] leading-tight">
        {guide.title}
      </h1>
      <p className="mt-3 font-mono text-xs text-[var(--text-muted)]">{guide.readTime}</p>

      <div className="mt-8 space-y-6 text-[var(--text-secondary)] leading-relaxed">
        <p>
          If your emails keep landing in spam or bouncing, the cause is often your{" "}
          <strong className="text-[var(--text-primary)]">domain reputation</strong> — a
          behind-the-scenes score that mailbox providers like Gmail, Outlook, and Yahoo
          use to decide whether to trust your mail. This guide explains what domain
          reputation is, how it&apos;s measured, how to check yours, and the concrete
          steps that improve it.
        </p>

        <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] pt-2">
          What is domain reputation?
        </h2>
        <p>
          Domain reputation is a trust rating that receiving mail servers assign to your
          sending domain based on its history and configuration. Every time you send
          email, providers observe how recipients react — do they open it, ignore it, or
          mark it as spam? — and whether your mail is properly authenticated. Over time
          this builds a picture of whether your domain is a trustworthy sender or a
          likely source of spam.
        </p>
        <p>
          A high-reputation domain reaches the inbox. A low-reputation domain gets
          filtered to spam or rejected outright, no matter how legitimate the message.
          Reputation is usually expressed as high, medium, or low rather than a precise
          number, and it&apos;s tied to both your domain and the IP addresses you send
          from.
        </p>

        <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] pt-2">
          What affects your domain reputation?
        </h2>
        <p>
          A handful of signals do most of the work. Getting these right is what separates
          inbox placement from the spam folder:
        </p>
        <ul className="space-y-3 list-none pl-0">
          <li>
            <strong className="text-[var(--text-primary)]">Authentication (SPF, DKIM, DMARC).</strong>{" "}
            These three records prove your mail is really from you. Missing or broken
            authentication is the single most common reason good mail gets treated as
            suspicious. A valid{" "}
            <ToolLink slug="spf-checker">SPF record</ToolLink>, working{" "}
            <ToolLink slug="dkim-checker">DKIM signature</ToolLink>, and an enforced{" "}
            <ToolLink slug="dmarc-checker">DMARC policy</ToolLink> are the foundation.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Blacklist status.</strong>{" "}
            If your domain or sending IP lands on a blocklist (RBL), delivery drops
            sharply. It&apos;s worth checking your{" "}
            <ToolLink slug="blacklist-checker">blacklist status</ToolLink> regularly.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Spam complaints.</strong>{" "}
            When recipients mark your mail as spam, providers take notice fast. Even a
            small complaint rate can tank reputation.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Sending consistency.</strong>{" "}
            Sudden spikes in volume, or sending to invalid addresses that bounce, signal
            spam-like behavior. Steady, wanted mail builds trust.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Domain age and history.</strong>{" "}
            Brand-new domains have no track record, so they start neutral and are watched
            closely. You can check a{" "}
            <ToolLink slug="domain-age-checker">domain&apos;s age</ToolLink> to understand
            where you stand.
          </li>
        </ul>

        <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] pt-2">
          How to check your domain reputation
        </h2>
        <p>
          You can&apos;t see the exact score a provider assigns, but you can check every
          signal that feeds into it. The fastest way is to run your domain through a{" "}
          <ToolLink slug="reputation-checker">domain reputation checker</ToolLink>, which
          combines your SPF, DKIM, DMARC, MX, DNSSEC, and threat status into one view and
          grades the quality of each — not just whether the records exist. That tells you
          precisely what&apos;s helping and what&apos;s dragging you down.
        </p>
        <p>
          For a deeper look, check each piece individually: validate your{" "}
          <ToolLink slug="spf-checker">SPF record</ToolLink> (and confirm it stays under
          the 10-lookup limit that silently breaks SPF), confirm your{" "}
          <ToolLink slug="dmarc-checker">DMARC policy</ToolLink> is actually enforcing,
          and scan your{" "}
          <ToolLink slug="blacklist-checker">blacklist status</ToolLink> across major
          RBLs.
        </p>

        <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] pt-2">
          How to improve your domain reputation
        </h2>
        <p>Once you know what&apos;s wrong, these are the fixes that move the needle, in order of impact:</p>
        <ol className="space-y-3 list-decimal pl-5">
          <li>
            <strong className="text-[var(--text-primary)]">Enforce DMARC.</strong> If your
            policy is <code className="font-mono text-sm text-[var(--accent)]">p=none</code>,
            it&apos;s only monitoring and offers no protection. Once your reports look
            clean, move to <code className="font-mono text-sm text-[var(--accent)]">quarantine</code>,
            then <code className="font-mono text-sm text-[var(--accent)]">reject</code>.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Fix SPF properly.</strong> Make
            sure every service that sends for you is listed, and that the record stays
            within 10 DNS lookups. Replace{" "}
            <code className="font-mono text-sm text-[var(--accent)]">+all</code> with{" "}
            <code className="font-mono text-sm text-[var(--accent)]">~all</code> or{" "}
            <code className="font-mono text-sm text-[var(--accent)]">-all</code>.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Enable DKIM signing</strong> with
            your mail provider so receivers can verify your messages weren&apos;t altered
            in transit.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Get off blacklists.</strong> If
            you&apos;re listed, each RBL has a delisting process. Fix the underlying cause
            first, then request removal.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Clean your mailing list.</strong>{" "}
            Remove invalid and inactive addresses so you stop generating bounces and
            complaints.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Send consistently.</strong> Warm
            up new domains gradually and keep volume steady rather than sending in sudden
            bursts.
          </li>
        </ol>

        <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="font-display font-semibold text-[var(--text-primary)]">
            Check your domain reputation now
          </p>
          <p className="mt-1.5 text-sm">
            Run a free, instant scan of your domain&apos;s authentication, blacklist
            status, and security signals — no signup required.
          </p>
          <Link
            href="/tools/reputation-checker"
            className="mt-4 inline-flex items-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] hover:opacity-90 transition-opacity"
          >
            Run a reputation scan →
          </Link>
        </div>

        <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] pt-4">
          Frequently asked questions
        </h2>
        <div className="space-y-5">
          <div>
            <h3 className="font-medium text-[var(--text-primary)]">What is a good domain reputation score?</h3>
            <p className="mt-1 text-sm">
              Reputation is generally judged as high, medium, or low rather than a single
              universal number. A domain with valid SPF, DKIM, and an enforced DMARC
              policy, clean blacklist status, and consistent sending is treated as high
              reputation. Blacklisting, authentication failures, or spam complaints push
              it down.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[var(--text-primary)]">Why do my emails go to spam even though my domain is fine?</h3>
            <p className="mt-1 text-sm">
              A clean domain is only part of the picture. Mail still lands in spam when
              DMARC is <code className="font-mono text-xs text-[var(--accent)]">p=none</code>,
              when SPF exceeds the 10-lookup limit and silently fails, when DKIM
              isn&apos;t configured, or when recipients mark your mail as spam. Content,
              volume, and list quality matter too.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[var(--text-primary)]">How long does it take to improve domain reputation?</h3>
            <p className="mt-1 text-sm">
              Fixing authentication records takes effect within hours to a day as DNS
              propagates. Rebuilding reputation after blacklisting or spam complaints
              takes longer — typically weeks of consistent, wanted mail — because
              providers weigh your recent history.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
