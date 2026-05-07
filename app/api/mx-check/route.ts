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
    const records = await resolver.resolveMx(domain);

    const sorted = records.sort((a, b) => a.priority - b.priority);

    return NextResponse.json({
      domain,
      status: "MX records found",
      count: sorted.length,
      records: sorted,
    });
  } catch {
    return NextResponse.json({
      domain,
      status: "No MX records found",
      count: 0,
      records: [],
    });
  }
}