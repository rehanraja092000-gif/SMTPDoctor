import { NextResponse } from "next/server";
import { assertPublicHost, isValidDomain, normalizeDomain } from "../../../lib/validation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("domain");
  if (!raw) return NextResponse.json({ error: "Domain is required" }, { status: 400 });

  const domain = normalizeDomain(raw);
  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: "Enter a valid domain, e.g. example.com" }, { status: 400 });
  }

  const check = await assertPublicHost(domain);
  if (!check.ok) {
    return NextResponse.json({ error: `Cannot check this host: ${check.reason}` }, { status: 400 });
  }

  try {
    const res = await fetch(`https://${domain}`, {
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "SMTPDoctor-SecurityScan/1.0" },
    });

    const header = res.headers.get("strict-transport-security");
    if (!header) {
      return NextResponse.json({
        domain,
        status: "HSTS not enabled",
        enabled: false,
        note: "No Strict-Transport-Security header. Browsers won't be forced to use HTTPS, leaving room for downgrade attacks.",
      });
    }

    const maxAgeMatch = header.match(/max-age=(\d+)/i);
    const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 0;
    const includeSubdomains = /includesubdomains/i.test(header);
    const preload = /preload/i.test(header);
    const maxAgeDays = Math.floor(maxAge / 86400);

    const warnings: string[] = [];
    if (maxAge < 15552000) warnings.push("max-age is below the recommended 6 months (15552000 seconds).");
    if (!includeSubdomains) warnings.push("includeSubDomains is not set — subdomains aren't protected.");

    return NextResponse.json({
      domain,
      status: "HSTS enabled",
      enabled: true,
      header,
      maxAge,
      maxAgeDays,
      includeSubdomains,
      preload,
      warnings,
    });
  } catch (err) {
    return NextResponse.json({
      domain,
      status: "Request failed",
      enabled: false,
      error: err instanceof Error ? err.message : "Could not fetch the site over HTTPS",
    });
  }
}
