import { getGuide } from "../../../lib/guides";
import GuideArticle, { ToolLink, GuideLink, ToolCTA } from "../../components/GuideArticle";

const guide = getGuide("spf-dkim-dmarc-setup")!;

export default function Page() {
  return (
    <GuideArticle guide={guide} eyebrow="EMAIL AUTHENTICATION">
      <p>
        SPF, DKIM, and DMARC are the three records that decide whether the world&apos;s
        mailbox providers trust your email. Get them right and your mail reaches the
        inbox; get them wrong — or skip them — and you fight the spam folder forever.
        As of 2024, Gmail and Yahoo <strong>require</strong> all three for bulk
        senders, so this is no longer optional. Here&apos;s how each works and how to
        set them up correctly, in the right order.
      </p>

      <h2>The 30-second overview</h2>
      <ul>
        <li>
          <strong>SPF</strong> says <em>which servers</em> may send mail for your
          domain.
        </li>
        <li>
          <strong>DKIM</strong> adds a <em>tamper-proof signature</em> proving the
          message wasn&apos;t altered.
        </li>
        <li>
          <strong>DMARC</strong> ties them together and tells receivers{" "}
          <em>what to do</em> when a message fails — and sends you reports.
        </li>
      </ul>
      <p>
        Set them up in that order, because DMARC depends on SPF and DKIM being in
        place first.
      </p>

      <h2>Step 1: Publish a valid SPF record</h2>
      <p>
        SPF is a single TXT record listing every service allowed to send for your
        domain. A typical record looks like{" "}
        <code>v=spf1 include:_spf.google.com ~all</code>. The key rules:
      </p>
      <ul>
        <li>Publish exactly <strong>one</strong> SPF record — multiple records invalidate each other.</li>
        <li>
          Include every sender — your mail host, marketing platform, CRM, and so on.
        </li>
        <li>
          End with <code>~all</code> (softfail) or <code>-all</code> (hardfail).
          Never use <code>+all</code>, which lets anyone send as you.
        </li>
        <li>
          Stay under the <strong>10 DNS-lookup limit</strong>. This is the single
          most common silent SPF failure: every <code>include</code> counts, nested
          includes add up, and going over makes SPF fail with a permerror even
          though the record looks fine.
        </li>
      </ul>
      <p>
        After publishing, validate it with an{" "}
        <ToolLink slug="spf-checker">SPF checker</ToolLink> that counts lookups — not
        just one that confirms the record exists.
      </p>

      <h2>Step 2: Enable DKIM signing</h2>
      <p>
        DKIM adds a digital signature to every message, using a private key held by
        your mail server and a public key you publish in DNS. Receivers use the
        public key to confirm the message is authentic and unmodified. You don&apos;t
        write DKIM by hand — you enable it in your mail provider (Google Workspace,
        Microsoft 365, your ESP), which gives you a selector and a DNS record to
        publish. Once live, confirm it with a{" "}
        <ToolLink slug="dkim-checker">DKIM checker</ToolLink>.
      </p>

      <h2>Step 3: Add a DMARC record — and start safe</h2>
      <p>
        DMARC lives at <code>_dmarc.yourdomain.com</code> and looks like{" "}
        <code>v=DMARC1; p=none; rua=mailto:reports@yourdomain.com</code>. The{" "}
        <code>p=</code> tag is the policy, and you should raise it gradually:
      </p>
      <ol>
        <li>
          <strong>p=none</strong> — monitor only. Nothing changes for your mail, but
          you start receiving reports showing what passes and fails. Stay here until
          the reports look clean.
        </li>
        <li>
          <strong>p=quarantine</strong> — failing mail goes to spam. Move here once
          you&apos;re confident legitimate mail passes.
        </li>
        <li>
          <strong>p=reject</strong> — failing mail is rejected outright. This is full
          protection against spoofing, and the goal.
        </li>
      </ol>
      <p>
        Always include a <code>rua</code> address so you receive aggregate reports —
        without them you&apos;re flying blind. Never jump straight to{" "}
        <code>p=reject</code>, or you risk blocking your own mail. Verify the record
        with a <ToolLink slug="dmarc-checker">DMARC checker</ToolLink>.
      </p>

      <h2>Step 4 (optional but recommended): MTA-STS</h2>
      <p>
        Once the big three are in place, <ToolLink slug="mtasts-checker">MTA-STS</ToolLink>{" "}
        enforces TLS encryption for mail sent to you, closing off downgrade attacks.
        It&apos;s a strong finishing touch for a fully hardened setup.
      </p>

      <h2>Common mistakes to avoid</h2>
      <ul>
        <li>Publishing two SPF records (breaks SPF entirely).</li>
        <li>Exceeding the 10-lookup limit (silent failure).</li>
        <li>Leaving DMARC at <code>p=none</code> forever — it never actually protects you.</li>
        <li>Forgetting the <code>rua</code> address, so you never see what&apos;s failing.</li>
        <li>Adding a new sending service without updating SPF.</li>
      </ul>

      <ToolCTA
        slug="reputation-checker"
        label="Check your whole setup at once"
        text="Run a reputation scan to see SPF, DKIM, DMARC, and more graded together — with prioritized fixes. Free, no signup."
      />

      <p>
        If your mail is already landing in spam, this pairs well with{" "}
        <GuideLink slug="why-emails-go-to-spam">
          why your emails go to spam and how to fix it
        </GuideLink>
        .
      </p>

      <h2>Frequently asked questions</h2>
      <div className="space-y-5">
        <div>
          <h3>Do I need all three of SPF, DKIM, and DMARC?</h3>
          <p className="mt-1 text-sm">
            Yes, for reliable delivery. Each proves a different aspect of
            authenticity, and DMARC ties them together. Gmail and Yahoo now require
            all three for bulk senders.
          </p>
        </div>
        <div>
          <h3>What is the SPF 10-lookup limit?</h3>
          <p className="mt-1 text-sm">
            SPF allows a maximum of 10 DNS lookups when evaluating a record. Each
            include, a, and mx mechanism counts, and nested includes add up. Exceed
            10 and SPF fails with a permerror — even though the record looks correct.
          </p>
        </div>
        <div>
          <h3>Should DMARC be set to none, quarantine, or reject?</h3>
          <p className="mt-1 text-sm">
            Start at p=none to monitor. Once reports show legitimate mail is passing
            with alignment, move to p=quarantine, then p=reject for full protection.
            Jumping straight to reject risks blocking your own mail.
          </p>
        </div>
      </div>
    </GuideArticle>
  );
}
