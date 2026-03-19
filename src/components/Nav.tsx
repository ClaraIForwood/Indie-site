import Link from "next/link";

export default function Nav() {
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 pb-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link className="font-display text-4xl font-semibold tracking-tight text-[#4d082a] sm:text-5xl lg:text-6xl" href="/">
          Clara Forwood
        </Link>
        <nav className="flex flex-wrap items-center gap-6 text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
          <Link className="transition hover:text-slate-900" href="/#projects">
            Work
          </Link>
          <Link className="transition hover:text-slate-900" href="/availability">
            Availability
          </Link>
          <Link
            className="rounded-full border border-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-900 hover:text-white"
            href="/#contact"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
