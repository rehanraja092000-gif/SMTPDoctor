import { NextResponse } from "next/server";
import { analyzeSpf } from "../../../lib/spfParser";
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

  const analysis = await analyzeSpf(domain);

  return NextResponse.json({
    domain,
    status: analysis.found
      ? analysis.valid ? "SPF record valid" : "SPF record has issues"
      : "No SPF record found",
    ...analysis,
  });
}
