import { NextResponse } from "next/server";
import { isValidDomain, normalizeDomain } from "../../../lib/validation";
import { errorInfo } from "../../../lib/errors";

const GOOGLE_API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

async function resolveDNS(name: string, type: string) {
  const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`;
  const res = await fetch(url);
  return res.json();
}

interface CheckResult {
  name: string;
  status: string;
  success: boolean;
  impact: string;
  message: string;
}

interface DnsAnswer {
  data?: string;
}

function pushCheck(
  checks: CheckResult[],
  suggestions: string[],
  scoreRef: { value: number },
  opts: {
    name: string;
    passed: boolean;
    passLabel: string;
    failLabel: string;
    passMessage: string;
    failMessage: string;
    penalty: number;
    suggestion?: string;
  }
) {
  if (opts.passed) {
    checks.push({
      name: opts.name,
      status: opts.passLabel,
      success: true,
      impact: "+0",
      message: opts.passMessage,
    });
  } else {
    scoreRef.value -= opts.penalty;
    if (opts.suggestion) suggestions.push(opts.suggestion);
    checks.push({
      name: opts.name,
      status: opts.failLabel,
      success: false,
      impact: `-${opts.penalty}`,
      message: opts.failMessage,
    });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawDomain = searchParams.get("domain");

  if (!rawDomain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  const domain = normalizeDomain(rawDomain);

  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: "Enter a valid domain, e.g. example.com" }, { status: 400 });
  }

  const scoreRef = { value: 100 };
  let unsafe = false;
  const checks: CheckResult[] = [];
  const suggestions: string[] = [];

  try {
    let hasSPF = false;
    try {
      const spfData = await resolveDNS(domain, "TXT");
      hasSPF = (spfData.Answer || []).some(
        (a: DnsAnswer) => a.data && a.data.toLowerCase().includes("v=spf1")
      );
    } catch {}
    pushCheck(checks, suggestions, scoreRef, {
      name: "SPF Record",
      passed: hasSPF,
      passLabel: "Valid",
      failLabel: "Missing",
      passMessage: "SPF record detected",
      failMessage: "No SPF record found",
      penalty: 15,
      suggestion: "Add a valid SPF record to improve email trust and deliverability.",
    });

    let hasDMARC = false;
    try {
      const dmarcData = await resolveDNS(`_dmarc.${domain}`, "TXT");
      hasDMARC = (dmarcData.Answer || []).some(
        (a: DnsAnswer) => a.data && a.data.toLowerCase().includes("v=dmarc1")
      );
    } catch {}
    pushCheck(checks, suggestions, scoreRef, {
      name: "DMARC Record",
      passed: hasDMARC,
      passLabel: "Valid",
      failLabel: "Missing",
      passMessage: "DMARC policy detected",
      failMessage: "No DMARC policy found",
      penalty: 20,
      suggestion: "Configure a DMARC policy to protect against spoofing and phishing.",
    });

    let hasMX = false;
    try {
      const mxData = await resolveDNS(domain, "MX");
      hasMX = (mxData.Answer || []).length > 0;
    } catch {}
    pushCheck(checks, suggestions, scoreRef, {
      name: "MX Records",
      passed: hasMX,
      passLabel: "Configured",
      failLabel: "Missing",
      passMessage: "Mail servers detected",
      failMessage: "No MX records found",
      penalty: 10,
      suggestion: "Configure MX records so email services can properly receive mail.",
    });

    if (GOOGLE_API_KEY) {
      try {
        const response = await fetch(
          `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              client: { clientId: "smtpdoctor", clientVersion: "1.0" },
              threatInfo: {
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [{ url: `http://${domain}` }],
              },
            }),
          }
        );

        const data = await response.json();

        if (data.matches) {
          unsafe = true;
          scoreRef.value -= 50;
          suggestions.push(
            "Google Safe Browsing flagged this domain. Scan the website for malware, phishing pages, or malicious scripts."
          );
          checks.push({
            name: "Google Safe Browsing",
            status: "Dangerous",
            success: false,
            impact: "-50",
            message: "Google flagged this domain as unsafe",
          });
        } else {
          checks.push({
            name: "Google Safe Browsing",
            status: "Clean",
            success: true,
            impact: "+0",
            message: "No malware or phishing detected",
          });
        }
      } catch {
        checks.push({
          name: "Google Safe Browsing",
          status: "Unavailable",
          success: false,
          impact: "0",
          message: "Unable to query Google Safe Browsing",
        });
      }
    } else {
      checks.push({
        name: "Google Safe Browsing",
        status: "Not configured",
        success: false,
        impact: "0",
        message: "Server is missing a Safe Browsing API key",
      });
    }

    const suspiciousWords = ["spam", "hack", "phish", "fake", "scam"];
    const suspicious = suspiciousWords.some((w) => domain.includes(w));
    checks.push({
      name: "Suspicious Keywords",
      status: suspicious ? "Detected" : "Clean",
      success: !suspicious,
      impact: "+0",
      message: suspicious
        ? "Domain name contains wording sometimes associated with spam — not a definitive signal on its own"
        : "No suspicious keywords detected",
    });

    const score = Math.max(0, Math.min(100, scoreRef.value));
    let overallStatus = "Excellent";
    if (score < 90) overallStatus = "Good";
    if (score < 75) overallStatus = "Average";
    if (score < 50) overallStatus = "Poor";
    if (score < 25) overallStatus = "Dangerous";

    return NextResponse.json({
      domain,
      overallStatus,
      score,
      unsafe,
      checks,
      suggestions,
    });
  } catch (error) {
    const { message } = errorInfo(error);
    return NextResponse.json(
      { error: message || "Lookup failed" },
      { status: 500 }
    );
  }
}
