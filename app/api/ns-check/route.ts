import { NextResponse } from "next/server";
import { Resolver } from "node:dns/promises";
import { isValidDomain, normalizeDomain } from "../../../lib/validation";
import { errorInfo } from "../../../lib/errors";

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

  try {
    const records = await resolver.resolveNs(domain);

    return NextResponse.json({
      domain,
      status: "NS records found",
      count: records.length,
      records,
    });
  } catch (error) {
    const { code, message } = errorInfo(error);
    return NextResponse.json({
      domain,
      status: "Lookup failed",
      error: code || message,
      count: 0,
      records: [],
    });
  }
}
