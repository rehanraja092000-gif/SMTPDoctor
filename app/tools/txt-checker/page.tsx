"use client";

import { useState } from "react";

export default function TXTChecker() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkTXT = async () => {
    if (!domain) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `/api/txt-check?domain=${encodeURIComponent(domain)}`
      );

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ status: "Lookup failed" });
    }

    setLoading(false);
  };

  const getTagType = (record: string) => {
    if (record.startsWith("v=spf1")) return "SPF";
    if (record.includes("google-site-verification"))
      return "Google Verification";
    if (record.includes("facebook-domain-verification"))
      return "Facebook Verification";
    if (record.includes("MS="))
      return "Microsoft Verification";
    if (record.includes("amazonses"))
      return "Amazon SES";
    if (record.includes("zoho-verification"))
      return "Zoho Verification";

    return "TXT Record";
  };

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h1 className="text-6xl font-bold text-slate-900">
          Free TXT Record Lookup
        </h1>

        <p className="mt-6 text-2xl text-slate-600">
          Check TXT records including SPF and domain verification entries.
        </p>

        <div className="mt-12 flex justify-center gap-4">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full max-w-2xl rounded-2xl border px-6 py-4 text-xl outline-none"
          />

          <button
            onClick={checkTXT}
            className="rounded-2xl bg-black px-10 py-4 text-xl text-white"
          >
            {loading ? "Checking..." : "Check TXT"}
          </button>
        </div>

        {result && (
          <div className="mt-14 rounded-3xl border p-8 text-left">
            <p className="text-xl">
              <strong>Domain:</strong> {result.domain}
            </p>

            <p className="mt-4 text-xl">
              <strong>Status:</strong> {result.status}
            </p>

            <p className="mt-4 text-xl">
              <strong>TXT Records:</strong> {result.count}
            </p>

            {result.records?.map((record: string, i: number) => (
              <div
                key={i}
                className="mt-6 rounded-2xl border bg-slate-50 p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-bold text-slate-800">
                    {getTagType(record)}
                  </p>
                </div>

                <div className="mt-4 rounded-xl border bg-white p-4 break-all text-lg">
                  {record}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}