export default function WarningList({ warnings }: { warnings: string[] }) {
  if (!warnings || warnings.length === 0) return null;
  return (
    <ul className="mt-3 space-y-2">
      {warnings.map((w, i) => (
        <li
          key={i}
          className="animate-row flex gap-2 text-sm text-[var(--warning)]"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <span aria-hidden="true">!</span>
          <span className="text-[var(--text-secondary)]">{w}</span>
        </li>
      ))}
    </ul>
  );
}
