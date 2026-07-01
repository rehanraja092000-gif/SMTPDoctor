"use client";

import { useId, useState } from "react";

interface ToolShellProps<T> {
  tag: string;
  title: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  buttonLabel?: string;
  buildUrl: (value: string) => string;
  validate?: (value: string) => string | null;
  renderResult: (data: T) => React.ReactNode;
  /** Optional extra input, e.g. a record-type select for the propagation checker. */
  extraControls?: (props: {
    disabled: boolean;
  }) => React.ReactNode;
  autoFocus?: boolean;
}

export default function ToolShell<T = unknown>({
  tag,
  title,
  description,
  inputLabel,
  inputPlaceholder,
  buttonLabel = "Run check",
  buildUrl,
  validate,
  renderResult,
  extraControls,
  autoFocus = true,
}: ToolShellProps<T>) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();

  const runCheck = async () => {
    const trimmed = value.trim();

    if (!trimmed) {
      setError("Enter a value to check.");
      return;
    }

    if (validate) {
      const validationError = validate(trimmed);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(buildUrl(trimmed));
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Try again.");
      } else if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      runCheck();
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <p className="font-mono text-xs text-[var(--accent)] tracking-wider">{tag}</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
        {title}
      </h1>
      <p className="mt-3 text-[var(--text-secondary)] max-w-[60ch]">{description}</p>

      <div className="mt-8">
        <label htmlFor={inputId} className="sr-only">
          {inputLabel}
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] focus-within:border-[var(--accent-dim)] transition-colors">
            <span className="pl-4 font-mono text-[var(--accent)] select-none" aria-hidden="true">
              &gt;
            </span>
            <input
              id={inputId}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={inputPlaceholder}
              autoFocus={autoFocus}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full bg-transparent px-3 py-3.5 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
            />
          </div>
          <button
            onClick={runCheck}
            disabled={loading}
            className="rounded-xl bg-[var(--accent)] px-6 py-3.5 font-semibold text-[#05130c] hover:bg-[var(--accent)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {loading ? "Running…" : buttonLabel}
          </button>
        </div>

        {extraControls && (
          <div className="mt-3">{extraControls({ disabled: loading })}</div>
        )}
      </div>

      <div role="status" aria-live="polite" className="mt-6">
        {error && (
          <div className="rounded-xl border border-[var(--danger)]/40 bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
            {error}
          </div>
        )}

        {loading && !error && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-6 text-sm text-[var(--text-secondary)] font-mono">
            Querying nameservers…
          </div>
        )}

        {result && !loading && (
          <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            {renderResult(result)}
          </div>
        )}
      </div>
    </div>
  );
}
