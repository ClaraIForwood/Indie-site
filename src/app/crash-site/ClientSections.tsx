"use client";

import dynamic from "next/dynamic";

export const CrashSiteEmbed = dynamic(() => import("@/components/CrashSiteEmbed"), {
  ssr: false,
});
