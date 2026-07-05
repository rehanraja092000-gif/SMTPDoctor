"use client";

import { useState } from "react";
import ToolShell from "../../components/ToolShell";
import StatusBadge, { toneForBool } from "../../components/StatusBadge";

interface ResolverResult {
  resolver: string;
  server: string;
  success: boolean;
  records: (string | number)[];
  error?: string;
}

interface PropagationResult {
  domain: string;
  type: string;
  results: ResolverResult[];
}

const RECORD_TYPES = ["A", "AAAA", "MX", "TXT", "NS", "CNAME"];

export default function PropagationCheckerPage() {
  const [type, setType] = useState("A");

  return (
    <ToolShell<PropagationResult>
      tag="DIAGNOSTICS"
      title="DNS Propagation Checker"
      description="Compare a domain's answers across four public resolvers to see how fully a change has propagated."
      inputLabel="Domain to check"
      inputPlaceholder="example.com"
      buttonLabel="Check propagation"
      buildUrl={(domain) =>
        `/api/propagation-check?domain=${encodeURIComponent(domain)}&type=${type}`
      }
      extraControls={({ disabled }) => (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[var(--text-muted)]">Record type</span>
          <div className="flex gap-1">
            {RECORD_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                disabled={disabled}
                onClick={() => setType(t)}
                aria-pressed={type === t}
                className={`rounded-md px-2.5 py-1 text-xs font-mono border transition-colors ${
                  type === t
                    ? "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-dim)]"
                    : "text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
      renderResult={(data) => (
        <div>
          <div className="flex items-center justify-between pb-4 mb-1 border-b border-[var(--border)]">
            <p className="font-mono text-sm text-[var(--text-primary)]">
              {data.domain} <span className="text-[var(--text-muted)]">· {data.type}</span>
            </p>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {data.results.map((r, i) => (
              <li key={i} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{r.resolver}</p>
                    <p className="text-xs font-mono text-[var(--text-muted)]">{r.server}</p>
                  </div>
                  <StatusBadge tone={toneForBool(r.success)}>
                    {r.success ? "Resolved" : "No answer"}
                  </StatusBadge>
                </div>
                {r.success && r.records.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {r.records.map((rec, j) => (
                      <li key={j} className="text-xs font-mono text-[var(--text-secondary)] break-all">
                        {String(rec)}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    />
  );
}
