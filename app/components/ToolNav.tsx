"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { CATEGORIES, toolsByCategory } from "../../lib/tools";

export default function ToolNav() {
  const pathname = usePathname();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside click and on Escape — keyboard and pointer parity.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenKey(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenKey(null);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const openMenu = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenKey(key);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenKey(null), 120);
  };

  return (
    <nav
      ref={navRef}
      aria-label="Tool categories"
      className="sticky top-[56px] z-30 border-b border-[var(--border)] bg-[var(--bg-raised)]/95 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-6xl px-4 flex items-center gap-1 overflow-x-auto">
        <Link
          href="/"
          className={`shrink-0 px-3 py-3 text-sm font-mono transition-colors ${
            pathname === "/"
              ? "text-[var(--accent)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Home
        </Link>

        {CATEGORIES.map((cat) => {
          const tools = toolsByCategory(cat.key);
          const isOpen = openKey === cat.key;
          const hasActive = tools.some((t) => pathname === `/tools/${t.slug}`);

          return (
            <div
              key={cat.key}
              className="relative shrink-0"
              onMouseEnter={() => openMenu(cat.key)}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={() => setOpenKey(isOpen ? null : cat.key)}
                className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors ${
                  hasActive || isOpen
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {cat.short}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </button>

              {isOpen && (
                <div
                  className="absolute left-0 top-full min-w-[240px] rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-1.5 shadow-xl shadow-black/40 animate-[fadeIn_0.12s_ease-out]"
                  role="menu"
                >
                  {tools.map((tool) => {
                    const active = pathname === `/tools/${tool.slug}`;
                    return (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        role="menuitem"
                        onClick={() => setOpenKey(null)}
                        className={`flex items-start gap-3 rounded-lg px-3 py-2 transition-colors ${
                          active
                            ? "bg-[var(--accent-soft)]"
                            : "hover:bg-[var(--surface-hover)]"
                        }`}
                      >
                        <span className="font-mono text-[10px] text-[var(--text-muted)] pt-1 w-12 shrink-0">
                          {tool.tag}
                        </span>
                        <span>
                          <span
                            className={`block text-sm font-medium ${
                              active ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
                            }`}
                          >
                            {tool.name}
                          </span>
                          <span className="block text-xs text-[var(--text-secondary)]">
                            {tool.short}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
