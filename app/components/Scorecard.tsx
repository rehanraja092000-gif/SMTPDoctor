import StatusChecklist, { ChecklistItem } from "./StatusChecklist";

export default function Scorecard({
  score,
  overallStatus,
  checks,
  suggestions,
}: {
  score: number;
  overallStatus: string;
  checks: ChecklistItem[];
  suggestions: string[];
}) {
  const ringColor =
    score >= 90
      ? "var(--accent)"
      : score >= 50
      ? "var(--warning)"
      : "var(--danger)";

  return (
    <div>
      <div className="flex items-center gap-5 pb-5 mb-1 border-b border-[var(--border)]">
        <div
          className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full font-display text-2xl font-semibold"
          style={{
            background: `conic-gradient(${ringColor} ${score * 3.6}deg, var(--border) 0deg)`,
          }}
        >
          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-primary)]">
            {score}
          </div>
        </div>
        <div>
          <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
            Overall
          </p>
          <p className="font-display text-xl font-semibold text-[var(--text-primary)]">
            {overallStatus}
          </p>
        </div>
      </div>

      <StatusChecklist items={checks} />

      {suggestions.length > 0 && (
        <div className="mt-5 pt-5 border-t border-[var(--border)]">
          <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Suggestions
          </p>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
              <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2">
                <span className="text-[var(--accent)]" aria-hidden="true">→</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
