"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Scrollytelling hero. The outer <section> is 200vh tall; the inner scene
 * is `position: sticky` so it stays pinned to the viewport for the entire
 * scroll. As the user scrolls 0→100% of the section, the envelope on the
 * fishing line rises from below the screen up toward the rod tip.
 *
 * Composition is one full-bleed SVG containing the rod, line, envelope,
 * fisherman, bubbles and waves. Headline + buttons are layered on top in
 * a normal flex container.
 *
 * Color: soft sky-blue gradient (much lighter than the previous take —
 * the navy was harsh). Foreground silhouettes are pure black.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Envelope rises from off-screen below to near the rod tip. We hold it
  // near the top in the trailing portion so the catch is still visible
  // when the user pauses near the end of the hero.
  const envelopeY = useTransform(scrollYProgress, [0, 0.7, 1], [880, 200, 200]);
  const envelopeRotate = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [-12, 4, 4],
  );
  const envelopeOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 1],
    [0, 1, 1],
  );

  // Fisherman tilts forward subtly to suggest effort while reeling in.
  const fishermanRotate = useTransform(scrollYProgress, [0, 1], [0, -2]);

  return (
    <section ref={ref} className="relative h-[200vh] w-full">
      {/* Sticky inner — keeps the scene pinned in the viewport while the
          user scrolls through the section's 200vh of scroll-distance. */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #38bdf8 0%, #0ea5e9 45%, #0284c7 100%)",
        }}
      >
        {/* Noise sits BEHIND the foreground content (z-0) so mix-blend
            doesn't darken the headline. */}
        <div className="noise-overlay pointer-events-none absolute inset-0 z-0 opacity-25 mix-blend-overlay" />

        <FishingScene
          envelopeY={envelopeY}
          envelopeRotate={envelopeRotate}
          envelopeOpacity={envelopeOpacity}
          fishermanRotate={fishermanRotate}
        />

        <div className="relative z-20 mx-auto flex h-full max-w-6xl flex-col justify-center px-6 pt-32 pb-24 md:pt-40">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-[88px]"
              style={{
                textShadow: "0 2px 30px rgba(0,0,0,0.15)",
              }}
            >
              Don&apos;t get caught
              <br />
              by phishing scams.
            </motion.h1>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl"
            >
              Gone Phishin&apos; watches your inbox so you — and the people
              you love — never click on something dangerous by mistake.
            </motion.p>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-base font-semibold text-sky-700 shadow-lg shadow-sky-900/20 transition-transform hover:scale-[1.02]"
              >
                Install free
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-7 py-3 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                How it works
              </Link>
            </motion.div>
          </div>
        </div>

        <ScrollHint />
      </div>
    </section>
  );
}

interface SceneProps {
  envelopeY: ReturnType<typeof useTransform<number, number>>;
  envelopeRotate: ReturnType<typeof useTransform<number, number>>;
  envelopeOpacity: ReturnType<typeof useTransform<number, number>>;
  fishermanRotate: ReturnType<typeof useTransform<number, number>>;
}

function FishingScene({
  envelopeY,
  envelopeRotate,
  envelopeOpacity,
  fishermanRotate,
}: SceneProps) {
  return (
    <svg
      className="absolute inset-0 z-10 h-full w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <Bubbles />

      {/* Rod — quadratic curve from the fisherman's hands across to the
         upper-left rod tip (at x=320, y=160), where the line drops from. */}
      <path
        d="M 1310 470 Q 800 -20 320 160"
        stroke="#0c0a09"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Static fishing line — drops straight down from the rod tip. The
         envelope rides on it via the motion group below. */}
      <line
        x1="320"
        y1="160"
        x2="320"
        y2="1100"
        stroke="#0c0a09"
        strokeWidth="2"
        opacity="0.85"
      />

      <motion.g
        style={{ rotate: fishermanRotate, originX: 1340, originY: 870 }}
      >
        <Fisherman />
      </motion.g>

      <motion.g
        style={{
          y: envelopeY,
          rotate: envelopeRotate,
          opacity: envelopeOpacity,
          originX: 320,
          originY: 0,
        }}
      >
        <PhishingEnvelope />
      </motion.g>

      <Waves />
    </svg>
  );
}

/* ---------------- Fisherman silhouette ----------------
 * Sitting on a small dock at the bottom-right, in profile facing left.
 * Sitting pose reads more iconic than standing and lets us keep the
 * proportions tight (head-to-feet within ~330 viewBox units).
 *
 * Drawn as one combined fill so it's a clean shadow shape.
 */
