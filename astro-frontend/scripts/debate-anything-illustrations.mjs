// Generates the debate-anything post illustrations. Edit this, not the SVGs.
// Run from astro-frontend: node scripts/debate-anything-illustrations.mjs
import { ACCENT, BLUE, GOLD, INK, PINK, SHADE, SHADE_STRONG, SURFACE, svg, write } from "./illustration-kit.mjs";

// In this post, blue is PRO, gold is CON and pink is the judge.

// Robot head and neck in one colour, facing right, with the top of the head at 0,0.
const head = (colour, top) => `${top}
    <g fill="${colour}">
      <rect x="-46" y="18" width="8" height="22" rx="3"/>
      <rect x="38" y="18" width="8" height="22" rx="3"/>
      <rect x="-38" y="0" width="76" height="58" rx="12"/>
    </g>
    <g fill="${SURFACE}">
      <circle cx="-15" cy="24" r="9"/>
      <circle cx="15" cy="24" r="9"/>
      <rect x="-16" y="40" width="32" height="9" rx="2"/>
    </g>
    <circle cx="-11" cy="24" r="4" fill="${INK}" stroke="none"/>
    <circle cx="19" cy="24" r="4" fill="${INK}" stroke="none"/>
    <path d="M-8 40v9M0 40v9M8 40v9" stroke-width="1.5"/>
    <path d="M-8 58v10M8 58v10"/>`;

const antenna = `<line x1="0" y1="-22" x2="0" y2="0"/>
    <circle cx="0" cy="-27" r="5" fill="${ACCENT}"/>`;

// A Santa hat that sits on the head in place of the antenna.
const santaHat = `<path d="M-30 -6Q-22 -46 16 -44Q30 -30 34 -6Z" fill="${ACCENT}"/>
    <circle cx="20" cy="-45" r="7" fill="${SURFACE}"/>
    <rect x="-40" y="-10" width="80" height="14" rx="7" fill="${SURFACE}"/>`;

// Shoulders down to y, open at the bottom so a lectern can hide the rest.
const shoulders = (y, colour) =>
  `<path d="M-48 ${y}V82q0-14 14-14h68q14 0 14 14v${y - 82}" fill="${colour}"/>`;

// Speech bubble with a tail on the bottom edge, from base a to base b, pointing at tip.
const bubble = (x, y, w, h, r, a, b, tip, colour = SURFACE) =>
  `<path fill="${colour}" d="M${x + r} ${y}H${x + w - r}q${r} 0 ${r} ${r}v${h - 2 * r}q0 ${r}-${r} ${r}H${b}L${tip[0]} ${tip[1]}L${a} ${y + h}H${x + r}q-${r} 0-${r}-${r}v-${h - 2 * r}q0-${r} ${r}-${r}Z"/>`;

// 1. The debate itself. PRO has come dressed for its side.
const debate = svg({
  w: 640,
  h: 380,
  label:
    "Two robots debate at lecterns marked PRO and CON. PRO wears a Santa hat and says 'It's Christmas Eve.' CON says 'It opened in July.' Between them, a judge robot behind a raised bench holds up a magnifying glass.",
  body: `
  ${bubble(24, 20, 204, 50, 16, 108, 126, [132, 94])}
  ${bubble(412, 20, 204, 50, 16, 514, 532, [508, 122])}
  <g transform="translate(0 30)">
    <path d="M30 330H610"/>
    <g transform="translate(140 130)">
      ${head(BLUE, santaHat)}
      ${shoulders(95, BLUE)}
      <path d="M48 80q18 2 20 10"/>
      <circle cx="68" cy="91" r="5" fill="${BLUE}"/>
    </g>
    <g transform="translate(500 130) scale(-1 1)">
      ${head(GOLD, antenna)}
      ${shoulders(95, GOLD)}
      <path d="M48 80q18 2 20 10"/>
      <circle cx="68" cy="91" r="5" fill="${GOLD}"/>
    </g>
    <g transform="translate(320 85)">
      ${head(PINK, antenna)}
      ${shoulders(95, PINK)}
      <path d="M48 80q18-4 22-26"/>
      <circle cx="70" cy="52" r="5" fill="${PINK}"/>
      <path d="M72 47l8-14" stroke-width="4"/>
      <circle cx="88" cy="20" r="14" fill="${SURFACE}"/>
      <path d="M80 15a9 9 0 0 1 8-5" stroke-width="1.5"/>
    </g>
    <g fill="${SHADE_STRONG}">
      <rect x="70" y="225" width="140" height="12" rx="4"/>
      <rect x="430" y="225" width="140" height="12" rx="4"/>
      <rect x="236" y="180" width="168" height="14" rx="4"/>
    </g>
    <g fill="${SHADE}">
      <path d="M86 237H194L182 330H98Z"/>
      <path d="M446 237H554L542 330H458Z"/>
      <rect x="250" y="194" width="140" height="136"/>
    </g>
    <g fill="${INK}" stroke="none" text-anchor="middle">
      <text x="140" y="292" font-size="26" font-weight="700" letter-spacing="2">PRO</text>
      <text x="500" y="292" font-size="26" font-weight="700" letter-spacing="2">CON</text>
      <text x="320" y="270" font-size="20" font-weight="700" letter-spacing="3">JUDGE</text>
    </g>
  </g>
  <g fill="${INK}" stroke="none" text-anchor="middle">
    <text x="126" y="52" font-size="20">It's Christmas Eve.</text>
    <text x="514" y="52" font-size="20">It opened in July.</text>
  </g>`,
});

