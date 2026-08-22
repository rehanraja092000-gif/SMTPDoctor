import { getGuide } from "../../../lib/guides";
import GuideArticle, { ToolLink, GuideLink, ToolCTA } from "../../components/GuideArticle";

const guide = getGuide("cname-records-explained")!;

export default function Page() {
  return (
    <GuideArticle guide={guide} eyebrow="DNS RECORDS">
      <p>
        CNAME records are one of the most common DNS record types — and one of the
        most misunderstood. If you&apos;ve ever pointed a subdomain at a hosting
        provider, set up a custom domain for a SaaS tool, or verified a service,
        you&apos;ve used one. This guide explains what a CNAME record is, how it
        differs from an A record, when to use it, and how to check one.
      </p>

      <h2>What is a CNAME record?</h2>
      <p>
        A <strong>CNAME (Canonical Name)</strong> record points one hostname to
        another hostname, rather than to an IP address. For example,{" "}
        <code>www.example.com</code> might have a CNAME pointing to{" "}
        <code>example.com</code>. When someone looks up the alias, DNS follows the
        CNAME to the target name, then resolves that target&apos;s IP address. In
        effect, the CNAME says &quot;this name is really just another name for
        that one.&quot;
      </p>

      <h2>CNAME vs A record: what&apos;s the difference?</h2>
      <p>The two are easy to confuse, but the distinction is simple:</p>
      <ul>
        <li>
          <strong>An <ToolLink slug="a-checker">A record</ToolLink></strong> points
          a hostname directly to an <em>IP address</em> (e.g.{" "}
          <code>93.184.216.34</code>).
        </li>
        <li>
          <strong>A CNAME record</strong> points a hostname to <em>another
          hostname</em>, which is then resolved onward to an IP.
        </li>
      </ul>
      <p>
        Use an A record when you have a specific IP to point at. Use a CNAME when
        you want an alias that automatically follows another name — so if that
        target&apos;s IP changes, you don&apos;t have to update anything.
      </p>

      <h2>When to use a CNAME</h2>
      <p>CNAMEs shine whenever you want a name to track another name:</p>
      <ul>
        <li>
          Pointing <code>www</code> to your root domain (or vice versa).
        </li>
        <li>
          Connecting a subdomain to a third-party service — a SaaS app, a CDN, a
          help desk, an email platform — where the provider gives you a hostname to
          point to rather than an IP.
        </li>
        <li>
          Domain verification, where a service asks you to add a CNAME to prove you
          control the domain.
        </li>
      </ul>

      <h2>The one big limitation: the root domain</h2>
      <p>
        You generally <strong>cannot</strong> put a CNAME on the root domain (the
        zone apex, like <code>example.com</code> with nothing in front). The DNS
        spec forbids it because a CNAME can&apos;t coexist with the required NS and
        SOA records that live at the root. Most DNS providers offer a workaround —{" "}
        <strong>CNAME flattening</strong> or <strong>ALIAS/ANAME</strong> records —
        that gives you the same behavior at the root without breaking the rules.
      </p>

      <h2>How to check a CNAME record</h2>
      <p>
        To see where a hostname points, run it through a{" "}
        <ToolLink slug="cname-checker">CNAME checker</ToolLink>. It queries DNS and
        returns the target the CNAME resolves to. This is useful for confirming an
        alias is set up correctly, seeing where a subdomain actually points, and
        catching dangling CNAMEs that could enable{" "}
        <GuideLink slug="subdomain-scanning">subdomain takeover</GuideLink>. After
        changing a CNAME, it&apos;s also worth confirming it has propagated with a{" "}
        <ToolLink slug="propagation-checker">DNS propagation check</ToolLink>.
      </p>

      <ToolCTA
        slug="cname-checker"
        label="Look up a CNAME record now"
        text="Check where any hostname's CNAME points, free and instantly — no signup required."
      />

      <h2>Frequently asked questions</h2>
      <div className="space-y-5">
        <div>
          <h3>What is a CNAME record?</h3>
          <p className="mt-1 text-sm">
            A DNS record that points one hostname to another hostname instead of an
            IP address. Resolvers follow the CNAME to its target, then resolve that
            target&apos;s address.
          </p>
        </div>
        <div>
          <h3>What&apos;s the difference between a CNAME and an A record?</h3>
          <p className="mt-1 text-sm">
            An A record points to an IP address; a CNAME points to another hostname.
            Use an A record when you have an IP, and a CNAME when you want an alias
            that follows another name.
          </p>
        </div>
        <div>
          <h3>Can the root domain have a CNAME?</h3>
          <p className="mt-1 text-sm">
            Traditionally no — the DNS spec forbids a CNAME at the zone apex. Many
            providers offer CNAME flattening or ALIAS/ANAME records as a workaround.
          </p>
        </div>
      </div>
    </GuideArticle>
  );
}