function Fisherman() {
  return (
    <g fill="#0c0a09">
      {/* Dock plank */}
      <rect x="1240" y="852" width="320" height="14" />
      <rect x="1260" y="866" width="14" height="34" />
      <rect x="1380" y="866" width="14" height="34" />
      <rect x="1500" y="866" width="14" height="34" />

      {/* Sitting fisherman, body */}
      {/* Hat brim */}
      <ellipse cx="1340" cy="572" rx="46" ry="6" />
      {/* Hat dome */}
      <path d="M 1314 548 Q 1340 528 1366 548 Q 1370 562 1366 568 L 1314 568 Q 1310 562 1314 548 Z" />
      {/* Head */}
      <circle cx="1340" cy="592" r="16" />
      {/* Torso — slightly hunched forward (sitting) */}
      <path d="M 1318 608 Q 1310 616 1310 632 L 1310 720 Q 1310 736 1322 740 L 1372 740 Q 1382 736 1382 720 L 1382 632 Q 1380 616 1372 608 Z" />
      {/* Forward arm + rod handle (extends to the rod start near 1310, 470)
         — the rod is drawn separately, this is the arm tucked along it. */}
      <path d="M 1370 622 Q 1330 540 1305 478 Q 1300 472 1308 470 Q 1340 540 1378 638 Z" />
      {/* Back arm bent at waist */}
      <path d="M 1320 660 L 1310 700 L 1320 706 L 1334 668 Z" />
      {/* Lap / thighs (sitting, knees bent forward) */}
      <path d="M 1308 740 Q 1304 750 1308 762 L 1252 798 Q 1248 802 1254 808 L 1316 776 Q 1382 760 1384 740 Z" />
      {/* Lower legs hanging off dock edge */}
      <rect
        x="1248"
        y="800"
        width="20"
        height="60"
        transform="rotate(-4 1258 830)"
      />
      <rect
        x="1278"
        y="804"
        width="20"
        height="56"
        transform="rotate(-2 1288 832)"
      />
      {/* Boots */}
      <ellipse cx="1252" cy="858" rx="16" ry="6" />
      <ellipse cx="1290" cy="858" rx="16" ry="6" />
    </g>
  );
}

/* ---------------- Phishing envelope on a hook ----------------
 * Stylized envelope with a hook through the top. Pure black so it reads
 * as the same shadow material as the fisherman.
 */
function PhishingEnvelope() {
  return (
    <g fill="#0c0a09">
      {/* Hook */}
      <path
        d="M 320 -50 L 320 -10 Q 320 6 304 6 Q 290 6 290 -8"
        stroke="#0c0a09"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Envelope body */}
      <rect x="262" y="0" width="116" height="76" rx="6" />
      {/* Envelope flap (V), slightly lighter so it reads as a separate plane */}
      <path d="M 262 0 L 320 44 L 378 0 Z" fill="#1c1917" />
      {/* @ symbol on the front */}
      <circle cx="320" cy="44" r="11" fill="#fff" opacity="0.92" />
      <text
        x="320"
        y="49"
        textAnchor="middle"
        fontSize="14"
        fontWeight="800"
        fill="#0369a1"
        fontFamily="system-ui, sans-serif"
      >
        @
      </text>
    </g>
  );
}

/* ---------------- Bubbles / atmospheric dots ---------------- */
function Bubbles() {
  const dots = [
    { cx: 100, cy: 80, r: 2, op: 0.35 },
    { cx: 220, cy: 220, r: 3, op: 0.45 },
    { cx: 480, cy: 120, r: 2, op: 0.3 },
    { cx: 760, cy: 320, r: 2, op: 0.45 },
    { cx: 920, cy: 70, r: 3, op: 0.4 },
    { cx: 1380, cy: 200, r: 2, op: 0.5 },
    { cx: 1480, cy: 460, r: 2, op: 0.35 },
    { cx: 350, cy: 540, r: 4, op: 0.25 },
    { cx: 580, cy: 720, r: 3, op: 0.3 },
    { cx: 1020, cy: 600, r: 2, op: 0.4 },
  ];
  return (
    <g>
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.cx}
          cy={d.cy}
          r={d.r}
          fill="#fff"
          opacity={d.op}
        />
      ))}
    </g>
  );
}

/* ---------------- Waves at bottom ---------------- */
function Waves() {
  return (
    <g aria-hidden="true">
      <path
        d="M 0 800 Q 200 770 400 800 T 800 800 T 1200 800 T 1600 800 L 1600 900 L 0 900 Z"
        fill="#fff"
        opacity="0.06"
      />
      <path
        d="M 0 836 Q 200 806 400 836 T 800 836 T 1200 836 T 1600 836 L 1600 900 L 0 900 Z"
        fill="#fff"
        opacity="0.08"
      />
      <path
        d="M 0 870 Q 200 850 400 870 T 800 870 T 1200 870 T 1600 870 L 1600 900 L 0 900 Z"
        fill="#fff"
        opacity="0.1"
      />
    </g>
  );
}

/* ---------------- Scroll hint at bottom ---------------- */
function ScrollHint() {
  return (
    <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-30 flex justify-center">
      <div className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70">
        Scroll
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