// 2. The two tests, which the sides wrote without seeing each other's.
const testCard = (y, angle, colour, title, checks) => `<g transform="rotate(${angle} 260 ${y + 90})">
    <rect x="12" y="${y}" width="496" height="180" rx="10" fill="${colour}"/>
    <g fill="${INK}" stroke="none">
      <text x="34" y="${y + 38}" font-size="22" font-weight="700" letter-spacing="1">${title}</text>
      ${checks
        .map(
          ([name, rule], i) => `<text x="34" y="${y + 74 + i * 54}" font-size="18" font-weight="700">${i + 1}. ${name}</text>
      <text x="34" y="${y + 98 + i * 54}" font-size="18">${rule}</text>`,
        )
        .join("\n      ")}
    </g>
  </g>`;
const tests = svg({
  w: 520,
  h: 412,
  maxWidth: "34rem",
  label:
    "Two cards with nearly the same test for a Christmas film. PRO's test: 1. Necessity. Take Christmas out and the story doesn't happen. 2. Theme. It ends on something Christmas stories are about. CON's test: 1. Removal. Take Christmas out and the story collapses. 2. Resolution. Something Christmas stands for settles the conflict.",
  body: `
  ${testCard(14, -1, BLUE, "PRO's test", [
    ["Necessity", "Take Christmas out and the story doesn't happen."],
    ["Theme", "It ends on something Christmas stories are about."],
  ])}
  ${testCard(218, 1, GOLD, "CON's test", [
    ["Removal", "Take Christmas out and the story collapses."],
    ["Resolution", "Something Christmas stands for settles the conflict."],
  ])}`,
});

// 3. Claims the judge flagged, on both sides.
const card = (x, angle, side, title, detail, stamp) => {
  const cx = x + 96;
  return `<g transform="rotate(${angle} ${cx} 142)">
    <rect x="${x}" y="20" width="192" height="244" rx="8" fill="${SURFACE}"/>
    <path d="M${cx - 70} 178h140" stroke-width="1.5" stroke-opacity=".5"/>
    <g transform="translate(${cx} 220) rotate(-9)" stroke="${ACCENT}">
      <rect x="-90" y="-23" width="180" height="46" rx="4" stroke-width="3"/>
      <rect x="-84" y="-17" width="168" height="34" rx="2" stroke-width="1.5"/>
      <text y="7" font-size="20" font-weight="700" fill="${ACCENT}" stroke="none" text-anchor="middle">${stamp}</text>
    </g>
    <g fill="${INK}" stroke="none" text-anchor="middle" font-size="20">
      <text x="${cx}" y="52" font-weight="700" letter-spacing="2">${side}</text>
      <text x="${cx}" y="84" font-weight="700">${title[0]}</text>
      <text x="${cx}" y="108" font-weight="700">${title[1]}</text>
      <text x="${cx}" y="138">${detail[0]}</text>
      <text x="${cx}" y="162">${detail[1]}</text>
    </g>
  </g>`;
};
const flagged = svg({
  w: 640,
  h: 284,
  label:
    "Three claims as index cards, each stamped by the judge. CON: 'No Christmas films in summer', but its own list had one, stamped withdrawn. CON: 'The sequels prove it', which left out Die Hard 2, stamped incomplete. PRO: 'A poll is just it depends', but a poll is still evidence, stamped wrong.",
  body: `
  ${card(16, -2, "CON", ["“No Christmas", "films in summer”"], ["its own list", "had one"], "WITHDRAWN")}
  ${card(224, 1.5, "CON", ["“The sequels", "prove it”"], ["left out", "Die Hard 2"], "INCOMPLETE")}
  ${card(432, -1, "PRO", ["“A poll is just", "it depends”"], ["a poll is", "still evidence"], "WRONG")}`,
});

// 4. The stress test swaps the occasion and keeps the story.
const calendarPage = (x, angle, top, big, small) => {
  const cx = x + 100;
  return `<g transform="rotate(${angle} ${cx} 100)">
    <rect x="${x}" y="24" width="200" height="156" rx="10" fill="${SURFACE}"/>
    <path d="M${x} 62V34q0-10 10-10h180q10 0 10 10v28Z" fill="${SHADE_STRONG}"/>
    <path d="M${x + 22} 14v18M${x + 178} 14v18" stroke-width="4"/>
    <g fill="${INK}" stroke="none" text-anchor="middle">
      <text x="${cx}" y="51" font-size="18" font-weight="700" letter-spacing="2">${top}</text>
      <text x="${cx}" y="118" font-size="44" font-weight="700">${big}</text>
      <text x="${cx}" y="156" font-size="19">${small}</text>
    </g>
  </g>`;
};
const swap = svg({
  w: 560,
  h: 262,
  maxWidth: "34rem",
  label:
    "Two calendar pages. On the first, December 24, Christmas Eve, the date is crossed out. An arrow points to the second: any Friday, her birthday. Underneath: same heist, same reunion. PRO's own test now fails.",
  body: `
  ${calendarPage(24, -2, "DECEMBER", "24", "Christmas Eve")}
  <path d="M76 136L172 80" stroke="${ACCENT}" stroke-width="5"/>
  <path d="M246 102H312M300 90l12 12-12 12"/>
  ${calendarPage(336, 1.5, "ANY FRIDAY", "?", "her birthday")}
  <g fill="${INK}" stroke="none" text-anchor="middle">
    <text x="280" y="222" font-size="20">Same heist, same reunion.</text>
    <text x="280" y="248" font-size="20" font-weight="700">PRO's own test now fails.</text>
  </g>`,
});

write(new URL("../src/content/blog/2026/11/debate-anything", import.meta.url), {
  "debate.svg": debate,
  "tests.svg": tests,
  "flagged.svg": flagged,
  "swap.svg": swap,
});
