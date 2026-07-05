"use client";
import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import StatusChecklist from "../../components/StatusChecklist";

interface HeaderResult { name: string; present: boolean; value: string | null; why: string; }
interface Result { domain: string; status: string; presentCount: number; total: number; results: HeaderResult[]; error?: string; }

export default function Page() {
  return (
    <ToolShell<Result>
      tag="WEBSITE SECURITY"
      title="Security Headers Checker"
      description="Audit a website's HTTP response headers for the security protections that guard against XSS, clickjacking, and protocol downgrade attacks."
      inputLabel="Domain to check" inputPlaceholder="example.com" buttonLabel="Scan headers"
      buildUrl={(d) => `/api/headers-check?domain=${encodeURIComponent(d)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader target={data.domain} status={data.status}
            tone={data.presentCount === data.total ? "success" : data.presentCount >= data.total / 2 ? "warning" : "danger"} />
          {data.error ? <p className="text-sm text-[var(--text-secondary)]">{data.error}</p> : (
            <StatusChecklist items={data.results.map((r) => ({ name: r.name, status: r.present ? "Present" : "Missing", success: r.present, message: r.why }))} />
          )}
        </div>
      )}
    />
  );
}
