"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "計算機" },
  { href: "/analyze", label: "牌譜" },
  { href: "/tables", label: "参照" },
  { href: "/quiz", label: "練習" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="hidden md:block"
      style={{
        background: "var(--c-bg)",
        borderBottom: "1px solid var(--c-border)",
      }}
    >
      <div className="mx-auto max-w-4xl flex items-center justify-between px-7 h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-md grid place-items-center font-glyph font-extrabold text-lg"
            style={{ background: "var(--c-ink)", color: "#fff" }}
          >
            麻
          </div>
          <div>
            <div
              className="font-bold text-[15px]"
              style={{ letterSpacing: "-0.01em" }}
            >
              押し引きEV
            </div>
            <div
              className="font-num text-[11px]"
              style={{ color: "var(--c-text-faint)", letterSpacing: "0.05em" }}
            >
              quick · v2
            </div>
          </div>
        </Link>
        <nav
          className="flex"
          style={{
            background: "var(--c-card)",
            border: "1px solid var(--c-border)",
            borderRadius: 9,
            overflow: "hidden",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 text-[13px] font-semibold transition-colors"
                style={{
                  background: active ? "var(--c-ink)" : "transparent",
                  color: active ? "#fff" : "var(--c-text-dim)",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
