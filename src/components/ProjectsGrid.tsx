"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    src: "/projects/cascade-house.jpg",
    name: "Cascade House",
    caption: "Contemporary Family Residence",
  },
  {
    src: "/projects/aurora-heights.jpg",
    name: "Aurora Heights",
    caption: "Hillside Glass Villa",
  },
  {
    src: "/projects/skyline-sanctuary.jpg",
    name: "Skyline Sanctuary",
    caption: "Modern Fortress Above the City",
  },
  {
    src: "/projects/cape-noir.jpg",
    name: "Cape Noir",
    caption: "Cliffside Water Retreat",
  },
  {
    src: "/projects/bellevue-manor.jpg",
    name: "Bellevue Manor",
    caption: "Family Estate & Motor Court",
  },
  {
    src: "/projects/golden-horizon.jpg",
    name: "Golden Horizon",
    caption: "Sunset Pavilion Residence",
  },
];

export default function ProjectsGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards =
        gridRef.current?.querySelectorAll<HTMLElement>("[data-card]");
      if (!cards || cards.length === 0) return;

      gsap.set(cards, { opacity: 0, y: 56 });

      ScrollTrigger.batch(cards, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
          }),
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative z-10 bg-paper px-8 py-28 text-ink md:px-14">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs tracking-[0.4em] uppercase text-brass">
          Portfolio
        </p>
        <h2 className="mb-14 max-w-xl font-[family-name:var(--font-display)] text-4xl font-light leading-tight md:text-5xl">
          Selected Residences
        </h2>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <div
              key={project.name}
              data-card
              className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-ink"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.src}
                alt={project.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-center text-paper">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-medium">
                  {project.name}
                </h3>
                <p className="mt-1 text-[11px] tracking-[0.25em] uppercase text-paper/70">
                  {project.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
