type Tone = "success" | "danger" | "warning" | "neutral";

const TONE_STYLES: Record<Tone, string> = {
  success: "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-dim)]",
  danger: "bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger)]/40",
  warning: "bg-[var(--warning-soft)] text-[var(--warning)] border-[var(--warning)]/40",
  neutral: "bg-[var(--surface-hover)] text-[var(--text-secondary)] border-[var(--border-strong)]",
};

export default function StatusBadge({
  tone,
  children,
}: {
  tone: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono font-medium ${TONE_STYLES[tone]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          tone === "success"
            ? "bg-[var(--accent)] status-dot"
            : tone === "danger"
            ? "bg-[var(--danger)]"
            : tone === "warning"
            ? "bg-[var(--warning)]"
            : "bg-[var(--text-muted)]"
        }`}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}

export function toneForBool(success: boolean): Tone {
  return success ? "success" : "danger";
}
