"use client";

import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import CopyButton from "../../components/CopyButton";

interface WhoisResult {
  domain: string;
  status: string;
  data: Record<string, unknown> | null;
  raw: string | null;
  rawServer: string | null;
  error?: string;
}

const FRIENDLY_KEYS: Record<string, string> = {
  registrar: "Registrar",
  creationDate: "Created",
  updatedDate: "Updated",
  registryExpiryDate: "Expires",
  domainStatus: "Status",
  nameServer: "Nameservers",
};

export default function WhoisCheckerPage() {
  return (
    <ToolShell<WhoisResult>
      tag="DIAGNOSTICS"
      title="WHOIS Lookup"
      description="Look up registrar and registration details for any domain."
      inputLabel="Domain to check"
      inputPlaceholder="example.com"
      buttonLabel="Look up WHOIS"
      buildUrl={(domain) => `/api/whois-check?domain=${encodeURIComponent(domain)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader
            target={data.domain}
            status={data.status}
            tone={data.raw || data.data ? "success" : "danger"}
          />

          {data.data && (
            <dl className="grid gap-2 sm:grid-cols-2 mb-4">
              {Object.entries(FRIENDLY_KEYS).map(([key, label]) =>
                data.data && data.data[key] ? (
                  <div key={key}>
                    <dt className="text-xs font-mono text-[var(--text-muted)]">{label}</dt>
                    <dd className="text-sm text-[var(--text-primary)] break-all">
                      {String(data.data[key])}
                    </dd>
                  </div>
                ) : null
              )}
            </dl>
          )}

          {data.raw ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-mono text-[var(--text-muted)]">
                  Raw response {data.rawServer ? `· ${data.rawServer}` : ""}
                </p>
                <CopyButton value={data.raw} label="raw WHOIS response" />
              </div>
              <pre className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-raised)] rounded-lg p-3 overflow-x-auto max-h-96 whitespace-pre-wrap">
                {data.raw}
              </pre>
            </div>
          ) : !data.data ? (
            <p className="text-sm text-[var(--text-secondary)]">
              No WHOIS data could be retrieved for this domain.
            </p>
          ) : null}
        </div>
      )}
    />
  );
}
