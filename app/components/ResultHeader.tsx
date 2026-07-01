import StatusBadge from "./StatusBadge";

type Tone = "success" | "danger" | "warning" | "neutral";

export default function ResultHeader({
  target,
  status,
  tone,
}: {
  target: string;
  status: string;
  tone: Tone;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-1 border-b border-[var(--border)]">
      <p className="font-mono text-sm text-[var(--text-primary)] break-all">{target}</p>
      <StatusBadge tone={tone}>{status}</StatusBadge>
    </div>
  );
}
