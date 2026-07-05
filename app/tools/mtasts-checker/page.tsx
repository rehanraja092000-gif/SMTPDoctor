"use client";
import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";

interface Result {
  domain: string; status: string; hasDnsRecord: boolean; hasPolicy: boolean;
  dnsRecord: string | null; policyMode: string | null; policy: string | null; note: string | null;
}

export default function Page() {
  return (
    <ToolShell<Result>
      tag="EMAIL AUTHENTICATION"
      title="MTA-STS Checker"
      description="Check a domain's MTA-STS setup, which forces sending servers to use TLS when delivering mail to you — both the DNS record and the HTTPS policy file."
      inputLabel="Domain to check" inputPlaceholder="example.com" buttonLabel="Check MTA-STS"
      buildUrl={(d) => `/api/mtasts-check?domain=${encodeURIComponent(d)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader target={data.domain} status={data.status} tone={data.hasDnsRecord && data.hasPolicy ? "success" : "warning"} />
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <span className={data.hasDnsRecord ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}>DNS record {data.hasDnsRecord ? "✓" : "✗"}</span>
            <span className={data.hasPolicy ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}>Policy file {data.hasPolicy ? "✓" : "✗"}</span>
            {data.policyMode && <span className="text-[var(--text-secondary)]">Mode: {data.policyMode}</span>}
          </div>
          {data.policy && <pre className="mt-3 text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-raised)] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">{data.policy}</pre>}
          {data.note && <p className="mt-3 text-sm text-[var(--text-secondary)]">{data.note}</p>}
        </div>
      )}
    />
  );
}
