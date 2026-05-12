import { NextResponse } from "next/server";
import dns from "dns/promises";

const resolvers = [
  {
    name: "Google DNS",
    server: "8.8.8.8",
  },
  {
    name: "Cloudflare DNS",
    server: "1.1.1.1",
  },
  {
    name: "Quad9",
    server: "9.9.9.9",
  },
  {
    name: "OpenDNS",
    server: "208.67.222.222",
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const domain = searchParams.get("domain");
  const type = (searchParams.get("type") || "A").toUpperCase();

  if (!domain) {
    return NextResponse.json(
      { error: "Domain is required" },
      { status: 400 }
    );
  }

  const results = await Promise.all(
    resolvers.map(async (resolverInfo) => {
      const resolver = new dns.Resolver();

      resolver.setServers([resolverInfo.server]);

      try {
        let records: any[] = [];

        switch (type) {
          case "A":
            records = await resolver.resolve4(domain);
            break;

          case "AAAA":
            records = await resolver.resolve6(domain);
            break;

          case "MX":
            records = await resolver.resolveMx(domain);
            records = records.map(
              (r) => `${r.exchange} (Priority ${r.priority})`
            );
            break;

          case "TXT":
            records = await resolver.resolveTxt(domain);
            records = records.map((r) => r.join(""));
            break;

          case "NS":
            records = await resolver.resolveNs(domain);
            break;

          case "CNAME":
            records = await resolver.resolveCname(domain);
            break;

          default:
            records = [];
        }

        return {
          resolver: resolverInfo.name,
          server: resolverInfo.server,
          success: true,
          records,
        };
      } catch (error: any) {
        return {
          resolver: resolverInfo.name,
          server: resolverInfo.server,
          success: false,
          error: error.code || error.message,
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