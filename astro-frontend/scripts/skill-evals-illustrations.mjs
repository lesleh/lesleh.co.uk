// Generates the skill-evals post illustrations. Edit this, not the SVGs.
// Run from astro-frontend: node scripts/skill-evals-illustrations.mjs
import { ACCENT, BLUE, GOLD, INK, PINK, SHADE, SHADE_STRONG, SURFACE, svg, write } from "./illustration-kit.mjs";

// In this post, gold is the dragon, blue is the pitcher (or whatever stands in for them) and pink is the graders.

// Speech bubble with a tail on its right edge, from base a to base b (y values), pointing at tip.
const bubble = (x, y, w, h, r, a, b, tip) =>
  `<path fill="${SURFACE}" d="M${x + r} ${y}H${x + w - r}q${r} 0 ${r} ${r}V${a}L${tip[0]} ${tip[1]}L${x + w} ${b}V${y + h - r}q0 ${r}-${r} ${r}H${x + r}q-${r} 0-${r}-${r}V${y + r}q0-${r} ${r}-${r}Z"/>`;

const arrow = (x, y1, y2) => `<path d="M${x} ${y1}V${y2}M${x - 7} ${y2 - 8}l7 8 7-8"/>`;

// 1. The dragon asks a question, then answers it for the empty chair.
const interview = svg({
  w: 640,
  h: 360,
  label:
    "A dragon sits behind a desk with a nameplate that says DRAGON. The pitcher's chair opposite is empty. The dragon asks 'Q1. What happens if this never gets done?', then answers itself: 'Answer (default): Just what I wanted to hear.'",
  body: `
  <path d="M24 340H616"/>
  <g fill="${BLUE}">
    <rect x="236" y="196" width="16" height="144" rx="6"/>
    <rect x="334" y="270" width="14" height="70" rx="5"/>
    <rect x="236" y="262" width="116" height="14" rx="6"/>
  </g>
  <path fill="${GOLD}" d="M526 186L582 46Q590 36 598 46L624 128Q606 136 612 168Q592 160 580 184Q560 174 548 194Z"/>
  <path d="M590 42L612 168M590 42L580 184" stroke-width="1.5"/>
  <g fill="${SHADE_STRONG}">
    <path d="M458 80Q474 48 506 42Q488 58 480 80Z"/>
    <path d="M474 82Q496 62 522 60Q502 74 494 86Z"/>
    <path d="M490 118L510 114L498 132Z"/>
    <path d="M498 134L520 134L508 150Z"/>
  </g>
  <rect x="368" y="226" width="256" height="14" rx="4" fill="${SHADE_STRONG}"/>
  <rect x="384" y="240" width="224" height="100" fill="${SHADE}"/>
  <rect x="432" y="262" width="128" height="40" rx="6" fill="${SURFACE}" transform="rotate(-1.5 496 282)"/>
  <path fill="${GOLD}" d="M440 226V196Q440 168 458 160Q450 146 452 130L490 112Q494 146 520 156H536Q580 160 580 204V226Z"/>
  <path d="M444 200q10 4 20 0" stroke-width="1.5"/>
  <path fill="${GOLD}" d="M492 100Q492 76 466 76H446Q428 76 422 92L384 98Q372 100 372 112V124Q372 136 384 136H470Q492 136 492 114Z"/>
  <circle cx="452" cy="98" r="10" fill="${SURFACE}"/>
  <circle cx="448" cy="101" r="4.5" fill="${INK}" stroke="none"/>
  <path fill="${GOLD}" d="M442 98A10 10 0 0 1 462 98Z"/>
  <path d="M384 106q4-3 8 0M376 124Q400 128 428 120" stroke-width="1.5"/>
  <rect x="414" y="210" width="44" height="18" rx="8" fill="${GOLD}"/>
  <path d="M424 218v8M434 218v8M444 218v8" stroke-width="1.5"/>
  ${bubble(16, 16, 300, 72, 18, 40, 62, [370, 114])}
  ${bubble(16, 102, 300, 72, 18, 124, 146, [372, 126])}
  <g fill="${INK}" stroke="none">
    <text x="36" y="46" font-size="20" font-weight="700">Q1. <tspan font-weight="400">What happens if</tspan></text>
    <text x="36" y="72" font-size="20">this never gets done?</text>
    <text x="36" y="132" font-size="20" font-weight="700">Answer (default):</text>
    <text x="36" y="158" font-size="20">Just what I wanted to hear.</text>
    <text x="496" y="289" font-size="20" font-weight="700" letter-spacing="2" text-anchor="middle" transform="rotate(-1.5 496 282)">DRAGON</text>
  </g>`,
});

// 2. How one case runs, from the fixture repo to the graders.
const box = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}"/>`;
const page = (x, y, w, h) =>
  `<path fill="${SURFACE}" d="M${x + 6} ${y}H${x + w - 18}L${x + w} ${y + 18}V${y + h - 6}q0 6-6 6H${x + 6}q-6 0-6-6V${y + 6}q0-6 6-6Z"/><path d="M${x + w - 18} ${y}V${y + 18}H${x + w}" stroke-width="1.5"/>`;
