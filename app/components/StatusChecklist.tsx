import StatusBadge, { toneForBool } from "./StatusBadge";

export interface ChecklistItem {
  name: string;
  status: string;
  success: boolean;
  message?: string;
}

/** Renders pass/fail style results — blacklist, AXFR, port scan, reputation checks. */
export default function StatusChecklist({ items }: { items: ChecklistItem[] }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-[var(--text-muted)] font-mono py-4">No results</p>;
  }

  return (
    <ul className="divide-y divide-[var(--border)]">
      {items.map((item, i) => (
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
  );
}
