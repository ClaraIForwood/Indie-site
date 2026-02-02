export default function Nav() {
  return (
    <header className="px-4 pt-4 sm:px-6">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <a
          className="text-2xl font-bold text-[#811c1c] sm:text-4xl md:text-5xl"
          style={{ fontFamily: "'K2D', sans-serif" }}
          href="/"
        >
          Clara Forwood
        </a>
        <a
          className="text-base font-semibold text-[#811c1c] hover:underline sm:text-lg md:text-2xl"
          style={{ fontFamily: "'K2D', sans-serif" }}
          href="#contact"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
