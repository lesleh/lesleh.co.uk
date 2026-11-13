// Generates the applying-dark-mode-in-css post illustrations. Edit this, not the SVGs.
// Run from astro-frontend: node scripts/applying-dark-mode-in-css-illustrations.mjs
import { ACCENT, BLUE, GOLD, INK, SHADE, SURFACE, colour, svg, write } from "./illustration-kit.mjs";

// In this post, blue is Safari and gold is Firefox. Pink is not used.
// The fixed colours are the three hex values in the post's colour scheme.
const WHITE = colour("fixed-white");
const NIGHT = colour("fixed-night");
const CRIMSON = colour("fixed-crimson");

const box = (x, y, w, h, fill, rx = 12) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;

// A small web page: a heading bar in the primary colour, then lines of text.
const page = (x, y, w, h, { background, text, primary }) => {
  const count = Math.floor((h - 30) / 12);
  const lines = Array.from({ length: count }, (_, i) => {
    const width = i === count - 1 ? (w - 24) * 0.6 : w - 24;
    return `<rect x="${x + 12}" y="${y + 30 + i * 12}" width="${width}" height="5" rx="2.5" fill="${text}"/>`;
  }).join("");
  return `${box(x, y, w, h, background, 6)}
  <g stroke="none"><rect x="${x + 12}" y="${y + 12}" width="${w * 0.5}" height="10" rx="3" fill="${primary}"/>${lines}</g>`;
};
const LIGHT = { background: WHITE, text: NIGHT, primary: CRIMSON };
const DARK = { background: NIGHT, text: WHITE, primary: CRIMSON };

// 1. The system setting that the post starts from.
const systemSetting = svg({
  w: 520,
  h: 250,
  label:
    "A system setting with two choices, Light and Dark. Dark is selected. Below it are two systems that have the setting: macOS Mojave, 2018, and Windows 10, October 2018.",
  body: `
  <g transform="rotate(-0.6 260 83)">
    ${box(120, 16, 280, 134, SURFACE, 10)}
    ${page(140, 32, 110, 70, LIGHT)}
    ${page(270, 32, 110, 70, DARK)}
    <rect x="263" y="25" width="124" height="84" rx="11" stroke="${ACCENT}" stroke-width="3"/>
    <g fill="${INK}" stroke="none" text-anchor="middle" font-size="17">
      <text x="195" y="134">Light</text>
      <text x="325" y="134" font-weight="700">Dark</text>
    </g>
  </g>
  ${box(60, 178, 190, 56, SHADE)}
  ${box(270, 178, 190, 56, SHADE)}
  <g fill="${INK}" stroke="none" text-anchor="middle" font-size="17">
    <text x="155" y="201" font-weight="700">macOS Mojave</text>
    <text x="155" y="223">2018</text>
    <text x="365" y="201" font-weight="700">Windows 10</text>
    <text x="365" y="223">October 2018</text>
  </g>`,
});

// 2. The same custom properties, with one value for each colour scheme.
const swatch = (x, y, fill, hex) => ({
  shape: `<rect x="${x}" y="${y - 21}" width="28" height="28" rx="6" fill="${fill}"/>`,
  text: `<text x="${x + 38}" y="${y}">${hex}</text>`,
});
const property = (y, name, light, dark) => {
  const cells = [swatch(236, y, ...light), swatch(396, y, ...dark)];
  return {
    shape: cells.map((c) => c.shape).join(""),
    text: `<text x="16" y="${y}">${name}</text>${cells.map((c) => c.text).join("")}`,
  };
};
const properties = [
  property(184, "--color-background", [WHITE, "#fff"], [NIGHT, "#222"]),
  property(228, "--color-text", [NIGHT, "#222"], [WHITE, "#fff"]),
  property(272, "--color-primary", [CRIMSON, "#af1440"], [CRIMSON, "#af1440"]),
];
const colourSchemes = svg({
  w: 560,
  h: 294,
  label:
    "Same names, new values. A light page and a dark page, with the value of each custom property under them. --color-background is #fff in light and #222 in dark. --color-text is #222 in light and #fff in dark. --color-primary is #af1440 in both.",
  body: `
  ${page(236, 16, 140, 96, LIGHT)}
  ${page(396, 16, 140, 96, DARK)}
  <path d="M16 152H544" stroke-width="1.5" stroke-opacity=".5"/>
  ${properties.map((p) => p.shape).join("\n  ")}
  <g fill="${INK}" stroke="none" font-size="18">
    <text x="16" y="60" font-weight="700">Same names,</text>
    <text x="16" y="84">new values.</text>
    <text x="306" y="138" font-weight="700" text-anchor="middle">light</text>
    <text x="466" y="138" font-weight="700" text-anchor="middle">dark</text>
    ${properties.map((p) => p.text).join("\n    ")}
  </g>`,
});

// 3. Which browsers apply the dark scheme, and what the others do.
const browser = (y, fill, name, note, scheme) => ({
  shape: `${box(16, y, 250, 64, fill)}
  <path d="M278 ${y + 32}H316M308 ${y + 24}l8 8-8 8"/>
  ${page(330, y, 134, 64, scheme)}`,
  text: `<text x="141" y="${y + 28}" font-weight="700">${name}</text>
    <text x="141" y="${y + 50}">${note}</text>`,
});
const browsers = [
  browser(16, BLUE, "Safari 12.1", "on macOS", DARK),
  browser(100, GOLD, "Firefox 67", "beta, on macOS", DARK),
  browser(184, SHADE, "No support", "falls back to light", LIGHT),
];
const browserSupport = svg({
  w: 480,
  h: 264,
  maxWidth: "30rem",
  label:
    "Three rows, each with an arrow to a page. Safari 12.1, on macOS, shows the dark page. Firefox 67, beta, on macOS, shows the dark page. No support falls back to light, and shows the light page.",
  body: `
  ${browsers.map((b) => b.shape).join("\n  ")}
  <g fill="${INK}" stroke="none" text-anchor="middle" font-size="16">
    ${browsers.map((b) => b.text).join("\n    ")}
  </g>`,
});

write(new URL("../src/content/blog/2019/04/applying-dark-mode-in-css", import.meta.url), {
  "system-setting.svg": systemSetting,
  "colour-schemes.svg": colourSchemes,
  "browser-support.svg": browserSupport,
});
