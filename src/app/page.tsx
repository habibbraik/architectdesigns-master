import FeatureScroll from "@/components/FeatureScroll";
import Hero from "@/components/Hero";
import ProjectsGrid from "@/components/ProjectsGrid";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <main>
        <Hero />

        <ProjectsGrid />

        <FeatureScroll />

        <section className="relative z-10 bg-paper px-8 py-32 text-ink md:px-14">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-xs tracking-[0.4em] uppercase text-brass">
              About the Studio
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-light leading-snug md:text-5xl">
              We design homes that feel inevitable — as if they could not
              have been arranged any other way.
            </h2>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-ink/70">
              Meridian is a residential architecture studio working across
              new builds, renovations, and interiors. Every project starts
              with how light moves through a site and how a family actually
              moves through a day.
            </p>
          </div>
        </section>

        <footer className="bg-ink px-8 py-10 text-xs tracking-[0.2em] text-paper/60 md:px-14">
          © {new Date().getFullYear()} Meridian Architecture Studio
        </footer>
      </main>
    </SmoothScroll>
  );
}
