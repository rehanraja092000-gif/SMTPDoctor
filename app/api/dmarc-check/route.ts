import { NextResponse } from "next/server";
import { Resolver } from "node:dns/promises";
import { isValidDomain, normalizeDomain } from "../../../lib/validation";

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

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

  const host = `_dmarc.${domain}`;

  try {
    const txt = await resolver.resolveTxt(host);
    const record = txt.flat().join("");

    if (record.includes("v=DMARC1")) {
      return NextResponse.json({
        domain,
        status: "DMARC record found",
        host,
        record,
      });
    }

    return NextResponse.json({
      domain,
      status: "No DMARC record found",
      host,
    });
  } catch {
    return NextResponse.json({
      domain,
      status: "No DMARC record found",
      host,
    });
  }
}
