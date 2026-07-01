"use client";

import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";

interface DMARCResult {
  domain: string;
  status: string;
  host?: string;
  record?: string;
  error?: string;
}

export default function DMARCCheckerPage() {
  return (
    <ToolShell<DMARCResult>
      tag="AUTH-03 / EMAIL AUTHENTICATION"
      title="DMARC Checker"
      description="Check a domain's DMARC policy, alignment settings, and reporting addresses."
      inputLabel="Domain to check"
      inputPlaceholder="example.com"
      buttonLabel="Check DMARC"
      buildUrl={(domain) => `/api/dmarc-check?domain=${encodeURIComponent(domain)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader
            target={data.domain}
            status={data.status}
            tone={data.record ? "success" : "danger"}
          />
          {data.record ? (
            <>
              <p className="text-xs font-mono text-[var(--text-muted)] mb-1">{data.host}</p>
              <p className="font-mono text-sm text-[var(--text-primary)] break-all bg-[var(--bg-raised)] rounded-lg p-3">
                {data.record}
              </p>
            </>
          ) : (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              No DMARC policy was found at {data.host}. Without DMARC, spoofed
              mail using this domain has no defined handling instructions.
            </p>
          )}
        </div>
      )}
    />
  );
}
