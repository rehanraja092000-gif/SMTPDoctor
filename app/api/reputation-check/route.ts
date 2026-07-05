import { NextResponse } from "next/server";
import { Resolver } from "node:dns/promises";
import { analyzeSpf } from "../../../lib/spfParser";
import { analyzeDmarc } from "../../../lib/dmarcParser";
import { scanDKIM } from "../../../lib/dkimScanner";
import { isValidDomain, normalizeDomain } from "../../../lib/validation";
import { errorInfo } from "../../../lib/errors";

const GOOGLE_API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

interface CheckResult {
  name: string;
  status: string;
  success: boolean;
  impact: string;
  message: string;
}

async function dohLookup(name: string, type: string) {
  const res = await fetch(
    `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`,
    { signal: AbortSignal.timeout(5000) }
  );
  return res.json();
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

  const checks: CheckResult[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 100;

  try {
    // ---- SPF: 20 pts, quality-graded ----
    const spf = await analyzeSpf(domain);
    if (!spf.found) {
      checks.push({ name: "SPF", status: "Missing", success: false, impact: "0 / 20", message: "No SPF record — receivers can't verify your senders" });
      suggestions.push("Publish an SPF record listing every service allowed to send mail for your domain.");
    } else if (spf.lookupLimitExceeded) {
      score += 8;
      checks.push({ name: "SPF", status: "Over lookup limit", success: false, impact: "8 / 20", message: `SPF exceeds the 10-lookup limit (${spf.lookupCount}) and will fail` });
      suggestions.push("Reduce nested SPF includes — you're over the 10 DNS-lookup limit, which makes SPF fail.");
    } else if (spf.allQualifier === "pass") {
      score += 10;
      checks.push({ name: "SPF", status: "Insecure (+all)", success: false, impact: "10 / 20", message: "SPF uses +all, allowing anyone to send as your domain" });
      suggestions.push("Change +all to ~all or -all — +all lets anyone spoof your domain.");
    } else if (!spf.valid) {
      score += 14;
      checks.push({ name: "SPF", status: "Has issues", success: false, impact: "14 / 20", message: spf.warnings[0] || "SPF record has minor issues" });
    } else {
      score += 20;
      checks.push({ name: "SPF", status: "Valid", success: true, impact: "20 / 20", message: "SPF is published and valid" });
    }

    // ---- DMARC: 25 pts, policy-strength graded ----
    const dmarc = await analyzeDmarc(domain);
    if (!dmarc.found) {
      checks.push({ name: "DMARC", status: "Missing", success: false, impact: "0 / 25", message: "No DMARC — spoofed mail has no handling policy" });
      suggestions.push("Add a DMARC record. Start at p=none to monitor, then move to quarantine or reject.");
    } else if (dmarc.strength === "strong") {
      score += 25;
      checks.push({ name: "DMARC", status: "Enforced (reject)", success: true, impact: "25 / 25", message: "DMARC is at full enforcement" });
    } else if (dmarc.strength === "moderate") {
      score += 20;
      checks.push({ name: "DMARC", status: "Quarantine", success: true, impact: "20 / 25", message: "DMARC enforces quarantine — consider moving to reject" });
      suggestions.push("Move DMARC from quarantine to p=reject once you're confident legitimate mail passes.");
    } else {
      score += 8;
      checks.push({ name: "DMARC", status: "Monitor only (p=none)", success: false, impact: "8 / 25", message: "p=none provides no protection — it only reports" });
      suggestions.push("Your DMARC is p=none, which offers no spoofing protection. Move to quarantine, then reject.");
    }

    // ---- DKIM: 15 pts ----
    const dkim = await scanDKIM(domain);
    if (dkim.length > 0) {
      score += 15;
      checks.push({ name: "DKIM", status: "Found", success: true, impact: "15 / 15", message: `DKIM signing key found (${dkim.length} selector${dkim.length !== 1 ? "s" : ""})` });
    } else {
      checks.push({ name: "DKIM", status: "Not found", success: false, impact: "0 / 15", message: "No DKIM key found for common selectors" });
      suggestions.push("Enable DKIM signing with your mail provider so receivers can verify your messages weren't altered.");
    }

    // ---- MX: 15 pts ----
    let hasMX = false;
    try {
      const mx = await resolver.resolveMx(domain);
      hasMX = mx.length > 0;
    } catch {}
    if (hasMX) {
      score += 15;
      checks.push({ name: "MX", status: "Configured", success: true, impact: "15 / 15", message: "Mail servers are configured" });
    } else {
      checks.push({ name: "MX", status: "Missing", success: false, impact: "0 / 15", message: "No MX records — the domain can't receive mail" });
      suggestions.push("Configure MX records so the domain can receive email.");
    }

    // ---- DNSSEC: 10 pts ----
    let dnssec = false;
    try {
      const ds = await dohLookup(domain, "DS");
      dnssec = Array.isArray(ds.Answer) && ds.Answer.some((a: { type: number }) => a.type === 43);
    } catch {}
    if (dnssec) {
      score += 10;
      checks.push({ name: "DNSSEC", status: "Enabled", success: true, impact: "10 / 10", message: "DNS is cryptographically signed" });
    } else {
      checks.push({ name: "DNSSEC", status: "Not enabled", success: false, impact: "0 / 10", message: "DNSSEC is off — DNS responses can't be verified" });
      suggestions.push("Enable DNSSEC at your DNS provider to protect against DNS spoofing.");
    }

    // ---- Threat / Safe Browsing: 15 pts ----
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
            signal: AbortSignal.timeout(5000),
          }
        );
        const data = await response.json();
        if (data.matches) {
          checks.push({ name: "Threat status", status: "Flagged", success: false, impact: "0 / 15", message: "Google Safe Browsing flagged this domain as unsafe" });
          suggestions.push("This domain is flagged by Google Safe Browsing — investigate for malware or phishing immediately.");
        } else {
          score += 15;
          checks.push({ name: "Threat status", status: "Clean", success: true, impact: "15 / 15", message: "No malware or phishing detected" });
        }
      } catch {
        score += 15;
        checks.push({ name: "Threat status", status: "Unavailable", success: true, impact: "15 / 15", message: "Threat check unavailable — not counted against score" });
      }
    } else {
      // No API key: don't penalize the domain for a server config gap.
      score += 15;
      checks.push({ name: "Threat status", status: "Not checked", success: true, impact: "15 / 15", message: "Threat scanning not configured on this server" });
    }

    const finalScore = Math.max(0, Math.min(maxScore, Math.round(score)));
    let overallStatus = "Excellent";
    if (finalScore < 90) overallStatus = "Good";
    if (finalScore < 75) overallStatus = "Needs work";
    if (finalScore < 55) overallStatus = "Poor";
    if (finalScore < 35) overallStatus = "Critical";

    return NextResponse.json({
      domain,
      overallStatus,
      score: finalScore,
      unsafe: finalScore < 35,
      checks,
      suggestions,
    });
  } catch (error) {
    const { message } = errorInfo(error);
    return NextResponse.json({ error: message || "Lookup failed" }, { status: 500 });
  }
}
