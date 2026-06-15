import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Under Construction | Clara Forwood",
};

export default function UnderConstruction() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Nav />
      <main id="main-content" className="flex flex-col items-center justify-center px-6 py-32 text-center">
        <p className="font-k2d text-7xl font-bold text-[#4d082a]">🚧</p>
        <h1 className="mt-6 text-2xl font-semibold text-neutral-800 sm:text-3xl">
          Under Construction
        </h1>
        <p className="mt-3 max-w-sm text-base text-neutral-500">
          This page is being built. Check back soon.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full border-2 border-[#4d082a] px-6 py-2 text-sm font-semibold text-[#4d082a] transition hover:bg-[#4d082a] hover:text-white"
        >
          Back home
        </Link>
      </main>
    </div>
  );
}
