"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type StickyNotePosition = {
  x: number;
  y: number;
};

type StickyNoteProps = {
  id: string;
  text: string;
  topOffset: number;
  rightOffset: number;
  rotation: string;
  className?: string;
  leftOffset?: number;
  bottomOffset?: number;
};

const NOTE_SIZE = 180;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function StickyNote({ id, text, topOffset, rightOffset, rotation, className, leftOffset, bottomOffset }: StickyNoteProps) {
  const [position, setPosition] = useState<StickyNotePosition>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  useEffect(() => {
    const setInitialPosition = () => {
      const maxX = window.innerWidth - NOTE_SIZE;
      const maxY = window.innerHeight - NOTE_SIZE;
      const xBase =
        typeof leftOffset === "number"
          ? leftOffset
          : window.innerWidth - NOTE_SIZE - rightOffset;
      const yBase =
        typeof bottomOffset === "number"
          ? window.innerHeight - NOTE_SIZE - bottomOffset
          : topOffset;
      const x = clamp(xBase, 12, Math.max(12, maxX));
      const y = clamp(yBase, 12, Math.max(12, maxY));
      setPosition({ x, y });
    };
    setInitialPosition();
  }, [rightOffset, topOffset, leftOffset, bottomOffset]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (event: PointerEvent) => {
      if (!dragRef.current || event.pointerId !== dragRef.current.pointerId) return;
      const nextX = event.clientX - dragRef.current.offsetX;
      const nextY = event.clientY - dragRef.current.offsetY;
      const maxX = window.innerWidth - NOTE_SIZE;
      const maxY = window.innerHeight - NOTE_SIZE;
      setPosition({
        x: clamp(nextX, 8, Math.max(8, maxX)),
        y: clamp(nextY, 8, Math.max(8, maxY)),
      });
    };
    const handleUp = (event: PointerEvent) => {
      if (!dragRef.current || event.pointerId !== dragRef.current.pointerId) return;
      dragRef.current = null;
      setIsDragging(false);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [isDragging]);

  return (
    <div
      role="note"
      aria-label={`Sticky note ${id}`}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = {
          pointerId: event.pointerId,
          offsetX: event.clientX - position.x,
          offsetY: event.clientY - position.y,
        };
        setIsDragging(true);
      }}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) ${rotation}`,
      }}
      className={`fixed z-40 flex h-[180px] w-[180px] select-none items-center justify-center rounded-[18px] border border-pink-200 p-3 text-center bg-gradient-to-br from-pink-200 via-pink-100 to-pink-300 text-l font-semibold text-pink-900 shadow-[0_12px_24px_rgba(236,72,153,0.35)] ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } ${className ?? ""}`}
    >
      <span>{text}</span>
    </div>
  );
}

export default function CrashSiteEmbed() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const sendMuteState = useCallback((muted: boolean) => {
    const frameWindow = iframeRef.current?.contentWindow;
    if (!frameWindow) return;
    try {
      (frameWindow as { setUnityMuted?: (value: boolean) => void }).setUnityMuted?.(muted);
    } catch {
      // Ignore cross-context errors and fall back to postMessage.
    }
    frameWindow.postMessage({ type: "unity-mute", muted }, "*");
  }, []);

  useEffect(() => {
    sendMuteState(isMuted);
  }, [isMuted, sendMuteState]);

  useEffect(() => {
    const handleFocus = () => sendMuteState(isMuted);
    const handleVisibility = () => {
      if (!document.hidden) {
        sendMuteState(isMuted);
      }
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isMuted, sendMuteState]);

  return (
    <>
      <StickyNote
        id="one"
        text="Sorry if spidey is buggy he's still learning :) "
        topOffset={160}
        rightOffset={48}
        rotation="rotate(-6deg)"
      />
      <StickyNote
        id="two"
        text="Artists Let's collab!      DM me ;) "
        topOffset={360}
        rightOffset={90}
        rotation="rotate(5deg)"
      />
      <StickyNote
        id="three"
        text="please ignore bugs I'm working on it"
        topOffset={0}
        rightOffset={0}
        leftOffset={24}
        bottomOffset={60}
        rotation="rotate(-4deg)"
        className="!border-orange-200 !from-orange-200 !via-orange-100 !to-orange-300 !text-orange-900 shadow-[0_12px_24px_rgba(251,146,60,0.35)] text-sm leading-snug"
      />
      <section className="px-4 pt-6 pb-4 text-center">
        <h1
          className="text-3xl font-semibold sm:text-4xl"
          style={{ fontFamily: "'K2D', sans-serif", color: "#4d082a" }}
        >
          Crash Site
        </h1>
        <p className="mt-2 text-sm text-neutral-600 sm:text-base">
          Play the latest WebGL build of Crash Site right in your browser.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsMuted((current) => !current)}
            className="rounded-full border border-[#4d082a] px-4 py-1.5 text-sm font-semibold text-[#4d082a] transition hover:bg-[#4d082a] hover:text-white"
            aria-pressed={isMuted}
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
        </div>
      </section>
      <div className="flex-1 px-4 pb-6">
        <div className="mx-auto w-full max-w-[90vmin]">
          <div className="aspect-square w-full overflow-hidden rounded-xl border border-black/10 bg-black/5 shadow-sm">
            <iframe
              ref={iframeRef}
              src="/crash-site/index.html"
              title="Crash Site WebGL"
              className="h-full w-full border-0"
              allow="autoplay; fullscreen; gamepad"
              allowFullScreen
              onLoad={() => sendMuteState(isMuted)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
