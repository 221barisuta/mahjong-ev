"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "計算機" },
  { href: "/analyze", label: "牌譜分析" },
  { href: "/tables", label: "参照表" },
  { href: "/quiz", label: "練習" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="hidden md:block border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-4xl flex items-center justify-between px-4 h-14">
        <Link href="/" className="font-bold text-lg">
          押し引きEV計算機
        </Link>
        <nav className="flex gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
