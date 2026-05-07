"use client";

import { useState } from "react";

export default function PortChecker() {
  const [host, setHost] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkPorts = async () => {
    if (!host) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/port-check?host=${host}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ status: "Lookup failed" });
    }

    setLoading(false);
  };

  const getLabel = (port: number) => {
    const labels: Record<number, string> = {
      25: "SMTP",
      465: "SMTPS",
      587: "Submission",
      2525: "Alt Submission",
      110: "POP3",
      995: "POP3S",
      143: "IMAP",
      993: "IMAPS",
      80: "HTTP",
      443: "HTTPS",
      2083: "cPanel SSL",
      2087: "WHM SSL",
      2096: "Webmail SSL",
    };

    return labels[port] || "Unknown";
  };

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-6xl font-bold text-slate-900">
          Free SMTP Port Tester
        </h1>

        <p className="mt-6 text-2xl text-slate-600">
          Check email and hosting ports instantly.
        </p>

        <div className="mt-12 flex justify-center gap-4">
          <input
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="smtp.gmail.com"
            className="w-full max-w-2xl rounded-2xl border px-6 py-4 text-xl outline-none"
          />

          <button
            onClick={checkPorts}
            className="rounded-2xl bg-black px-10 py-4 text-xl text-white"
          >
            {loading ? "Checking..." : "Check Ports"}
          </button>
        </div>

        {result && (
          <div className="mt-14 rounded-3xl border p-8 text-left text-xl">
            <p>
              <strong>Host:</strong> {result.host}
            </p>

            <p className="mt-4">
              <strong>Status:</strong> {result.status}
            </p>

            {result.results?.map((r: any, i: number) => (
              <div
                key={i}
                className={`mt-5 rounded-xl p-5 border ${
                  r.open
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <p>
                  <strong>Port {r.port}</strong> — {getLabel(r.port)}
                </p>

                <p className="mt-2">
                  Status: {r.open ? "Open ✅" : "Closed ❌"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}