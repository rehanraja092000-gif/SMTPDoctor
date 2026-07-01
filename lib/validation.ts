import net from "node:net";
import dns from "node:dns/promises";

/**
 * Shared input validation + SSRF guards for all diagnostic API routes.
 *
 * These tools accept a hostname/IP from an anonymous visitor and then have
 * the server perform DNS lookups or open raw sockets to whatever was typed.
 * Without guardrails, that turns the API into an open proxy that anyone
 * can point at internal/private infrastructure (localhost, RFC1918 ranges,
 * link-local/cloud metadata addresses, etc). Every route that resolves or
 * connects to a user-supplied host should run its input through these
 * checks first.
 */

const DOMAIN_RE =
  /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;

export function isValidDomain(input: string): boolean {
  if (!input) return false;
  const value = input.trim().toLowerCase();
  if (value.length > 253) return false;
  return DOMAIN_RE.test(value);
}

export function normalizeDomain(input: string): string {
  return input.trim().toLowerCase().replace(/\.$/, "");
}

/** Blocks loopback, private, link-local, and other non-public IP ranges. */
export function isPrivateOrReservedIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    const [a, b] = parts;
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 127) return true; // loopback
    if (a === 169 && b === 254) return true; // link-local / cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 0) return true; // "this network"
    if (a >= 224) return true; // multicast/reserved
    return false;
  }

  if (net.isIPv6(ip)) {
    const value = ip.toLowerCase();
    if (value === "::1") return true; // loopback
    if (value.startsWith("fe80")) return true; // link-local
    if (value.startsWith("fc") || value.startsWith("fd")) return true; // unique local
    if (value.startsWith("::ffff:")) {
      // IPv4-mapped IPv6 — check the embedded v4 address too
      const embedded = value.split(":").pop() || "";
      if (net.isIPv4(embedded)) return isPrivateOrReservedIp(embedded);
    }
    return false;
  }

  return false;
}

/**
 * Resolves a hostname and confirms every result is a public address.
 * Use this before opening any raw socket (port scanning, banner grabs, etc)
 * to a user-supplied host, so a hostname that resolves to an internal IP
 * (DNS rebinding) can't be used to reach internal infrastructure.
 */
export async function assertPublicHost(
  host: string
): Promise<{ ok: true; ip: string } | { ok: false; reason: string }> {
  const target = host.trim();

  if (net.isIP(target)) {
    if (isPrivateOrReservedIp(target)) {
      return { ok: false, reason: "Target resolves to a private or reserved address" };
    }
    return { ok: true, ip: target };
  }

  if (!isValidDomain(target)) {
    return { ok: false, reason: "Invalid hostname" };
  }

  try {
    const { address } = await dns.lookup(target);
    if (isPrivateOrReservedIp(address)) {
      return { ok: false, reason: "Target resolves to a private or reserved address" };
    }
    return { ok: true, ip: address };
  } catch {
    return { ok: false, reason: "Could not resolve hostname" };
  }
}
