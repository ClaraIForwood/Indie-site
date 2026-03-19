import Image from "next/image";

export default function Hero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 pt-12 pb-12 text-center sm:px-8 md:flex-row md:items-center md:gap-10 md:px-12 md:pt-20 md:pb-24 md:text-left">
      <div
        className="relative shrink-0 overflow-hidden rounded-full"
        style={{ width: "clamp(180px, 55vw, 280px)", height: "clamp(180px, 55vw, 280px)" }}
      >
        <Image
          src="/profile.webp"
          alt="Clara Forwood"
          fill
          className="object-cover"
          sizes="(min-width: 768px) 280px, 55vw"
          priority
        />
      </div>
      <div className="max-w-2xl rounded-md px-2 md:flex-1">
        <h1 className="text-3xl font-bold text-black sm:text-4xl md:text-5xl">
          Hello World!
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-2xl">
          I&apos;m an Electrical and Electronic Engineer working across hardware, software, and AI.
          My current dissertation project is about the role of AI in finance, but I also build indie games, design circuits,
          and chase down any technical challenge that makes me curious.
          I believe the best engineers are the ones who can&apos;t help but tinker.
          
        </p>
      </div>
    </section>
  );
}
