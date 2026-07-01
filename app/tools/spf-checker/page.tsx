"use client";

import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";

interface SPFResult {
  domain: string;
  status: string;
  record: string | null;
  error?: string;
}

export default function SPFCheckerPage() {
  return (
    <ToolShell<SPFResult>
      tag="AUTH-01 / EMAIL AUTHENTICATION"
      title="SPF Checker"
      description="Look up a domain's SPF record and confirm it's published correctly."
      inputLabel="Domain to check"
      inputPlaceholder="example.com"
      buttonLabel="Check SPF"
      buildUrl={(domain) => `/api/spf-check?domain=${encodeURIComponent(domain)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader
            target={data.domain}
            status={data.status}
            tone={data.record ? "success" : "danger"}
          />
          {data.record ? (
            <p className="font-mono text-sm text-[var(--text-primary)] break-all bg-[var(--bg-raised)] rounded-lg p-3 mt-1">
              {data.record}
            </p>
          ) : (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              No SPF record was found. Without one, receiving mail servers can&apos;t
              verify which servers are allowed to send mail for this domain.
            </p>
          )}
        </div>
      )}
    />
  );
}
