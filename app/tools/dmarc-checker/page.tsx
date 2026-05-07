"use client";

import { useState } from "react";

export default function DMARCChecker() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkDMARC = async () => {
    if (!domain) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/dmarc-check?domain=${domain}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ status: "Lookup failed" });
    }

    setLoading(false);
  };

  const parseTags = (record: string) => {
    if (!record) return [];

    return record
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const [key, value] = item.split("=");
        return { key, value };
      });
  };

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-6xl font-bold text-slate-900">
          Free DMARC Checker Tool
        </h1>

        <p className="mt-6 text-2xl text-slate-600">
          Enter a domain and instantly validate its DMARC record.
        </p>

        <div className="mt-12 flex justify-center gap-4">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full max-w-2xl rounded-2xl border px-6 py-4 text-xl outline-none"
          />

          <button
            onClick={checkDMARC}
            className="rounded-2xl bg-black px-10 py-4 text-xl text-white"
          >
            {loading ? "Checking..." : "Check DMARC"}
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

            {result.host && (
              <p className="mt-4 break-all">
                <strong>Host:</strong> {result.host}
              </p>
            )}

            {result.record && (
              <>
                <p className="mt-6">
                  <strong>Record:</strong>
                </p>

                <div className="mt-3 rounded-xl bg-slate-50 p-4 break-all">
                  {result.record}
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {parseTags(result.record).map((tag, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-slate-50 p-4 border"
                    >
                      <p className="font-bold uppercase text-slate-800">
                        {tag.key}
                      </p>
                      <p className="mt-2 break-all text-slate-600">
                        {tag.value}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}