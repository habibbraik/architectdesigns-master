"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bandOpacity } from "@/lib/scrollAnim";

gsap.registerPlugin(ScrollTrigger);

// The source clip fades in from black; frames 1-4 are pure black, so we
// skip straight to frame 5 to avoid a dead black stretch on scroll-in.
const START_FRAME = 5;
const TOTAL_FRAMES = 287;
const FRAME_COUNT = TOTAL_FRAMES - (START_FRAME - 1);
const getFrameSrc = (index: number) =>
  `/feature/ezgif-frame-${String(START_FRAME + index).padStart(3, "0")}.jpg`;

export default function FeatureScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const preRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  // Preload the interior sequence.
  useEffect(() => {
    let cancelled = false;
    let count = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const onSettle = () => {
        count++;
        if (cancelled) return;
        setLoaded(count);
        if (count === FRAME_COUNT) setReady(true);
      };
      img.onload = onSettle;
      img.onerror = onSettle;
      img.src = getFrameSrc(i);
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
  }, []);

  // Drive the canvas + overlay text from scroll position.
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let currentIndex = 0;

    const draw = (index: number) => {
      const img = imagesRef.current[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const sw = cw / scale;
      const sh = ch / scale;
      const sx = (iw - sw) / 2;
      const sy = (ih - sh) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    };

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      draw(currentIndex);
    };

    resize();
    window.addEventListener("resize", resize);

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.35,
      onUpdate: (self) => {
        const progress = self.progress;
        currentIndex = Math.min(
          FRAME_COUNT - 1,
          Math.floor(progress * FRAME_COUNT)
        );
        draw(currentIndex);

        if (preRef.current) {
          gsap.set(preRef.current, {
            opacity: bandOpacity(progress, 0.06, 0.16, 0.66, 0.78),
            y: (0.16 - progress) * 30,
          });
        }
        if (titleRef.current) {
          gsap.set(titleRef.current, {
            opacity: bandOpacity(progress, 0.1, 0.22, 0.66, 0.8),
            y: (0.22 - progress) * 40,
          });
        }
        if (captionRef.current) {
          gsap.set(captionRef.current, {
            opacity: bandOpacity(progress, 0.3, 0.42, 0.66, 0.8),
            y: (0.42 - progress) * 30,
          });
        }
      },
    });

    return () => {
      window.removeEventListener("resize", resize);
      st.kill();
    };
  }, [ready]);

  const progressPct = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <section ref={wrapperRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-paper">
          <p
            ref={preRef}
            className="mb-4 text-xs tracking-[0.4em] uppercase text-brass opacity-0"
          >
            Interior Design
          </p>
          <h2
            ref={titleRef}
            className="font-[family-name:var(--font-display)] text-4xl font-light leading-tight opacity-0 md:text-6xl"
          >
            Where the Evening
            <br />
            Settles In
          </h2>
          <div
            ref={captionRef}
            className="mt-6 max-w-md opacity-0"
          >
            <p className="text-sm text-paper/80 md:text-base">
              Floor-to-ceiling glass, a marble hearth, and an ocean that
              never leaves the room.
            </p>
          </div>
        </div>

        {!ready && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black text-paper/70">
            <div className="h-px w-40 overflow-hidden bg-white/15">
              <div
                className="h-full bg-brass transition-[width] duration-150"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[10px] tracking-[0.35em] uppercase">
              Loading
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
