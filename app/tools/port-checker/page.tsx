"use client";

import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import StatusChecklist from "../../components/StatusChecklist";

interface PortResult {
  port: number;
  label: string;
  open: boolean;
}

interface PortScanResult {
  host: string;
  resolvedIp: string;
  status: string;
  results: PortResult[];
}

export default function PortCheckerPage() {
  return (
    <ToolShell<PortScanResult>
      tag="SECURITY"
      title="SMTP Port Tester"
      description="Test common mail, web, and hosting control panel ports on a public host."
      inputLabel="Host to test"
      inputPlaceholder="mail.example.com"
      buttonLabel="Test ports"
      buildUrl={(host) => `/api/port-check?host=${encodeURIComponent(host)}`}
      renderResult={(data) => (
        <div>
          <ResultHeader
            target={`${data.host} (${data.resolvedIp})`}
            status={`${data.results.filter((r) => r.open).length} open`}
            tone="neutral"
          />
          <StatusChecklist
            items={data.results.map((r) => ({
              name: `${r.port} — ${r.label}`,
              status: r.open ? "Open" : "Closed",
              success: r.open,
            }))}
          />
        </div>
      )}
    />
  );
}
