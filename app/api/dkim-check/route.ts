import { NextResponse } from "next/server";
import { Resolver } from "node:dns/promises";
import { scanDKIM } from "../../../lib/dkimScanner";
import { isValidDomain, normalizeDomain } from "../../../lib/validation";

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

const SELECTOR_RE = /^[a-zA-Z0-9_-]{1,63}$/;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const rawDomain = searchParams.get("domain");
  const selector = searchParams.get("selector");

  if (!rawDomain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  const domain = normalizeDomain(rawDomain);

  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: "Enter a valid domain, e.g. example.com" }, { status: 400 });
  }

  if (selector) {
    if (!SELECTOR_RE.test(selector)) {
      return NextResponse.json({ error: "Selector contains invalid characters" }, { status: 400 });
    }

    const host = `${selector}._domainkey.${domain}`;

    try {
      const txt = await resolver.resolveTxt(host);
      const record = txt.flat().join("");

      if (record.includes("v=DKIM1")) {
        return NextResponse.json({
          domain,
          status: "DKIM found",
          count: 1,
          records: [
            {
              selector,
              host,
              record: record.slice(0, 250) + (record.length > 250 ? "..." : ""),
              found: true,
            },
          ],
        });
      }
    } catch {}

    return NextResponse.json({
      domain,
      status: "Custom selector not found",
      count: 0,
      records: [],
    });
  }

  const results = await scanDKIM(domain);

  if (results.length > 0) {
    return NextResponse.json({
      domain,
      status: "DKIM found",
      count: results.length,
      records: results,
    });
  }

  return NextResponse.json({
    domain,
    status: "No DKIM found",
    count: 0,
    records: [],
  });
}
