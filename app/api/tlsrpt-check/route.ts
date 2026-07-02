import { NextResponse } from "next/server";
import { Resolver } from "node:dns/promises";
import { isValidDomain, normalizeDomain } from "../../../lib/validation";

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

  let record: string | null = null;
  try {
    const txt = await resolver.resolveTxt(`_smtp._tls.${domain}`);
    record = txt.map((r) => r.join("")).find((r) => /v=TLSRPTv1/i.test(r)) || null;
  } catch {}

  const rua = record?.match(/rua=([^;]+)/i)?.[1]?.trim() || null;

  return NextResponse.json({
    domain,
    status: record ? "TLS-RPT configured" : "Not configured",
    found: Boolean(record),
    record,
    reportAddress: rua,
    note: !record
      ? "TLS-RPT lets receiving servers send you reports when TLS negotiation for your mail fails. Pairs with MTA-STS."
      : null,
  });
}
