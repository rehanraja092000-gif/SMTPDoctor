import { NextResponse } from "next/server";
import { smtpProbe } from "../../../lib/smtp";
import { assertPublicHost } from "../../../lib/validation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("host");
  const port = parseInt(searchParams.get("port") || "25", 10);
  if (!raw) return NextResponse.json({ error: "Host is required" }, { status: 400 });
  if (![25, 587, 2525].includes(port)) {
    return NextResponse.json({ error: "Port must be 25, 587, or 2525" }, { status: 400 });
  }

  const check = await assertPublicHost(raw.trim());
  if (!check.ok) {
    return NextResponse.json({ error: `Cannot probe this host: ${check.reason}` }, { status: 400 });
  }

  const result = await smtpProbe(check.ip, port);

  return NextResponse.json({
    host: raw.trim(),
    port,
    status: !result.connected ? "Connection failed"
      : result.supportsStartTls ? "STARTTLS supported" : "STARTTLS not offered",
    connected: result.connected,
    supportsStartTls: result.supportsStartTls,
    banner: result.banner,
    note: result.connected && !result.supportsStartTls
      ? "This server did not advertise STARTTLS, meaning mail to it may travel unencrypted. Enable STARTTLS on the mail server."
      : null,
    error: result.error,
  });
}
