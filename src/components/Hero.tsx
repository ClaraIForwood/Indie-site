export default function Hero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 pt-8 pb-12 text-center sm:px-8 md:flex-row md:items-center md:gap-10 md:px-12 md:pt-16 md:pb-24 md:text-left">
      <div
        className="shrink-0 overflow-hidden rounded-full"
        style={{ width: "clamp(180px, 55vw, 280px)", height: "clamp(180px, 55vw, 280px)" }}
      >
        <img
          src="/profile.jpg"
          alt="Clara Forwood"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="max-w-xl rounded-md px-2">
        <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl md:text-5xl">
          Hello World!
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-2xl">
          I'm an Electrical Engineer who loves to tinker. Thank you for visiting my
          site, please have a look around.
        </p>
      </div>
    </section>
  );
}
