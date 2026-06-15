"use client";

import Link from "next/link";
import { EB_Garamond, Jost } from "next/font/google";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

// 2. Initialize the new font for your nav links
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "600"], // Including 600 since your links use font-semibold
  display: "swap",
});

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/20 bg-slate-50/90 backdrop-blur-sm">
      <nav
        aria-label="Site navigation"
        className="mx-auto flex max-w-6xl items-center px-6 py-4"
      >
        {/* Left links */}
        <div className="flex flex-1 items-center gap-8">
          <Link
            href="/"
            className={`${jost.className} text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:text-slate-900`}
          >
            Home
          </Link>
          <Link
            href="/#projects"
            className={`${jost.className} text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:text-slate-900`}
          >
            Work
          </Link>
        </div>

        {/* Center logo */}
        <Link
          href="/"
          aria-label="Clara Forwood — home"
          className={`${ebGaramond.className} select-none text-[2.75rem] leading-none text-[#4d082a] transition hover:opacity-75`}
        >
          C
        </Link>

        {/* Right links */}
        <div className="flex flex-1 items-center justify-end gap-8">
          <Link
            href="/under-construction"
            className={`${jost.className} text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:text-slate-900`}
          >
            About
          </Link>
          <Link
            href="/#contact"
            className={`${jost.className} text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:text-slate-900`}
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
