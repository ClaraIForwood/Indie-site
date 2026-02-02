export default function Footer() {
  return (
    <footer id="contact" className="border-t pt-10 pb-20 text-center">
      <h2 className="text-3xl font-semibold mb-4 pb-10 py-11">{"Let\u2019s work together!"}</h2>
      <div className="flex items-center justify-center gap-8">
        <a href="https://www.linkedin.com/in/clara-forwood-5272ba268/">
          <img
            draggable={false}
            alt="footer link"
            loading="lazy"
            decoding="async"
            className="hidden dark:block drop-shadow-sm max-w-30 h-auto mx-auto transition duration-150 ease-in-out hover:scale-110"
            src="/li-logo.png"
          />
        </a>
        <a href="https://www.instagram.com/claraforwood/">
          <img
            draggable={false}
            alt="footer link"
            loading="lazy"
            decoding="async"
            className="hidden dark:block drop-shadow-sm max-w-19 h-auto mx-auto duration-150 ease-in-out transition-transform hover:scale-110"
            src="/instagram-logo.png"
          />
        </a>
      </div>
    </footer>
  );
}
