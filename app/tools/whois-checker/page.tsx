"use client";

import { useState } from "react";

export default function WhoisChecker() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkWhois = async () => {
    if (!domain) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `/api/whois-check?domain=${encodeURIComponent(domain)}`
      );

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ status: "WHOIS lookup failed" });
    }

    setLoading(false);
  };

  const info = result?.data || {};

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h1 className="text-6xl font-bold text-slate-900">
          Free WHOIS Lookup Tool
        </h1>

        <p className="mt-6 text-2xl text-slate-600">
          Check domain registration and WHOIS information.
        </p>

        <div className="mt-12 flex justify-center gap-4">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full max-w-2xl rounded-2xl border px-6 py-4 text-xl outline-none"
          />

          <button
            onClick={checkWhois}
            className="rounded-2xl bg-black px-10 py-4 text-xl text-white"
          >
            {loading ? "Checking..." : "Check WHOIS"}
          </button>
        </div>

        {result && (
          <div className="mt-14 rounded-3xl border p-8 text-left">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Domain</p>
                <p className="mt-2 text-xl font-semibold break-all">
                  {info.domainName || result.domain}
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Registrar</p>
                <p className="mt-2 text-xl font-semibold break-all">
                  {info.registrar || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Creation Date</p>
                <p className="mt-2 text-xl font-semibold break-all">
                  {info.creationDate || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Expiration Date</p>
                <p className="mt-2 text-xl font-semibold break-all">
                  {info.registrarRegistrationExpirationDate || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Updated Date</p>
                <p className="mt-2 text-xl font-semibold break-all">
                  {info.updatedDate || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Registrant Country</p>
                <p className="mt-2 text-xl font-semibold break-all">
                  {info.registrantCountry || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6 md:col-span-2">
                <p className="text-sm text-slate-500">Name Servers</p>

                <div className="mt-3 flex flex-wrap gap-3">
                  {Array.isArray(info.nameServer)
                    ? info.nameServer.map((ns: string, i: number) => (
                        <div
                          key={i}
                          className="rounded-xl border bg-white px-4 py-2 text-lg"
                        >
                          {ns}
                        </div>
                      ))
                    : (
                      <div className="rounded-xl border bg-white px-4 py-2 text-lg">
                        {info.nameServer || "N/A"}
                      </div>
                    )}
                </div>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6 md:col-span-2">
                <p className="text-sm text-slate-500">Domain Status</p>

                <p className="mt-3 text-lg break-all">
                  {info.domainStatus || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}