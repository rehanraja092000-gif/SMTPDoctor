"use client";

import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import RecordTable from "../../components/RecordTable";

interface NSResult {
  domain: string;
  status: string;
  count: number;
  records: string[];
  error?: string;
}

export default function NSCheckerPage() {
  return (
    <ToolShell<NSResult>
      tag="DNS-02 / DNS RECORDS"
      title="NS Lookup"
      description="Find the authoritative nameservers responsible for a domain."
      inputLabel="Domain to check"
      inputPlaceholder="example.com"
      buttonLabel="Look up NS"
      buildUrl={(domain) => `/api/ns-check?domain=${encodeURIComponent(domain)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader
            target={data.domain}
            status={data.status}
            tone={data.count > 0 ? "success" : "danger"}
          />
          <RecordTable records={data.records} emptyLabel="No nameservers found" />
        </div>
      )}
    />
  );
}
