"use client";

import { useState } from "react";

export default function PropagationChecker() {
  const [domain, setDomain] = useState("");
  const [recordType, setRecordType] = useState("A");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkPropagation = async () => {
    if (!domain) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `/api/propagation-check?domain=${encodeURIComponent(
          domain
        )}&type=${recordType}`
      );

      const data = await res.json();

      setResult(data);
    } catch {
      setResult({
        status: "Lookup failed",
      });
    }

    setLoading(false);
  };

  const successfulResolvers =
    result?.results?.filter((r: any) => r.success)?.length || 0;

  const totalResolvers = result?.results?.length || 0;

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">

        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-900">
            DNS Propagation Checker
          </h1>

          <p className="mt-6 text-2xl text-slate-600">
            Check DNS propagation across multiple public DNS resolvers.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-4 md:flex-row md:justify-center">

          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full max-w-2xl rounded-2xl border px-6 py-4 text-xl outline-none"
          />

          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="rounded-2xl border px-6 py-4 text-xl outline-none"
          >
            <option value="A">A</option>
            <option value="AAAA">AAAA</option>
            <option value="MX">MX</option>
            <option value="TXT">TXT</option>
            <option value="NS">NS</option>
            <option value="CNAME">CNAME</option>
          </select>

          <button
            onClick={checkPropagation}
            className="rounded-2xl bg-black px-10 py-4 text-xl text-white"
          >
            {loading ? "Checking..." : "Check DNS"}
          </button>

        </div>

        {result && (
          <div className="mt-14 rounded-3xl border p-8">

            <div className="mb-8 rounded-2xl border bg-slate-50 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                  <p className="text-xl font-semibold text-slate-900">
                    Domain: {result.domain}
                  </p>

                  <p className="mt-2 text-slate-600">
                    Record Type: {recordType}
                  </p>
                </div>

                <div>
                  {successfulResolvers === totalResolvers ? (
                    <span className="rounded-xl bg-green-100 px-5 py-3 text-lg font-semibold text-green-700">
                      Fully Propagated ({successfulResolvers}/{totalResolvers})
                    </span>
                  ) : (
                    <span className="rounded-xl bg-yellow-100 px-5 py-3 text-lg font-semibold text-yellow-700">
                      Partial Propagation ({successfulResolvers}/{totalResolvers})
                    </span>
                  )}
                </div>

              </div>
            </div>

            <div className="flex flex-col gap-6">

              {result.results?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="rounded-2xl border bg-slate-50 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {item.resolver}
                      </p>

                      <p className="mt-1 text-slate-500">
                        {item.server}
                      </p>
                    </div>

                    <div>
                      {item.success ? (
                        <span className="rounded-xl bg-green-100 px-4 py-2 text-lg font-semibold text-green-700">
                          Propagated
                        </span>
                      ) : (
                        <span className="rounded-xl bg-red-100 px-4 py-2 text-lg font-semibold text-red-700">
                          Failed
                        </span>
                      )}
                    </div>

                  </div>

                  <div className="mt-5">

                    {item.records?.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {item.records.map(
                          (record: string, j: number) => (
                            <div
                              key={j}
                              className="rounded-xl border bg-white px-4 py-3 text-lg break-all"
                            >
                              {record}
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-lg text-slate-500">
                        {item.error || "No records found"}
                      </p>
                    )}

                  </div>
                </div>
              ))}

            </div>
          </div>
        )}
      </div>
    </main>
  );
}