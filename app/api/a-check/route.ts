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

  let aRecords: string[] = [];
  let aaaaRecords: string[] = [];

  try {
    aRecords = await resolver.resolve4(domain);
  } catch {}

  try {
    aaaaRecords = await resolver.resolve6(domain);
  } catch {}

  return NextResponse.json({
    domain,
    status: aRecords.length || aaaaRecords.length ? "IP records found" : "No records found",
    aCount: aRecords.length,
    aaaaCount: aaaaRecords.length,
    aRecords,
    aaaaRecords,
  });
}
