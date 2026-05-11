"use client";

import { useState } from "react";

export default function SubdomainChecker() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const scanSubdomains = async () => {
    if (!domain) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `/api/subdomain-check?domain=${encodeURIComponent(domain)}`
      );

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ status: "Scan failed" });
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h1 className="text-6xl font-bold text-slate-900">
          Free Subdomain Scanner
        </h1>

        <p className="mt-6 text-2xl text-slate-600">
          Discover common subdomains for any domain.
        </p>

        <div className="mt-12 flex justify-center gap-4">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full max-w-2xl rounded-2xl border px-6 py-4 text-xl outline-none"
          />

          <button
            onClick={scanSubdomains}
            className="rounded-2xl bg-black px-10 py-4 text-xl text-white"
          >
            {loading ? "Scanning..." : "Scan Subdomains"}
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
              <strong>Subdomains Found:</strong> {result.count}
            </p>

            {result.records?.map((record: any, i: number) => (
              <div
                key={i}
                className="mt-5 rounded-xl bg-slate-50 border p-5"
              >
                <p className="break-all">
                  <strong>Subdomain:</strong> {record.subdomain}
                </p>

                <div className="mt-3">
                  <strong>IPs:</strong>

                  {record.ips?.map((ip: string, j: number) => (
                    <div
                      key={j}
                      className="mt-2 rounded-lg bg-white border p-3 break-all"
                    >
                      {ip}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}