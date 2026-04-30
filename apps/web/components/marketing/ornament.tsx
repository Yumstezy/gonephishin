/**
 * Editorial ornaments — small decorative SVGs used as section markers and
 * dividers. All inherit currentColor so they tint with the surrounding text.
 */

export function FleuronTriangle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <circle cx="6" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="26" cy="8" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CompassStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth="0.7" fill="none">
        <circle cx="20" cy="20" r="14" />
        <path d="M20 6 L22 20 L20 34 L18 20 Z" fill="currentColor" />
        <path d="M6 20 L20 22 L34 20 L20 18 Z" fill="currentColor" opacity="0.6" />
      </g>
    </svg>
  );
}

export function WaveRule({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 8"
      preserveAspectRatio="none"
      aria-hidden
      className={className}
    >
      <path
        d="M0 4 Q 12.5 0 25 4 T 50 4 T 75 4 T 100 4 T 125 4 T 150 4 T 175 4 T 200 4"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  );
}

export function FishOrnament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" aria-hidden className={className}>
      <path
        d="M2 15 Q 12 5 28 12 L 38 8 Q 50 4 56 14 Q 50 24 38 22 L 28 18 Q 12 25 2 15 Z M 56 14 L 56 18 M 38 14 a 1 1 0 1 1 0.1 0"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}
