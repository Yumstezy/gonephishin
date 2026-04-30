import { Reveal } from "./reveal";

/**
 * Three full-width zigzag rows, each with a custom inline SVG illustration
 * (single-color, geometric, friendly — Headspace-adjacent without being
 * twee) and Apple-scale display type. Alternating left/right.
 */
export function ValuePropsSection() {
  const items: Array<{
    eyebrow: string;
    title: string;
    accent: string;
    desc: string;
    illustration: React.ReactNode;
    flip?: boolean;
    bg?: "white" | "tint";
  }> = [
    {
      eyebrow: "Always on",
      title: "Every link checked.",
      accent: "Silently.",
      desc: "Gone Phishin' inspects every link as the email loads — against the same threat database Chrome itself uses, plus our own detection for fake brand pages and look-alike domains.",
      illustration: <ShieldIllustration />,
    },
    {
      eyebrow: "Stop. Look.",
      title: "A clear warning,",
      accent: "in plain English.",
      desc: "When a link looks dangerous, the click is intercepted. A warning appears with one big button to go back safely — no jargon, no decisions.",
      illustration: <CatchIllustration />,
      flip: true,
      bg: "tint",
    },
    {
      eyebrow: "Quietly looking out",
      title: "Set it up for someone",
      accent: "you love.",
      desc: "Pair Gone Phishin' with a parent or grandparent in under a minute. They never need an account. You see only the dangerous links they encounter — never anything they actually read.",
      illustration: <FamilyIllustration />,
    },
  ];

  return (
    <section id="features">
      {items.map((item) => (
        <div
          key={item.title}
          className={
            item.bg === "tint"
              ? "bg-secondary/50 py-32 md:py-44"
              : "bg-background py-32 md:py-44"
          }
        >
          <div
            className={`mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2 md:gap-24 ${
              item.flip ? "md:[&>*:first-child]:order-last" : ""
            }`}
          >
            <Reveal>{item.illustration}</Reveal>
            <Reveal delay={0.1}>
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-primary">
                {item.eyebrow}
              </p>
              <h2 className="font-display text-balance text-4xl font-semibold leading-[1] tracking-tight md:text-5xl lg:text-[64px]">
                {item.title}{" "}
                <span className="text-muted-foreground">{item.accent}</span>
              </h2>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl">
                {item.desc}
              </p>
            </Reveal>
          </div>
        </div>
      ))}
    </section>
  );
}

function ShieldIllustration() {
  return (
    <div className="relative mx-auto aspect-square max-w-md">
      <div className="absolute inset-6 rounded-[3rem] bg-gradient-to-br from-secondary to-warm/20 blur-2xl" />
      <svg viewBox="0 0 320 320" className="relative h-full w-full" aria-hidden>
        <circle cx="60" cy="80" r="6" fill="rgb(var(--warm))" opacity="0.7" />
        <circle cx="266" cy="58" r="4" fill="rgb(var(--primary))" opacity="0.4" />
        <circle cx="282" cy="226" r="9" fill="rgb(var(--warm))" opacity="0.55" />

        {/* Soft outer halo */}
        <path
          d="M 160 50 Q 222 50 240 82 Q 258 120 250 182 Q 230 252 160 282 Q 90 252 70 182 Q 62 120 80 82 Q 98 50 160 50 Z"
          fill="rgb(var(--primary))"
          opacity="0.08"
        />
        {/* Solid shield */}
        <path
          d="M 160 70 Q 212 70 226 96 Q 244 130 234 180 Q 218 240 160 264 Q 102 240 86 180 Q 76 130 94 96 Q 108 70 160 70 Z"
          fill="rgb(var(--primary))"
        />
        {/* Inner highlight for depth */}
        <path
          d="M 100 95 Q 130 80 160 80 Q 175 80 188 86"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />
        {/* Bold checkmark */}
        <path
          d="M 118 168 L 152 200 L 204 138"
          stroke="white"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

function CatchIllustration() {
  return (
    <div className="relative mx-auto aspect-square max-w-md">
      <div className="absolute inset-6 rounded-[3rem] bg-gradient-to-br from-warm/40 to-secondary blur-2xl" />
      <svg viewBox="0 0 320 320" className="relative h-full w-full" aria-hidden>
        <circle cx="44" cy="62" r="4" fill="rgb(var(--primary))" opacity="0.4" />
        <circle cx="282" cy="100" r="5" fill="rgb(var(--warm))" opacity="0.7" />
        <circle cx="60" cy="262" r="7" fill="rgb(var(--primary))" opacity="0.25" />

        {/* Hook line dropping from the top */}
        <path
          d="M 162 30 L 162 78"
          stroke="rgb(var(--foreground))"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Hook curl */}
        <path
          d="M 162 78 Q 162 96 145 96 Q 130 96 130 80"
          stroke="rgb(var(--foreground))"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Envelope (caught fish) */}
        <g transform="translate(160 178) rotate(-6)">
          <rect
            x="-90"
            y="-50"
            width="180"
            height="110"
            rx="14"
            fill="white"
            stroke="rgb(var(--foreground))"
            strokeWidth="3"
          />
          <path
            d="M -90 -42 L 0 18 L 90 -42"
            fill="none"
            stroke="rgb(var(--foreground))"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* @ symbol */}
          <circle cx="0" cy="-18" r="14" fill="rgb(var(--primary))" />
          <text
            x="0"
            y="-13"
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            fill="white"
            fontFamily="-apple-system, system-ui"
          >
            @
          </text>
        </g>

        {/* Big peach "!" warning bubble */}
        <g transform="translate(238 92)">
          <circle
            r="36"
            fill="rgb(var(--warm))"
            stroke="rgb(var(--foreground))"
            strokeWidth="3"
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="40"
            fontWeight="800"
            fontFamily="-apple-system, system-ui"
            fill="rgb(var(--foreground))"
          >
            !
          </text>
        </g>
      </svg>
    </div>
  );
}

