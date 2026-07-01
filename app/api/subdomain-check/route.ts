import { NextResponse } from "next/server";
import { Resolver } from "node:dns/promises";
import { isValidDomain, normalizeDomain } from "../../../lib/validation";

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

const commonSubs = [
  "www", "mail", "smtp", "webmail", "autodiscover", "autoconfig",
  "cpanel", "webdisk", "ftp", "api", "app", "dev", "staging", "admin",
  "portal", "vpn", "mx", "ns1", "ns2", "blog", "shop", "test", "cdn",
  "m", "status", "docs", "support", "beta",
];

async function checkSubdomain(subdomain: string) {
  try {
    const a = await resolver.resolve4(subdomain);
    return { subdomain, found: true, ips: a };
  } catch {
    return null;
  }
}

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

  const checks = commonSubs.map((sub) => checkSubdomain(`${sub}.${domain}`));
  const results = await Promise.all(checks);
  const found = results.filter(Boolean);

  return NextResponse.json({
    domain,
    status: "Subdomain scan completed",
    scanned: commonSubs.length,
    count: found.length,
    records: found,
  });
}
