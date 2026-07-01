import { NextResponse } from "next/server";
import { Resolver } from "node:dns/promises";
import { attemptAxfr } from "../../../lib/axfr";
import { isValidDomain, normalizeDomain } from "../../../lib/validation";
import { errorInfo } from "../../../lib/errors";

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("domain");

  if (!raw) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  const domain = normalizeDomain(raw);

  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: "Enter a valid domain, e.g. example.com" }, { status: 400 });
  }

  try {
    const nameservers = await resolver.resolveNs(domain);

    if (nameservers.length === 0) {
      return NextResponse.json({ domain, nameservers: 0, results: [] });
    }

    // Actually attempt AXFR against each nameserver rather than assuming.
    const results = await Promise.all(
      nameservers.map(async (ns) => {
        const outcome = await attemptAxfr(domain, ns);
        return {
          nameserver: ns,
          status: outcome.transferAllowed ? "Zone Transfer Allowed" : "AXFR Transfer Refused",
          secure: !outcome.transferAllowed,
          message: outcome.message,
        };
      })
    );

    return NextResponse.json({
      domain,
      nameservers: nameservers.length,
      results,
    });
  } catch (error) {
    const { message } = errorInfo(error);
    return NextResponse.json(
      { error: message || "Lookup failed" },
      { status: 500 }
    );
  }
}
