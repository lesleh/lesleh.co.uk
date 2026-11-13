// Generates favicon.ico and apple-touch-icon.png from public/favicon.svg.
// Run it again after a change to the SVG: node scripts/generate-icons.mjs
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const publicDir = new URL("../public/", import.meta.url);
const svg = await readFile(new URL("favicon.svg", publicDir));

const render = (size) =>
  sharp(svg, { density: (72 * size) / 36 })
    .resize(size, size)
    .png()
    .toBuffer();

// iOS shows transparent pixels as black, so the touch icon gets a white
// background and a margin around the logo.
const touchSize = 180;
const logoSize = 132;
const margin = (touchSize - logoSize) / 2;
const touchIcon = await sharp({
  create: {
    width: touchSize,
    height: touchSize,
    channels: 4,
    background: "#fff",
  },
})
  .composite([{ input: await render(logoSize), top: margin, left: margin }])
  .flatten({ background: "#fff" })
  .png()
  .toBuffer();
await writeFile(new URL("apple-touch-icon.png", publicDir), touchIcon);

// An ICO file is a 6 byte header, a 16 byte entry for each image, then the
// images. Each image is a PNG.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(render));
const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);

let offset = header.length + 16 * images.length;
const entries = images.map((image, index) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(sizes[index], 0);
  entry.writeUInt8(sizes[index], 1);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(image.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += image.length;
  return entry;
});
await writeFile(
  new URL("favicon.ico", publicDir),
  Buffer.concat([header, ...entries, ...images]),
);
