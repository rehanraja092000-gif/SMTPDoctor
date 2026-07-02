"use client";
import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import WarningList from "../../components/WarningList";

interface Result {
  domain: string; status: string; enabled: boolean; header?: string;
  maxAgeDays?: number; includeSubdomains?: boolean; preload?: boolean; warnings?: string[]; note?: string;
}

export default function Page() {
  return (
    <ToolShell<Result>
      tag="WEB-02 / WEBSITE SECURITY"
      title="HSTS Checker"
      description="Check a website's HTTP Strict Transport Security policy, which forces browsers to connect over HTTPS and blocks downgrade attacks."
      inputLabel="Domain to check" inputPlaceholder="example.com" buttonLabel="Check HSTS"
      buildUrl={(d) => `/api/hsts-check?domain=${encodeURIComponent(d)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader target={data.domain} status={data.status} tone={data.enabled ? "success" : "warning"} />
          {data.header && <p className="mt-1 font-mono text-sm text-[var(--text-primary)] break-all bg-[var(--bg-raised)] rounded-lg p-3">{data.header}</p>}
          {data.enabled && (
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <span className="text-[var(--text-secondary)]">max-age: {data.maxAgeDays} days</span>
              <span className={data.includeSubdomains ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}>includeSubDomains {data.includeSubdomains ? "✓" : "✗"}</span>
              <span className={data.preload ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}>preload {data.preload ? "✓" : "✗"}</span>
            </div>
          )}
          {data.warnings && <WarningList warnings={data.warnings} />}
          {data.note && <p className="mt-3 text-sm text-[var(--text-secondary)]">{data.note}</p>}
        </div>
      )}
    />
  );
}
