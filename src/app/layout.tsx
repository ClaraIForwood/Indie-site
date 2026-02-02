import "./globals.css";

export const metadata = {
  title: "Clara Forwood",
  description: "Electrical Engineer",
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