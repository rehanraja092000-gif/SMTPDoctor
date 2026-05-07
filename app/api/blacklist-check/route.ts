import { NextResponse } from "next/server";
import dns from "node:dns/promises";
import net from "node:net";

const BLACKLISTS = [
  "zen.spamhaus.org",
  "bl.spamcop.net",
  "b.barracudacentral.org",
  "dnsbl.sorbs.net",
];

function reverseIP(ip: string) {
  return ip.split(".").reverse().join(".");
}

async function resolveToIP(input: string) {
  if (net.isIP(input)) return input;

  try {
    const result = await dns.lookup(input);
    return result.address;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("target");

  if (!target) {
    return NextResponse.json(
      { error: "Target is required" },
      { status: 400 }
    );
  }

  const ip = await resolveToIP(target);

  if (!ip || !net.isIP(ip)) {
    return NextResponse.json({
      target,
      status: "Invalid target",
      results: [],
    });
  }

  const reversed = reverseIP(ip);
  const results = [];

  for (const blacklist of BLACKLISTS) {
    const query = `${reversed}.${blacklist}`;

    try {
      await dns.resolve(query, "A");

      results.push({
        blacklist,
        listed: true,
      });
    } catch {
      results.push({
        blacklist,
        listed: false,
      });
    }
  }

  return NextResponse.json({
    target,
    ip,
    status: "Lookup completed",
    results,
  });
}