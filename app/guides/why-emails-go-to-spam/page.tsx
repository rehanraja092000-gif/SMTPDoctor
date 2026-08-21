import { getGuide } from "../../../lib/guides";
import GuideArticle, { ToolLink, GuideLink, ToolCTA } from "../../components/GuideArticle";

const guide = getGuide("why-emails-go-to-spam")!;

export default function Page() {
  return (
    <GuideArticle guide={guide} eyebrow="DELIVERABILITY">
      <p>
        You send an important email and it never gets read — because it quietly
        landed in the spam folder. This is one of the most frustrating problems in
        email, partly because there&apos;s rarely a single cause. Mailbox providers
        weigh several signals together, and any one of them can tip a legitimate
        message into spam. Here are the real reasons it happens, in the order
        they&apos;re worth checking, and how to fix each.
      </p>

      <h2>1. Your email authentication is broken or missing</h2>
      <p>
        This is the most common and most fixable cause. Three records tell
        receiving servers your mail is genuinely from you:
      </p>
      <ul>
        <li>
          <strong>SPF</strong> lists which servers are allowed to send for your
          domain. It commonly fails silently when it exceeds the 10 DNS-lookup
          limit — the record looks fine but returns an error. Validate it with an{" "}
          <ToolLink slug="spf-checker">SPF checker</ToolLink> that actually counts
          lookups.
        </li>
        <li>
          <strong>DKIM</strong> cryptographically signs your mail so receivers know
          it wasn&apos;t altered. Missing DKIM is a red flag to filters. Confirm
          yours with a <ToolLink slug="dkim-checker">DKIM checker</ToolLink>.
        </li>
        <li>
          <strong>DMARC</strong> tells providers what to do with mail that fails the
          above. If it&apos;s missing — or set to <code>p=none</code>, which only
          monitors — you get no protection and less trust. Check it with a{" "}
          <ToolLink slug="dmarc-checker">DMARC checker</ToolLink>.
        </li>
      </ul>
      <p>
        If you only fix one thing, fix authentication. Our full walkthrough covers
        it step by step:{" "}
        <GuideLink slug="spf-dkim-dmarc-setup">
          how to set up SPF, DKIM, and DMARC correctly
        </GuideLink>
        .
      </p>

      <h2>2. Your domain or IP is blacklisted</h2>
      <p>
        Real-time blocklists (RBLs) are databases of domains and IPs known for
        spam. If you land on one — often because of a compromised account, a bad
        mailing list, or shared-IP neighbors — delivery drops sharply. Check your{" "}
        <ToolLink slug="blacklist-checker">blacklist status</ToolLink> across major
        RBLs. If you&apos;re listed, fix the root cause first, then use each
        list&apos;s delisting process.
      </p>

      <h2>3. Your domain reputation is low</h2>
      <p>
        Providers track how recipients react to your mail over time. Low open
        rates, spam complaints, and sending to dead addresses all erode reputation
        — and low reputation means the spam folder, even for legitimate mail. See{" "}
        <GuideLink slug="domain-reputation">
          how to check and improve your domain reputation
        </GuideLink>{" "}
        for the full picture, or run a quick{" "}
        <ToolLink slug="reputation-checker">reputation scan</ToolLink> now.
      </p>

      <h2>4. Your content trips spam filters</h2>
      <p>
        Even authenticated mail from a good domain can be filtered on content
        alone. Common triggers:
      </p>
      <ul>
        <li>Spam-associated phrases (&quot;free money,&quot; &quot;act now,&quot; &quot;risk-free&quot;)</li>
        <li>ALL-CAPS or excessive punctuation in the subject line</li>
        <li>A single large image with almost no text</li>
        <li>Too many links, or links to low-reputation domains</li>
        <li>Misleading subject lines that don&apos;t match the body</li>
      </ul>
      <p>
        Write like a human, keep a healthy text-to-image ratio, and be honest in
        your subject lines.
      </p>

      <h2>5. Poor list quality and sending habits</h2>
      <p>
        Sending to purchased lists, addresses that bounce, or people who never
        opted in generates complaints and hard bounces — two of the strongest
        negative signals. Sudden volume spikes look like spam too. Clean your list
        regularly, only mail people who asked to hear from you, and warm up new
        domains gradually instead of blasting from day one.
      </p>

      <ToolCTA
        slug="reputation-checker"
        label="Find out what's hurting your deliverability"
        text="Run a free scan of your domain's authentication, blacklist status, and reputation signals — no signup required."
      />

      <h2>Frequently asked questions</h2>
      <div className="space-y-5">
        <div>
          <h3>Why are my emails suddenly going to spam?</h3>
          <p className="mt-1 text-sm">
            A sudden change usually means a recent blacklisting, a broken
            authentication record, or a spike in spam complaints. Check your
            blacklist status and SPF/DKIM/DMARC first — those are the most common
            sudden causes.
          </p>
        </div>
        <div>
          <h3>Does having SPF, DKIM, and DMARC guarantee inbox placement?</h3>
          <p className="mt-1 text-sm">
            No. Authentication is necessary but not sufficient. It proves your mail
            is genuine, but providers still weigh reputation, engagement, content,
            and list quality. Good authentication with a poor reputation can still
            land in spam.
          </p>
        </div>
        <div>
          <h3>Can spammy content alone send good email to spam?</h3>
          <p className="mt-1 text-sm">
            Yes. Even a perfectly authenticated message can be filtered if the
            content triggers spam signals — excessive links, spammy phrases,
            all-caps subjects, image-only emails, or misleading claims.
          </p>
        </div>
      </div>
    </GuideArticle>
  );
}
