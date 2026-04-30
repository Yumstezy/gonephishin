/**
 * Three single-column "stages" — each is a full-width row with a friendly
 * SVG illustration on one side and Apple-style display type on the other.
 * Alternates left/right for visual rhythm.
 */
export function ValuePropsSection() {
  const items: Array<{
    eyebrow: string;
    title: string;
    desc: string;
    illustration: React.ReactNode;
    flip?: boolean;
  }> = [
    {
      eyebrow: "Always watching",
      title: "Every link, checked the second it lands.",
      desc: "Gone Phishin' inspects every link in every email — silently, in real time, against the same threat database Chrome itself uses, plus our own detection for fake brand pages and look-alike domains.",
      illustration: <ShieldIllustration />,
    },
    {
      eyebrow: "Stop, before you click",
      title: "A clear warning, in plain English.",
      desc: "When something looks dangerous, the click is intercepted. A warning appears with one big button to go back safely — no jargon, no decisions to make.",
      illustration: <WarningIllustration />,
      flip: true,
    },
    {
      eyebrow: "For someone you love",
      title: "Set up by a phone call.",
      desc: "Pair Gone Phishin' with a parent or grandparent in under a minute. They never need an account. You see the dangerous links they encounter — never anything they actually read.",
      illustration: <FamilyIllustration />,
    },
  ];

  return (
    <section id="features" className="bg-background">
      {items.map((item, i) => (
        <div
          key={item.title}
          className={
            i % 2 === 1 ? "bg-secondary/50 py-32 md:py-40" : "py-32 md:py-40"
          }
        >
          <div
            className={`mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2 md:gap-20 ${
              item.flip ? "md:[&>*:first-child]:order-last" : ""
            }`}
          >
            <div>{item.illustration}</div>
            <div>
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.14em] text-primary">
                {item.eyebrow}
              </p>
              <h2 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-[56px]">
                {item.title}
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl">
                {item.desc}
              </p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function ShieldIllustration() {
  return (
    <div className="relative mx-auto aspect-square max-w-md">
      <div className="absolute inset-8 rounded-[3rem] bg-gradient-to-br from-secondary to-warm/30 blur-2xl" />
      <svg
        viewBox="0 0 320 320"
        className="relative h-full w-full"
        aria-hidden
      >
        {/* Ambient circles */}
        <circle cx="60" cy="80" r="6" fill="rgb(var(--warm))" opacity="0.6" />
        <circle cx="270" cy="60" r="4" fill="rgb(var(--primary))" opacity="0.3" />
        <circle cx="280" cy="220" r="8" fill="rgb(var(--warm))" opacity="0.5" />

        {/* Soft shield blob */}
        <path
          d="M 160 50 Q 220 50 240 80 Q 260 120 250 180 Q 230 250 160 280 Q 90 250 70 180 Q 60 120 80 80 Q 100 50 160 50 Z"
          fill="rgb(var(--primary))"
          opacity="0.08"
        />
        <path
          d="M 160 70 Q 210 70 226 96 Q 242 130 234 180 Q 218 240 160 264 Q 102 240 86 180 Q 78 130 94 96 Q 110 70 160 70 Z"
          fill="rgb(var(--primary))"
        />

        {/* Checkmark */}
        <path
          d="M 120 165 L 150 195 L 200 140"
          stroke="white"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

function WarningIllustration() {
  return (
    <div className="relative mx-auto aspect-square max-w-md">
      <div className="absolute inset-8 rounded-[3rem] bg-gradient-to-br from-warm/40 to-secondary blur-2xl" />
      <svg
        viewBox="0 0 320 320"
        className="relative h-full w-full"
        aria-hidden
      >
        <circle cx="280" cy="80" r="6" fill="rgb(var(--primary))" opacity="0.4" />
        <circle cx="50" cy="140" r="4" fill="rgb(var(--warm))" opacity="0.7" />
        <circle cx="60" cy="260" r="8" fill="rgb(var(--primary))" opacity="0.2" />

        {/* Envelope (hooked) */}
        <g transform="translate(160 160)">
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
          {/* Hook */}
          <path
            d="M 0 -50 L 0 -90 Q 0 -110 -16 -110 Q -32 -110 -32 -94"
            fill="none"
            stroke="rgb(var(--foreground))"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        {/* Big warning bubble — peach for warmth, not aggressive red */}
        <g transform="translate(232 86)">
          <circle
            r="44"
            fill="rgb(var(--warm))"
            stroke="rgb(var(--foreground))"
            strokeWidth="3"
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="44"
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
      <div className="absolute inset-8 rounded-[3rem] bg-gradient-to-br from-secondary to-warm/30 blur-2xl" />
      <svg viewBox="0 0 320 320" className="relative h-full w-full" aria-hidden>
        <circle cx="50" cy="60" r="6" fill="rgb(var(--warm))" opacity="0.7" />
        <circle cx="280" cy="240" r="4" fill="rgb(var(--primary))" opacity="0.4" />

        {/* Two phone-card silhouettes overlapping, joined by a dotted line */}
        <g>
          <rect
            x="40"
            y="80"
            width="120"
            height="200"
            rx="20"
            fill="rgb(var(--primary))"
          />
          <rect
            x="62"
            y="108"
            width="76"
            height="8"
            rx="4"
            fill="white"
            opacity="0.5"
          />
          <rect
            x="62"
            y="128"
            width="56"
            height="6"
            rx="3"
            fill="white"
            opacity="0.35"
          />
          <circle cx="100" cy="170" r="22" fill="white" opacity="0.85" />
          <text
            x="100"
            y="178"
            textAnchor="middle"
            fontSize="28"
            fontWeight="700"
            fontFamily="-apple-system, system-ui"
            fill="rgb(var(--primary))"
          >
            ♥
          </text>
        </g>

        <g>
          <rect
            x="160"
            y="40"
            width="120"
            height="200"
            rx="20"
            fill="white"
            stroke="rgb(var(--foreground))"
            strokeWidth="3"
          />
          <rect x="182" y="68" width="76" height="8" rx="4" fill="rgb(var(--foreground))" opacity="0.6" />
          <rect x="182" y="88" width="56" height="6" rx="3" fill="rgb(var(--foreground))" opacity="0.4" />
          <circle cx="220" cy="130" r="22" fill="rgb(var(--warm))" />
          <text
            x="220"
            y="138"
            textAnchor="middle"
            fontSize="22"
            fontWeight="800"
            fontFamily="-apple-system, system-ui"
            fill="rgb(var(--foreground))"
          >
            ✓
          </text>
        </g>

        {/* Connecting dotted line */}
        <path
          d="M 130 220 Q 160 270 220 240"
          fill="none"
          stroke="rgb(var(--primary))"
          strokeWidth="3"
          strokeDasharray="2 7"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
