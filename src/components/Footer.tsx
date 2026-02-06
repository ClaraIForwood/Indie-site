"use client";

import { useState, type FormEvent } from "react";

export default function Footer() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to send your message.");
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send your message.");
    }
  };

  return (
    <footer id="contact" className="border-t pt-4 pb-15 text-center">
      <h2 className="text-3xl font-semibold mb-4 pb-5 py-5">{"Let\u2019s work together!"}</h2>
      <div className="flex flex-col items-center gap-10">
        
        <form className="form text-left" onSubmit={handleSubmit}>
          <div className="title">Contact us</div>
          <input
            type="email"
            name="email"
            placeholder="Your email"
            className="input"
            aria-label="Your email"
            required
          />
          <textarea name="message" placeholder="Your message" aria-label="Your message" required />
          <div className="flex w-full items-center justify-between gap-3">
            <p className="text-sm text-neutral-600" aria-live="polite">
              {status === "sending" && "Sending..."}
              {status === "success" && "Thanks! Your message has been sent."}
              {status === "error" && errorMessage}
            </p>
            <button type="submit" disabled={status === "sending"}>
              Submit
            </button>
          </div>
        </form>
        
        <div className="flex items-center justify-center gap-8">
          <a href="https://www.linkedin.com/in/clara-forwood-5272ba268/">
            <img
              draggable={false}
              alt="footer link"
              loading="lazy"
              decoding="async"
              className="hidden dark:block max-w-30 h-auto mx-auto transition duration-150 ease-in-out hover:scale-110"
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
      </div>
    </footer>
  );
}
