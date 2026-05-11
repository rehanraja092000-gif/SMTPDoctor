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
    status:
      aRecords.length || aaaaRecords.length
        ? "IP records found"
        : "No records found",

    aCount: aRecords.length,
    aaaaCount: aaaaRecords.length,

    aRecords,
    aaaaRecords,
  });
}