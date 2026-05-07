"use client";

import { useState } from "react";

export default function MXChecker() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkMX = async () => {
    if (!domain) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/mx-check?domain=${domain}`);
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
          Free MX Checker Tool
        </h1>

        <p className="mt-6 text-2xl text-slate-600">
          Enter a domain and instantly check its MX records.
        </p>

        <div className="mt-12 flex justify-center gap-4">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full max-w-2xl rounded-2xl border px-6 py-4 text-xl outline-none"
          />

          <button
            onClick={checkMX}
            className="rounded-2xl bg-black px-10 py-4 text-xl text-white"
          >
            {loading ? "Checking..." : "Check MX"}
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

            {result.count > 0 && (
              <p className="mt-4">
                <strong>Records Found:</strong> {result.count}
              </p>
            )}

            {result.records?.map((record: any, i: number) => (
              <div key={i} className="mt-6 rounded-xl bg-slate-50 p-5">
                <p>
                  <strong>Priority:</strong> {record.priority}
                </p>

                <p className="mt-2 break-all">
                  <strong>Exchange:</strong> {record.exchange}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}