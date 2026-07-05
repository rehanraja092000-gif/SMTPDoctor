"use client";

import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import WarningList from "../../components/WarningList";

interface SpfMechanism {
  raw: string;
  type: string;
  qualifier: string;
  causesLookup: boolean;
  note?: string;
}

interface SPFResult {
  domain: string;
  status: string;
  found: boolean;
  record: string | null;
  valid: boolean;
  mechanisms: SpfMechanism[];
  lookupCount: number;
  lookupLimitExceeded: boolean;
  allQualifier: string | null;
  warnings: string[];
}

export default function SPFCheckerPage() {
  return (
    <ToolShell<SPFResult>
      tag="EMAIL AUTHENTICATION"
      title="SPF Checker"
      description="Look up a domain's SPF record, validate its syntax, and count DNS lookups against the limit that silently breaks SPF."
      inputLabel="Domain to check"
      inputPlaceholder="example.com"
      buttonLabel="Check SPF"
      buildUrl={(domain) => `/api/spf-check?domain=${encodeURIComponent(domain)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader
            target={data.domain}
            status={data.status}
            tone={!data.found ? "danger" : data.valid ? "success" : "warning"}
          />

          {data.record && (
            <p className="font-mono text-sm text-[var(--text-primary)] break-all bg-[var(--bg-raised)] rounded-lg p-3 mt-1">
              {data.record}
            </p>
          )}

          {data.found && (
            <>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-[var(--text-muted)] font-mono text-xs">DNS lookups </span>
                  <span className={data.lookupLimitExceeded ? "text-[var(--danger)]" : "text-[var(--accent)]"}>
                    {data.lookupCount} / 10
                  </span>
                </div>
                {data.allQualifier && (
                  <div>
                    <span className="text-[var(--text-muted)] font-mono text-xs">Policy </span>
                    <span className="text-[var(--text-primary)]">{data.allQualifier}</span>
                  </div>
                )}
              </div>

              {data.mechanisms.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Mechanisms
                  </p>
                  <ul className="divide-y divide-[var(--border)]">
                    {data.mechanisms.map((m, i) => (
                      <li key={i} className="flex items-center justify-between gap-3 py-2">
                        <span className="font-mono text-sm text-[var(--text-primary)]">{m.raw}</span>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {m.note || m.qualifier}
                          {m.causesLookup && <span className="text-[var(--text-muted)]"> · lookup</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          <WarningList warnings={data.warnings} />
        </div>
      )}
    />
  );
}
