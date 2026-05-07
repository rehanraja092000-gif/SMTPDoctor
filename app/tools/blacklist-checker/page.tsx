"use client";

import { useState } from "react";

export default function BlacklistChecker() {
  const [target, setTarget] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkBlacklist = async () => {
    if (!target) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `/api/blacklist-check?target=${encodeURIComponent(target)}`
      );
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ status: "Lookup failed" });
    }

    setLoading(false);
  };

  const listedCount =
    result?.results?.filter((r: any) => r.listed).length || 0;

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-6xl font-bold text-slate-900">
          Free Blacklist Checker
        </h1>

        <p className="mt-6 text-2xl text-slate-600">
          Check whether your IP or mail server is listed on major spam blacklists.
        </p>

        <div className="mt-12 flex justify-center gap-4">
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="example.com or 1.2.3.4"
            className="w-full max-w-2xl rounded-2xl border px-6 py-4 text-xl outline-none"
          />

          <button
            onClick={checkBlacklist}
            className="rounded-2xl bg-black px-10 py-4 text-xl text-white"
          >
            {loading ? "Checking..." : "Check Blacklist"}
          </button>
        </div>

        {result && (
          <div className="mt-14 rounded-3xl border p-8 text-left text-xl">
            <p>
              <strong>Target:</strong> {result.target}
            </p>

            {result.ip && (
              <p className="mt-4">
                <strong>Resolved IP:</strong> {result.ip}
              </p>
            )}

            <p className="mt-4">
              <strong>Status:</strong> {result.status}
            </p>

            {result.results && (
              <p className="mt-4">
                <strong>Blacklists Hit:</strong> {listedCount} / {result.results.length}
              </p>
            )}

            {result.results?.map((r: any, i: number) => (
              <div
                key={i}
                className={`mt-5 rounded-xl p-5 border ${
                  r.listed
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <p>
                  <strong>{r.blacklist}</strong>
                </p>

                <p className="mt-2">
                  Status: {r.listed ? "Listed ❌" : "Clean ✅"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}