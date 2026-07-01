import net from "node:net";

/**
 * Minimal raw WHOIS client. The whois-json package parses responses into
 * fields, but registrars format WHOIS output inconsistently (GoDaddy in
 * particular returns very little in the parsed shape). Querying raw and
 * returning the unparsed text — the same approach the classic `whois` CLI
 * uses — is more reliable across registrars: start at IANA, follow the
 * referral to the responsible registry/registrar, and return whatever text
 * comes back.
 */

function queryWhoisServer(server: string, query: string, timeoutMs = 6000): Promise<string> {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    let data = "";
    let settled = false;

    socket.setTimeout(timeoutMs);

    socket.on("connect", () => {
      socket.write(query + "\r\n");
    });

    socket.on("data", (chunk) => {
      data += chunk.toString("utf8");
    });

    socket.on("end", () => {
      if (settled) return;
      settled = true;
      resolve(data);
    });

    socket.on("timeout", () => {
      if (settled) return;
      settled = true;
      socket.destroy();
      reject(new Error("WHOIS query timed out"));
    });

    socket.on("error", (err) => {
      if (settled) return;
      settled = true;
      reject(err);
    });

    socket.connect(43, server);
  });
}

function extractReferral(text: string): string | null {
  const match = text.match(/(?:refer|whois server|referral url):\s*([^\s]+)/i);
  if (!match) return null;
  let value = match[1].trim();
  value = value.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  return value || null;
}

export async function rawWhoisLookup(domain: string): Promise<{
  raw: string;
  server: string;
}> {
  const ianaResponse = await queryWhoisServer("whois.iana.org", domain);
  const referral = extractReferral(ianaResponse);

  if (!referral) {
    return { raw: ianaResponse, server: "whois.iana.org" };
  }

  try {
    const registryResponse = await queryWhoisServer(referral, domain);

    // Some registries (notably Verisign for .com/.net) refer again to the
    // registrar's own WHOIS server — follow one more hop if present.
    const secondReferral = extractReferral(registryResponse);
    if (secondReferral && secondReferral !== referral) {
      try {
        const registrarResponse = await queryWhoisServer(secondReferral, domain);
        return { raw: registrarResponse, server: secondReferral };
      } catch {
        return { raw: registryResponse, server: referral };
      }
    }

    return { raw: registryResponse, server: referral };
  } catch {
    return { raw: ianaResponse, server: "whois.iana.org" };
  }
}
