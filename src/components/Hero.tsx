"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bandOpacity } from "@/lib/scrollAnim";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 300;
const getFrameSrc = (index: number) =>
  `/frames/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const introRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderContentRef = useRef<HTMLDivElement>(null);
  const loaderLogoRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const displayValue = useRef({ value: 0 });

  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  // Preload the full frame sequence.
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

  // Breathing pulse on the loader logo while it's on screen.
  useEffect(() => {
    if (!showLoader) return;
    const ctx = gsap.context(() => {
      if (loaderLogoRef.current) {
        gsap.to(loaderLogoRef.current, {
          scale: 1.05,
          duration: 1.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    });
    return () => ctx.revert();
  }, [showLoader]);

  // Smoothly tween the displayed percentage/bar toward the real load progress
  // instead of snapping on every single frame's onload event.
  useEffect(() => {
    const target = (loaded / FRAME_COUNT) * 100;
    const tween = gsap.to(displayValue.current, {
      value: target,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        const v = displayValue.current.value;
        if (percentRef.current) percentRef.current.textContent = String(Math.round(v));
        if (barRef.current) barRef.current.style.width = `${v}%`;
      },
    });
    return () => {
      tween.kill();
    };
  }, [loaded]);

  // Curtain-wipe the loader away once every frame has loaded.
  useEffect(() => {
    if (!ready || !showLoader) return;
    const tl = gsap.timeline({ onComplete: () => setShowLoader(false) });
    tl.to(loaderContentRef.current, {
      opacity: 0,
      y: -24,
      duration: 0.45,
      ease: "power2.in",
    }).to(
      loaderRef.current,
      {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut",
      },
      "-=0.1"
    );
    return () => {
      tl.kill();
    };
  }, [ready, showLoader]);

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
        currentIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
        draw(currentIndex);

        if (introRef.current) {
          gsap.set(introRef.current, {
            opacity: bandOpacity(progress, 0, 0, 0.02, 0.14),
            y: -progress * 60,
          });
        }
        if (indicatorRef.current) {
          gsap.set(indicatorRef.current, {
            opacity: bandOpacity(progress, 0, 0, 0.02, 0.08),
          });
        }
        if (midRef.current) {
          gsap.set(midRef.current, {
            opacity: bandOpacity(progress, 0.36, 0.46, 0.58, 0.68),
            y: (0.46 - progress) * 40,
          });
        }
        if (outroRef.current) {
          gsap.set(outroRef.current, {
            opacity: bandOpacity(progress, 0.84, 0.94, 1, 1),
            y: (0.94 - progress) * 40,
          });
        }
      },
    });

    return () => {
      window.removeEventListener("resize", resize);
      st.kill();
    };
  }, [ready]);

  return (
    <section ref={wrapperRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />

        <nav className="pointer-events-auto absolute inset-x-0 top-0 z-20 flex items-center justify-between px-8 py-6 text-paper md:px-14">
          <span className="font-[family-name:var(--font-display)] text-xl tracking-[0.2em]">
            MERIDIAN
          </span>
          <div className="hidden gap-10 text-xs tracking-[0.25em] uppercase md:flex">
            <span>Studio</span>
            <span>Projects</span>
            <span>Contact</span>
          </div>
        </nav>

        <div
          ref={introRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-paper"
        >
          <p className="mb-4 text-xs tracking-[0.4em] uppercase text-brass">
            Residential Architecture
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-light leading-tight md:text-8xl">
            Homes Built
            <br />
            Around Light
          </h1>
        </div>

        <div
          ref={midRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-paper opacity-0"
        >
          <h2 className="font-[family-name:var(--font-display)] text-4xl font-light md:text-6xl">
            Every Room, Considered.
          </h2>
          <p className="mt-4 max-w-md text-sm text-paper/80 md:text-base">
            From facade to fixture, each space is drawn around how you
            actually live.
          </p>
        </div>

        <div
          ref={outroRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-paper opacity-0"
        >
          <h2 className="font-[family-name:var(--font-display)] text-4xl font-light md:text-6xl">
            Step Inside.
          </h2>
          <button className="pointer-events-auto mt-8 border border-paper/60 px-8 py-3 text-xs tracking-[0.3em] uppercase transition hover:bg-paper hover:text-ink">
            View Projects
          </button>
        </div>

        <div
          ref={indicatorRef}
          className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-2 text-paper/70"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="h-10 w-px animate-pulse bg-paper/50" />
        </div>

        {showLoader && (
          <div
            ref={loaderRef}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-8 bg-black text-paper"
          >
            <div
              ref={loaderContentRef}
              className="flex flex-col items-center gap-8"
            >
              <span
                ref={loaderLogoRef}
                className="font-[family-name:var(--font-display)] text-2xl tracking-[0.4em] text-paper/80 md:text-3xl"
              >
                MERIDIAN
              </span>
              <div className="flex items-baseline gap-2 font-[family-name:var(--font-display)] text-8xl font-light tabular-nums md:text-9xl">
                <span ref={percentRef}>0</span>
                <span className="text-3xl text-paper/40 md:text-4xl">%</span>
              </div>
              <div className="h-px w-56 overflow-hidden bg-white/15 md:w-72">
                <div
                  ref={barRef}
                  className="h-full bg-brass"
                  style={{ width: "0%" }}
                />
              </div>
              <span className="text-[10px] tracking-[0.4em] uppercase text-paper/50">
                Loading Experience
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
