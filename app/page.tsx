import Link from "next/link";

import { DimensionCard } from "@/components/dimension-card";

const EXPLAINERS = [
  {
    title: "Melody",
    example: "Example: a hook with wide interval leaps and a fast return to repeated notes.",
    description:
      "Melody tracks the contour of the sung line: pitch center, motion, repetition, and how singable the topline feels."
  },
  {
    title: "Harmony",
    example: "Example: a blues-plagal loop that keeps resolving with a grounded, familiar cadence.",
    description:
      "Harmony describes chord movement and tonal structure, from simple diatonic loops to more extended progressions."
  },
  {
    title: "Rhythm",
    example: "Example: a swung 3/4 pulse versus a straighter 4/4 groove with a quicker BPM.",
    description:
      "Rhythm captures the pulse, meter, tempo, and swing feel that shape how a song moves over time."
  },
  {
    title: "Timbre",
    example: "Example: bright, loud instrumentation with high danceability versus softer, more acoustic textures.",
    description:
      "Timbre reflects sonic texture: brightness, loudness, instrument mix, energy, and the overall production feel."
  }
];

const DIMENSION_CARDS: Array<{
  title: string;
  href: string;
  eyebrow: string;
  description: string;
  accentClassName: string;
}> = [
  {
    title: "Melody",
    href: "/melody",
    eyebrow: "Pitch Shapes",
    description: "Step range, repetition, pitch center, and melodic motion across representative Billboard styles.",
    accentClassName: "bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#fbbf24]"
  },
  {
    title: "Harmony",
    href: "/harmony",
    eyebrow: "Chord Logic",
    description: "Key structure, fifths distance, harmonic extensions, and recurring progression templates.",
    accentClassName: "bg-gradient-to-r from-[#0f766e] via-[#14b8a6] to-[#5eead4]"
  },
  {
    title: "Rhythm",
    href: "/rhythm",
    eyebrow: "Pulse & Meter",
    description: "Tempo, swing, and meter clusters mapped into a concise style timeline you can browse by year.",
    accentClassName: "bg-gradient-to-r from-[#b91c1c] via-[#ef4444] to-[#fca5a5]"
  },
  {
    title: "Timbre",
    href: "/timbre",
    eyebrow: "Production Texture",
    description: "Instrumentation, brightness, loudness, energy, and other production-facing stylistic signatures.",
    accentClassName: "bg-gradient-to-r from-[#1d4ed8] via-[#3b82f6] to-[#93c5fd]"
  }
];

export default function HomePage() {
  return (
    <main className="space-y-8">
      <section className="glass-panel overflow-hidden rounded-[34px] border border-line shadow-panel">
        <div className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.5fr_1fr] lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Guo, Seetharaman &amp; Xie (2026)</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl tracking-tight text-ink sm:text-6xl">
              Music Evolution in Western Popular Music
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-7 text-ink/85 sm:text-xl">
              Billboard song styles across melody, harmony, rhythm, and timbre (1958–2017).
            </p>
            <div className="mt-6 max-w-3xl space-y-5 text-base leading-7 text-muted sm:text-lg">
              <p>
                This site is based on <em>Echoes from the Past: Generative AI Music Design Through Controlled Similarity to Historical Styles</em> by Haihao Guo, Seethu Seetharaman, and Yingkang Xie (2026).
              </p>
              <p>
                We conceptualize popular music as composed of four core dimensions: melody, harmony, and rhythm, which reflect songwriting structure, and timbre, which captures instrumentation and production.
              </p>
              <p>
                Using 24,618 Billboard songs released between 1958 and 2017, we trace how styles in each dimension evolve over time and identify stable historical templates that continue to shape modern music.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/melody"
                className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-accent"
              >
                Start with Melody
              </Link>
              <Link
                href="#dimensions"
                className="rounded-full border border-line bg-white/75 px-5 py-3 text-sm font-medium text-ink transition hover:border-accent"
              >
                Browse all dimensions
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-line bg-[rgba(255,240,223,0.75)] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">What You Can Inspect</p>
            <div className="mt-5 space-y-4">
              {EXPLAINERS.map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/70 bg-white/70 p-4">
                  <p className="font-display text-2xl text-ink">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                  <p className="mt-3 text-sm font-medium text-ink">{item.example}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="dimensions" className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Dimensions</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white">
              Four Dimensions of Music Style Evolution
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {DIMENSION_CARDS.map((card) => (
            <DimensionCard key={card.title} {...card} />
          ))}
        </div>
      </section>
    </main>
  );
}
