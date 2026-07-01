"use client";

import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import RecordTable from "../../components/RecordTable";

interface PTRResult {
  ip: string;
  status: string;
  count: number;
  records: string[];
  error?: string;
}

export default function PTRCheckerPage() {
  return (
    <ToolShell<PTRResult>
      tag="DNS-06 / DNS RECORDS"
      title="PTR Lookup"
      description="Reverse DNS — find the hostname an IP address resolves back to."
      inputLabel="IP address to check"
      inputPlaceholder="8.8.8.8"
      buttonLabel="Look up PTR"
      buildUrl={(ip) => `/api/ptr-check?ip=${encodeURIComponent(ip)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader
            target={data.ip}
            status={data.status}
            tone={data.count > 0 ? "success" : "danger"}
          />
          <RecordTable records={data.records} emptyLabel="No PTR record found" />
        </div>
      )}
    />
  );
}
