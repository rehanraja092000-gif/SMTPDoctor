"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { CATEGORIES, toolsByCategory, type CategoryKey } from "../../lib/tools";

export default function ToolNav() {
  const pathname = usePathname();
  const [openKey, setOpenKey] = useState<CategoryKey | null>(null);
  const [menuPos, setMenuPos] = useState<{ left: number; top: number } | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const closeMenu = useCallback(() => {
    setOpenKey(null);
    setMenuPos(null);
  }, []);

  const toggleMenu = useCallback(
    (key: CategoryKey) => {
      if (openKey === key) {
        closeMenu();
        return;
      }
      const btn = btnRefs.current[key];
      if (btn) {
        const rect = btn.getBoundingClientRect();
        // Position the menu in fixed coordinates so it is never clipped by
        // the horizontally-scrolling nav container.
        setMenuPos({ left: rect.left, top: rect.bottom });
      }
      setOpenKey(key);
    },
    [openKey, closeMenu]
  );

  // Close on outside click, Escape, scroll, and resize.
  useEffect(() => {
    if (!openKey) return;

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideNav = navRef.current?.contains(target);
      const insideMenu = (target as HTMLElement)?.closest?.("[data-toolnav-menu]");
      if (!insideNav && !insideMenu) closeMenu();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
  }, [openKey, closeMenu]);

  const openTools = openKey ? toolsByCategory(openKey) : [];

  return (
    <>
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
            const isOpen = openKey === cat.key;
            const hasActive = toolsByCategory(cat.key).some(
              (t) => pathname === `/tools/${t.slug}`
            );

            return (
              <button
                key={cat.key}
                type="button"
                ref={(el) => {
                  btnRefs.current[cat.key] = el;
                }}
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={() => toggleMenu(cat.key)}
                onMouseEnter={() => {
                  // On devices with a real pointer, open on hover too.
                  if (window.matchMedia("(hover: hover)").matches) toggleMenu(cat.key);
                }}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors ${
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
            );
          })}
        </div>
      </nav>

      {/* Menu rendered outside the scroll container so it is never clipped. */}
      {openKey && menuPos && (
        <div
          data-toolnav-menu
          role="menu"
          onMouseLeave={closeMenu}
          style={{ left: menuPos.left, top: menuPos.top }}
          className="fixed z-50 mt-1 min-w-[260px] max-w-[calc(100vw-1rem)] rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-1.5 shadow-xl shadow-black/50 animate-[fadeIn_0.12s_ease-out]"
        >
          {openTools.map((tool) => {
            const active = pathname === `/tools/${tool.slug}`;
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                role="menuitem"
                onClick={closeMenu}
                className={`flex items-start gap-3 rounded-lg px-3 py-2 transition-colors ${
                  active ? "bg-[var(--accent-soft)]" : "hover:bg-[var(--surface-hover)]"
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
    </>
  );
}
