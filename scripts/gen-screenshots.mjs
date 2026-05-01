import sharp from "sharp";
import { writeFileSync, readFileSync } from "node:fs";

const SKY = "#38bdf8";
const SKY_DIM = "#7dd3fc";
const INK = "#e7ecf3";
const MUTED = "#9aa6b2";
const MUTED2 = "#6b7280";
const BG = "#0b0f17";
const SURFACE = "#111827";
const SURFACE2 = "#0f1623";
const BORDER = "rgba(255,255,255,0.08)";
const DANGER = "#f87171";
const SUCCESS = "#4ade80";

const fishSvg = readFileSync(
  "/Users/ianbarrie/gonephisin/apps/extension/public/fish.svg",
  "utf8",
).replace(/currentColor/g, SKY);
const fishInner = fishSvg
  .replace(/<\?xml.*?\?>/, "")
  .replace(/<svg[^>]*>/, "")
  .replace(/<\/svg>$/, "");

function bg(w, h) {
  // Multi-radial sky-glow mimicking the marketing background
  return `
    <defs>
      <radialGradient id="g1" cx="20%" cy="0%" r="65%">
        <stop offset="0%" stop-color="${SKY}" stop-opacity="0.16"/>
        <stop offset="100%" stop-color="${SKY}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="g2" cx="85%" cy="20%" r="55%">
        <stop offset="0%" stop-color="${SKY}" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="${SKY}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="g3" cx="50%" cy="100%" r="70%">
        <stop offset="0%" stop-color="${SKY}" stop-opacity="0.07"/>
        <stop offset="100%" stop-color="${SKY}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="ink-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${SKY}"/>
        <stop offset="100%" stop-color="${SKY_DIM}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="${BG}"/>
    <rect width="${w}" height="${h}" fill="url(#g1)"/>
    <rect width="${w}" height="${h}" fill="url(#g2)"/>
    <rect width="${w}" height="${h}" fill="url(#g3)"/>
  `;
}

function fishMark(x, y, size) {
  return `<g transform="translate(${x}, ${y}) scale(${size / 330})">${fishInner}</g>`;
}

function chrome(w, h) {
  // Browser chrome at the top
  const tabH = 36;
  return `
    <rect x="0" y="0" width="${w}" height="${tabH}" fill="#000" fill-opacity="0.35"/>
    <circle cx="20" cy="${tabH / 2}" r="6" fill="#ff5f57"/>
    <circle cx="40" cy="${tabH / 2}" r="6" fill="#febc2e"/>
    <circle cx="60" cy="${tabH / 2}" r="6" fill="#28c840"/>
    <rect x="${w / 2 - 200}" y="${tabH / 2 - 12}" width="400" height="24" rx="12" fill="rgba(255,255,255,0.08)"/>
    <text x="${w / 2}" y="${tabH / 2 + 4}" text-anchor="middle" fill="${MUTED}" font-family="Geist Mono, ui-monospace, monospace" font-size="12">mail.google.com</text>
  `;
}

function topbar(w, label = "Gone Phishin'") {
  // Sticky topbar like the dashboard
  const h = 64;
  return `
    <g transform="translate(0, 36)">
      <rect width="${w}" height="${h}" fill="${SURFACE}" fill-opacity="0.6"/>
      <line x1="0" y1="${h}" x2="${w}" y2="${h}" stroke="${BORDER}" stroke-width="1"/>
      ${fishMark(28, 16, 32)}
      <text x="76" y="40" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="18" font-weight="600">${label}</text>
      <circle cx="${w - 50}" cy="32" r="14" fill="${SKY}" fill-opacity="0.16"/>
      <text x="${w - 50}" y="37" text-anchor="middle" fill="${SKY}" font-family="Geist, system-ui, sans-serif" font-size="12" font-weight="600">Y</text>
    </g>
  `;
}

function caption(text, w, h, sub) {
  // Bottom-centered headline + subhead
  return `
    <g transform="translate(${w / 2}, ${h - 96})">
      <text x="0" y="0" text-anchor="middle" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="34" font-weight="700">${text}</text>
      ${sub ? `<text x="0" y="34" text-anchor="middle" fill="${MUTED}" font-family="Geist, system-ui, sans-serif" font-size="18">${sub}</text>` : ""}
    </g>
  `;
}

