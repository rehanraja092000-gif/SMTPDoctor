"use client";

import { useState } from "react";

export default function IPChecker() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkIP = async () => {
    if (!domain) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `/api/a-check?domain=${encodeURIComponent(domain)}`
      );

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ status: "Lookup failed" });
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-6xl font-bold text-slate-900">
          Free IP Lookup Tool
        </h1>

        <p className="mt-6 text-2xl text-slate-600">
          Find IPv4 (A) and IPv6 (AAAA) records for any domain.
        </p>

        <div className="mt-12 flex justify-center gap-4">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full max-w-2xl rounded-2xl border px-6 py-4 text-xl outline-none"
          />

          <button
            onClick={checkIP}
            className="rounded-2xl bg-black px-10 py-4 text-xl text-white"
          >
            {loading ? "Checking..." : "Check IP"}
          </button>
        </div>

        {result && (
          <div className="mt-14 rounded-3xl border p-8 text-left text-xl">
            <p>
              <strong>Domain:</strong> {result.domain}
            </p>

            <p className="mt-4">
              <strong>Status:</strong> {result.status}
            </p>

            {/* IPv4 */}
            <div className="mt-8">
              <h2 className="text-3xl font-bold">IPv4 (A Records)</h2>

              <p className="mt-2">
                <strong>Count:</strong> {result.aCount}
              </p>

              {result.aRecords?.map((record: string, i: number) => (
                <div
                  key={i}
                  className="mt-4 rounded-xl bg-slate-50 border p-5 break-all"
                >
                  {record}
                </div>
              ))}
            </div>

            {/* IPv6 */}
            <div className="mt-10">
              <h2 className="text-3xl font-bold">IPv6 (AAAA Records)</h2>

              <p className="mt-2">
                <strong>Count:</strong> {result.aaaaCount}
              </p>

              {result.aaaaRecords?.map((record: string, i: number) => (
                <div
                  key={i}
                  className="mt-4 rounded-xl bg-slate-50 border p-5 break-all"
                >
                  {record}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}