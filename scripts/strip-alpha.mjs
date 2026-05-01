import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const dir = "/Users/ianbarrie/gonephisin/docs/store/screenshots";
const files = readdirSync(dir).filter((f) => f.endsWith(".png"));

for (const name of files) {
  const path = join(dir, name);
  // Flatten onto the dark BG to drop the alpha channel cleanly.
  const png = await sharp(path)
    .flatten({ background: "#0b0f17" })
    .png({ palette: false })
    .toBuffer();
  // sharp auto-detects 8-bit RGB output when alpha is flattened.
  await sharp(png).toFile(path);
  const before = statSync(path).size;
  console.log(`${name} → ${(before / 1024).toFixed(1)} KB`);
}