// SHOT 1 — Inbox with phishing badge on a row
function shot1() {
  const w = 1280, h = 800;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${bg(w, h)}
    ${chrome(w, h)}
    <g transform="translate(160, 100)">
      ${[
        { from: "Bank of America", subj: "Action required — verify your account", t: "9:14am", flag: null, safe: true },
        { from: "[Bank of Amer1ca]", subj: "Confirm your debit card · click to secure", t: "8:52am", flag: "PHISHING", safe: false },
        { from: "Linda (your sister)", subj: "Photos from the trip!", t: "7:18am", flag: null, safe: true },
        { from: "Comcast Billing", subj: "Update payment method on file", t: "Yesterday", flag: "SUSPICIOUS", safe: false, warn: true },
        { from: "Costco Member Services", subj: "April rebate processed", t: "Yesterday", flag: null, safe: true },
      ].map((m, i) => {
        const y = i * 110;
        const dangerBg = m.flag === "PHISHING" ? DANGER : (m.flag === "SUSPICIOUS" ? "#fbbf24" : null);
        return `
          <g transform="translate(0, ${y})">
            <rect width="960" height="92" rx="14" fill="${SURFACE}" fill-opacity="0.85" stroke="${BORDER}" stroke-width="1"/>
            <circle cx="38" cy="46" r="20" fill="${SKY}" fill-opacity="0.16"/>
            <text x="38" y="52" text-anchor="middle" fill="${SKY}" font-family="Geist, system-ui, sans-serif" font-size="14" font-weight="700">${m.from.charAt(m.from.startsWith("[") ? 1 : 0).toUpperCase()}</text>
            <text x="78" y="40" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="16" font-weight="${m.flag ? 700 : 600}">${m.from}</text>
            <text x="78" y="64" fill="${MUTED}" font-family="Geist, system-ui, sans-serif" font-size="14">${m.subj}</text>
            <text x="900" y="40" text-anchor="end" fill="${MUTED2}" font-family="Geist Mono, ui-monospace, monospace" font-size="12">${m.t}</text>
            ${m.flag ? `
              <g transform="translate(840, 52)">
                <rect width="100" height="22" rx="6" fill="${dangerBg}" fill-opacity="0.18" stroke="${dangerBg}" stroke-opacity="0.5" stroke-width="1"/>
                <text x="50" y="15" text-anchor="middle" fill="${dangerBg}" font-family="Geist Mono, ui-monospace, monospace" font-size="10" font-weight="700">${m.flag}</text>
              </g>
            ` : ""}
          </g>
        `;
      }).join("")}
    </g>
    ${caption("Sees the trap before you click.", w, h, "Gmail and Outlook, every link checked.")}
  </svg>`;
}

// SHOT 2 — Click-time warning modal
function shot2() {
  const w = 1280, h = 800;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${bg(w, h)}
    <rect width="${w}" height="${h}" fill="#000" fill-opacity="0.55"/>
    <g transform="translate(${w / 2 - 280}, ${h / 2 - 200})">
      <rect width="560" height="380" rx="20" fill="${SURFACE}" stroke="${SKY}" stroke-opacity="0.4" stroke-width="2"/>
      <rect width="560" height="6" rx="3" fill="${DANGER}"/>
      <g transform="translate(40, 60)">
        <circle cx="32" cy="32" r="32" fill="${DANGER}" fill-opacity="0.2"/>
        <text x="32" y="46" text-anchor="middle" fill="${DANGER}" font-family="Geist, system-ui, sans-serif" font-size="40" font-weight="700">!</text>
      </g>
      <g transform="translate(120, 70)">
        <text x="0" y="22" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="24" font-weight="700">Dangerous link</text>
        <text x="0" y="50" fill="${MUTED}" font-family="Geist, system-ui, sans-serif" font-size="15">This page is reported as phishing or malware.</text>
        <text x="0" y="72" fill="${MUTED}" font-family="Geist, system-ui, sans-serif" font-size="15">We strongly suggest going back.</text>
      </g>
      <g transform="translate(40, 200)">
        <rect width="480" height="44" rx="8" fill="${SURFACE2}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="28" fill="${INK}" font-family="Geist Mono, ui-monospace, monospace" font-size="13">bank-of-amer1ca-secure.support</text>
      </g>
      <g transform="translate(40, 280)">
        <rect width="220" height="48" rx="10" fill="${SKY}"/>
        <text x="110" y="30" text-anchor="middle" fill="${BG}" font-family="Geist, system-ui, sans-serif" font-size="15" font-weight="700">Go back safely</text>
      </g>
      <text x="320" y="310" fill="${MUTED2}" font-family="Geist, system-ui, sans-serif" font-size="13" text-decoration="underline">Continue anyway</text>
    </g>
    ${caption("Stops you with a plain-English warning.", w, h, "No red walls. Just one clear button to safety.")}
  </svg>`;
}

