import { NextResponse } from "next/server";
import { Resolver } from "node:dns/promises";

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  try {
    const txtRecords = await resolver.resolveTxt(domain);
    const flatRecords = txtRecords.flat().map(String);
    const spfRecord = flatRecords.find((r) => r.startsWith("v=spf1"));

    return NextResponse.json({
      domain,
      status: spfRecord ? "SPF record found" : "No SPF record found",
      record: spfRecord || null,
    });
  } catch (error: any) {
    return NextResponse.json({
      domain,
      status: "DNS lookup failed",
      error: error.message,
    });
  }
}