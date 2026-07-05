"use client";
import { useState } from "react";
import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";

interface Result { host: string; port: number; status: string; connected: boolean; supportsStartTls: boolean; banner: string | null; note: string | null; error?: string; }
const PORTS = [25, 587, 2525];

export default function Page() {
  const [port, setPort] = useState(587);
  return (
    <ToolShell<Result>
      tag="DIAGNOSTICS"
      title="STARTTLS Checker"
      description="Confirm whether a mail server offers STARTTLS, the mechanism that upgrades an SMTP connection to an encrypted one so mail isn't sent in the clear."
      inputLabel="Mail server host" inputPlaceholder="mail.example.com" buttonLabel="Check STARTTLS"
      buildUrl={(h) => `/api/starttls-check?host=${encodeURIComponent(h)}&port=${port}`}
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
          <ResultHeader target={`${data.host}:${data.port}`} status={data.status}
            tone={!data.connected ? "danger" : data.supportsStartTls ? "success" : "warning"} />
          {data.banner && <p className="mt-1 font-mono text-xs text-[var(--text-secondary)] break-all">{data.banner}</p>}
          {data.note && <p className="mt-3 text-sm text-[var(--text-secondary)]">{data.note}</p>}
          {data.error && <p className="mt-2 text-sm text-[var(--text-secondary)]">{data.error}</p>}
        </div>
      )}
    />
  );
}
