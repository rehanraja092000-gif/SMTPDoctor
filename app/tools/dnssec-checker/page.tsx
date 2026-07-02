"use client";
import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";

interface Result {
  domain: string; status: string; enabled: boolean;
  hasDS: boolean; hasDNSKEY: boolean; authenticated: boolean; note: string | null;
}

export default function Page() {
  return (
    <ToolShell<Result>
      tag="SEC-05 / SECURITY"
      title="DNSSEC Checker"
      description="Check whether a domain is protected by DNSSEC, which cryptographically signs DNS records to prevent spoofing and cache poisoning."
      inputLabel="Domain to check" inputPlaceholder="example.com" buttonLabel="Check DNSSEC"
      buildUrl={(d) => `/api/dnssec-check?domain=${encodeURIComponent(d)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader target={data.domain} status={data.status} tone={data.enabled ? "success" : "warning"} />
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <span className={data.hasDS ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}>
              DS record {data.hasDS ? "present" : "missing"}
            </span>
            <span className={data.hasDNSKEY ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}>
              DNSKEY {data.hasDNSKEY ? "present" : "missing"}
            </span>
          </div>
          {data.note && <p className="mt-3 text-sm text-[var(--text-secondary)]">{data.note}</p>}
        </div>
      )}
    />
  );
}
