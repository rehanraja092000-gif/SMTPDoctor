import { NextResponse } from "next/server";
import { smtpProbe } from "../../../lib/smtp";
import { assertPublicHost } from "../../../lib/validation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("host");
  const port = parseInt(searchParams.get("port") || "25", 10);
  if (!raw) return NextResponse.json({ error: "Host is required" }, { status: 400 });
  if (![25, 587, 465, 2525].includes(port)) {
    return NextResponse.json({ error: "Port must be 25, 465, 587, or 2525" }, { status: 400 });
  }

  const check = await assertPublicHost(raw.trim());
  if (!check.ok) {
    return NextResponse.json({ error: `Cannot probe this host: ${check.reason}` }, { status: 400 });
  }

  const result = await smtpProbe(check.ip, port);

  return NextResponse.json({
    host: raw.trim(),
    port,
    status: result.connected ? "Connected" : "Connection failed",
    banner: result.banner,
    ehloLines: result.ehloLines,
    supportsStartTls: result.supportsStartTls,
    error: result.error,
  });
}
