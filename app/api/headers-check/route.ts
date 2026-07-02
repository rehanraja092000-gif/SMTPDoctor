import { NextResponse } from "next/server";
import { assertPublicHost, isValidDomain, normalizeDomain } from "../../../lib/validation";

const SECURITY_HEADERS = [
  { key: "strict-transport-security", name: "Strict-Transport-Security", why: "Forces HTTPS, preventing downgrade attacks" },
  { key: "content-security-policy", name: "Content-Security-Policy", why: "Mitigates XSS and injection attacks" },
  { key: "x-frame-options", name: "X-Frame-Options", why: "Prevents clickjacking via framing" },
  { key: "x-content-type-options", name: "X-Content-Type-Options", why: "Stops MIME-type sniffing" },
  { key: "referrer-policy", name: "Referrer-Policy", why: "Controls referrer information leakage" },
  { key: "permissions-policy", name: "Permissions-Policy", why: "Restricts browser feature access" },
];

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
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "SMTPDoctor-SecurityScan/1.0" },
    });

    const results = SECURITY_HEADERS.map((h) => {
      const value = res.headers.get(h.key);
      return { name: h.name, present: Boolean(value), value: value || null, why: h.why };
    });

    const presentCount = results.filter((r) => r.present).length;

    return NextResponse.json({
      domain,
      status: `${presentCount} of ${SECURITY_HEADERS.length} present`,
      httpStatus: res.status,
      presentCount,
      total: SECURITY_HEADERS.length,
      results,
    });
  } catch (err) {
    return NextResponse.json({
      domain,
      status: "Request failed",
      error: err instanceof Error ? err.message : "Could not fetch the site over HTTPS",
    });
  }
}
