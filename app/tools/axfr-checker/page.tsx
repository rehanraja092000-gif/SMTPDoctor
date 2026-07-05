"use client";

import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import StatusChecklist from "../../components/StatusChecklist";

interface AxfrEntry {
  nameserver: string;
  status: string;
  secure: boolean;
  message: string;
}

interface AxfrResult {
  domain: string;
  nameservers: number;
  results: AxfrEntry[];
  error?: string;
}

export default function AxfrCheckerPage() {
  return (
    <ToolShell<AxfrResult>
      tag="SECURITY"
      title="AXFR Checker"
      description="Test whether a domain's nameservers allow unauthorized DNS zone transfers — a real, if now rare, misconfiguration."
      inputLabel="Domain to check"
      inputPlaceholder="example.com"
      buttonLabel="Test AXFR"
      buildUrl={(domain) => `/api/axfr-check?domain=${encodeURIComponent(domain)}`}
      renderResult={(data) => {
        const exposed = data.results.some((r) => !r.secure);
        return (
          <div>
            <ResultHeader
              target={data.domain}
              status={exposed ? "Zone transfer exposed" : "Secure"}
              tone={exposed ? "danger" : "success"}
            />
            <StatusChecklist
              items={data.results.map((r) => ({
                name: r.nameserver,
                status: r.status,
                success: r.secure,
                message: r.message,
              }))}
            />
          </div>
        );
      }}
    />
  );
}
