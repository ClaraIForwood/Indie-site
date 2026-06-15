import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "When Is Clara Available | Clara Forwood",
  description: "Live availability view and booking options for Clara Forwood.",
};

const calendlyEmbedUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";

export default function AvailabilityPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Nav />
      <main id="main-content" className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-20 left-[8%] h-64 w-64 rounded-full bg-[#ffd7e5] opacity-70 blur-3xl" />
          <div className="absolute top-28 right-[-40px] h-72 w-72 rounded-full bg-[#b9f2e4] opacity-50 blur-3xl" />
          <div className="absolute bottom-8 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#fff0c9] opacity-60 blur-3xl" />
        </div>

        <section className="rounded-3xl border border-[#4d082a]/10 bg-white/80 p-6 shadow-[0_20px_60px_rgba(77,8,42,0.12)] backdrop-blur sm:p-10">
          <h1 className="font-k2d mt-4 text-3xl font-semibold text-[#2d0a1a] sm:text-4xl md:text-5xl">
            When Is Clara Available?
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-700 sm:text-lg">
            I&apos;m currently available for new projects and collaborations! If you&apos;d like to chat about a potential project, ask questions about my work, or just say hi, feel free to book a time on my calendar. I look forward to connecting with you!
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            <span className="rounded-full border border-[#4d082a]/20 bg-white px-3 py-1">
              Timezone: Europe/London
            </span>
          </div>
        </section>

        <section className="mt-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.12)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-[#4d082a]">Book a Time</h2>
              <span className="rounded-full border border-[#4d082a]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Scheduler
              </span>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {calendlyEmbedUrl ? (
                <iframe
                  title="Clara Forwood scheduling"
                  src={calendlyEmbedUrl}
                  className="h-[720px] w-full sm:h-[820px]"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-[420px] flex-col items-center justify-center gap-4 px-6 text-center">
                  <p className="text-base font-semibold text-slate-700">Scheduling coming soon!</p>
                  <p className="text-sm text-slate-500">
                    In the meantime, reach out via the{" "}
                    <Link href="/#contact" className="underline text-[#4d082a] hover:opacity-80">
                      contact form
                    </Link>{" "}
                    on the home page.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
