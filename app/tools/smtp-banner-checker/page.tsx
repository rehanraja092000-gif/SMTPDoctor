"use client";
import { useState } from "react";
import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";

interface Result { host: string; port: number; status: string; banner: string | null; ehloLines: string[]; supportsStartTls: boolean; error?: string; }
const PORTS = [25, 587, 465, 2525];

export default function Page() {
  const [port, setPort] = useState(25);
  return (
    <ToolShell<Result>
      tag="DIAGNOSTICS"
      title="SMTP Banner Check"
      description="Connect to a mail server and read the greeting banner it sends, plus the capabilities it advertises in response to EHLO."
      inputLabel="Mail server host" inputPlaceholder="mail.example.com" buttonLabel="Read banner"
      buildUrl={(h) => `/api/smtp-banner-check?host=${encodeURIComponent(h)}&port=${port}`}
      extraControls={({ disabled }) => (
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--text-muted)]">Port</span>
          {PORTS.map((p) => (
            <button key={p} type="button" disabled={disabled} onClick={() => setPort(p)} aria-pressed={port === p}
              className={`rounded-md px-2.5 py-1 text-xs font-mono border transition-colors ${port === p ? "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-dim)]" : "text-[var(--text-secondary)] border-[var(--border)]"}`}>{p}</button>
          ))}
        </div>
      )}
      renderResult={(data) => (
        <div>
          <ResultHeader target={`${data.host}:${data.port}`} status={data.status} tone={data.banner ? "success" : "danger"} />
          {data.banner && <p className="mt-1 font-mono text-sm text-[var(--text-primary)] break-all bg-[var(--bg-raised)] rounded-lg p-3">{data.banner}</p>}
          {data.ehloLines?.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1">Capabilities</p>
              <ul className="space-y-1">{data.ehloLines.map((l, i) => <li key={i} className="font-mono text-xs text-[var(--text-secondary)]">{l}</li>)}</ul>
            </div>
          )}
          {data.error && <p className="mt-2 text-sm text-[var(--text-secondary)]">{data.error}</p>}
        </div>
      )}
    />
  );
}
