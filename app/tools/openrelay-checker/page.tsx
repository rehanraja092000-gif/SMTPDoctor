"use client";
import { useState } from "react";
import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";

interface Result { host: string; port: number; status: string; openRelay: boolean; secure: boolean; transcript: string[]; note: string | null; error?: string; }
const PORTS = [25, 587, 2525];

export default function Page() {
  const [port, setPort] = useState(25);
  return (
    <ToolShell<Result>
      tag="SECURITY"
      title="Open Relay Test"
      description="Test whether a mail server will relay mail from an external sender to an external recipient — the open-relay misconfiguration that spammers hunt for and abuse."
      inputLabel="Mail server host" inputPlaceholder="mail.example.com" buttonLabel="Test relay"
      buildUrl={(h) => `/api/openrelay-check?host=${encodeURIComponent(h)}&port=${port}`}
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
            tone={data.openRelay ? "danger" : data.secure ? "success" : "neutral"} />
          {data.transcript?.length > 0 && (
            <pre className="mt-3 text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-raised)] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap max-h-56">{data.transcript.join("\n")}</pre>
          )}
          {data.note && <p className="mt-3 text-sm text-[var(--text-secondary)]">{data.note}</p>}
        </div>
      )}
    />
  );
}
