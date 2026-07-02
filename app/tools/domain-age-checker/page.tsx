"use client";
import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";

interface Result {
  domain: string; status: string; created: string | null; updated: string | null;
  expires: string | null; ageDisplay: string | null; note: string | null;
}

const fmt = (iso: string | null) => iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";

export default function Page() {
  return (
    <ToolShell<Result>
      tag="DIAG-04 / DIAGNOSTICS"
      title="Domain Age Checker"
      description="Find when a domain was first registered, when it was last updated, and when it expires — useful for assessing trust and reputation."
      inputLabel="Domain to check" inputPlaceholder="example.com" buttonLabel="Check age"
      buildUrl={(d) => `/api/domainage-check?domain=${encodeURIComponent(d)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader target={data.domain} status={data.ageDisplay || data.status} tone={data.created ? "success" : "neutral"} />
          <dl className="mt-3 grid gap-3 sm:grid-cols-3">
            <div><dt className="text-xs font-mono text-[var(--text-muted)]">Created</dt><dd className="text-sm text-[var(--text-primary)]">{fmt(data.created)}</dd></div>
            <div><dt className="text-xs font-mono text-[var(--text-muted)]">Updated</dt><dd className="text-sm text-[var(--text-primary)]">{fmt(data.updated)}</dd></div>
            <div><dt className="text-xs font-mono text-[var(--text-muted)]">Expires</dt><dd className="text-sm text-[var(--text-primary)]">{fmt(data.expires)}</dd></div>
          </dl>
          {data.note && <p className="mt-3 text-sm text-[var(--warning)]">{data.note}</p>}
        </div>
      )}
    />
  );
}
