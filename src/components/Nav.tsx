import Link from "next/link";

export default function Nav() {
  return (
    <header className="px-4 pt-4 sm:px-6">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link
          className="text-2xl font-bold text-[#4d082a] sm:text-4xl md:text-6xl"
          style={{ fontFamily: "'K2D', sans-serif" }}
          href="/"
        >
          Clara Forwood
        </Link>
        <nav className="flex flex-wrap items-center gap-4">
          <Link
            className="text-base font-semibold text-[#4d082a] hover:underline sm:text-lg"
            style={{ fontFamily: "'K2D', sans-serif" }}
            href="/availability"
          >
            Availability
          </Link>
          <Link
            className="text-base font-semibold text-[#4d082a] hover:underline sm:text-lg"
            style={{ fontFamily: "'K2D', sans-serif" }}
            href="/#contact"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
