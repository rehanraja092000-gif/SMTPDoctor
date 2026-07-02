import { NextResponse } from "next/server";
import { Resolver } from "node:dns/promises";
import { isValidDomain, normalizeDomain } from "../../../lib/validation";

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("domain");
  const selector = (searchParams.get("selector") || "default").replace(/[^a-z0-9_-]/gi, "");
  if (!raw) return NextResponse.json({ error: "Domain is required" }, { status: 400 });

  const domain = normalizeDomain(raw);
  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: "Enter a valid domain, e.g. example.com" }, { status: 400 });
  }

  let record: string | null = null;
  try {
    const txt = await resolver.resolveTxt(`${selector}._bimi.${domain}`);
    record = txt.map((r) => r.join("")).find((r) => /v=BIMI1/i.test(r)) || null;
  } catch {}

  const logoUrl = record?.match(/l=([^;]+)/i)?.[1]?.trim() || null;
  const vmcUrl = record?.match(/a=([^;]+)/i)?.[1]?.trim() || null;

  return NextResponse.json({
    domain,
    selector,
    status: record ? "BIMI record found" : "No BIMI record",
    found: Boolean(record),
    record,
    logoUrl,
    vmcUrl,
    note: !record
      ? "BIMI displays your brand logo next to authenticated email. It requires DMARC at enforcement (quarantine or reject) first."
      : vmcUrl ? null : "BIMI found, but no VMC (verified mark certificate). Gmail and others often require a VMC to show the logo.",
  });
}
