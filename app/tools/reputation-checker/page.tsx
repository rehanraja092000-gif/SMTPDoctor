"use client";

import ToolShell from "../../components/ToolShell";
import Scorecard from "../../components/Scorecard";

interface ReputationCheck {
  name: string;
  status: string;
  success: boolean;
  impact: string;
  message: string;
}

interface ReputationResult {
  domain: string;
  overallStatus: string;
  score: number;
  unsafe: boolean;
  checks: ReputationCheck[];
  suggestions: string[];
  error?: string;
}

export default function ReputationCheckerPage() {
  return (
    <ToolShell<ReputationResult>
      tag="SEC-04 / SECURITY"
      title="Domain Reputation Checker"
      description="A weighted score that grades the quality of your SPF, DKIM, DMARC, MX, DNSSEC, and threat status — not just whether records exist — with prioritized fixes."
      inputLabel="Domain to check"
      inputPlaceholder="example.com"
      buttonLabel="Run full scan"
      buildUrl={(domain) => `/api/reputation-check?domain=${encodeURIComponent(domain)}`}
      renderResult={(data) => (
        <Scorecard
          score={data.score}
          overallStatus={data.overallStatus}
          checks={data.checks}
          suggestions={data.suggestions}
        />
      )}
    />
  );
}
