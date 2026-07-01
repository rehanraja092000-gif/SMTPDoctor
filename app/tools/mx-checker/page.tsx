"use client";

import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import CopyButton from "../../components/CopyButton";

interface MXRecord {
  exchange: string;
  priority: number;
}

interface MXResult {
  domain: string;
  status: string;
  count: number;
  records: MXRecord[];
  error?: string;
}

export default function MXCheckerPage() {
  return (
    <ToolShell<MXResult>
      tag="DNS-01 / DNS RECORDS"
      title="MX Lookup"
      description="Find the mail exchanger records and delivery priority for any domain."
      inputLabel="Domain to check"
      inputPlaceholder="example.com"
      buttonLabel="Look up MX"
      buildUrl={(domain) => `/api/mx-check?domain=${encodeURIComponent(domain)}`}
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
                <li key={i} className="flex items-center gap-3 py-3">
                  <span className="text-xs font-mono text-[var(--text-muted)] shrink-0 w-16">
                    Priority {r.priority}
                  </span>
                  <span className="flex-1 text-sm font-mono text-[var(--text-primary)] break-all">
                    {r.exchange}
                  </span>
                  <CopyButton value={r.exchange} label="mail exchanger" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              No MX records found. This domain can&apos;t receive email until mail
              exchanger records are configured.
            </p>
          )}
        </div>
      )}
    />
  );
}
