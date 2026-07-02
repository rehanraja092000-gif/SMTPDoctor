import { Resolver } from "node:dns/promises";

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

/**
 * Parses and validates an SPF record properly. The single most common cause
 * of silent SPF failures is exceeding the 10 DNS-lookup limit (RFC 7208 §4.6.4),
 * which a naive "does a record exist" check never catches. This counts the
 * lookups that include/a/mx/ptr/exists/redirect mechanisms actually incur,
 * flags multiple records, and explains each term.
 */

export interface SpfMechanism {
  raw: string;
  type: string;
  qualifier: string;
  causesLookup: boolean;
  note?: string;
}

export interface SpfAnalysis {
  found: boolean;
  record: string | null;
  multipleRecords: boolean;
  mechanisms: SpfMechanism[];
  lookupCount: number;
  lookupLimitExceeded: boolean;
  allQualifier: string | null;
  warnings: string[];
  valid: boolean;
}

const LOOKUP_MECHANISMS = new Set(["include", "a", "mx", "ptr", "exists", "redirect"]);

function qualifierName(q: string): string {
  switch (q) {
    case "+": return "pass";
    case "-": return "fail";
    case "~": return "softfail";
    case "?": return "neutral";
    default: return "pass";
  }
}

async function countLookups(
  record: string,
  domain: string,
  depth: number,
  seen: Set<string>
): Promise<number> {
  // Recursively counts DNS-querying mechanisms, following include/redirect,
  // bounded so a malicious or broken record can't cause runaway recursion.
  if (depth > 10) return 99;

  const terms = record.split(/\s+/).filter(Boolean);
  let count = 0;

  for (const term of terms) {
    const clean = term.replace(/^[+\-~?]/, "");
    const [mechRaw, value] = clean.split(":");
    const mech = mechRaw.toLowerCase();

    if (mech === "include" && value) {
      count += 1;
      if (!seen.has(value)) {
        seen.add(value);
        try {
          const txt = await resolver.resolveTxt(value);
          const spf = txt.flat().join("").match(/v=spf1[^"]*/i);
          if (spf) count += await countLookups(spf[0], value, depth + 1, seen);
        } catch {}
      }
    } else if (mech.startsWith("redirect=")) {
      const target = clean.split("=")[1];
      count += 1;
      if (target && !seen.has(target)) {
        seen.add(target);
        try {
          const txt = await resolver.resolveTxt(target);
          const spf = txt.flat().join("").match(/v=spf1[^"]*/i);
          if (spf) count += await countLookups(spf[0], target, depth + 1, seen);
        } catch {}
      }
    } else if (["a", "mx", "ptr", "exists"].includes(mech)) {
      count += 1;
    }
  }

  return count;
}

export async function analyzeSpf(domain: string): Promise<SpfAnalysis> {
  const warnings: string[] = [];
  let txtRecords: string[][] = [];

  try {
    txtRecords = await resolver.resolveTxt(domain);
  } catch {
    return {
      found: false, record: null, multipleRecords: false, mechanisms: [],
      lookupCount: 0, lookupLimitExceeded: false, allQualifier: null,
      warnings: ["No TXT records found for this domain"], valid: false,
    };
  }

  const flat = txtRecords.map((r) => r.join(""));
  const spfRecords = flat.filter((r) => /^v=spf1/i.test(r.trim()));

  if (spfRecords.length === 0) {
    return {
      found: false, record: null, multipleRecords: false, mechanisms: [],
      lookupCount: 0, lookupLimitExceeded: false, allQualifier: null,
      warnings: ["No SPF record found. Add one so receivers can verify your senders."],
      valid: false,
    };
  }

  const multipleRecords = spfRecords.length > 1;
  if (multipleRecords) {
    warnings.push("Multiple SPF records found — this is invalid. A domain must publish exactly one.");
  }

  const record = spfRecords[0];
  const terms = record.split(/\s+/).filter(Boolean);
  const mechanisms: SpfMechanism[] = [];
  let allQualifier: string | null = null;

  for (const term of terms) {
    if (/^v=spf1$/i.test(term)) continue;

    const qMatch = term.match(/^([+\-~?])?(.+)/);
    const qualifier = qMatch?.[1] || "+";
    const body = qMatch?.[2] || term;
    const type = body.split(/[:=]/)[0].toLowerCase();

    if (type === "all") {
      allQualifier = qualifier;
      if (qualifier === "+") {
        warnings.push("+all allows anyone to send as your domain — remove it immediately.");
      }
      mechanisms.push({
        raw: term, type: "all", qualifier: qualifierName(qualifier),
        causesLookup: false,
        note: qualifier === "-" ? "Strict — unlisted senders rejected"
          : qualifier === "~" ? "Soft fail — unlisted senders marked"
          : qualifier === "?" ? "Neutral — no policy" : "Dangerous — allows all senders",
      });
    } else {
      mechanisms.push({
        raw: term, type, qualifier: qualifierName(qualifier),
        causesLookup: LOOKUP_MECHANISMS.has(type),
      });
    }
  }

  if (allQualifier === null) {
    warnings.push("No 'all' mechanism found — your record has no default policy for unlisted senders.");
  }

  const lookupCount = await countLookups(record, domain, 0, new Set([domain]));
  const lookupLimitExceeded = lookupCount > 10;
  if (lookupLimitExceeded) {
    warnings.push(`This record needs ${lookupCount} DNS lookups, over the limit of 10. SPF will return permerror and fail. Reduce nested includes.`);
  }

  return {
    found: true,
    record,
    multipleRecords,
    mechanisms,
    lookupCount,
    lookupLimitExceeded,
    allQualifier: allQualifier ? qualifierName(allQualifier) : null,
    warnings,
    valid: !multipleRecords && !lookupLimitExceeded && allQualifier !== "+",
  };
}
