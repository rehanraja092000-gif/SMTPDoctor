"use client";

import { useState } from "react";
import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import CopyButton from "../../components/CopyButton";

interface DKIMRecord {
  selector: string;
  host: string;
  record: string;
  found: boolean;
}

interface DKIMResult {
  domain: string;
  status: string;
  count: number;
  records: DKIMRecord[];
  error?: string;
}

export default function DKIMCheckerPage() {
  const [selector, setSelector] = useState("");

  return (
    <ToolShell<DKIMResult>
      tag="EMAIL AUTHENTICATION"
      title="DKIM Checker"
      description="Scan for common DKIM selectors, or check a specific selector you already know."
      inputLabel="Domain to check"
      inputPlaceholder="example.com"
      buttonLabel="Check DKIM"
      buildUrl={(domain) =>
        `/api/dkim-check?domain=${encodeURIComponent(domain)}${
          selector.trim() ? `&selector=${encodeURIComponent(selector.trim())}` : ""
        }`
      }
      extraControls={({ disabled }) => (
        <div className="flex items-center gap-2">
          <label htmlFor="dkim-selector" className="text-xs font-mono text-[var(--text-muted)] shrink-0">
            Selector (optional)
          </label>
          <input
            id="dkim-selector"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            disabled={disabled}
            placeholder="e.g. google, selector1, k1"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 font-mono text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent-dim)]"
          />
        </div>
      )}
      renderResult={(data) => (
        <div>
          <ResultHeader
            target={data.domain}
            status={data.status}
            tone={data.count > 0 ? "success" : "danger"}
          />
          {data.count > 0 ? (
            <ul className="divide-y divide-[var(--border)]">
              {data.records.map((r, i) => (
                <li key={i} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-mono text-[var(--accent)]">{r.selector}._domainkey</p>
                    <CopyButton value={r.record} label={`${r.selector} DKIM record`} />
                  </div>
                  <p className="mt-1 font-mono text-xs text-[var(--text-secondary)] break-all">
                    {r.record}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              No DKIM record was found for the common selectors scanned. If you
              know the exact selector your provider uses, enter it above.
            </p>
          )}
        </div>
      )}
    />
  );
}
