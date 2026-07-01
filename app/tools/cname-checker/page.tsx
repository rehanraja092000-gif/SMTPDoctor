"use client";

import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import RecordTable from "../../components/RecordTable";

interface CNAMEResult {
  domain: string;
  status: string;
  count: number;
  records: string[];
  error?: string;
}

export default function CNAMECheckerPage() {
  return (
    <ToolShell<CNAMEResult>
      tag="DNS-04 / DNS RECORDS"
      title="CNAME Lookup"
      description="Check the canonical name (alias) record for a subdomain."
      inputLabel="Hostname to check"
      inputPlaceholder="www.example.com"
      buttonLabel="Look up CNAME"
      buildUrl={(domain) => `/api/cname-check?domain=${encodeURIComponent(domain)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader
            target={data.domain}
            status={data.status}
            tone={data.count > 0 ? "success" : "neutral"}
          />
          <RecordTable records={data.records} emptyLabel="No CNAME record — this may be a root record instead" />
        </div>
      )}
    />
  );
}
