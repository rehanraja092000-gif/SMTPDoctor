import { NextResponse } from "next/server";
import { Resolver } from "node:dns/promises";
import { isValidDomain, normalizeDomain } from "../../../lib/validation";
import { errorInfo } from "../../../lib/errors";

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

  try {
    const records = await resolver.resolveCaa(domain);
    const formatted = records.map((r) => {
      if (r.issue !== undefined) return { tag: "issue", value: r.issue, critical: r.critical };
      if (r.issuewild !== undefined) return { tag: "issuewild", value: r.issuewild, critical: r.critical };
      if (r.iodef !== undefined) return { tag: "iodef", value: r.iodef, critical: r.critical };
      return { tag: "unknown", value: JSON.stringify(r), critical: r.critical };
    });

    return NextResponse.json({
      domain,
      status: formatted.length > 0 ? "CAA records found" : "No CAA records",
      hasPolicy: formatted.length > 0,
      records: formatted,
      note: formatted.length === 0
        ? "No CAA records means any certificate authority can issue certificates for this domain. Adding CAA records restricts which CAs are allowed."
        : null,
    });
  } catch (error) {
    const { code } = errorInfo(error);
    return NextResponse.json({
      domain,
      status: "No CAA records",
      hasPolicy: false,
      records: [],
      note: "No CAA records found. Any certificate authority can issue certificates for this domain.",
      error: code,
    });
  }
}
