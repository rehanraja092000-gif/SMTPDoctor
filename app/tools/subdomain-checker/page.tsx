"use client";

import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import CopyButton from "../../components/CopyButton";

interface SubdomainRecord {
  subdomain: string;
  found: boolean;
  ips: string[];
}

interface SubdomainResult {
  domain: string;
  status: string;
  scanned: number;
  count: number;
  records: SubdomainRecord[];
}

export default function SubdomainCheckerPage() {
  return (
    <ToolShell<SubdomainResult>
      tag="DIAG-02 / DIAGNOSTICS"
      title="Subdomain Scanner"
      description="Scan a domain for commonly used subdomains like mail, vpn, cpanel, and staging environments."
      inputLabel="Domain to scan"
      inputPlaceholder="example.com"
      buttonLabel="Scan subdomains"
      buildUrl={(domain) => `/api/subdomain-check?domain=${encodeURIComponent(domain)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader
            target={data.domain}
            status={`${data.count} of ${data.scanned} found`}
            tone={data.count > 0 ? "success" : "neutral"}
          />
          {data.count > 0 ? (
            <ul className="divide-y divide-[var(--border)]">
              {data.records.map((r, i) => (
                <li key={i} className="flex items-center justify-between gap-3 py-3">
                  <span className="text-sm font-mono text-[var(--text-primary)]">{r.subdomain}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--text-secondary)]">
                      {r.ips.join(", ")}
                    </span>
                    <CopyButton value={r.subdomain} label={r.subdomain} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              None of the commonly scanned subdomains resolved for this domain.
            </p>
          )}
        </div>
      )}
    />
  );
}
