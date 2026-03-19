import "./globals.css";
import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

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
        className={`${bodyFont.variable} ${displayFont.variable} min-h-screen bg-slate-50 text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
