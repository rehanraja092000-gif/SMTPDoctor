"use client";

import { useEffect, useRef, useState } from "react";
import StatusBadge, { toneForBool } from "./StatusBadge";

interface ScoreCheck {
  name: string;
  status: string;
  success: boolean;
  impact?: string;
  message?: string;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
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
  checks: ScoreCheck[];
  suggestions: string[];
}) {
  const animatedScore = useCountUp(score);

  const ringColor =
    score >= 90 ? "var(--accent)" : score >= 55 ? "var(--warning)" : "var(--danger)";

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
            Reputation score
          </p>
          <p className="font-display text-xl font-semibold text-[var(--text-primary)]">
            {overallStatus}
          </p>
        </div>
      </div>

      <ul className="divide-y divide-[var(--border)]">
        {checks.map((item, i) => (
          <li key={i} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)]">{item.name}</p>
              {item.message && (
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.message}</p>
              )}
            </div>
            <StatusBadge tone={toneForBool(item.success)}>{item.status}</StatusBadge>
          </li>
        ))}
      </ul>

      {suggestions.length > 0 && (
        <div className="mt-5 pt-5 border-t border-[var(--border)]">
          <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Priority fixes
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
