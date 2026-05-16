import { NextResponse } from "next/server";

const GOOGLE_API_KEY =
  process.env.GOOGLE_SAFE_BROWSING_API_KEY;

async function resolveDNS(
  name: string,
  type: string
) {
  const url =
    `https://dns.google/resolve?name=${name}&type=${type}`;

  const res = await fetch(url);

  return res.json();
}

export async function GET(req: Request) {

  const { searchParams } =
    new URL(req.url);

  const domain =
    searchParams.get("domain");

  if (!domain) {

    return NextResponse.json(
      {
        error:
          "Domain is required",
      },
      { status: 400 }
    );

  }

  let score = 100;

  let unsafe = false;

  const checks: any[] = [];

  const suggestions: string[] =
    [];

  try {

    // SPF CHECK
    try {

      const spfData =
        await resolveDNS(
          domain,
          "TXT"
        );

      const answers =
        spfData.Answer || [];

      const hasSPF =
        answers.some(
          (a: any) =>
            a.data &&
            a.data
              .toLowerCase()
              .includes(
                "v=spf1"
              )
        );

      if (hasSPF) {

        checks.push({
          name:
            "SPF Record",
          status:
            "Valid",
          success: true,
          impact:
            "+15",
          message:
            "SPF record detected",
        });

      } else {

        score -= 15;

        suggestions.push(
          "Add a valid SPF record to improve email trust and deliverability."
        );

        checks.push({
          name:
            "SPF Record",
          status:
            "Missing",
          success: false,
          impact:
            "-15",
          message:
            "No SPF record found",
        });

      }

    } catch {

      score -= 15;

      suggestions.push(
        "Add a valid SPF record to improve email trust and deliverability."
      );

      checks.push({
        name:
          "SPF Record",
        status:
          "Missing",
        success: false,
        impact:
          "-15",
        message:
          "No SPF record found",
      });

    }

    // DMARC CHECK
    try {

      const dmarcData =
        await resolveDNS(
          `_dmarc.${domain}`,
          "TXT"
        );

      const answers =
        dmarcData.Answer || [];

      const hasDMARC =
        answers.some(
          (a: any) =>
            a.data &&
            a.data
              .toLowerCase()
              .includes(
                "v=dmarc1"
              )
        );

      if (hasDMARC) {

        checks.push({
          name:
            "DMARC Record",
          status:
            "Valid",
          success: true,
          impact:
            "+20",
          message:
            "DMARC policy detected",
        });

      } else {

        score -= 20;

        suggestions.push(
          "Configure a DMARC policy to protect against spoofing and phishing."
        );

        checks.push({
          name:
            "DMARC Record",
          status:
            "Missing",
          success: false,
          impact:
            "-20",
          message:
            "No DMARC policy found",
        });

      }

    } catch {

      score -= 20;

      suggestions.push(
        "Configure a DMARC policy to protect against spoofing and phishing."
      );

      checks.push({
        name:
          "DMARC Record",
        status:
          "Missing",
        success: false,
        impact:
          "-20",
        message:
          "No DMARC policy found",
      });

    }

    // MX CHECK
    try {

      const mxData =
        await resolveDNS(
          domain,
          "MX"
        );

      const answers =
        mxData.Answer || [];

      if (
        answers.length > 0
      ) {

        checks.push({
          name:
            "MX Records",
          status:
            "Configured",
          success: true,
          impact:
            "+10",
          message:
            "Mail servers detected",
        });

      } else {

        score -= 10;

        suggestions.push(
          "Configure MX records so email services can properly receive mail."
        );

        checks.push({
          name:
            "MX Records",
          status:
            "Missing",
          success: false,
          impact:
            "-10",
          message:
            "No MX records found",
        });

      }

    } catch {

      score -= 10;

      suggestions.push(
        "Configure MX records so email services can properly receive mail."
      );

      checks.push({
        name:
          "MX Records",
        status:
          "Missing",
        success: false,
        impact:
          "-10",
        message:
          "No MX records found",
      });

    }

    // GOOGLE SAFE BROWSING
    try {

      const response =
        await fetch(
          `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              client: {
                clientId:
                  "smtpdoctor",
                clientVersion:
                  "1.0",
              },
              threatInfo: {
                threatTypes: [
                  "MALWARE",
                  "SOCIAL_ENGINEERING",
                  "UNWANTED_SOFTWARE",
                ],
                platformTypes: [
                  "ANY_PLATFORM",
                ],
                threatEntryTypes: [
                  "URL",
                ],
                threatEntries: [
                  {
                    url:
                      `http://${domain}`,
                  },
                ],
              },
            }),
          }
        );

      const data =
        await response.json();

      if (
        data.matches
      ) {

        unsafe = true;

        score -= 50;

        suggestions.push(
          "Google Safe Browsing flagged this domain. Scan the website for malware, phishing pages, or malicious scripts."
        );

        checks.push({
          name:
            "Google Safe Browsing",
          status:
            "Dangerous",
          success: false,
          impact:
            "-50",
          message:
            "Google flagged this domain as unsafe",
        });

      } else {

        checks.push({
          name:
            "Google Safe Browsing",
          status:
            "Clean",
          success: true,
          impact:
            "+0",
          message:
            "No malware or phishing detected",
        });

      }

    } catch {

      checks.push({
        name:
          "Google Safe Browsing",
        status:
          "Unavailable",
        success: false,
        impact:
          "0",
        message:
          "Unable to query Google Safe Browsing",
      });

    }

    // SUSPICIOUS KEYWORDS
    const suspiciousWords =
      [
        "spam",
        "hack",
        "phish",
        "fake",
        "scam",
      ];

    const suspicious =
      suspiciousWords.some(
        (w) =>
          domain
            .toLowerCase()
            .includes(
              w
            )
      );

    if (
      suspicious
    ) {

      score -= 20;

      suggestions.push(
        "Domain contains suspicious keywords often associated with spam or phishing."
      );

      checks.push({
        name:
          "Suspicious Keywords",
        status:
          "Detected",
        success: false,
        impact:
          "-20",
        message:
          "Domain contains suspicious wording",
      });

    } else {

      checks.push({
        name:
          "Suspicious Keywords",
        status:
          "Clean",
        success: true,
        impact:
          "+0",
        message:
          "No suspicious keywords detected",
      });

    }

    // FINAL STATUS
    let overallStatus =
      "Excellent";

    if (
      score < 90
    )
      overallStatus =
        "Good";

    if (
      score < 75
    )
      overallStatus =
        "Average";

    if (
      score < 50
    )
      overallStatus =
        "Poor";

    if (
      score < 25
    )
      overallStatus =
        "Dangerous";

    if (
      score < 0
    )
      score = 0;

    return NextResponse.json({
      domain,
      overallStatus,
      score,
      unsafe,
      checks,
      suggestions,
    });

  } catch (
    error: any
  ) {

    return NextResponse.json(
      {
        error:
          error.message ||
          "Lookup failed",
      },
      { status: 500 }
    );

  }

}