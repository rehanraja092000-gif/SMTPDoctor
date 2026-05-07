import { NextResponse } from "next/server";
import net from "node:net";

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const host = searchParams.get("host");

  if (!host) {
    return NextResponse.json(
      { error: "Host is required" },
      { status: 400 }
    );
  }

  const ports = [25, 465, 587, 2525, 110, 995, 143, 993, 80, 443, 2083, 2087, 2096];

  const results = await Promise.all(
    ports.map(async (port) => ({
      port,
      open: await checkPort(host, port),
    }))
  );

  return NextResponse.json({
    host,
    status: "Port scan completed",
    results,
  });
}