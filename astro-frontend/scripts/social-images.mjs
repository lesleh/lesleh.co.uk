// Renders each post's preview image, because Slack and other sites do not show an SVG preview.
// A post names its image in frontmatter (`image: ./folder/name.png`). The SVG with the same name is the source.
// Run it after an illustration changes: node scripts/social-images.mjs
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN = 40;
const PAPER = "#fbf1e4";
const FONT = "Nunito Sans, Helvetica Neue, Helvetica, Arial, sans-serif";

const blog = fileURLToPath(new URL("../src/content/blog", import.meta.url));
const posts = readdirSync(blog, { recursive: true }).filter((file) => file.endsWith(".mdx"));

for (const post of posts) {
  const path = resolve(blog, post);
  const [, image] = readFileSync(path, "utf8").match(/^image:\s*(\S+\.png)\s*$/m) ?? [];
  if (!image) {
    console.log(`${post} names no image, so it uses the default for the site`);
    continue;
  }
  const png = resolve(dirname(path), image);
  // The renderer does not read CSS variables, so each colour becomes its light fallback.
  const drawing = readFileSync(png.replace(/\.png$/, ".svg"), "utf8")
    .replace(/var\(--[a-z-]+,\s*([^)]+)\)/g, "$1")
    .replace(/ width="100%"/, ` font-family="${FONT}"`)
    .replace(/ style="[^"]*"/, "");
  const picture = await sharp(Buffer.from(drawing), { density: 300 })
    .resize(WIDTH - 2 * MARGIN, HEIGHT - 2 * MARGIN, { fit: "inside" })
    .toBuffer();
  await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: PAPER } })
    .composite([{ input: picture }])
    .png({ compressionLevel: 9, palette: true })
    .toFile(png);
  console.log(`wrote ${png}`);
}
