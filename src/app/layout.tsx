import "./globals.css";
import type { Metadata } from "next";
import { Manrope, Space_Grotesk, K2D } from "next/font/google";

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const k2dFont = K2D({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-k2d",
});

export const metadata: Metadata = {
  title: {
    default: "Clara Forwood",
    template: "%s | Clara Forwood",
  },
  description: "Electrical and Electronic Engineer working across hardware, software, and AI.",
  openGraph: {
    siteName: "Clara Forwood",
    type: "website",
    images: [{ url: "/profile.webp", width: 5760, height: 3840, alt: "Clara Forwood" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/profile.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${displayFont.variable} ${k2dFont.variable} min-h-screen bg-slate-50 text-slate-900 antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#4d082a] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#4d082a]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
