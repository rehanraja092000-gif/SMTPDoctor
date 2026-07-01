import { NextResponse } from "next/server";
import dns from "node:dns/promises";
import { isValidDomain, normalizeDomain } from "../../../lib/validation";
import { errorInfo } from "../../../lib/errors";

const resolvers = [
  { name: "Google DNS", server: "8.8.8.8" },
  { name: "Cloudflare DNS", server: "1.1.1.1" },
  { name: "Quad9", server: "9.9.9.9" },
  { name: "OpenDNS", server: "208.67.222.222" },
];

const ALLOWED_TYPES = ["A", "AAAA", "MX", "TXT", "NS", "CNAME"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawDomain = searchParams.get("domain");
  const type = (searchParams.get("type") || "A").toUpperCase();

  if (!rawDomain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  const domain = normalizeDomain(rawDomain);

  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: "Enter a valid domain, e.g. example.com" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(type)) {
    return NextResponse.json({ error: `Record type must be one of ${ALLOWED_TYPES.join(", ")}` }, { status: 400 });
  }

  const results = await Promise.all(
    resolvers.map(async (resolverInfo) => {
      const resolver = new dns.Resolver();
      resolver.setServers([resolverInfo.server]);

      try {
        let records: (string | number)[] = [];

        switch (type) {
          case "A":
            records = await resolver.resolve4(domain);
            break;
          case "AAAA":
            records = await resolver.resolve6(domain);
            break;
          case "MX":
            records = (await resolver.resolveMx(domain)).map(
              (r) => `${r.exchange} (Priority ${r.priority})`
            );
            break;
          case "TXT":
            records = (await resolver.resolveTxt(domain)).map((r) => r.join(""));
            break;
          case "NS":
            records = await resolver.resolveNs(domain);
            break;
          case "CNAME":
            records = await resolver.resolveCname(domain);
            break;
        }

        return {
          resolver: resolverInfo.name,
          server: resolverInfo.server,
          success: true,
          records,
        };
      } catch (error) {
        const { code, message } = errorInfo(error);
        return {
          resolver: resolverInfo.name,
          server: resolverInfo.server,
          success: false,
          error: code || message,
          records: [],
        };
      }
    })
  );

  return NextResponse.json({
    domain,
    type,
    status: "Propagation check completed",
    count: results.length,
    results,
  });
}
