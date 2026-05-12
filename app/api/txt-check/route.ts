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

  try {
    const records = await resolver.resolveTxt(domain);

    const formatted = records.map((r) => r.join(""));

    return NextResponse.json({
      domain,
      status: "TXT records found",
      count: formatted.length,
      records: formatted,
    });
  } catch (error: any) {
    return NextResponse.json({
      domain,
      status: "Lookup failed",
      error: error.code || error.message,
      count: 0,
      records: [],
    });
  }
}