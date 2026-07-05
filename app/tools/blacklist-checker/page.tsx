"use client";

import ToolShell from "../../components/ToolShell";
import ResultHeader from "../../components/ResultHeader";
import StatusChecklist from "../../components/StatusChecklist";

interface BlacklistEntry {
  blacklist: string;
  listed: boolean;
}

interface BlacklistResult {
  target: string;
  ip?: string;
  status: string;
  results: BlacklistEntry[];
}

export default function BlacklistCheckerPage() {
  return (
    <ToolShell<BlacklistResult>
      tag="SECURITY"
      title="Blacklist Checker"
      description="Check whether a domain or IP is listed on major real-time blackhole lists (RBLs)."
      inputLabel="Domain or IP to check"
      inputPlaceholder="example.com or 192.0.2.1"
      buttonLabel="Check blacklists"
      buildUrl={(target) => `/api/blacklist-check?target=${encodeURIComponent(target)}`}
      renderResult={(data) => {
        const listedCount = data.results.filter((r) => r.listed).length;
        return (
          <div>
            <ResultHeader
              target={data.ip ? `${data.target} (${data.ip})` : data.target}
              status={listedCount > 0 ? `Listed on ${listedCount}` : "Not listed"}
              tone={listedCount > 0 ? "danger" : "success"}
            />
            <StatusChecklist
              items={data.results.map((r) => ({
                name: r.blacklist,
                status: r.listed ? "Listed" : "Clean",
                success: !r.listed,
              }))}
            />
          </div>
        );
      }}
    />
  );
}
