"use client";
import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";

interface Result {
  domain: string; status: string; valid: boolean; expiringSoon: boolean;
  subject: string; issuer: string; validFrom: string; validTo: string;
  daysRemaining: number; san: string[]; protocol: string | null; error?: string;
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

export default function Page() {
  return (
    <ToolShell<Result>
      tag="TLS-01 / TLS & CERTIFICATES"
      title="SSL / TLS Certificate Checker"
      description="Inspect a website's TLS certificate: issuer, validity dates, days until expiry, protocol version, and every hostname it covers."
      inputLabel="Domain to check" inputPlaceholder="example.com" buttonLabel="Check certificate"
      buildUrl={(d) => `/api/ssl-check?domain=${encodeURIComponent(d)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader target={data.domain} status={data.status}
            tone={!data.valid ? "danger" : data.expiringSoon ? "warning" : "success"} />
          {data.error ? (
            <p className="text-sm text-[var(--text-secondary)]">{data.error}</p>
          ) : (
            <>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                <div><dt className="text-xs font-mono text-[var(--text-muted)]">Issued to</dt><dd className="text-sm text-[var(--text-primary)] break-all">{data.subject}</dd></div>
                <div><dt className="text-xs font-mono text-[var(--text-muted)]">Issuer</dt><dd className="text-sm text-[var(--text-primary)]">{data.issuer}</dd></div>
                <div><dt className="text-xs font-mono text-[var(--text-muted)]">Valid from</dt><dd className="text-sm text-[var(--text-primary)]">{fmt(data.validFrom)}</dd></div>
                <div><dt className="text-xs font-mono text-[var(--text-muted)]">Expires</dt><dd className="text-sm text-[var(--text-primary)]">{fmt(data.validTo)} ({data.daysRemaining} days)</dd></div>
                {data.protocol && <div><dt className="text-xs font-mono text-[var(--text-muted)]">Protocol</dt><dd className="text-sm text-[var(--text-primary)]">{data.protocol}</dd></div>}
              </dl>
              {data.san.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-mono text-[var(--text-muted)] mb-1">Covers {data.san.length} hostname{data.san.length !== 1 ? "s" : ""}</p>
                  <p className="text-xs font-mono text-[var(--text-secondary)] break-all">{data.san.join(", ")}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    />
  );
}