const oneCase = svg({
  w: 560,
  h: 640,
  maxWidth: "34rem",
  label:
    "How one eval case runs. scaffold.sh builds a tiny git repo, if the case has one. prompt.md holds the slash command and the pitch, and the appended system prompt answers for the user. One run of dragons-den asks its questions and answers them. It leaves a JSONL trace and a scope doc in plans/. The graders check them: regex and llm graders read the trace, and file_exists looks for the doc. Each case runs 3 times, and each run passes or fails.",
  body: `
  ${box(16, 16, 528, 70, SHADE)}
  ${arrow(280, 92, 116)}
  <rect x="16" y="122" width="250" height="96" rx="8" fill="${BLUE}" transform="rotate(-1.5 141 170)"/>
  <rect x="294" y="122" width="250" height="96" rx="8" fill="${BLUE}" transform="rotate(1.5 419 170)"/>
  ${arrow(141, 226, 250)}
  ${arrow(419, 226, 250)}
  ${box(16, 256, 528, 70, GOLD)}
  ${arrow(141, 332, 356)}
  ${arrow(419, 332, 356)}
  ${page(36, 362, 210, 52)}
  ${page(314, 362, 210, 52)}
  ${arrow(141, 420, 444)}
  ${arrow(419, 420, 444)}
  ${box(16, 450, 528, 104, PINK)}
  ${arrow(280, 560, 584)}
  <g fill="${INK}" stroke="none" text-anchor="middle" font-size="18">
    <text x="280" y="44" font-weight="700">scaffold.sh</text>
    <text x="280" y="70">builds a tiny git repo, if the case has one</text>
    <g transform="rotate(-1.5 141 170)">
      <text x="141" y="152" font-weight="700">prompt.md</text>
      <text x="141" y="178">the slash command</text>
      <text x="141" y="202">and the pitch</text>
    </g>
    <g transform="rotate(1.5 419 170)">
      <text x="419" y="152" font-weight="700">Appended prompt</text>
      <text x="419" y="178">answers for</text>
      <text x="419" y="202">the user</text>
    </g>
    <text x="280" y="284" font-weight="700">One run of dragons-den</text>
    <text x="280" y="310">asks its questions and answers them</text>
    <text x="141" y="394">JSONL trace</text>
    <text x="419" y="394">plans/ scope doc</text>
    <text x="280" y="480" font-weight="700">Graders</text>
    <text x="280" y="506">regex and llm read the trace,</text>
    <text x="280" y="530">file_exists looks for the doc</text>
    <text x="280" y="614">Pass or fail, 3 runs a case</text>
  </g>`,
});

// 3. The round-1 scope list before and after the fix.
const scopeCard = (x, angle, title, inItem, outItem, stamp) => {
  const cx = x + 148;
  return `<g transform="rotate(${angle} ${cx} 170)">
    <rect x="${x}" y="20" width="296" height="300" rx="8" fill="${SURFACE}"/>
    <path d="M${x + 24} 102h248" stroke-width="1.5" stroke-opacity=".5"/>
    <g transform="translate(${cx} 280) rotate(-7)" stroke="${ACCENT}">
      <rect x="-90" y="-23" width="180" height="46" rx="4" stroke-width="3"/>
      <rect x="-84" y="-17" width="168" height="34" rx="2" stroke-width="1.5"/>
      <text y="7" font-size="20" font-weight="700" fill="${ACCENT}" stroke="none" text-anchor="middle">${stamp}</text>
    </g>
    <g fill="${INK}" stroke="none" font-size="20">
      <text x="${x + 24}" y="56" font-weight="700">${title}</text>
      <text x="${x + 24}" y="84">Round 1, no answers yet</text>
      <text x="${x + 24}" y="138" font-weight="700">In</text>
      <text x="${x + 44}" y="166">${inItem}</text>
      <text x="${x + 24}" y="204" font-weight="700">Out</text>
      <text x="${x + 44}" y="232">${outItem}</text>
    </g>
  </g>`;
};
const scopeList = svg({
  w: 640,
  h: 340,
  label:
    "The dragon's round-1 scope list, before anyone has answered. Before the fix, In is empty and the changelog date check is already Out, stamped too soon. After the fix, the changelog date check is In and nothing is Out, stamped as pitched.",
  body: `
  ${scopeCard(16, -1.5, "Before the fix", "(nothing)", "Changelog date check", "TOO SOON")}
  ${scopeCard(328, 1, "After the fix", "Changelog date check", "(nothing)", "AS PITCHED")}`,
});

write(new URL("../src/content/blog/2026/11/skill-evals", import.meta.url), {
  "interview.svg": interview,
  "one-case.svg": oneCase,
  "scope-list.svg": scopeList,
});
