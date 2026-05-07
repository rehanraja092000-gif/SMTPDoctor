"use client";

import { useState } from "react";

export default function Home() {
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
    <main className="min-h-screen bg-white text-gray-900">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <h1 className="text-2xl font-bold">SMTPDoctor</h1>
      </nav>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-5xl font-bold leading-tight">
          Free SPF Checker Tool
        </h2>

        <p className="mt-6 text-lg text-gray-600">
          Enter a domain and instantly validate its SPF record.
        </p>

        <div className="mt-10 flex gap-3 justify-center">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full max-w-md rounded-xl border px-4 py-3"
          />
          <button
            onClick={checkSPF}
            className="rounded-xl bg-black px-6 py-3 text-white"
          >
            {loading ? "Checking..." : "Check SPF"}
          </button>
        </div>

        {result && (
          <div className="mt-10 rounded-2xl border bg-gray-50 p-6 text-left">
            <p><strong>Domain:</strong> {result.domain}</p>
            <p><strong>Status:</strong> {result.status}</p>
            {result.record && (
              <p className="mt-2 break-all">
                <strong>Record:</strong> {result.record}
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}