// SHOT 3 — Caregiver pairing dashboard
function shot3() {
  const w = 1280, h = 800;
  const code = ["4","9","2","7","1","8"];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${bg(w, h)}
    ${topbar(w, "Gone Phishin'")}
    <g transform="translate(120, 140)">
      <text x="0" y="0" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="34" font-weight="700">Mom's laptop</text>
      <text x="0" y="32" fill="${MUTED}" font-family="Geist, system-ui, sans-serif" font-size="16">Family circle · 12 events on record</text>
      <g transform="translate(900, -10)">
        <rect width="120" height="32" rx="16" fill="${SUCCESS}" fill-opacity="0.16"/>
        <circle cx="20" cy="16" r="5" fill="${SUCCESS}"/>
        <text x="36" y="21" fill="${SUCCESS}" font-family="Geist, system-ui, sans-serif" font-size="13" font-weight="600">Active</text>
      </g>
    </g>
    <g transform="translate(120, 220)">
      <rect width="560" height="380" rx="18" fill="${SURFACE}" fill-opacity="0.85" stroke="${BORDER}" stroke-width="1"/>
      <text x="32" y="50" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="20" font-weight="600">Recent activity</text>
      ${["Phishing or malware page · Warning shown · 9:14am",
         "Look-alike domain · Went back safely · Yesterday",
         "Suspicious IP-only link · Warning shown · 2d ago",
         "Phishing or malware page · Went back safely · 3d ago",
         "Suspicious link · Warning shown · 4d ago"]
        .map((row, i) => `
          <g transform="translate(32, ${90 + i * 56})">
            <circle cx="14" cy="14" r="14" fill="${DANGER}" fill-opacity="0.2"/>
            <text x="14" y="19" text-anchor="middle" fill="${DANGER}" font-family="Geist, system-ui, sans-serif" font-size="14" font-weight="700">!</text>
            <text x="40" y="20" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="14">${row}</text>
          </g>
        `).join("")}
    </g>
    <g transform="translate(720, 220)">
      <rect width="440" height="380" rx="18" fill="${SURFACE}" fill-opacity="0.85" stroke="${BORDER}" stroke-width="1"/>
      <text x="32" y="50" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="20" font-weight="600">Pairing</text>
      <text x="32" y="76" fill="${MUTED}" font-family="Geist, system-ui, sans-serif" font-size="14">Read this code to your family member.</text>
      <g transform="translate(32, 110)">
        <text x="0" y="14" fill="${MUTED2}" font-family="Geist Mono, ui-monospace, monospace" font-size="11" letter-spacing="2">PAIRING CODE</text>
        <g transform="translate(0, 30)">
          ${code.map((c, i) => {
            const x = i * 56 + (i >= 3 ? 32 : 0);
            return `
              <rect x="${x}" y="0" width="48" height="64" rx="10" fill="${SURFACE2}" stroke="${SKY}" stroke-opacity="0.4" stroke-width="1"/>
              <text x="${x + 24}" y="42" text-anchor="middle" fill="${SKY}" font-family="Geist Mono, ui-monospace, monospace" font-size="28" font-weight="700">${c}</text>
            `;
          }).join("")}
          <text x="184" y="40" text-anchor="middle" fill="${SKY}" font-family="Geist Mono, ui-monospace, monospace" font-size="28">—</text>
        </g>
        <text x="0" y="120" fill="${MUTED}" font-family="Geist, system-ui, sans-serif" font-size="13">Expires 9:48am</text>
      </g>
      <g transform="translate(32, 280)">
        <rect width="180" height="46" rx="10" fill="${SKY}"/>
        <text x="90" y="29" text-anchor="middle" fill="${BG}" font-family="Geist, system-ui, sans-serif" font-size="14" font-weight="700">New code</text>
      </g>
    </g>
    ${caption("Set it up for someone you love.", w, h, "Read a 6-digit code over the phone — no email links.")}
  </svg>`;
}

// SHOT 4 — Privacy/permissions reassurance
function shot4() {
  const w = 1280, h = 800;
  const items = [
    { ok: true,  text: "Reads only the URLs already shown on Gmail / Outlook" },
    { ok: false, text: "Reads your email contents, subjects, or attachments" },
    { ok: false, text: "Tracks browsing history" },
    { ok: false, text: "Sells data, shows ads, or trains AI on your data" },
    { ok: true,  text: "Caches verdicts locally so we don't re-scan known links" },
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${bg(w, h)}
    <g transform="translate(${w / 2 - 350}, 120)">
      ${fishMark(280, 0, 110)}
      <text x="350" y="200" text-anchor="middle" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="42" font-weight="700">Your inbox stays yours.</text>
      <text x="350" y="240" text-anchor="middle" fill="${MUTED}" font-family="Geist, system-ui, sans-serif" font-size="18">We look at link URLs. That's it.</text>
    </g>
    <g transform="translate(${w / 2 - 320}, 380)">
      ${items.map((it, i) => `
        <g transform="translate(0, ${i * 56})">
          <rect width="640" height="48" rx="12" fill="${SURFACE}" fill-opacity="0.85" stroke="${BORDER}" stroke-width="1"/>
          ${it.ok
            ? `<g transform="translate(20, 13)"><circle cx="11" cy="11" r="11" fill="${SUCCESS}" fill-opacity="0.2"/><path d="M 6 11 L 10 15 L 16 7" stroke="${SUCCESS}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`
            : `<g transform="translate(20, 13)"><circle cx="11" cy="11" r="11" fill="${DANGER}" fill-opacity="0.2"/><path d="M 7 7 L 15 15 M 15 7 L 7 15" stroke="${DANGER}" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`
          }
          <text x="64" y="30" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="15">${it.text}</text>
        </g>
      `).join("")}
    </g>
  </svg>`;
}

