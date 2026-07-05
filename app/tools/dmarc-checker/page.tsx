"use client";

import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import WarningList from "../../components/WarningList";

interface DMARCResult {
  domain: string;
  status: string;
  found: boolean;
  record: string | null;
  policy: string | null;
  subdomainPolicy: string | null;
  pct: number;
  ruaAddresses: string[];
  rufAddresses: string[];
  alignment: { spf: string; dkim: string };
  strength: "strong" | "moderate" | "weak" | "none";
  warnings: string[];
}

const alignLabel = (v: string) => (v === "s" ? "strict" : "relaxed");

export default function DMARCCheckerPage() {
  return (
    <ToolShell<DMARCResult>
      tag="EMAIL AUTHENTICATION"
      title="DMARC Checker"
      description="Parse a domain's DMARC record into its policy, alignment, and reporting tags — and see how strong the enforcement really is."
      inputLabel="Domain to check"
      inputPlaceholder="example.com"
      buttonLabel="Check DMARC"
      buildUrl={(domain) => `/api/dmarc-check?domain=${encodeURIComponent(domain)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader
            target={data.domain}
            status={data.status}
            tone={
              !data.found ? "danger"
              : data.strength === "strong" ? "success"
              : data.strength === "moderate" ? "success"
              : "warning"
            }
          />

          {data.record && (
            <p className="font-mono text-sm text-[var(--text-primary)] break-all bg-[var(--bg-raised)] rounded-lg p-3 mt-1">
              {data.record}
            </p>
          )}

          {data.found && (
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-mono text-[var(--text-muted)]">Policy (p)</dt>
                <dd className="text-sm text-[var(--text-primary)]">{data.policy || "—"}</dd>
              </div>
              {data.subdomainPolicy && (
                <div>
                  <dt className="text-xs font-mono text-[var(--text-muted)]">Subdomain (sp)</dt>
                  <dd className="text-sm text-[var(--text-primary)]">{data.subdomainPolicy}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-mono text-[var(--text-muted)]">Coverage (pct)</dt>
                <dd className="text-sm text-[var(--text-primary)]">{data.pct}%</dd>
              </div>
              <div>
                <dt className="text-xs font-mono text-[var(--text-muted)]">Alignment</dt>
                <dd className="text-sm text-[var(--text-primary)]">
                  SPF {alignLabel(data.alignment.spf)}, DKIM {alignLabel(data.alignment.dkim)}
                </dd>
              </div>
              {data.ruaAddresses.length > 0 && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-mono text-[var(--text-muted)]">Aggregate reports (rua)</dt>
                  <dd className="text-sm text-[var(--text-primary)] break-all">
                    {data.ruaAddresses.join(", ")}
                  </dd>
                </div>
              )}
            </dl>
          )}

          <WarningList warnings={data.warnings} />
        </div>
      )}
    />
  );
}
