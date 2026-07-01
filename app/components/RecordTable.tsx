import CopyButton from "./CopyButton";

/** Renders a list of plain-text records (TXT/NS/CNAME/PTR-style results). */
export default function RecordTable({
  records,
  emptyLabel = "No records found",
}: {
  records: string[];
  emptyLabel?: string;
}) {
  if (!records || records.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)] font-mono py-4">{emptyLabel}</p>
    );
  }

  return (
    <ul className="divide-y divide-[var(--border)]">
      {records.map((record, i) => (
        <li key={i} className="flex items-start gap-3 py-3">
          <span className="text-xs font-mono text-[var(--text-muted)] pt-0.5 shrink-0">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="flex-1 text-sm font-mono text-[var(--text-primary)] break-all">
            {record}
          </span>
          <CopyButton value={record} label={`record ${i + 1}`} />
        </li>
      ))}
    </ul>
  );
}
