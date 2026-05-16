"use client";

import { useState } from "react";

export default function ReputationCheckerPage() {

  const [domain, setDomain] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<any>(null);

  const checkReputation =
    async () => {

      if (!domain) return;

      setLoading(true);

      setResult(null);

      try {

        const res =
          await fetch(
            `/api/reputation-check?domain=${domain}`
          );

        const data =
          await res.json();

        setResult(data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  return (

    <main className="min-h-screen bg-white px-6 py-20">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-14">

          <h1 className="text-7xl font-bold text-[#071133] mb-5">

            Domain Reputation Checker

          </h1>

          <p className="text-2xl text-gray-600">

            Analyze domain trust, blacklist reputation, and security signals.

          </p>

        </div>

        {/* SEARCH */}

        <div className="flex gap-4 mb-12">

          <input
            type="text"
            placeholder="Enter domain..."
            value={domain}
            onChange={(e) =>
              setDomain(
                e.target.value
              )
            }
            className="flex-1 border border-black rounded-3xl px-8 py-6 text-2xl outline-none"
          />

          <button
            onClick={
              checkReputation
            }
            className="bg-black text-white px-10 py-6 rounded-3xl text-2xl font-semibold hover:opacity-90 transition"
          >

            {loading
              ? "Checking..."
              : "Check Reputation"}

          </button>

        </div>

        {/* RESULTS */}

        {result && (

          <div className="border border-black rounded-[40px] p-10">

            {/* TOP RESULT */}

            <div className="border border-black rounded-3xl p-8 mb-8 flex items-center justify-between">

              <div>

                <h2 className="text-5xl font-bold text-[#071133] mb-4">

                  {result.domain}

                </h2>

                <p className="text-3xl text-gray-700">

                  Reputation Score:{" "}

                  {result.score}/100

                </p>

              </div>

              <div>

                <span
                  className={`px-8 py-4 rounded-2xl text-3xl font-bold
                  ${
                    result.overallStatus ===
                    "Excellent"
                      ? "bg-green-100 text-green-700"
                      : result.overallStatus ===
                        "Good"
                      ? "bg-blue-100 text-blue-700"
                      : result.overallStatus ===
                        "Average"
                      ? "bg-yellow-100 text-yellow-700"
                      : result.overallStatus ===
                        "Poor"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >

                  {
                    result.overallStatus
                  }

                </span>

              </div>

            </div>

            {/* CHECKS */}

            <div className="space-y-6">

              {result.checks?.map(
                (
                  check: any,
                  index: number
                ) => (

                  <div
                    key={index}
                    className="border border-black rounded-3xl p-8 flex items-center justify-between"
                  >

                    <div>

                      <h3 className="text-3xl font-bold text-[#071133] mb-3">

                        {check.name}

                      </h3>

                      <p className="text-xl text-gray-700 mb-2">

                        {
                          check.message
                        }

                      </p>

                      <p className="text-lg text-gray-500">

                        Impact:{" "}

                        {
                          check.impact
                        }

                      </p>

                    </div>

                    <div>

                      <span
                        className={`px-6 py-3 rounded-2xl text-2xl font-semibold
                        ${
                          check.success
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >

                        {
                          check.status
                        }

                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

            {/* SUGGESTIONS */}

            {result.suggestions &&
              result.suggestions
                .length > 0 && (

                <div className="mt-10 border border-black rounded-3xl p-8 bg-yellow-50">

                  <h2 className="text-4xl font-bold text-[#071133] mb-6">

                    Improvement Suggestions

                  </h2>

                  <div className="space-y-5">

                    {result.suggestions.map(
                      (
                        suggestion: string,
                        index: number
                      ) => (

                        <div
                          key={index}
                          className="border border-yellow-400 rounded-2xl p-5 bg-white"
                        >

                          <p className="text-2xl text-black">

                            {
                              suggestion
                            }

                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

          </div>

        )}

      </div>

    </main>

  );

}