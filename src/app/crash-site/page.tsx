import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CrashSiteEmbed } from "./ClientSections";

export const metadata: Metadata = {
  title: "Crash Site",
  description: "Play Crash Site — an indie WebGL game by Clara Forwood — right in your browser.",
};

export default function CrashSitePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <CrashSiteEmbed />
      <Footer />
    </div>
  );
}
