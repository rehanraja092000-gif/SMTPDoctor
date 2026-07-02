import { Resolver } from "node:dns/promises";

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

/**
 * Parses a DMARC record into its individual tags and evaluates the policy
 * strength. A raw "record exists" check misses the important nuance: p=none
 * provides no protection, missing rua means you get no visibility, and
 * relaxed alignment is weaker than strict.
 */

export interface DmarcAnalysis {
  found: boolean;
  record: string | null;
  tags: Record<string, string>;
  policy: string | null;
  subdomainPolicy: string | null;
  pct: number;
  ruaAddresses: string[];
  rufAddresses: string[];
  alignment: { spf: string; dkim: string };
  warnings: string[];
  strength: "strong" | "moderate" | "weak" | "none";
}

export async function analyzeDmarc(domain: string): Promise<DmarcAnalysis> {
  const host = `_dmarc.${domain}`;
  const warnings: string[] = [];

  let record: string | null = null;
  try {
    const txt = await resolver.resolveTxt(host);
    const joined = txt.map((r) => r.join(""));
    record = joined.find((r) => /v=DMARC1/i.test(r)) || null;
  } catch {}

  if (!record) {
    return {
      found: false, record: null, tags: {}, policy: null, subdomainPolicy: null,
      pct: 0, ruaAddresses: [], rufAddresses: [], alignment: { spf: "r", dkim: "r" },
      warnings: ["No DMARC record found. Without it, spoofed mail has no defined handling."],
      strength: "none",
    };
  }

  const tags: Record<string, string> = {};
  record.split(";").forEach((part) => {
    const [k, v] = part.split("=").map((s) => s?.trim());
    if (k && v) tags[k.toLowerCase()] = v;
  });

  const policy = tags["p"] || null;
  const subdomainPolicy = tags["sp"] || null;
  const pct = tags["pct"] ? parseInt(tags["pct"], 10) : 100;

  const parseAddrs = (val?: string) =>
    val ? val.split(",").map((a) => a.trim().replace(/^mailto:/i, "")) : [];
  const ruaAddresses = parseAddrs(tags["rua"]);
  const rufAddresses = parseAddrs(tags["ruf"]);

  const alignment = { spf: tags["aspf"] || "r", dkim: tags["adkim"] || "r" };

  if (policy === "none") {
    warnings.push("Policy is p=none — monitoring only, no protection. Move to quarantine or reject once your reports look clean.");
  }
  if (!policy) {
    warnings.push("No policy (p=) tag — the record is invalid without one.");
  }
  if (ruaAddresses.length === 0) {
    warnings.push("No rua address — you won't receive aggregate reports to tune your setup.");
  }
  if (pct < 100) {
    warnings.push(`pct=${pct} means the policy only applies to ${pct}% of mail. Raise to 100 for full enforcement.`);
  }

  let strength: DmarcAnalysis["strength"] = "none";
  if (policy === "reject" && pct === 100) strength = "strong";
  else if (policy === "reject" || policy === "quarantine") strength = "moderate";
  else if (policy === "none") strength = "weak";

  return {
    found: true, record, tags, policy, subdomainPolicy, pct,
    ruaAddresses, rufAddresses, alignment, warnings, strength,
  };
}
