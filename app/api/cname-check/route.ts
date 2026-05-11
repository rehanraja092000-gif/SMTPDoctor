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
    const records = await resolver.resolveCname(domain);

    return NextResponse.json({
      domain,
      status: "CNAME record found",
      count: records.length,
      records,
    });
  } catch (error: any) {
    return NextResponse.json({
      domain,
      status: "No CNAME record found",
      error: error.code || error.message,
      count: 0,
      records: [],
    });
  }
}