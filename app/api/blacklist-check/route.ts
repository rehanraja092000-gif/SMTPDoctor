import { NextResponse } from "next/server";
import dns from "node:dns/promises";
import net from "node:net";
import { isValidDomain } from "../../../lib/validation";

const BLACKLISTS = [
  "zen.spamhaus.org",
  "bl.spamcop.net",
  "b.barracudacentral.org",
  "dnsbl.sorbs.net",
  "spam.dnsbl.sorbs.net",
  "cbl.abuseat.org",
  "dnsbl-1.uceprotect.net",
  "psbl.surriel.com",
  "db.wpbl.info",
  "bl.mailspike.net",
  "dnsbl.dronebl.org",
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
  const raw = searchParams.get("target");

  if (!raw) {
    return NextResponse.json({ error: "Target is required" }, { status: 400 });
  }

  const target = raw.trim();

  if (!net.isIP(target) && !isValidDomain(target)) {
    return NextResponse.json({ error: "Enter a valid domain or IP address" }, { status: 400 });
  }

  const ip = await resolveToIP(target);

  if (!ip || !net.isIP(ip) || !net.isIPv4(ip)) {
    return NextResponse.json({
      target,
      status: ip && net.isIPv6(ip) ? "IPv6 targets are not yet supported for blacklist checks" : "Invalid target",
      results: [],
    });
  }

  const reversed = reverseIP(ip);
  const results = [];

  for (const blacklist of BLACKLISTS) {
    const query = `${reversed}.${blacklist}`;
    try {
      await dns.resolve(query, "A");
      results.push({ blacklist, listed: true });
    } catch {
      results.push({ blacklist, listed: false });
    }
  }

  return NextResponse.json({
    target,
    ip,
    status: "Lookup completed",
    results,
  });
}
