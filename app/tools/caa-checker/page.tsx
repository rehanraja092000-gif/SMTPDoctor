"use client";
import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";

interface CaaRecord { tag: string; value: string; critical: boolean; }
interface Result { domain: string; status: string; hasPolicy: boolean; records: CaaRecord[]; note: string | null; }

export default function Page() {
  return (
    <ToolShell<Result>
      tag="TLS & CERTIFICATES"
      title="CAA Checker"
      description="Check a domain's CAA records, which control exactly which certificate authorities are allowed to issue TLS certificates for it."
      inputLabel="Domain to check" inputPlaceholder="example.com" buttonLabel="Check CAA"
      buildUrl={(d) => `/api/caa-check?domain=${encodeURIComponent(d)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader target={data.domain} status={data.status} tone={data.hasPolicy ? "success" : "warning"} />
          {data.records.length > 0 ? (
            <ul className="divide-y divide-[var(--border)]">
              {data.records.map((r, i) => (
                <li key={i} className="flex items-center justify-between gap-3 py-2">
                  <span className="font-mono text-xs text-[var(--accent)]">{r.tag}</span>
                  <span className="font-mono text-sm text-[var(--text-primary)] break-all">{r.value}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {data.note && <p className="mt-3 text-sm text-[var(--text-secondary)]">{data.note}</p>}
        </div>
      )}
    />
  );
}
