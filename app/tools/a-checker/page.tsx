"use client";

import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import RecordTable from "../../components/RecordTable";

interface AResult {
  domain: string;
  status: string;
  aCount: number;
  aaaaCount: number;
  aRecords: string[];
  aaaaRecords: string[];
}

export default function ACheckerPage() {
  return (
    <ToolShell<AResult>
      tag="DNS-03 / DNS RECORDS"
      title="A / AAAA Lookup"
      description="Look up IPv4 (A) and IPv6 (AAAA) address records for any domain."
      inputLabel="Domain to check"
      inputPlaceholder="example.com"
      buttonLabel="Look up IPs"
      buildUrl={(domain) => `/api/a-check?domain=${encodeURIComponent(domain)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader
            target={data.domain}
            status={data.status}
            tone={data.aCount + data.aaaaCount > 0 ? "success" : "danger"}
          />
          <div>
            <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mt-3 mb-1">
              A (IPv4) — {data.aCount}
            </p>
            <RecordTable records={data.aRecords} emptyLabel="No IPv4 records" />
          </div>
          <div>
            <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mt-4 mb-1">
              AAAA (IPv6) — {data.aaaaCount}
            </p>
            <RecordTable records={data.aaaaRecords} emptyLabel="No IPv6 records" />
          </div>
        </div>
      )}
    />
  );
}
