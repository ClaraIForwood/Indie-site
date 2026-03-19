import "./globals.css";
import type { Metadata } from "next";

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
      <body className="antialiased text-neutral-900">{children}</body>
    </html>
  );
}