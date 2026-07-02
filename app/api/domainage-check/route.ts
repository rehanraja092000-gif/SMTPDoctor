import { NextResponse } from "next/server";
import { rawWhoisLookup } from "../../../lib/whoisRaw";
import { isValidDomain, normalizeDomain } from "../../../lib/validation";

function parseDate(raw: string, patterns: RegExp[]): string | null {
  for (const re of patterns) {
    const m = raw.match(re);
    if (m && m[1]) {
      const d = new Date(m[1].trim());
      if (!isNaN(d.getTime())) return d.toISOString();
    }
  }
  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("domain");
  if (!raw) return NextResponse.json({ error: "Domain is required" }, { status: 400 });

  const domain = normalizeDomain(raw);
  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: "Enter a valid domain, e.g. example.com" }, { status: 400 });
  }

  try {
    const { raw: whoisText } = await rawWhoisLookup(domain);

    const created = parseDate(whoisText, [
      /Creation Date:\s*(.+)/i,
      /Created On:\s*(.+)/i,
      /Registered on:\s*(.+)/i,
      /created:\s*(.+)/i,
    ]);
    const expires = parseDate(whoisText, [
      /Registry Expiry Date:\s*(.+)/i,
      /Expiration Date:\s*(.+)/i,
      /Expiry Date:\s*(.+)/i,
      /paid-till:\s*(.+)/i,
    ]);
    const updated = parseDate(whoisText, [
      /Updated Date:\s*(.+)/i,
      /last-update:\s*(.+)/i,
    ]);

    let ageDays: number | null = null;
    let ageDisplay: string | null = null;
    if (created) {
      ageDays = Math.floor((Date.now() - new Date(created).getTime()) / 86400000);
      const years = Math.floor(ageDays / 365);
      const days = ageDays % 365;
      ageDisplay = years > 0 ? `${years} year${years !== 1 ? "s" : ""}, ${days} day${days !== 1 ? "s" : ""}` : `${ageDays} days`;
    }

    return NextResponse.json({
      domain,
      status: created ? "Registration data found" : "No registration date available",
      created,
      updated,
      expires,
      ageDays,
      ageDisplay,
      note: created && ageDays !== null && ageDays < 90
        ? "This is a newly registered domain (under 90 days). New domains carry less sending reputation and are more often associated with abuse."
        : null,
    });
  } catch {
    return NextResponse.json({
      domain,
      status: "WHOIS lookup failed",
      created: null,
      error: "Could not retrieve registration data",
    });
  }
}
