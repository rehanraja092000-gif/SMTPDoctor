import { getGuide } from "../../../lib/guides";
import GuideArticle, { ToolLink, GuideLink, ToolCTA } from "../../components/GuideArticle";

const guide = getGuide("subdomain-scanning")!;

export default function Page() {
  return (
    <GuideArticle guide={guide} eyebrow="DNS & SECURITY">
      <p>
        Most domains are far bigger than the single website you see. Behind{" "}
        <code>example.com</code> there&apos;s often <code>mail.example.com</code>,{" "}
        <code>blog.example.com</code>, <code>app.example.com</code>, staging
        servers, admin panels, and more — each one a <strong>subdomain</strong>. A
        subdomain scanner finds them all. This guide explains what that means, why
        it matters, and how to scan any domain.
      </p>

      <h2>What is a subdomain?</h2>
      <p>
        A subdomain is a prefix on your main domain that points to a separate
        service or section. In <code>mail.example.com</code>, the{" "}
        <code>mail</code> part is the subdomain. Each one has its own DNS records
        and can host a completely different application, on a different server, than
        the main site. Organizations accumulate dozens of them over time — and
        that&apos;s where the risk lives.
      </p>

      <h2>What is a subdomain scanner?</h2>
      <p>
        A subdomain scanner enumerates the subdomains that exist under a domain by
        querying DNS and public data sources. Instead of guessing hostnames one at
        a time, it surfaces the full list in one pass. You can run any domain
        through our <ToolLink slug="subdomain-checker">subdomain scanner</ToolLink>{" "}
        to see what&apos;s published under it.
      </p>

      <h2>Why finding subdomains matters</h2>
      <p>
        Every subdomain is a door into your infrastructure, and the forgotten ones
        are the most dangerous:
      </p>
      <ul>
        <li>
          <strong>Attack surface.</strong> Each subdomain is another service that
          can be attacked. You can&apos;t secure what you don&apos;t know exists.
        </li>
        <li>
          <strong>Forgotten services.</strong> Old staging sites, dev environments,
          and unused apps often run outdated, vulnerable software.
        </li>
        <li>
          <strong>Subdomain takeover.</strong> If a subdomain&apos;s{" "}
          <GuideLink slug="cname-records-explained">CNAME record</GuideLink> points
          to a third-party service that&apos;s been deleted, an attacker can claim
          that service and serve content from <em>your</em> domain. Scanning finds
          these dangling records.
        </li>
        <li>
          <strong>Email and security posture.</strong> Mail subdomains and their
          records affect deliverability and trust across the whole domain.
        </li>
      </ul>

      <h2>How to scan a domain&apos;s subdomains</h2>
      <p>
        The passive approach — used by our tool — queries DNS and public sources to
        list known subdomains without probing the target&apos;s servers. To do it:
      </p>
      <ol>
        <li>Enter the root domain (like <code>example.com</code>) into a subdomain scanner.</li>
        <li>Review the discovered subdomains and note any you don&apos;t recognize.</li>
        <li>
          For each unfamiliar one, check where it points and whether it&apos;s still
          in use — a <ToolLink slug="cname-checker">CNAME lookup</ToolLink> and an{" "}
          <ToolLink slug="ssl-checker">SSL check</ToolLink> quickly reveal whether a
          subdomain is live, misconfigured, or dangling.
        </li>
        <li>Decommission anything unused, and secure anything that should stay.</li>
      </ol>

      <ToolCTA
        slug="subdomain-checker"
        label="Scan a domain's subdomains now"
        text="Discover the subdomains published under any domain, free and instantly — no signup required."
      />

      <h2>A note on responsible use</h2>
      <p>
        Discovering subdomains through public DNS is passive and fine — that data is
        already published. But only actively test or probe systems you own or have
        explicit permission to assess. Use this for securing your own domains and
        for authorized security work.
      </p>

      <h2>Frequently asked questions</h2>
      <div className="space-y-5">
        <div>
          <h3>What is a subdomain scanner?</h3>
          <p className="mt-1 text-sm">
            A tool that discovers the subdomains under a domain — like
            mail.example.com — by querying DNS and public sources. It&apos;s used for
            security audits, asset inventory, and finding forgotten services.
          </p>
        </div>
        <div>
          <h3>Why does finding subdomains matter?</h3>
          <p className="mt-1 text-sm">
            Every subdomain is a potential entry point. Forgotten ones often run
            outdated software or are vulnerable to takeover. Mapping them all is a
            basic step in understanding and securing your attack surface.
          </p>
        </div>
        <div>
          <h3>What is subdomain takeover?</h3>
          <p className="mt-1 text-sm">
            It happens when a subdomain points via CNAME to an external service
            that&apos;s been deleted, letting an attacker claim it and serve content
            from your domain. Scanning and checking where subdomains point catches
            this early.
          </p>
        </div>
      </div>
    </GuideArticle>
  );
}
