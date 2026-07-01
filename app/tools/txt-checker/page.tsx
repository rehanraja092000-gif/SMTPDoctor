"use client";

import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import RecordTable from "../../components/RecordTable";

interface TXTResult {
  domain: string;
  status: string;
  count: number;
  records: string[];
  error?: string;
}

export default function TXTCheckerPage() {
  return (
    <ToolShell<TXTResult>
      tag="DNS-05 / DNS RECORDS"
      title="TXT Record Lookup"
      description="View every TXT record published for a domain — SPF, verification codes, and more."
      inputLabel="Domain to check"
      inputPlaceholder="example.com"
      buttonLabel="Look up TXT"
      buildUrl={(domain) => `/api/txt-check?domain=${encodeURIComponent(domain)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader
            target={data.domain}
            status={data.status}
            tone={data.count > 0 ? "success" : "danger"}
          />
          <RecordTable records={data.records} emptyLabel="No TXT records found" />
        </div>
      )}
    />
  );
}
