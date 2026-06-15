import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import ElectronicsPageClient from "./ElectronicsPageClient";

export const metadata: Metadata = {
  title: "Engineering Projects",
  description: "Electrical and Electronic Engineering BENG projects — IR comms, Arduino interfaces, signal analysis, and more.",
};

export default function ElectronicsPage() {
  return (
    <>
      {/* Nav + gradient bridge — fades the light header into the dark canvas below */}
      <div className="bg-linear-to-b from-stone-50 from-70% to-slate-950">
        <Nav />
      </div>

      {/* Credential strip on dark background, then ElectronicsPageClient manages its own section backgrounds */}
      <div className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 pt-6 pb-0 md:px-10">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-5 backdrop-blur-sm sm:flex-row sm:gap-6">
            <Image
              src="/UoELogo.png"
              alt="University of Exeter logo"
              width={220}
              height={80}
              className="h-auto w-32 shrink-0 object-contain opacity-90 sm:w-48"
              sizes="(min-width: 640px) 220px, 128px"
            />
            <div className="h-px w-full bg-slate-700 sm:h-10 sm:w-px" />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Degree</p>
              <p className="mt-1 text-base font-semibold text-white sm:text-lg">
                Electrical and Electronic Engineering BEng (Hons)
              </p>
            </div>
            <div className="h-px w-full bg-slate-700 sm:h-10 sm:w-px" />
            <div className="shrink-0 text-center sm:text-right">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Graduated</p>
              <p className="mt-1 text-base font-semibold text-white">Class of 2026</p>
            </div>
          </div>
        </div>
      </div>

      <ElectronicsPageClient />
    </>
  );
}
