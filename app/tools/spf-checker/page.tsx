"use client";

import { useState } from "react";

export default function SPFChecker() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkSPF = async () => {
    if (!domain) return;

    setLoading(true);
    setResult(null);

    const res = await fetch(`/api/spf-check?domain=${domain}`);
    const data = await res.json();

    setResult(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">SPF Checker</h1>
        <p className="mt-3 text-gray-600">
          Validate SPF records instantly.
        </p>

        <div className="mt-8 flex gap-3">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="flex-1 rounded-xl border px-4 py-3"
          />
          <button
            onClick={checkSPF}
            className="rounded-xl bg-black px-6 py-3 text-white"
          >
            {loading ? "Checking..." : "Check SPF"}
          </button>
        </div>

        {result && (
          <div className="mt-8 rounded-2xl border bg-gray-50 p-6">
            <p><strong>Domain:</strong> {result.domain}</p>
            <p><strong>Status:</strong> {result.status}</p>
            {result.record && (
              <p className="mt-2 break-all">
                <strong>Record:</strong> {result.record}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}