function FamilyIllustration() {
  return (
    <div className="relative mx-auto aspect-square max-w-md">
      <div className="absolute inset-6 rounded-[3rem] bg-gradient-to-br from-secondary to-warm/30 blur-2xl" />
      <svg viewBox="0 0 320 320" className="relative h-full w-full" aria-hidden>
        <circle cx="50" cy="50" r="6" fill="rgb(var(--warm))" opacity="0.7" />
        <circle cx="284" cy="240" r="4" fill="rgb(var(--primary))" opacity="0.4" />

        {/* Back phone (caregiver — primary blue) */}
        <g>
          <rect x="38" y="86" width="118" height="194" rx="22" fill="rgb(var(--primary))" />
          <rect x="56" y="112" width="78" height="8" rx="4" fill="white" opacity="0.55" />
          <rect x="56" y="130" width="58" height="6" rx="3" fill="white" opacity="0.35" />
          <rect x="56" y="146" width="68" height="6" rx="3" fill="white" opacity="0.35" />
          <circle cx="97" cy="200" r="26" fill="white" opacity="0.95" />
          <text
            x="97"
            y="210"
            textAnchor="middle"
            fontSize="32"
            fontWeight="700"
            fill="rgb(var(--primary))"
            fontFamily="-apple-system, system-ui"
          >
            ♥
          </text>
        </g>

        {/* Front phone (senior — white) */}
        <g>
          <rect
            x="158"
            y="44"
            width="118"
            height="194"
            rx="22"
            fill="white"
            stroke="rgb(var(--foreground))"
            strokeWidth="3"
          />
          <rect x="178" y="72" width="78" height="8" rx="4" fill="rgb(var(--foreground))" opacity="0.7" />
          <rect x="178" y="90" width="58" height="6" rx="3" fill="rgb(var(--foreground))" opacity="0.4" />
          <rect x="178" y="106" width="68" height="6" rx="3" fill="rgb(var(--foreground))" opacity="0.4" />
          <circle cx="217" cy="158" r="26" fill="rgb(var(--warm))" />
          <text
            x="217"
            y="167"
            textAnchor="middle"
            fontSize="22"
            fontWeight="800"
            fill="rgb(var(--foreground))"
            fontFamily="-apple-system, system-ui"
          >
            ✓
          </text>
        </g>

        {/* Connecting heartbeat-line */}
        <path
          d="M 130 250 Q 160 280 215 250"
          fill="none"
          stroke="rgb(var(--primary))"
          strokeWidth="3"
          strokeDasharray="2 8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
