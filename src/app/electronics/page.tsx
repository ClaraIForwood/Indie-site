import Image from "next/image";

import ElectronicsCanvas from "@/components/ElectronicsCanvas";
import ElectronicsCarousel from "@/components/ElectronicsCarousel";
import Nav from "@/components/Nav";

export default function ElectronicsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full px-4 pb-20 mt-6">
        <section className="overflow-hidden bg-[#003c3c] text-white">
          <div className="flex flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:gap-6 sm:px-6">
            <Image
              src="/UoELogo.png"
              alt="University of Exeter logo"
              width={280}
              height={100}
              className="h-auto w-40 shrink-0 object-contain sm:w-70"
              sizes="(min-width: 640px) 280px, 160px"
            />
            <div className="flex-1 text-center leading-tight sm:text-left">
              <h2 className="text-2xl font-semibold sm:text-3xl" style={{ color: "white" }}>
                Electrical and Electronic Engineering BENG (Hons)
              </h2>
              <p className="mt-2 text-sm text-white sm:text-lg" style={{ color: "white" }}>
                (Insert photo of me graduating ;-) )
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 flex flex-col items-center gap-4 rounded-xl bg-white/70 p-4 text-center sm:flex-row sm:gap-6 sm:text-left">
          <div className="h-32 w-32 shrink-0 sm:h-44 sm:w-44">
            <ElectronicsCanvas className="h-full w-full" />
          </div>
          <div className="flex w-full flex-1 items-center justify-center sm:justify-start">
            <h2 className="text-2xl font-bold sm:text-3xl">Dissertation Project coming soon!</h2>
          </div>
        </section>

        <ElectronicsCarousel />
      </main>
    </>
  );
}
