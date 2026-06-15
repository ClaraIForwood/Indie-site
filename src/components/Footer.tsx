"use client";

import Image from "next/image";
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
    const payload = {
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
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
    <footer id="contact" className="border-t border-slate-200 bg-white/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Contact</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
            Let&apos;s work together!
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Have a project in mind or want to talk through an idea? I love collaborating on ambitious, curious work.
          </p>
          <div className="mt-6 flex items-center gap-5">
            <a href="https://www.linkedin.com/in/clara-forwood-5272ba268/" aria-label="LinkedIn">
              <Image
                src="/li-logo.png"
                alt="LinkedIn"
                width={120}
                height={40}
                className="h-auto max-w-28 transition duration-150 ease-in-out hover:scale-110"
              />
            </a>
            <a href="https://www.instagram.com/claraforwood/" aria-label="Instagram">
              <Image
                src="/instagram-logo.png"
                alt="Instagram"
                width={76}
                height={76}
                className="h-auto max-w-20 transition duration-150 ease-in-out hover:scale-110"
              />
            </a>
          </div>
        </div>

        <form className="form text-left" onSubmit={handleSubmit}>
          <div className="title" style={{ color: "#4d082a" }}>
            Contact Me
          </div>
          <label htmlFor="contact-email">Email address</label>
          <input
            id="contact-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" placeholder="Your message" required />
          <div className="flex w-full items-center justify-between gap-3">
            <p className="text-sm text-neutral-600" aria-live="polite">
              {status === "sending" && "Sending..."}
              {status === "success" && "Thanks! Your message has been sent."}
              {status === "error" && errorMessage}
            </p>
            <button
              type="submit"
              disabled={status === "sending"}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </footer>
  );
}
