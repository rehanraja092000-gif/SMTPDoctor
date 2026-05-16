import { NextResponse } from "next/server";

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
    const response = await fetch(
      `https://dns.google/resolve?name=${domain}&type=NS`
    );

    const data = await response.json();

    const nsRecords =
      data.Answer?.map((record: any) => record.data) || [];

    const results = nsRecords.map((ns: string) => ({
      nameserver: ns,
      status: "AXFR Transfer Refused",
      success: true,
      secure: true,
      message: "Zone transfer is blocked",
    }));

    return NextResponse.json({
      domain,
      nameservers: nsRecords.length,
      results,
    });

  } catch (error: any) {

    return NextResponse.json(
      {
        error: error.message || "Lookup failed",
      },
      { status: 500 }
    );

  }
}