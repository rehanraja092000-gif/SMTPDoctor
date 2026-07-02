import { NextResponse } from "next/server";
import net from "node:net";
import { assertPublicHost } from "../../../lib/validation";

/**
 * Tests whether an SMTP server acts as an open relay by attempting to set an
 * external sender and external recipient (both unrelated to the server's own
 * domains). A properly configured server rejects the RCPT TO. We never send
 * actual mail — we stop at the RCPT stage and read the response code.
 */
function testRelay(host: string, port: number, timeoutMs = 9000): Promise<{ openRelay: boolean; transcript: string[]; error?: string }> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const transcript: string[] = [];
    let step = 0;
    let settled = false;
    let buffer = "";

    const commands = [
      "EHLO smtpdoctor.test",
      "MAIL FROM:<test@smtpdoctor-relay-test.com>",
      "RCPT TO:<relay-test@example.net>",
    ];

    const finish = (openRelay: boolean, error?: string) => {
      if (settled) return;
      settled = true;
      try { socket.write("QUIT\r\n"); } catch {}
      socket.destroy();
      resolve({ openRelay, transcript, error });
    };

    socket.setTimeout(timeoutMs);
    socket.on("timeout", () => finish(false, "Timed out"));
    socket.on("error", (err: NodeJS.ErrnoException) => finish(false, err.code || "connection error"));
    socket.connect(port, host, () => {});

    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf8");
      if (!buffer.endsWith("\r\n")) return;
      const response = buffer.trim();
      transcript.push(response);
      buffer = "";

      if (step < commands.length) {
        socket.write(commands[step] + "\r\n");
        step++;
      } else {
        // We've sent RCPT TO and have its response — evaluate.
        const rcptResponse = transcript[transcript.length - 1] || "";
        const accepted = /^2\d\d/.test(rcptResponse);
        finish(accepted);
      }
    });
  });
}

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

  const result = await testRelay(check.ip, port);

  return NextResponse.json({
    host: raw.trim(),
    port,
    status: result.error ? "Test inconclusive"
      : result.openRelay ? "Open relay detected" : "Not an open relay",
    openRelay: result.openRelay,
    secure: !result.openRelay && !result.error,
    transcript: result.transcript,
    note: result.openRelay
      ? "This server accepted mail from an external sender to an external recipient — a serious misconfiguration that spammers abuse. Restrict relaying to authenticated users."
      : result.error ? "Could not complete the test — the server may have closed the connection." : null,
    error: result.error,
  });
}