// SHOT 5 — Hover preview tooltip on a sketchy link
function shot5() {
  const w = 1280, h = 800;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${bg(w, h)}
    ${chrome(w, h)}
    <g transform="translate(160, 130)">
      <rect width="960" height="500" rx="18" fill="${SURFACE}" fill-opacity="0.85" stroke="${BORDER}" stroke-width="1"/>
      <text x="40" y="50" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="20" font-weight="600">Action required: verify your account</text>
      <text x="40" y="78" fill="${MUTED}" font-family="Geist, system-ui, sans-serif" font-size="14">From: Bank of Amer1ca Security &lt;security@bofa-secure.support&gt;</text>
      <line x1="40" y1="100" x2="920" y2="100" stroke="${BORDER}"/>
      <g transform="translate(40, 130)">
        <text x="0" y="0" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="14">Dear customer,</text>
        <text x="0" y="32" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="14">We've detected unusual activity on your account. To protect your funds,</text>
        <text x="0" y="52" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="14">please log in and confirm your identity using the secure portal below.</text>
        <g transform="translate(0, 90)">
          <rect width="280" height="44" rx="6" fill="${DANGER}" fill-opacity="0.18" stroke="${DANGER}" stroke-opacity="0.5" stroke-width="1"/>
          <text x="20" y="29" fill="${DANGER}" font-family="Geist, system-ui, sans-serif" font-size="14" font-weight="600" text-decoration="underline">Verify my account →</text>
          <g transform="translate(280, 12)">
            <rect width="20" height="20" rx="10" fill="${DANGER}" fill-opacity="0.2"/>
            <text x="10" y="15" text-anchor="middle" fill="${DANGER}" font-family="Geist, system-ui, sans-serif" font-size="13" font-weight="700">!</text>
          </g>
        </g>
        <g transform="translate(310, 144)">
          <path d="M 0 -10 L 10 0 L 0 10 Z" fill="${SURFACE2}"/>
          <rect x="10" y="-58" width="380" height="120" rx="14" fill="${SURFACE2}" stroke="${DANGER}" stroke-opacity="0.6" stroke-width="2"/>
          <text x="34" y="-30" fill="${DANGER}" font-family="Geist Mono, ui-monospace, monospace" font-size="11" letter-spacing="1.5" font-weight="700">DANGEROUS LINK</text>
          <text x="34" y="-2" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="14" font-weight="600">Reported phishing page</text>
          <text x="34" y="22" fill="${MUTED}" font-family="Geist Mono, ui-monospace, monospace" font-size="12">bofa-secure.support</text>
          <text x="34" y="48" fill="${MUTED}" font-family="Geist, system-ui, sans-serif" font-size="12">Click-through is blocked. Hover for detail.</text>
        </g>
      </g>
    </g>
    ${caption("Hover, and we'll explain what's wrong.", w, h, "No surprise red walls — just a quiet, clear callout.")}
  </svg>`;
}

const shots = [
  { name: "01-inbox-flagged.png", svg: shot1() },
  { name: "02-warning-modal.png", svg: shot2() },
  { name: "03-caregiver-pairing.png", svg: shot3() },
  { name: "04-privacy-checklist.png", svg: shot4() },
  { name: "05-hover-tooltip.png", svg: shot5() },
];

for (const s of shots) {
  const png = await sharp(Buffer.from(s.svg)).png().toBuffer();
  writeFileSync(`/Users/ianbarrie/gonephisin/docs/store/screenshots/${s.name}`, png);
  console.log(`wrote ${s.name} (${(png.length / 1024).toFixed(1)} KB)`);
}

// Small promo tile (440×280)
const smallPromo = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="280" viewBox="0 0 440 280">
  ${bg(440, 280)}
  ${fishMark(28, 90, 100)}
  <g transform="translate(150, 88)">
    <text x="0" y="0" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="22" font-weight="700">Gone Phishin'</text>
    <text x="0" y="32" fill="${SKY}" font-family="Geist, system-ui, sans-serif" font-size="18" font-weight="600">Phishing, stopped at the door.</text>
    <text x="0" y="62" fill="${MUTED}" font-family="Geist, system-ui, sans-serif" font-size="13">Free protection for Gmail &amp; Outlook,</text>
    <text x="0" y="82" fill="${MUTED}" font-family="Geist, system-ui, sans-serif" font-size="13">built for parents and grandparents.</text>
    <g transform="translate(0, 110)">
      <rect width="120" height="32" rx="16" fill="${SKY}"/>
      <text x="60" y="20" text-anchor="middle" fill="${BG}" font-family="Geist, system-ui, sans-serif" font-size="13" font-weight="700">Add to Chrome</text>
    </g>
  </g>
</svg>`;
writeFileSync(
  "/Users/ianbarrie/gonephisin/docs/store/screenshots/promo-small-440x280.png",
  await sharp(Buffer.from(smallPromo)).png().toBuffer(),
);
console.log("wrote promo-small-440x280.png");

// Marquee promo (1400×560)
const marquee = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="560" viewBox="0 0 1400 560">
  ${bg(1400, 560)}
  ${fishMark(80, 200, 200)}
  <g transform="translate(340, 180)">
    <text x="0" y="0" fill="${MUTED2}" font-family="Geist Mono, ui-monospace, monospace" font-size="14" letter-spacing="3">FREE · GMAIL · OUTLOOK</text>
    <text x="0" y="62" fill="${INK}" font-family="Geist, system-ui, sans-serif" font-size="62" font-weight="700">Phishing scams,</text>
    <text x="0" y="124" fill="${SKY}" font-family="Geist, system-ui, sans-serif" font-size="62" font-weight="700" font-style="italic">stopped at the door.</text>
    <text x="0" y="178" fill="${MUTED}" font-family="Geist, system-ui, sans-serif" font-size="22">Catches dangerous links before your parents click them.</text>
    <g transform="translate(0, 218)">
      <rect width="220" height="56" rx="28" fill="${SKY}"/>
      <text x="110" y="35" text-anchor="middle" fill="${BG}" font-family="Geist, system-ui, sans-serif" font-size="17" font-weight="700">Add to Chrome — Free</text>
    </g>
  </g>
</svg>`;
writeFileSync(
  "/Users/ianbarrie/gonephisin/docs/store/screenshots/promo-marquee-1400x560.png",
  await sharp(Buffer.from(marquee)).png().toBuffer(),
);
console.log("wrote promo-marquee-1400x560.png");
