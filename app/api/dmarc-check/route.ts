import { NextResponse } from "next/server";
import { Resolver } from "node:dns/promises";

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json(
      { error: "Domain is required" },
      { status: 400 }
    );
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
  } catch {}

  return NextResponse.json({
    domain,
    status: "No DMARC record found",
  });
}