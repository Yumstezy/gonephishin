"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Fisherman-silhouette hero. The metaphor: as the user scrolls down, the
 * fisherman reels in the catch (a phishing envelope on a hook) — same
 * visual gag as the brand name.
 *
 * Composition:
 *  - Sky-blue gradient background, subtle wave shapes at the bottom
 *  - One full-bleed SVG holds the fisherman, rod, line, and envelope. We
 *    keep it as a single SVG so coordinates stay pinned to viewBox space
 *    and don't drift between elements as the viewport resizes.
 *  - useScroll bound to the hero section gives a 0→1 progress over the
 *    first viewport's worth of scroll. We map that to the envelope's Y
 *    position and a slight tilt of the fisherman.
 *  - The static line is drawn from rod tip straight down; the envelope is
 *    a separate motion group sitting on the line, translated upward.
 *
 * All decorative shapes are aria-hidden — the headline and buttons carry
 * the semantic content.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Envelope rises from below the hero (y=920 in viewBox space) up toward
  // the rod tip (y=140). The trailing 0.4 of scroll keeps it parked near
  // the top instead of flying off, so the metaphor still reads if the
  // user pauses mid-scroll.
  const envelopeY = useTransform(scrollYProgress, [0, 0.6, 1], [920, 220, 220]);
  const envelopeRotate = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [-12, 4, 4],
  );
  const envelopeOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 1],
    [0, 1, 1],
  );

  // Fisherman tilts forward subtly to suggest effort while reeling in.
  const fishermanRotate = useTransform(scrollYProgress, [0, 1], [0, -3]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0369a1 0%, #075985 65%, #0c4a6e 100%)",
      }}
    >
      <FishingScene
        envelopeY={envelopeY}
        envelopeRotate={envelopeRotate}
        envelopeOpacity={envelopeOpacity}
        fishermanRotate={fishermanRotate}
      />

      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pt-32 pb-24 md:pt-40">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-[88px]"
          >
            Don&apos;t get caught
            <br />
            by phishing scams.
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl"
          >
            Gone Phishin&apos; watches your inbox so you — and the people you
            love — never click on something dangerous by mistake.
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-base font-medium text-[#0369a1] transition-transform hover:scale-[1.02]"
            >
              Install free
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
            >
              How it works
            </Link>
          </motion.div>
        </div>
      </div>

      <ScrollHint />
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
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <Bubbles />

      {/* Rod — quadratic curve from fisherman's hands across to the upper
         left, where the line drops from. */}
      <path
        d="M 1180 380 Q 700 -40 280 140"
        stroke="#000"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.92"
      />
      {/* The static fishing line: from rod tip straight down, off-screen
         below. The envelope rides on it via the motion group below. */}
      <line
        x1="280"
        y1="140"
        x2="280"
        y2="1100"
        stroke="#000"
        strokeWidth="2"
        opacity="0.85"
      />

      <motion.g style={{ rotate: fishermanRotate, originX: 1240, originY: 870 }}>
        <Fisherman />
      </motion.g>

      <motion.g
        style={{
          y: envelopeY,
          rotate: envelopeRotate,
          opacity: envelopeOpacity,
          originX: 280,
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
 * Standing in profile facing left, holding a rod up and to the left. Pure
 * black silhouette — no facial detail, no shading — to read as shadow.
 * Anchored at viewBox bottom-right (~x:1100-1380, full height of lower
 * half).
 */
function Fisherman() {
  return (
    <g fill="#000" opacity="0.96">
      {/* Bucket-style hat brim */}
      <ellipse cx="1240" cy="345" rx="78" ry="10" />
      {/* Hat crown */}
      <path d="M 1196 308 Q 1240 282 1284 308 Q 1290 326 1284 340 L 1196 340 Q 1190 326 1196 308 Z" />
      {/* Head */}
      <circle cx="1240" cy="370" r="22" />
      {/* Neck */}
      <rect x="1230" y="385" width="20" height="12" />
      {/* Torso — jacket shape, slight taper */}
      <path d="M 1192 396 Q 1184 410 1184 432 L 1184 580 Q 1184 605 1200 612 L 1280 612 Q 1296 605 1296 580 L 1296 432 Q 1296 410 1288 396 Z" />
      {/* Forward arm holding rod — extends out and slightly up to meet the
          rod start at (1180, 380). */}
      <path d="M 1290 414 Q 1235 396 1180 372 Q 1170 378 1175 388 Q 1230 414 1280 432 Z" />
      {/* Back arm tucked at side */}
      <path d="M 1190 422 L 1188 540 L 1198 540 L 1200 422 Z" />
      {/* Belt */}
      <rect x="1184" y="582" width="112" height="10" />
      {/* Front leg (left, anatomically) */}
      <path d="M 1196 612 L 1192 832 L 1226 832 L 1234 612 Z" />
      {/* Back leg (right, anatomically) */}
      <path d="M 1248 612 L 1256 832 L 1290 832 L 1284 612 Z" />
      {/* Boots */}
      <ellipse cx="1208" cy="844" rx="22" ry="10" />
      <ellipse cx="1272" cy="844" rx="22" ry="10" />
    </g>
  );
}

/* ---------------- Phishing envelope on a hook ----------------
 * Stylized envelope with a hook through the top — the "catch". Rendered
 * pure black so it matches the fisherman silhouette aesthetic.
 */
function PhishingEnvelope() {
  return (
    <g fill="#000" opacity="0.94">
      {/* Hook (above the envelope) */}
      <path
        d="M 280 -40 L 280 -8 Q 280 6 268 6 Q 256 6 256 -6"
        stroke="#000"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Envelope body */}
      <rect x="222" y="0" width="116" height="76" rx="4" />
      {/* Envelope flap (V shape, slightly lighter so it reads) */}
      <path
        d="M 222 0 L 280 44 L 338 0 Z"
        fill="#1f2937"
      />
      {/* "@" mark cut out of the envelope (knocked-out so it shows the
          gradient through). Approximated with a smaller white circle. */}
      <circle cx="280" cy="44" r="11" fill="#fff" opacity="0.9" />
      <text
        x="280"
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
  // Placed by hand for variety. A few are larger for foreground interest.
  const dots = [
    { cx: 100, cy: 80, r: 2, op: 0.4 },
    { cx: 220, cy: 220, r: 3, op: 0.5 },
    { cx: 480, cy: 120, r: 2, op: 0.3 },
    { cx: 760, cy: 320, r: 2, op: 0.5 },
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
        d="M 0 820 Q 200 790 400 820 T 800 820 T 1200 820 T 1600 820 L 1600 900 L 0 900 Z"
        fill="#fff"
        opacity="0.06"
      />
      <path
        d="M 0 850 Q 200 820 400 850 T 800 850 T 1200 850 T 1600 850 L 1600 900 L 0 900 Z"
        fill="#fff"
        opacity="0.08"
      />
      <path
        d="M 0 880 Q 200 860 400 880 T 800 880 T 1200 880 T 1600 880 L 1600 900 L 0 900 Z"
        fill="#fff"
        opacity="0.1"
      />
    </g>
  );
}

/* ---------------- Scroll hint at bottom ---------------- */
function ScrollHint() {
  return (
    <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-10 flex justify-center">
      <div className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
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
