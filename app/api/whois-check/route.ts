import { NextResponse } from "next/server";
import whois from "whois-json";
import { rawWhoisLookup } from "../../../lib/whoisRaw";
import { isValidDomain, normalizeDomain } from "../../../lib/validation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("domain");

  if (!raw) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  const domain = normalizeDomain(raw);

  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: "Enter a valid domain, e.g. example.com" }, { status: 400 });
  }

  // whois-json gives a nicely parsed shape when the registrar's format is
  // recognized, but some registrars (GoDaddy in particular) return very
  // little to it. Always also fetch the raw WHOIS text as a reliable
  // fallback — the same text a `whois` CLI would show.
  const [parsedResult, rawResult] = await Promise.allSettled([
    whois(domain),
    rawWhoisLookup(domain),
  ]);

  const data = parsedResult.status === "fulfilled" ? parsedResult.value : null;
  const rawText = rawResult.status === "fulfilled" ? rawResult.value.raw : null;
  const rawServer = rawResult.status === "fulfilled" ? rawResult.value.server : null;

  if (!data && !rawText) {
    return NextResponse.json({
      domain,
      status: "WHOIS lookup failed",
      error: "No WHOIS server responded",
    });
  }

  const parsedLooksUseful =
    data && Object.values(data).filter((v) => v !== undefined && v !== null && v !== "").length > 2;

  return NextResponse.json({
    domain,
    status: "WHOIS data found",
    data: parsedLooksUseful ? data : null,
    raw: rawText,
    rawServer,
  });
}
