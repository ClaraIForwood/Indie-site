import CrashSiteEmbed from "@/components/CrashSiteEmbed";
import Nav from "@/components/Nav";

export default function CrashSitePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <CrashSiteEmbed />
    </div>
  );
}
