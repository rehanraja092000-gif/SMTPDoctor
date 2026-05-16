import { NextResponse } from "next/server";
import dns from "dns/promises";

const GOOGLE_API_KEY =
  process.env.GOOGLE_SAFE_BROWSING_API_KEY;

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

  let score = 100;

  const checks = [];

  try {

    // SPF CHECK
    try {

      const txtRecords = await dns.resolveTxt(domain);

      let hasSPF = false;

      for (const record of txtRecords) {

        const value = record.join("");

        if (
          value.toLowerCase().includes("v=spf1")
        ) {
          hasSPF = true;
          break;
        }

      }

      if (hasSPF) {

        checks.push({
          name: "SPF Record",
          status: "Valid",
          success: true,
          impact: "+15",
          message: "SPF record detected",
        });

      } else {

        score -= 15;

        checks.push({
          name: "SPF Record",
          status: "Missing",
          success: false,
          impact: "-15",
          message: "No SPF record found",
        });

      }

    } catch {

      score -= 15;

      checks.push({
        name: "SPF Record",
        status: "Missing",
        success: false,
        impact: "-15",
        message: "No SPF record found",
      });

    }

    // DMARC CHECK
    try {

      const dmarcRecords = await dns.resolveTxt(
        `_dmarc.${domain}`
      );

      let hasDMARC = false;

      for (const record of dmarcRecords) {

        const value = record.join("");

        if (
          value.toLowerCase().includes("v=dmarc1")
        ) {
          hasDMARC = true;
          break;
        }

      }

      if (hasDMARC) {

        checks.push({
          name: "DMARC Record",
          status: "Valid",
          success: true,
          impact: "+20",
          message: "DMARC policy detected",
        });

      } else {

        score -= 20;

        checks.push({
          name: "DMARC Record",
          status: "Missing",
          success: false,
          impact: "-20",
          message: "No DMARC policy found",
        });

      }

    } catch {

      score -= 20;

      checks.push({
        name: "DMARC Record",
        status: "Missing",
        success: false,
        impact: "-20",
        message: "No DMARC policy found",
      });

    }

    // MX CHECK
    try {

      const mx = await dns.resolveMx(domain);

      if (mx && mx.length > 0) {

        checks.push({
          name: "MX Records",
          status: "Configured",
          success: true,
          impact: "+10",
          message: "Mail servers detected",
        });

      } else {

        score -= 10;

        checks.push({
          name: "MX Records",
          status: "Missing",
          success: false,
          impact: "-10",
          message: "No MX records found",
        });

      }

    } catch {

      score -= 10;

      checks.push({
        name: "MX Records",
        status: "Missing",
        success: false,
        impact: "-10",
        message: "No MX records found",
      });

    }

    // GOOGLE SAFE BROWSING
    let unsafe = false;

    try {

      const response = await fetch(
        `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client: {
              clientId: "smtpdoctor",
              clientVersion: "1.0",
            },
            threatInfo: {
              threatTypes: [
                "MALWARE",
                "SOCIAL_ENGINEERING",
                "UNWANTED_SOFTWARE",
              ],
              platformTypes: ["ANY_PLATFORM"],
              threatEntryTypes: ["URL"],
              threatEntries: [
                {
                  url: `http://${domain}`,
                },
              ],
            },
          }),
        }
      );

      const data = await response.json();

      if (data.matches) {

        unsafe = true;

        score -= 50;

        checks.push({
          name: "Google Safe Browsing",
          status: "Dangerous",
          success: false,
          impact: "-50",
          message:
            "Google flagged this domain as unsafe",
        });

      } else {

        checks.push({
          name: "Google Safe Browsing",
          status: "Clean",
          success: true,
          impact: "+0",
          message:
            "No malware or phishing detected",
        });

      }

    } catch {

      checks.push({
        name: "Google Safe Browsing",
        status: "Unavailable",
        success: false,
        impact: "0",
        message:
          "Unable to query Google Safe Browsing",
      });

    }

    // SUSPICIOUS KEYWORDS
    const suspiciousWords = [
      "spam",
      "hack",
      "phish",
      "fake",
      "scam",
    ];

    const lower = domain.toLowerCase();

    const suspicious = suspiciousWords.some((w) =>
      lower.includes(w)
    );

    if (suspicious) {

      score -= 20;

      checks.push({
        name: "Suspicious Keywords",
        status: "Detected",
        success: false,
        impact: "-20",
        message:
          "Domain contains suspicious wording",
      });

    } else {

      checks.push({
        name: "Suspicious Keywords",
        status: "Clean",
        success: true,
        impact: "+0",
        message:
          "No suspicious keywords detected",
      });

    }

    // FINAL STATUS
    let overallStatus = "Excellent";

    if (score < 90) overallStatus = "Good";
    if (score < 75) overallStatus = "Average";
    if (score < 50) overallStatus = "Poor";
    if (score < 25) overallStatus = "Dangerous";

    if (score < 0) score = 0;

    return NextResponse.json({
      domain,
      overallStatus,
      score,
      unsafe,
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