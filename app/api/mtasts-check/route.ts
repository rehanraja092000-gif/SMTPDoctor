import { NextResponse } from "next/server";
import { Resolver } from "node:dns/promises";
import { isValidDomain, normalizeDomain } from "../../../lib/validation";

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("domain");
  if (!raw) return NextResponse.json({ error: "Domain is required" }, { status: 400 });

  const domain = normalizeDomain(raw);
  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: "Enter a valid domain, e.g. example.com" }, { status: 400 });
  }

  // 1. DNS TXT record at _mta-sts.<domain>
  let dnsRecord: string | null = null;
  try {
    const txt = await resolver.resolveTxt(`_mta-sts.${domain}`);
    dnsRecord = txt.map((r) => r.join("")).find((r) => /v=STSv1/i.test(r)) || null;
  } catch {}

  // 2. Policy file at https://mta-sts.<domain>/.well-known/mta-sts.txt
  let policy: string | null = null;
  let policyMode: string | null = null;
  try {
    const res = await fetch(`https://mta-sts.${domain}/.well-known/mta-sts.txt`, {
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      policy = (await res.text()).slice(0, 2000);
      const modeMatch = policy.match(/mode:\s*(\w+)/i);
      policyMode = modeMatch ? modeMatch[1] : null;
    }
  } catch {}

  const configured = Boolean(dnsRecord && policy);

  return NextResponse.json({
    domain,
    status: configured ? "MTA-STS configured" : dnsRecord ? "Partial — DNS record only" : "Not configured",
    hasDnsRecord: Boolean(dnsRecord),
    hasPolicy: Boolean(policy),
    dnsRecord,
    policyMode,
    policy,
    note: !configured
      ? "MTA-STS enforces TLS for inbound mail. It needs both a _mta-sts DNS record and a policy file served over HTTPS."
      : null,
  });
}
