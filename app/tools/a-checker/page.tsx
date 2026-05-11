"use client";

import { useState } from "react";

export default function AChecker() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkA = async () => {
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
          Free A Record Lookup
        </h1>

        <p className="mt-6 text-2xl text-slate-600">
          Find IPv4 addresses for any domain.
        </p>

        <div className="mt-12 flex justify-center gap-4">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full max-w-2xl rounded-2xl border px-6 py-4 text-xl outline-none"
          />

          <button
            onClick={checkA}
            className="rounded-2xl bg-black px-10 py-4 text-xl text-white"
          >
            {loading ? "Checking..." : "Check A Record"}
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

            <p className="mt-4">
              <strong>A Records:</strong> {result.count}
            </p>

            {result.records?.map((record: string, i: number) => (
              <div
                key={i}
                className="mt-5 rounded-xl bg-slate-50 border p-5 break-all"
              >
                {record}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}