"use client";

import { useState } from "react";

export default function ReputationChecker() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkReputation = async () => {
    if (!domain) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `/api/reputation-check?domain=${encodeURIComponent(domain)}`
      );

      const data = await res.json();

      setResult(data);

    } catch {

      setResult({
        error: "Lookup failed",
      });

    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl">

        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-900">
            Domain Reputation Checker
          </h1>

          <p className="mt-6 text-2xl text-slate-600">
            Analyze domain trust, blacklist reputation, and security signals.
          </p>
        </div>

        <div className="mt-12 flex justify-center gap-4">

          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full max-w-2xl rounded-2xl border px-6 py-4 text-xl outline-none"
          />

          <button
            onClick={checkReputation}
            className="rounded-2xl bg-black px-10 py-4 text-xl text-white"
          >
            {loading ? "Checking..." : "Check Reputation"}
          </button>

        </div>

        {result && (
          <div className="mt-14 rounded-3xl border p-8">

            {result.error ? (

              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <p className="text-xl font-semibold text-red-700">
                  {result.error}
                </p>
              </div>

            ) : (

              <div className="flex flex-col gap-6">

                <div className="rounded-2xl border bg-slate-50 p-6">

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                      <p className="text-3xl font-bold text-slate-900">
                        {result.domain}
                      </p>

                      <p className="mt-3 text-xl text-slate-600">
                        Reputation Score: {result.score}/100
                      </p>
                    </div>

                    <div>
                      <span className="rounded-xl bg-green-100 px-5 py-3 text-lg font-semibold text-green-700">
                        {result.overallStatus}
                      </span>
                    </div>

                  </div>

                </div>

                {result.checks?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-2xl border bg-slate-50 p-6"
                  >

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          {item.name}
                        </p>

                        <p className="mt-2 text-slate-600">
                          {item.message}
                        </p>
                      </div>

                      <div>
                        <span className="rounded-xl bg-green-100 px-5 py-3 text-lg font-semibold text-green-700">
                          {item.status}
                        </span>
                      </div>

                    </div>

                  </div>
                ))}

              </div>

            )}

          </div>
        )}

      </div>
    </main>
  );
}