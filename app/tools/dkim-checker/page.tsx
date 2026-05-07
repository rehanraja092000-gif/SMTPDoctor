"use client";

import { useState } from "react";

export default function DKIMChecker() {
  const [domain, setDomain] = useState("");
  const [selector, setSelector] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkDKIM = async () => {
    if (!domain) return;

    setLoading(true);
    setResult(null);

    try {
      const query = selector
        ? `/api/dkim-check?domain=${domain}&selector=${selector}`
        : `/api/dkim-check?domain=${domain}`;

      const res = await fetch(query);
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
          Free DKIM Checker Tool
        </h1>

        <p className="mt-6 text-2xl text-slate-600">
          Enter a domain and instantly validate its DKIM record.
        </p>

        <p className="mt-2 text-lg text-slate-500">
          Leave selector blank to auto-scan all common DKIM selectors.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full max-w-2xl rounded-2xl border px-6 py-4 text-xl outline-none"
          />

          <input
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            placeholder="Custom Selector (optional) — default / selector1 / google"
            className="w-full max-w-2xl rounded-2xl border px-6 py-4 text-xl outline-none"
          />

          <button
            onClick={checkDKIM}
            className="rounded-2xl bg-black px-10 py-4 text-xl text-white"
          >
            {loading ? "Checking..." : "Check DKIM"}
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

            {result.count && (
              <p className="mt-4">
                <strong>Selectors Found:</strong> {result.count}
              </p>
            )}

            {result.records?.map((r: any, i: number) => (
              <div key={i} className="mt-6 rounded-xl bg-slate-50 p-4">
                <p><strong>Selector:</strong> {r.selector}</p>
                <p><strong>Host:</strong> {r.host}</p>
                <p className="break-all mt-2">
                  <strong>Record:</strong> {r.record}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}