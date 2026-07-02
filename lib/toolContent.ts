/**
 * Per-tool SEO/GEO content: an intro, a "how it works" section, and an FAQ.
 * The FAQ is also emitted as JSON-LD FAQPage structured data, which helps
 * both Google rich results and AI answer engines (AIO/GEO) extract clean
 * question/answer pairs. Written to be genuinely useful, not keyword-stuffed.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export interface ToolContent {
  intro: string;
  what: { heading: string; body: string }[];
  faq: FaqItem[];
}

export const TOOL_CONTENT: Record<string, ToolContent> = {
  "spf-checker": {
    intro:
      "SPF (Sender Policy Framework) tells receiving mail servers which servers are allowed to send email for your domain. A missing or broken SPF record is one of the most common reasons legitimate email lands in spam. This checker looks up your domain's published SPF record and shows you exactly what's there.",
    what: [
      {
        heading: "What this tool checks",
        body: "It queries your domain's TXT records over public DNS and finds the one beginning with v=spf1. It shows the full record so you can review the mechanisms (include, a, mx, ip4, ip6) and the final qualifier (~all, -all, or ?all) that decides how strictly unlisted senders are treated.",
      },
      {
        heading: "How to read the result",
        body: "A healthy SPF record lists every service that sends mail for you and ends with ~all (soft fail) or -all (hard fail). If no record is found, receiving servers have no way to verify your senders. If you have more than one SPF record, that's an error — SPF permits only a single record per domain.",
      },
    ],
    faq: [
      {
        q: "What does a valid SPF record look like?",
        a: "A typical record looks like v=spf1 include:_spf.google.com ~all. It starts with v=spf1, lists authorized senders through mechanisms like include and ip4, and ends with an all qualifier.",
      },
      {
        q: "Can I have two SPF records?",
        a: "No. A domain must publish exactly one SPF record. Multiple v=spf1 TXT records cause SPF to fail. If you use several mail providers, combine them into one record using multiple include statements.",
      },
      {
        q: "What is the difference between ~all and -all?",
        a: "~all is a soft fail — mail from unlisted servers is accepted but marked. -all is a hard fail — mail from unlisted servers should be rejected. -all is stricter and more secure once you're confident every legitimate sender is listed.",
      },
      {
        q: "Why does SPF have a 10-lookup limit?",
        a: "SPF allows a maximum of 10 DNS lookups when evaluating a record. Exceeding this causes a permerror and SPF failures. Nested include statements are the usual cause, so keep your record lean.",
      },
    ],
  },

  "dkim-checker": {
    intro:
      "DKIM (DomainKeys Identified Mail) adds a cryptographic signature to your outgoing email so receiving servers can confirm it wasn't altered in transit and really came from your domain. DKIM records live at a selector-specific subdomain, which makes them easy to miss. This tool scans common selectors and lets you check a specific one.",
    what: [
      {
        heading: "What this tool checks",
        body: "It looks up TXT records at selector._domainkey.yourdomain.com for a set of common selectors used by major providers (Google, Microsoft, and others), and reports any that contain a valid DKIM public key.",
      },
      {
        heading: "Finding your selector",
        body: "Every DKIM key is published under a selector chosen by your mail provider. If the common-selector scan doesn't find yours, check a signed email's headers for the s= value in the DKIM-Signature line, then enter that selector directly.",
      },
    ],
    faq: [
      {
        q: "What is a DKIM selector?",
        a: "A selector is a label your mail provider uses to publish a specific DKIM key, forming the hostname selector._domainkey.yourdomain.com. Providers pick their own selectors, such as google, selector1, or k1.",
      },
      {
        q: "How do I find my DKIM selector?",
        a: "Open a message you sent, view its raw headers, and find the DKIM-Signature line. The s= value is your selector and the d= value is your signing domain.",
      },
      {
        q: "Do I need DKIM if I already have SPF?",
        a: "Yes. SPF and DKIM protect against different things, and DMARC requires at least one of them to pass with alignment. Publishing both gives the strongest deliverability and anti-spoofing protection.",
      },
    ],
  },

  "dmarc-checker": {
    intro:
      "DMARC ties SPF and DKIM together and tells receiving servers what to do when a message fails authentication — and where to send reports. Without DMARC, attackers can spoof your domain with no consequences. This tool reads your published DMARC policy and shows its enforcement level and reporting setup.",
    what: [
      {
        heading: "What this tool checks",
        body: "It queries the TXT record at _dmarc.yourdomain.com and displays the full policy, including the p= enforcement level, any rua/ruf reporting addresses, and the pct percentage.",
      },
      {
        heading: "Policy levels explained",
        body: "p=none only monitors and reports without affecting delivery. p=quarantine sends failing mail to spam. p=reject blocks it outright. Most domains start at none to gather reports, then move to quarantine and finally reject once legitimate mail is confirmed to pass.",
      },
    ],
    faq: [
      {
        q: "What DMARC policy should I use?",
        a: "Start with p=none to collect reports without affecting delivery. Once your reports confirm all legitimate mail passes SPF or DKIM with alignment, move to p=quarantine and then p=reject for full protection.",
      },
      {
        q: "What are rua and ruf in DMARC?",
        a: "rua is the address for aggregate reports — daily summaries of authentication results. ruf is for forensic reports on individual failures. Aggregate reports (rua) are the most useful for tuning your setup.",
      },
      {
        q: "Why is my DMARC failing even though SPF passes?",
        a: "DMARC requires alignment, not just a pass. The domain SPF authenticates must match your From domain. A common cause is mail sent through a third party that passes SPF for their domain but not yours — DKIM signing with your domain usually fixes this.",
      },
    ],
  },

  "mx-checker": {
    intro:
      "MX (Mail Exchanger) records tell the world which servers receive email for your domain, and in what priority order. If your MX records are missing or misconfigured, inbound mail simply won't arrive. This tool lists every MX record for a domain, sorted by delivery priority.",
    what: [
      {
        heading: "What this tool checks",
        body: "It resolves the MX records for your domain and lists each mail server with its priority value. Lower numbers are tried first, with higher numbers acting as backups.",
      },
      {
        heading: "How to read the result",
        body: "A domain can have one or several MX records. Multiple records with different priorities provide redundancy. If no MX records appear, the domain can't receive email until they're configured with your mail host.",
      },
    ],
    faq: [
      {
        q: "What does MX priority mean?",
        a: "Priority sets the order servers are tried. The lowest number is the primary. If it's unreachable, sending servers fall back to the next-lowest, providing redundancy.",
      },
      {
        q: "Can I have multiple MX records?",
        a: "Yes, and it's good practice. Multiple MX records at different priorities give you failover if your primary mail server goes down. Records at equal priority distribute load.",
      },
      {
        q: "Why is my email not being received?",
        a: "The most common causes are missing MX records, MX records pointing to the wrong host, or a firewall blocking port 25 on the mail server. Confirm your MX records here, then verify the target server accepts SMTP connections.",
      },
    ],
  },

  "ns-checker": {
    intro:
      "NS (Nameserver) records identify the authoritative DNS servers for your domain — the servers that hold the real answers for all your other records. Checking them confirms your domain is delegated to the right DNS provider. This tool lists the authoritative nameservers for any domain.",
    what: [
      {
        heading: "What this tool checks",
        body: "It resolves the NS records for your domain, showing which nameservers the domain is delegated to at the registry level.",
      },
      {
        heading: "Why this matters",
        body: "If your nameservers don't match your DNS provider, none of your other DNS changes will take effect. This is the first thing to verify when DNS changes aren't propagating.",
      },
    ],
    faq: [
      {
        q: "What are nameservers?",
        a: "Nameservers are the authoritative DNS servers that store and answer queries for your domain's records. Your registrar delegates your domain to them, and they serve your A, MX, TXT, and other records.",
      },
      {
        q: "How many nameservers should a domain have?",
        a: "At least two, for redundancy. Most providers give you two to four. Having more than one ensures DNS keeps working if one server becomes unavailable.",
      },
      {
        q: "Why don't my DNS changes take effect?",
        a: "Usually because your domain's nameservers at the registrar don't point to the DNS provider where you're editing records. Confirm the NS records here match your provider before troubleshooting individual records.",
      },
    ],
  },

  "a-checker": {
    intro:
      "A and AAAA records map your domain to IP addresses — A for IPv4, AAAA for IPv6. They're what turn a hostname into an actual server your visitors can reach. This tool looks up both record types for any domain in a single check.",
    what: [
      {
        heading: "What this tool checks",
        body: "It resolves both the A (IPv4) and AAAA (IPv6) records for your domain and lists every address returned, so you can confirm your domain points where it should.",
      },
      {
        heading: "IPv4 vs IPv6",
        body: "A records return IPv4 addresses like 93.184.216.34. AAAA records return IPv6 addresses. Not every domain publishes AAAA records yet, so an empty IPv6 result is common and usually not a problem.",
      },
    ],
    faq: [
      {
        q: "What is the difference between an A and AAAA record?",
        a: "An A record maps a hostname to an IPv4 address; an AAAA record maps it to an IPv6 address. Both serve the same purpose for their respective IP versions.",
      },
      {
        q: "Do I need an AAAA record?",
        a: "It's optional but increasingly recommended. AAAA records let IPv6-only clients reach your site directly. If your host supports IPv6, publishing an AAAA record improves reach and future-proofs your setup.",
      },
      {
        q: "Why does my domain resolve to multiple IPs?",
        a: "Multiple A records are used for load balancing and redundancy. DNS returns all of them and clients pick one, spreading traffic across servers or CDN edges.",
      },
    ],
  },

  "cname-checker": {
    intro:
      "A CNAME record points one hostname at another, letting a subdomain inherit the target's address. They're widely used for CDNs, verification, and third-party services. This tool resolves the CNAME chain for any hostname.",
    what: [
      {
        heading: "What this tool checks",
        body: "It looks up the CNAME record for a hostname and shows the canonical name it points to. If the hostname has no CNAME, it may be using direct A/AAAA records instead.",
      },
      {
        heading: "Common uses",
        body: "CNAMEs are how you point www at your root domain, connect a subdomain to a service like a CDN or help desk, or satisfy domain-verification requirements from SaaS providers.",
      },
    ],
    faq: [
      {
        q: "What is a CNAME record used for?",
        a: "A CNAME aliases one hostname to another so it resolves to the same address. It's commonly used to point subdomains at CDNs, SaaS platforms, or your root domain.",
      },
      {
        q: "Can the root domain have a CNAME?",
        a: "Not in standard DNS — the root (apex) can't have a CNAME because it conflicts with required records like SOA and NS. Providers offer workarounds such as ALIAS or ANAME records for apex domains.",
      },
      {
        q: "Why isn't my CNAME resolving?",
        a: "Common causes are a typo in the target, the target itself not resolving, or a conflicting record at the same name. Check that the target hostname resolves on its own first.",
      },
    ],
  },

  "txt-checker": {
    intro:
      "TXT records hold arbitrary text in DNS and are used for everything from SPF and DKIM to domain verification for Google, Microsoft, and countless other services. This tool lists every TXT record published for a domain.",
    what: [
      {
        heading: "What this tool checks",
        body: "It retrieves all TXT records for your domain and displays each one in full, so you can audit SPF policies, verification tokens, and any other text records at a glance.",
      },
      {
        heading: "What you'll find",
        body: "Typical TXT records include your SPF policy (v=spf1...), domain-verification strings from various providers, and sometimes DMARC or site-verification tokens. Reviewing them together helps spot duplicates or stale entries.",
      },
    ],
    faq: [
      {
        q: "What are TXT records used for?",
        a: "TXT records store text data in DNS. Their most common uses are email authentication (SPF, DKIM, DMARC) and proving domain ownership to services like Google Workspace and Microsoft 365.",
      },
      {
        q: "How many TXT records can a domain have?",
        a: "A domain can have many TXT records, but only one SPF record specifically. Verification tokens and other TXT entries can coexist freely alongside it.",
      },
      {
        q: "Is there a size limit on TXT records?",
        a: "A single TXT string is capped at 255 characters, but records can be split into multiple strings that are concatenated. Long DKIM keys are often split this way.",
      },
    ],
  },

  "ptr-checker": {
    intro:
      "A PTR record is reverse DNS — it maps an IP address back to a hostname. Mail servers rely on PTR records to verify sending IPs, and a missing or mismatched PTR is a frequent cause of email being rejected. This tool performs a reverse lookup on any IP.",
    what: [
      {
        heading: "What this tool checks",
        body: "It performs a reverse DNS lookup on the IP address you enter and returns the PTR record — the hostname that IP claims to be.",
      },
      {
        heading: "Why PTR matters for email",
        body: "Receiving mail servers check that a sending IP's PTR record resolves and ideally matches the forward DNS. Missing or generic PTR records make your mail look suspicious and hurt deliverability.",
      },
    ],
    faq: [
      {
        q: "What is a PTR record?",
        a: "A PTR (pointer) record maps an IP address to a hostname — the reverse of an A record. It's the basis of reverse DNS lookups.",
      },
      {
        q: "Why do mail servers need a PTR record?",
        a: "Many receiving servers reject or downgrade mail from IPs without a valid PTR record, since legitimate mail servers almost always have proper reverse DNS. A matching forward and reverse record signals a trustworthy sender.",
      },
      {
        q: "How do I set up a PTR record?",
        a: "PTR records are managed by whoever controls the IP block — usually your hosting provider or ISP, not your domain registrar. You'll need to request the PTR entry through them.",
      },
    ],
  },

  "propagation-checker": {
    intro:
      "When you change a DNS record, the update doesn't reach every resolver instantly — it propagates gradually as caches expire. This tool queries several major public resolvers at once so you can see how far a change has spread and whether they all agree.",
    what: [
      {
        heading: "What this tool checks",
        body: "It sends the same DNS query to Google, Cloudflare, Quad9, and OpenDNS and shows each resolver's answer side by side, for the record type you select.",
      },
      {
        heading: "Reading propagation status",
        body: "If all resolvers return the same up-to-date answer, your change has propagated. If some still show the old value, they're serving cached data that will refresh once the record's TTL expires.",
      },
    ],
    faq: [
      {
        q: "How long does DNS propagation take?",
        a: "It depends on the record's TTL. Changes usually appear within minutes to a few hours, but can take up to 48 hours in the worst case if the previous TTL was long.",
      },
      {
        q: "Why do different resolvers show different results?",
        a: "Each resolver caches records independently. After a change, some may still serve the old cached value until its TTL expires, so you'll see a mix until propagation completes.",
      },
      {
        q: "How can I make DNS changes propagate faster?",
        a: "Lower the record's TTL a day or two before making a change. A shorter TTL means resolvers refresh sooner, so your update spreads more quickly when you make it.",
      },
    ],
  },

  "subdomain-checker": {
    intro:
      "Subdomains often expose services you've forgotten about — old staging sites, admin panels, or mail interfaces. Enumerating them is a basic step in understanding your domain's footprint. This tool scans a domain for commonly used subdomains.",
    what: [
      {
        heading: "What this tool checks",
        body: "It tests a curated list of common subdomain names (mail, vpn, cpanel, dev, staging, and more) against your domain and reports which ones resolve to an IP address.",
      },
      {
        heading: "Why enumerate subdomains",
        body: "Discovered subdomains reveal your attack surface. Forgotten dev or admin subdomains are a frequent security weak point, and reviewing what's live helps you decommission what shouldn't be.",
      },
    ],
    faq: [
      {
        q: "What is subdomain enumeration?",
        a: "Subdomain enumeration is the process of discovering the subdomains that exist under a domain. It's used in security assessments to map a domain's full footprint and attack surface.",
      },
      {
        q: "Is scanning subdomains legal?",
        a: "Checking DNS resolution for subdomains uses public DNS data and is generally fine for domains you own or are authorized to assess. Always have permission before testing domains you don't control.",
      },
      {
        q: "Why should I care about old subdomains?",
        a: "Forgotten subdomains — old staging servers, unused admin panels — often run outdated software and become security liabilities. Finding them lets you secure or remove them.",
      },
    ],
  },

  "whois-checker": {
    intro:
      "WHOIS records reveal a domain's registrar, registration and expiry dates, and status. It's the fastest way to see who a domain is registered with and when it needs renewing. This tool queries WHOIS and shows both parsed fields and the raw registry response.",
    what: [
      {
        heading: "What this tool checks",
        body: "It starts at IANA, follows the referral to the correct registry and registrar WHOIS servers, and returns the registration details along with the raw response for anything the parser doesn't structure.",
      },
      {
        heading: "Why registrars differ",
        body: "WHOIS output isn't standardized, so different registrars format their responses differently and some redact contact details for privacy. The raw response ensures you see everything that was returned, even when parsing is incomplete.",
      },
    ],
    faq: [
      {
        q: "What information does WHOIS show?",
        a: "WHOIS typically shows the registrar, creation and expiry dates, domain status codes, and nameservers. Contact details are often redacted for privacy under GDPR and registrar privacy services.",
      },
      {
        q: "Why is some WHOIS data hidden?",
        a: "Privacy regulations and registrar privacy services mask personal contact details to protect owners from spam and abuse. Registration and expiry dates usually remain visible.",
      },
      {
        q: "How do I find when a domain expires?",
        a: "The expiry date appears in the WHOIS response, often labeled Registry Expiry Date or Expiration Date. This checker surfaces it in the parsed fields when the registrar provides it.",
      },
    ],
  },

  "blacklist-checker": {
    intro:
      "If your domain or mail server IP lands on a DNS blocklist (RBL), your email starts bouncing or landing in spam across many providers at once. This tool checks your target against several major real-time blocklists so you can catch listings early.",
    what: [
      {
        heading: "What this tool checks",
        body: "It resolves your domain or IP to an address and queries it against major RBLs including Spamhaus, SpamCop, Barracuda, and SORBS, reporting whether each one lists you.",
      },
      {
        heading: "If you're listed",
        body: "A listing means that blocklist has flagged your IP for spam or abuse. Each RBL has its own delisting process. Fix the underlying cause first — compromised accounts, misconfiguration, or an open relay — then request removal.",
      },
    ],
    faq: [
      {
        q: "What is a DNS blacklist (RBL)?",
        a: "A DNS-based blocklist is a published list of IPs known for sending spam or abuse. Mail servers query these lists to decide whether to accept, flag, or reject incoming mail from an IP.",
      },
      {
        q: "How do I get removed from a blacklist?",
        a: "First fix the cause — secure compromised accounts, close open relays, correct misconfigurations. Then use the specific blocklist's delisting form. Removal is often quick once the problem is resolved.",
      },
      {
        q: "Why is my IP on a blacklist?",
        a: "Common reasons include a compromised account sending spam, a misconfigured or open mail relay, shared hosting where another user was flagged, or a sudden spike in outbound volume that looks abusive.",
      },
    ],
  },

  "axfr-checker": {
    intro:
      "A DNS zone transfer (AXFR) is meant to sync records between your own nameservers — but if a server allows anyone to request one, it hands over your entire DNS zone, exposing every host you have. This tool actually attempts a transfer against each nameserver to test whether they're locked down.",
    what: [
      {
        heading: "What this tool checks",
        body: "It finds your domain's nameservers and sends a real AXFR request to each over TCP port 53, reporting whether the transfer is refused (secure) or allowed (a serious exposure).",
      },
      {
        heading: "What a good result looks like",
        body: "Nearly all correctly configured nameservers refuse public AXFR requests — that's the secure, expected outcome. If any server allows the transfer, restrict zone transfers to authorized secondary servers immediately.",
      },
    ],
    faq: [
      {
        q: "What is a DNS zone transfer?",
        a: "A zone transfer (AXFR) copies all records in a DNS zone from one nameserver to another. It's a legitimate replication mechanism, but should only be allowed between your own authorized servers.",
      },
      {
        q: "Why is an open zone transfer dangerous?",
        a: "It lets anyone download your complete DNS zone — every subdomain, mail server, and internal host you've published. That's a detailed map of your infrastructure handed to potential attackers.",
      },
      {
        q: "How do I fix an exposed zone transfer?",
        a: "Restrict AXFR to specific authorized secondary nameserver IPs in your DNS server configuration, or disable transfers entirely if you don't use secondaries. Most managed DNS providers block public AXFR by default.",
      },
    ],
  },

  "port-checker": {
    intro:
      "Email and web services rely on specific TCP ports being reachable — SMTP on 25, submission on 587, IMAPS on 993, and so on. If a required port is closed or firewalled, the corresponding service won't work. This tool probes common mail, web, and control-panel ports on a public host.",
    what: [
      {
        heading: "What this tool checks",
        body: "It attempts TCP connections to a set of common ports (SMTP, submission, POP3, IMAP, HTTP, HTTPS, and hosting control panels) on the host you enter, and reports which are open. Private and internal addresses are blocked for safety.",
      },
      {
        heading: "Reading the results",
        body: "An open port means the service is reachable from the internet. A closed port could mean the service isn't running, or that a firewall is blocking it. For mail servers, ports 25, 587, and 465 are the ones that matter most.",
      },
    ],
    faq: [
      {
        q: "Which ports does an email server use?",
        a: "SMTP uses port 25 for server-to-server delivery, 587 for authenticated submission with STARTTLS, and 465 for implicit TLS submission. POP3 uses 110/995 and IMAP uses 143/993.",
      },
      {
        q: "Why is port 25 blocked?",
        a: "Many ISPs and cloud providers block outbound port 25 by default to curb spam. This is why authenticated submission on port 587 is preferred for sending mail from applications and clients.",
      },
      {
        q: "What does a closed port mean?",
        a: "A closed port means no service accepted the connection — either nothing is listening on that port, or a firewall is blocking it. For a service you expect to be running, check the service status and firewall rules.",
      },
    ],
  },

  "reputation-checker": {
    intro:
      "Your domain's email reputation is the sum of many signals: proper authentication, correct mail configuration, and a clean safety record. This tool runs those checks together and produces a single score with concrete, prioritized fixes for anything that's dragging it down.",
    what: [
      {
        heading: "What this tool checks",
        body: "It evaluates your SPF and DMARC records, confirms MX records are configured, and checks the domain against Google Safe Browsing. Each factor adjusts the score, and every failure comes with a specific suggestion.",
      },
      {
        heading: "How the score works",
        body: "The score starts at 100 and drops for each missing or misconfigured element, weighted by impact — missing DMARC costs more than a missing AAAA record. The result is a snapshot of email trustworthiness with a clear path to improvement.",
      },
    ],
    faq: [
      {
        q: "What affects domain email reputation?",
        a: "The biggest factors are proper SPF, DKIM, and DMARC setup, correct MX configuration, a clean sending history, and not appearing on blocklists or threat databases. Consistent, authenticated sending builds reputation over time.",
      },
      {
        q: "How can I improve my domain's reputation?",
        a: "Publish valid SPF, DKIM, and DMARC records, keep your mail configuration correct, avoid sending to invalid addresses, and monitor blocklists. Fix any issues this tool flags, starting with authentication.",
      },
      {
        q: "Does domain age affect reputation?",
        a: "Established domains with a consistent sending history are generally trusted more than brand-new ones. New domains should warm up gradually and get authentication right from day one to build reputation.",
      },
    ],
  },
};

export function getToolContent(slug: string): ToolContent | undefined {
  return TOOL_CONTENT[slug];
}
