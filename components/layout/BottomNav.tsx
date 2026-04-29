"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "計算機" },
  { href: "/analyze", label: "牌譜" },
  { href: "/tables", label: "参照" },
  { href: "/quiz", label: "練習" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "var(--c-card)",
        borderTop: "1px solid var(--c-border)",
      }}
    >
      <div className="flex justify-around">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 py-3 text-center text-[13px] font-semibold transition-colors"
              style={{
                color: active ? "var(--c-ink)" : "var(--c-text-faint)",
                borderTop: active
                  ? "2px solid var(--c-ink)"
                  : "2px solid transparent",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
