import { NextResponse } from "next/server";
import { Resolver } from "node:dns/promises";
import net from "node:net";

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const ip = searchParams.get("ip");

  if (!ip) {
    return NextResponse.json(
      { error: "IP address is required" },
      { status: 400 }
    );
  }

  if (!net.isIP(ip)) {
    return NextResponse.json({
      ip,
      status: "Invalid IP address",
      count: 0,
      records: [],
    });
  }

  try {
    const records = await resolver.reverse(ip);

    return NextResponse.json({
      ip,
      status: "PTR record found",
      count: records.length,
      records,
    });
  } catch (error: any) {
    return NextResponse.json({
      ip,
      status: "Lookup failed",
      error: error.code || error.message,
      count: 0,
      records: [],
    });
  }
}