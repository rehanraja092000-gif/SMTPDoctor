"use client";

import { useState } from "react";

export default function PTRChecker() {
  const [ip, setIP] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkPTR = async () => {
    if (!ip) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `/api/ptr-check?ip=${encodeURIComponent(ip)}`
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
          Free PTR Lookup Tool
        </h1>

        <p className="mt-6 text-2xl text-slate-600">
          Check reverse DNS (PTR) records for any IP address.
        </p>

        <div className="mt-12 flex justify-center gap-4">
          <input
            value={ip}
            onChange={(e) => setIP(e.target.value)}
            placeholder="8.8.8.8"
            className="w-full max-w-2xl rounded-2xl border px-6 py-4 text-xl outline-none"
          />

          <button
            onClick={checkPTR}
            className="rounded-2xl bg-black px-10 py-4 text-xl text-white"
          >
            {loading ? "Checking..." : "Check PTR"}
          </button>
        </div>

        {result && (
          <div className="mt-14 rounded-3xl border p-8 text-left text-xl">
            <p>
              <strong>IP Address:</strong> {result.ip}
            </p>

            <p className="mt-4">
              <strong>Status:</strong> {result.status}
            </p>

            <p className="mt-4">
              <strong>PTR Records:</strong> {result.count}
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