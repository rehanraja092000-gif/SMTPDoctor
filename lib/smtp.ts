import net from "node:net";

/**
 * Minimal SMTP conversation helper. Connects to a mail server, reads the
 * banner, and can issue EHLO to discover capabilities (including STARTTLS).
 * Used by the banner, STARTTLS, and open-relay tools. All callers must pass
 * a host that has already cleared the SSRF public-address check.
 */

export interface SmtpResponse {
  connected: boolean;
  banner: string | null;
  ehloLines: string[];
  supportsStartTls: boolean;
  error?: string;
}

export function smtpProbe(host: string, port: number, timeoutMs = 7000): Promise<SmtpResponse> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let stage: "banner" | "ehlo" = "banner";
    let buffer = "";
    let banner: string | null = null;
    const ehloLines: string[] = [];
    let settled = false;

    const finish = (result: SmtpResponse) => {
      if (settled) return;
      settled = true;
      try { socket.write("QUIT\r\n"); } catch {}
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(timeoutMs);
    socket.on("timeout", () =>
      finish({ connected: Boolean(banner), banner, ehloLines, supportsStartTls: false, error: "Timed out" })
    );
    socket.on("error", (err: NodeJS.ErrnoException) =>
      finish({ connected: false, banner, ehloLines, supportsStartTls: false, error: err.code || "connection error" })
    );

    socket.connect(port, host, () => {});

    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf8");
      if (!buffer.includes("\r\n")) return;

      if (stage === "banner") {
        banner = buffer.trim().split("\r\n")[0];
        buffer = "";
        stage = "ehlo";
        socket.write("EHLO smtpdoctor.test\r\n");
        return;
      }

      if (stage === "ehlo") {
        // EHLO multiline responses use "250-" for continuation, "250 " for last.
        const lines = buffer.split("\r\n").filter(Boolean);
        const done = lines.some((l) => /^250 /.test(l));
        if (done) {
          for (const l of lines) ehloLines.push(l.replace(/^250[ -]/, ""));
          const supportsStartTls = ehloLines.some((l) => /starttls/i.test(l));
          finish({ connected: true, banner, ehloLines, supportsStartTls });
        }
      }
    });
  });
}
