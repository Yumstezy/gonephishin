import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

const SKY = "#38bdf8";
const BG = "#0b0f17";

const fishSvg = readFileSync(
  "/Users/ianbarrie/gonephisin/apps/web/public/fish.svg",
  "utf8",
)
  .replace(/<\?xml.*?\?>/, "")
  .replace(/<svg[^>]*>/, "")
  .replace(/<\/svg>$/, "")
  .replace(/currentColor/g, SKY);

function wrap(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="${BG}"/>
    <g transform="translate(${size * 0.11}, ${size * 0.11}) scale(${(size * 0.78) / 330})">
      ${fishSvg}
    </g>
  </svg>`;
}

const out = "/Users/ianbarrie/gonephisin/apps/web/app";

// 1) SVG favicon (modern browsers prefer this; crisp at every size).
//    Use a small viewBox-perfect version so it renders cleanly in tab bars.
writeFileSync(`${out}/icon.svg`, wrap(64));
console.log("wrote app/icon.svg");

// 2) PNG fallback at 32×32 for older browsers + the favicon spot.
const png32 = await sharp(Buffer.from(wrap(32)))
  .flatten({ background: BG })
  .png()
  .toBuffer();
writeFileSync(`${out}/icon.png`, png32);
console.log(`wrote app/icon.png (${png32.length} bytes)`);

// 3) Apple touch icon for iOS home-screen pinning. 180×180.
const apple = await sharp(Buffer.from(wrap(180)))
  .flatten({ background: BG })
  .png()
  .toBuffer();
writeFileSync(`${out}/apple-icon.png`, apple);
console.log(`wrote app/apple-icon.png (${apple.length} bytes)`);
