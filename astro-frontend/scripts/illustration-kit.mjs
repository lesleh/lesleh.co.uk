// Shared by the <post-slug>-illustrations.mjs scripts: the palette, the <svg> root and the style checks.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// The palette lives in global.css, so each colour has one home.
const css = readFileSync(new URL("../src/stylesheets/global.css", import.meta.url), "utf8");
const palette = Object.fromEntries(
  [...css.matchAll(/--illo-([a-z-]+):\s*light-dark\((#[0-9a-f]+),\s*(#[0-9a-f]+)\)/gi)].map(
    ([, name, light, dark]) => [name, { light, dark }],
  ),
);

// Fixed colours are the same in both themes. They show a real colour from a post, and carry no text.
const fixed = Object.fromEntries(
  [...css.matchAll(/--illo-(fixed-[a-z-]+):\s*(#[0-9a-f]+);/gi)].map(([, name, hex]) => [name, hex]),
);

const luminance = (hex) => {
  const h = hex.length === 4 ? [...hex.slice(1)].map((c) => c + c).join("") : hex.slice(1);
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// Text is ink on any fill, or accent on paper and surface, so those pairs must reach WCAG AA.
const TEXT_CONTRAST = 4.5;
for (const theme of ["light", "dark"]) {
  const pairs = [
    ...Object.keys(palette)
      .filter((name) => name !== "ink" && name !== "accent")
      .map((name) => ["ink", name]),
    ["accent", "paper"],
    ["accent", "surface"],
  ];
  for (const [text, fill] of pairs) {
    const ratio = contrast(palette[text][theme], palette[fill][theme]);
    if (ratio < TEXT_CONTRAST) {
      throw new Error(
        `--illo-${text} on --illo-${fill} is ${ratio.toFixed(2)}:1 in the ${theme} theme. It needs ${TEXT_CONTRAST}:1.`,
      );
    }
  }
}

// A palette colour, with the light value as the fallback for a file opened on its own.
export const colour = (name) => {
  const fallback = fixed[name] ?? palette[name]?.light;
  if (!fallback) throw new Error(`--illo-${name} is not in global.css`);
  return `var(--illo-${name}, ${fallback})`;
};

export const PAPER = colour("paper");
export const INK = colour("ink");
export const SURFACE = colour("surface");
export const SHADE = colour("shade");
export const SHADE_STRONG = colour("shade-strong");
export const BLUE = colour("blue");
export const GOLD = colour("gold");
export const PINK = colour("pink");
export const ACCENT = colour("accent");

// The panel's padding leaves 94% of a 345px phone column, so this keeps text at about 10px.
const VIEWBOX_PER_FONT = 32;

// The <svg> root with the paper panel. Throws when the body breaks a style rule.
export const svg = ({ w, h, label, maxWidth, body }) => {
  const fail = (problem) => {
    throw new Error(`"${label.slice(0, 40)}...": ${problem}`);
  };
  const smallest = w / VIEWBOX_PER_FONT;
  for (const [, size] of body.matchAll(/font-size="([\d.]+)"/g)) {
    if (Number(size) < smallest) {
      fail(`font-size ${size} is under ${smallest}, the smallest for a viewBox ${w} wide`);
    }
  }
  for (const [, attribute, value] of body.matchAll(/\b(fill|stroke)="([^"]*)"/g)) {
    if (value !== "none" && !value.startsWith("var(--illo-")) {
      fail(`${attribute}="${value}" is not a palette colour`);
    }
  }
  if (body.includes("<style")) fail("a <style> block applies to the whole page");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${label}" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:2rem auto;padding:3%;box-sizing:border-box;border-radius:12px;background:${PAPER}${maxWidth ? `;max-width:${maxWidth}` : ""}">
${body.trim()}
</svg>
`;
};

// Writes each drawing into the post's folder. `folder` is a URL next to the post's .mdx file.
export const write = (folder, drawings) => {
  const out = fileURLToPath(folder);
  mkdirSync(out, { recursive: true });
  for (const [name, content] of Object.entries(drawings)) {
    writeFileSync(`${out}/${name}`, content);
  }
  console.log(`wrote ${Object.keys(drawings).length} files to ${out}`);
};
