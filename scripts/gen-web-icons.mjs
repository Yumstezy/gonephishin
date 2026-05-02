import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SOURCE = "/Users/ianbarrie/gonephisin/apps/web/public/brand-fish.png";
const OUT = "/Users/ianbarrie/gonephisin/apps/web/public";

// Source is RGBA with transparent background. Trim transparent edges
// (sharp.trim() defaults to the top-left pixel value, which here is
// fully transparent) so the fish fills the canvas.
const trimmed = await sharp(SOURCE).trim().toBuffer();
const meta = await sharp(trimmed).metadata();
console.log(`trimmed to ${meta.width}×${meta.height}`);

// Make a square version with the fish centered + a little padding.
async function makeSquare(size, bg = "#ffffff") {
  const padPct = 0.08;
  const fishSize = Math.round(size * (1 - padPct * 2));
  const fish = await sharp(trimmed)
    .resize(fishSize, fishSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: bg,
    },
  })
    .composite([{ input: fish, gravity: "center" }])
    .flatten({ background: bg })
    .removeAlpha()
    .png()
    .toBuffer();
}

const png32 = await makeSquare(32);
writeFileSync(`${OUT}/icon.png`, png32);
console.log(`icon.png ${png32.length} bytes`);

const apple = await makeSquare(180);
writeFileSync(`${OUT}/apple-icon.png`, apple);
console.log(`apple-icon.png ${apple.length} bytes`);

// SVG that embeds a 512×512 PNG of the trimmed fish on white.
const big = await makeSquare(512);
const b64 = big.toString("base64");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><image width="64" height="64" href="data:image/png;base64,${b64}"/></svg>`;
writeFileSync(`${OUT}/icon.svg`, svg);
console.log(`icon.svg ${svg.length} bytes`);

// Also rebuild the EXTENSION icons from the new brand. Web Store still needs
// no-alpha 24-bit PNG, white BG keeps the brand reading the same in the
// store as on the site.
for (const size of [16, 32, 48, 128]) {
  const png = await makeSquare(size);
  writeFileSync(
    `/Users/ianbarrie/gonephisin/apps/extension/public/icons/icon-${size}.png`,
    png,
  );
  console.log(`extension icon-${size}.png ${png.length} bytes`);
}
