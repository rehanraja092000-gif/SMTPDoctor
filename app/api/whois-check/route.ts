import { NextResponse } from "next/server";
import whois from "whois-json";

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
    const result = await whois(domain);

    return NextResponse.json({
      domain,
      status: "WHOIS data found",
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json({
      domain,
      status: "WHOIS lookup failed",
      error: error.message,
    });
  }
}
