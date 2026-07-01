import net from "node:net";

/**
 * Attempts a genuine AXFR (zone transfer) request against a nameserver over
 * TCP port 53, using raw DNS wire format. Most nameservers correctly refuse
 * this for the general public, and that refusal is exactly what we want to
 * detect and report — but unlike a hardcoded "always refused" response,
 * this actually sends the request and reports what really happened,
 * including the rare case where a misconfigured server allows the transfer
 * (which is a real, reportable security exposure).
 */

function buildAxfrQuery(domain: string): Buffer {
  const id = Math.floor(Math.random() * 65535);
  const header = Buffer.alloc(12);
  header.writeUInt16BE(id, 0);
  header.writeUInt16BE(0x0000, 2); // standard query, no recursion
  header.writeUInt16BE(1, 4); // QDCOUNT
  header.writeUInt16BE(0, 6);
  header.writeUInt16BE(0, 8);
  header.writeUInt16BE(0, 10);

  const labels = domain.split(".").filter(Boolean);
  const qnameParts: Buffer[] = [];
  for (const label of labels) {
    const buf = Buffer.from(label, "ascii");
    qnameParts.push(Buffer.from([buf.length]), buf);
  }
  qnameParts.push(Buffer.from([0])); // root terminator
  const qname = Buffer.concat(qnameParts);

  const qtypeQclass = Buffer.alloc(4);
  qtypeQclass.writeUInt16BE(252, 0); // QTYPE = AXFR
  qtypeQclass.writeUInt16BE(1, 2); // QCLASS = IN

  const message = Buffer.concat([header, qname, qtypeQclass]);
  const lengthPrefix = Buffer.alloc(2);
  lengthPrefix.writeUInt16BE(message.length, 0);

  return Buffer.concat([lengthPrefix, message]);
}

export interface AxfrResult {
  nameserver: string;
  attempted: boolean;
  transferAllowed: boolean;
  message: string;
}

export function attemptAxfr(domain: string, nameserver: string, timeoutMs = 4000): Promise<AxfrResult> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;
    let responseBytes = Buffer.alloc(0);

    const finish = (result: AxfrResult) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(timeoutMs);

    socket.on("timeout", () => {
      finish({
        nameserver,
        attempted: true,
        transferAllowed: false,
        message: "No response (timed out) — transfer not permitted",
      });
    });

    socket.on("error", (err: NodeJS.ErrnoException) => {
      finish({
        nameserver,
        attempted: true,
        transferAllowed: false,
        message:
          err?.code === "ECONNREFUSED"
            ? "Connection refused — zone transfer blocked"
            : `Connection failed (${err?.code || "error"}) — treated as refused`,
      });
    });

    socket.connect(53, nameserver, () => {
      socket.write(buildAxfrQuery(domain));
    });

    socket.on("data", (chunk) => {
      responseBytes = Buffer.concat([responseBytes, chunk]);

      // First 2 bytes are the TCP length prefix, next 12 are the DNS header.
      if (responseBytes.length < 14) return;

      const ancount = responseBytes.readUInt16BE(2 + 6);
      const rcode = responseBytes[2 + 3] & 0x0f;

      if (rcode !== 0) {
        finish({
          nameserver,
          attempted: true,
          transferAllowed: false,
          message: "Server returned an error response — transfer refused",
        });
        return;
      }

      if (ancount > 0) {
        // The server started sending zone records back — transfer allowed.
        // This is a real misconfiguration worth flagging.
        finish({
          nameserver,
          attempted: true,
          transferAllowed: true,
          message: `Zone transfer succeeded — server returned records (exposure risk)`,
        });
      }
    });
  });
}
