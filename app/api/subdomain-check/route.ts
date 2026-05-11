import { NextResponse } from "next/server";
import { Resolver } from "node:dns/promises";

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

const commonSubs = [
  "www",
  "mail",
  "smtp",
  "webmail",
  "autodiscover",
  "cpanel",
  "webdisk",
  "ftp",
  "api",
  "app",
  "dev",
  "staging",
  "admin",
  "portal",
  "vpn",
  "mx",
  "ns1",
  "ns2",
  "blog",
  "shop",
  "test",
  "hello",
  "welcome",
];

async function checkSubdomain(subdomain: string) {
  try {
    const a = await resolver.resolve4(subdomain);

    return {
      subdomain,
      found: true,
      ips: a,
    };
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json(
      { error: "Domain is required" },
      { status: 400 }
    );
  }

  const checks = commonSubs.map((sub) =>
    checkSubdomain(`${sub}.${domain}`)
  );

  const results = await Promise.all(checks);

  const found = results.filter(Boolean);

  return NextResponse.json({
    domain,
    status: "Subdomain scan completed",
    count: found.length,
    records: found,
  });
}