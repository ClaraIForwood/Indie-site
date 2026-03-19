import Link from "next/link";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Page Not Found | Clara Forwood",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f7f3f6] text-neutral-900">
      <Nav />
      <main className="flex flex-col items-center justify-center px-6 py-32 text-center">
        <p className="text-7xl font-bold text-[#4d082a]" style={{ fontFamily: "'K2D', sans-serif" }}>
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-neutral-800 sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-sm text-base text-neutral-500">
          Looks like this page got lost in the crash site.
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
