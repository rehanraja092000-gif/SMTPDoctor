"use client";
import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";

interface Result { domain: string; status: string; found: boolean; record: string | null; reportAddress: string | null; note: string | null; }

export default function Page() {
  return (
    <ToolShell<Result>
      tag="MAIL-02 / EMAIL AUTHENTICATION"
      title="TLS-RPT Checker"
      description="Check a domain's TLS-RPT record, which asks receiving servers to report back when TLS encryption for your email fails."
      inputLabel="Domain to check" inputPlaceholder="example.com" buttonLabel="Check TLS-RPT"
      buildUrl={(d) => `/api/tlsrpt-check?domain=${encodeURIComponent(d)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader target={data.domain} status={data.status} tone={data.found ? "success" : "warning"} />
          {data.record && <p className="mt-1 font-mono text-sm text-[var(--text-primary)] break-all bg-[var(--bg-raised)] rounded-lg p-3">{data.record}</p>}
          {data.reportAddress && <p className="mt-2 text-sm text-[var(--text-secondary)]">Reports sent to: <span className="text-[var(--text-primary)]">{data.reportAddress}</span></p>}
          {data.note && <p className="mt-3 text-sm text-[var(--text-secondary)]">{data.note}</p>}
        </div>
      )}
    />
  );
}
