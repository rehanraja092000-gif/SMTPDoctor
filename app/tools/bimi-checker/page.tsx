"use client";
import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";

interface Result { domain: string; selector: string; status: string; found: boolean; record: string | null; logoUrl: string | null; vmcUrl: string | null; note: string | null; }

export default function Page() {
  return (
    <ToolShell<Result>
      tag="EMAIL AUTHENTICATION"
      title="BIMI Checker"
      description="Check a domain's BIMI record, which displays your verified brand logo beside authenticated messages in supporting inboxes like Gmail and Apple Mail."
      inputLabel="Domain to check" inputPlaceholder="example.com" buttonLabel="Check BIMI"
      buildUrl={(d) => `/api/bimi-check?domain=${encodeURIComponent(d)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader target={data.domain} status={data.status} tone={data.found ? "success" : "warning"} />
          {data.record && <p className="mt-1 font-mono text-sm text-[var(--text-primary)] break-all bg-[var(--bg-raised)] rounded-lg p-3">{data.record}</p>}
          {data.logoUrl && <p className="mt-2 text-sm text-[var(--text-secondary)]">Logo: <span className="text-[var(--text-primary)] break-all">{data.logoUrl}</span></p>}
          {data.note && <p className="mt-3 text-sm text-[var(--text-secondary)]">{data.note}</p>}
        </div>
      )}
    />
  );
}
