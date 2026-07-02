import { NextResponse } from "next/server";
import { analyzeDmarc } from "../../../lib/dmarcParser";
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

  const analysis = await analyzeDmarc(domain);

  return NextResponse.json({
    domain,
    status: analysis.found
      ? analysis.strength === "strong" ? "DMARC enforced"
        : analysis.strength === "moderate" ? "DMARC partially enforced"
        : "DMARC monitoring only"
      : "No DMARC record found",
    ...analysis,
  });
}
