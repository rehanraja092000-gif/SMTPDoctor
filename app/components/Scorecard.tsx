"use client";

import { useEffect, useRef, useState } from "react";
import StatusChecklist, { ChecklistItem } from "./StatusChecklist";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function useCountUp(target: number, durationMs = 900) {
  // Start at the final value when motion is reduced, so no animation runs
  // and the effect never has to set state synchronously.
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, durationMs]);

  return value;
}

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
  const animatedScore = useCountUp(score);

  const ringColor =
    score >= 90 ? "var(--accent)" : score >= 50 ? "var(--warning)" : "var(--danger)";

  return (
    <div>
      <div className="flex items-center gap-5 pb-5 mb-1 border-b border-[var(--border)]">
        <div
          className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full font-display text-2xl font-semibold transition-all"
          style={{
            background: `conic-gradient(${ringColor} ${animatedScore * 3.6}deg, var(--border) 0deg)`,
          }}
        >
          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-primary)]">
            {animatedScore}
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
              <li
                key={i}
                className="animate-row text-sm text-[var(--text-secondary)] flex gap-2"
                style={{ animationDelay: `${i * 60}ms` }}
              >
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
