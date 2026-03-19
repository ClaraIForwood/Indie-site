"use client";

import dynamic from "next/dynamic";

export const ElectronicsCanvas = dynamic(() => import("@/components/ElectronicsCanvas"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-lg bg-neutral-200" />,
});

export const ElectronicsCarousel = dynamic(() => import("@/components/ElectronicsCarousel"), {
  ssr: false,
});
