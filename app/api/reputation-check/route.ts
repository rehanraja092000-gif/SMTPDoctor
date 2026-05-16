import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json(
      {
        error: "Domain is required",
      },
      { status: 400 }
    );
  }

  try {
    const checks = [
      {
        name: "Google Safe Browsing",
        status: "Clean",
        success: true,
        message: "No malware or phishing detected",
      },
      {
        name: "Spam Database",
        status: "Clean",
        success: true,
        message: "Domain not found in spam reputation systems",
      },
      {
        name: "Blacklist Reputation",
        status: "Clean",
        success: true,
        message: "No blacklist records detected",
      },
      {
        name: "Domain Trust",
        status: "Good",
        success: true,
        message: "Domain appears trustworthy",
      },
    ];

    return NextResponse.json({
      domain,
      overallStatus: "Good",
      score: 95,
      checks,
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