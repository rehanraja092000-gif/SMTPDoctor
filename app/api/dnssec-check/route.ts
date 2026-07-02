import { NextResponse } from "next/server";
import { isValidDomain, normalizeDomain } from "../../../lib/validation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("domain");
  if (!raw) return NextResponse.json({ error: "Domain is required" }, { status: 400 });

  const domain = normalizeDomain(raw);
  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: "Enter a valid domain, e.g. example.com" }, { status: 400 });
  }

  // Use Google's DoH endpoint which reports the AD (Authenticated Data) flag
  // and lets us query DS/DNSKEY records to confirm the chain of trust.
  try {
    const dsRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=DS`, {
      signal: AbortSignal.timeout(5000),
    });
    const dsData = await dsRes.json();

    const dnskeyRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=DNSKEY`, {
      signal: AbortSignal.timeout(5000),
    });
    const dnskeyData = await dnskeyRes.json();

    const hasDS = Array.isArray(dsData.Answer) && dsData.Answer.some((a: { type: number }) => a.type === 43);
    const hasDNSKEY = Array.isArray(dnskeyData.Answer) && dnskeyData.Answer.some((a: { type: number }) => a.type === 48);
    const authenticated = dsData.AD === true || dnskeyData.AD === true;

    const enabled = hasDS && hasDNSKEY;

    return NextResponse.json({
      domain,
      status: enabled ? "DNSSEC enabled" : "DNSSEC not enabled",
      enabled,
      hasDS,
      hasDNSKEY,
      authenticated,
      note: enabled
        ? "DNSSEC is signing this zone, protecting against DNS spoofing and cache poisoning."
        : "DNSSEC is not enabled. Without it, DNS responses for this domain can't be cryptographically verified.",
    });
  } catch {
    return NextResponse.json({
      domain,
      status: "Lookup failed",
      enabled: false,
      error: "Could not query DNSSEC status",
    });
  }
}
