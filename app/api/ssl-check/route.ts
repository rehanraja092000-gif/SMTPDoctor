import { NextResponse } from "next/server";
import tls from "node:tls";
import { assertPublicHost, isValidDomain, normalizeDomain } from "../../../lib/validation";

interface CertInfo {
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  san: string[];
  protocol: string | null;
}

function getCertificate(host: string): Promise<CertInfo> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      { host, port: 443, servername: host, timeout: 6000, rejectUnauthorized: false },
      () => {
        const cert = socket.getPeerCertificate();
        const protocol = socket.getProtocol();
        if (!cert || Object.keys(cert).length === 0) {
          socket.destroy();
          return reject(new Error("No certificate presented"));
        }
        const validTo = new Date(cert.valid_to);
        const daysRemaining = Math.floor((validTo.getTime() - Date.now()) / 86400000);
        const san = (cert.subjectaltname || "")
          .split(",")
          .map((s) => s.trim().replace(/^DNS:/, ""))
          .filter(Boolean);

        const cnOf = (field: string | string[] | undefined): string | undefined =>
          Array.isArray(field) ? field[0] : field;
        socket.destroy();
        resolve({
          subject: cnOf(cert.subject?.CN) || host,
          issuer: cnOf(cert.issuer?.O) || cnOf(cert.issuer?.CN) || "Unknown",
          validFrom: new Date(cert.valid_from).toISOString(),
          validTo: validTo.toISOString(),
          daysRemaining,
          san,
          protocol,
        });
      }
    );
    socket.on("error", reject);
    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("Connection timed out"));
    });
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("domain");
  if (!raw) return NextResponse.json({ error: "Domain is required" }, { status: 400 });

  const domain = normalizeDomain(raw);
  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: "Enter a valid domain, e.g. example.com" }, { status: 400 });
  }

  const check = await assertPublicHost(domain);
  if (!check.ok) {
    return NextResponse.json({ error: `Cannot check this host: ${check.reason}` }, { status: 400 });
  }

  try {
    const cert = await getCertificate(domain);
    const expired = cert.daysRemaining < 0;
    const expiringSoon = cert.daysRemaining >= 0 && cert.daysRemaining < 21;

    return NextResponse.json({
      domain,
      status: expired ? "Certificate expired" : expiringSoon ? "Expiring soon" : "Certificate valid",
      valid: !expired,
      expiringSoon,
      ...cert,
    });
  } catch (err) {
    return NextResponse.json({
      domain,
      status: "TLS connection failed",
      valid: false,
      error: err instanceof Error ? err.message : "Could not establish TLS connection",
    });
  }
}
