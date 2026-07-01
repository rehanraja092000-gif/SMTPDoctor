import { NextResponse } from "next/server";
import net from "node:net";
import { assertPublicHost } from "../../../lib/validation";

function checkPort(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(3000);

    socket.connect(port, host, () => {
      socket.destroy();
      resolve(true);
    });

    socket.on("error", () => {
      socket.destroy();
      resolve(false);
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
  });
}

const PORTS = [
  { port: 25, label: "SMTP" },
  { port: 465, label: "SMTPS (implicit TLS)" },
  { port: 587, label: "SMTP submission (STARTTLS)" },
  { port: 2525, label: "SMTP (alt)" },
  { port: 110, label: "POP3" },
  { port: 995, label: "POP3S" },
  { port: 143, label: "IMAP" },
  { port: 993, label: "IMAPS" },
  { port: 80, label: "HTTP" },
  { port: 443, label: "HTTPS" },
  { port: 2083, label: "cPanel (SSL)" },
  { port: 2087, label: "WHM (SSL)" },
  { port: 2096, label: "Webmail (SSL)" },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("host");

  if (!raw) {
    return NextResponse.json({ error: "Host is required" }, { status: 400 });
  }

  const host = raw.trim();

  // SSRF guard: refuse to open sockets to private/reserved addresses,
  // including hostnames that resolve to them (DNS rebinding).
  const check = await assertPublicHost(host);
  if (!check.ok) {
    return NextResponse.json(
      { error: `Cannot scan this target: ${check.reason}` },
      { status: 400 }
    );
  }

  const results = await Promise.all(
    PORTS.map(async ({ port, label }) => ({
      port,
      label,
      open: await checkPort(check.ip, port),
    }))
  );

  return NextResponse.json({
    host,
    resolvedIp: check.ip,
    status: "Port scan completed",
    results,
  });
}
