import sharp from "sharp";
import { writeFileSync } from "node:fs";

// Sky-tinted fish icon: filled background + sky-blue currentColor fish.
// Use the same fish path but with explicit fill, padded into a square.
const SKY = "#38bdf8";
const BG = "#0b0f17"; // dark slate matching the marketing site

const sizes = [16, 32, 48, 128];
// Wrap fish.svg with explicit color + dark background.
const fishSvg = await import("node:fs").then((fs) =>
  fs.readFileSync("/Users/ianbarrie/gonephisin/apps/extension/public/fish.svg", "utf8"),
);
// Replace currentColor with sky.
const colored = fishSvg.replace(/currentColor/g, SKY);

for (const size of sizes) {
  // Pad fish to ~78% of canvas, centered.
  const wrapper = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="${BG}"/>
    <g transform="translate(${size * 0.11}, ${size * 0.11}) scale(${(size * 0.78) / 330})">
      ${colored.replace(/<\?xml.*?\?>/, "").replace(/<svg[^>]*>/, "").replace(/<\/svg>$/, "")}
    </g>
  </svg>`;
  const png = await sharp(Buffer.from(wrapper)).png().toBuffer();
  writeFileSync(
    `/Users/ianbarrie/gonephisin/apps/extension/public/icons/icon-${size}.png`,
    png,
  );
  console.log(`wrote icon-${size}.png (${png.length} bytes)`);
}
