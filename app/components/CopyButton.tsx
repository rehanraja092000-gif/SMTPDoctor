"use client";

import { useState } from "react";

export default function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — fail silently, the value is still selectable text.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label ? `Copy ${label}` : "Copy to clipboard"}
      className="shrink-0 rounded-md border border-[var(--border-strong)] px-2 py-1 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent-dim)] transition-colors"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
