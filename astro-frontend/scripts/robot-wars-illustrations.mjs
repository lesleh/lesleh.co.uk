// Generates the robot-wars post illustrations. Edit this, not the SVGs.
// Run from astro-frontend: node scripts/robot-wars-illustrations.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../src/content/blog/2026/11/robot-wars", import.meta.url));

const TINT = 'fill="currentColor" fill-opacity=".12"';

const svg = ({ w, h, label, maxWidth, body }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${label}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:2rem auto${maxWidth ? `;max-width:${maxWidth}` : ""}">
${body.trim()}
</svg>
`;

// Robot head and neck, facing right, with the top of the head at 0,0.
const head = (id) => `<g id="${id}">
      <line x1="0" y1="-22" x2="0" y2="0"/>
      <circle cx="0" cy="-27" r="5" fill="currentColor"/>
      <rect x="-46" y="18" width="8" height="22" rx="3"/>
      <rect x="38" y="18" width="8" height="22" rx="3"/>
      <rect x="-38" y="0" width="76" height="58" rx="12" ${TINT}/>
      <circle cx="-15" cy="24" r="9"/>
      <circle cx="15" cy="24" r="9"/>
      <circle cx="-11" cy="24" r="4" fill="currentColor" stroke="none"/>
      <circle cx="19" cy="24" r="4" fill="currentColor" stroke="none"/>
      <rect x="-16" y="40" width="32" height="9" rx="2"/>
      <path d="M-8 40v9M0 40v9M8 40v9" stroke-width="1.5"/>
      <path d="M-8 58v10M8 58v10"/>
    </g>`;

// Shoulders down to y, open at the bottom so a desk can hide the rest.
const shoulders = (y) => `<path d="M-48 ${y}V82q0-14 14-14h68q14 0 14 14v${y - 82}" ${TINT}/>`;

// Speech bubble with a tail on the bottom edge, from base a to base b, pointing at tip.
const bubble = (x, y, w, h, r, a, b, tip) =>
  `<path d="M${x + r} ${y}H${x + w - r}q${r} 0 ${r} ${r}v${h - 2 * r}q0 ${r}-${r} ${r}H${b}L${tip[0]} ${tip[1]}L${a} ${y + h}H${x + r}q-${r} 0-${r}-${r}v-${h - 2 * r}q0-${r} ${r}-${r}Z"/>`;

// 1. The debate itself.
const debate = svg({
  w: 640,
  h: 350,
  label:
    "Two robots debate at lecterns marked PRO and CON. PRO says 'CI runs it anyway' and CON says 'Citation needed'. Between them, a judge robot behind a raised bench holds up a magnifying glass.",
  body: `
  <defs>
    ${head("rw-debate-head")}
  </defs>
  <path d="M30 330H610"/>
  ${bubble(24, 20, 204, 50, 16, 108, 126, [132, 92])}
  ${bubble(412, 20, 204, 50, 16, 514, 532, [508, 92])}
  <g transform="translate(140 130)">
    <use href="#rw-debate-head"/>
    ${shoulders(95)}
    <path d="M48 80q18 2 20 10"/>
    <circle cx="68" cy="91" r="5" fill="currentColor"/>
  </g>
  <g transform="translate(500 130) scale(-1 1)">
    <use href="#rw-debate-head"/>
    ${shoulders(95)}
    <path d="M48 80q18 2 20 10"/>
    <circle cx="68" cy="91" r="5" fill="currentColor"/>
  </g>
  <g transform="translate(320 85)">
    <use href="#rw-debate-head"/>
    ${shoulders(95)}
    <path d="M48 80q18-4 22-26"/>
    <circle cx="70" cy="52" r="5" fill="currentColor"/>
    <path d="M72 47l8-14" stroke-width="4"/>
    <circle cx="88" cy="20" r="14" ${TINT}/>
    <path d="M80 15a9 9 0 0 1 8-5" stroke-width="1.5"/>
  </g>
  <rect x="70" y="225" width="140" height="12" rx="4" ${TINT}/>
  <path d="M86 237H194L182 330H98Z" ${TINT}/>
  <rect x="430" y="225" width="140" height="12" rx="4" ${TINT}/>
  <path d="M446 237H554L542 330H458Z" ${TINT}/>
  <rect x="236" y="180" width="168" height="14" rx="4" ${TINT}/>
  <rect x="250" y="194" width="140" height="136" ${TINT}/>
  <g fill="currentColor" stroke="none" text-anchor="middle">
    <text x="126" y="52" font-size="19">CI runs it anyway.</text>
    <text x="514" y="52" font-size="19">Citation needed.</text>
    <text x="140" y="292" font-size="26" font-weight="700" letter-spacing="2">PRO</text>
    <text x="500" y="292" font-size="26" font-weight="700" letter-spacing="2">CON</text>
    <text x="320" y="270" font-size="20" font-weight="700" letter-spacing="3">JUDGE</text>
  </g>`,
});

// 2. One run, from openings to the stress test.
const speech = (side, y, words) => {
  const x = side === "pro" ? 16 : 374;
  const w = 170;
  const h = 36;
  const tail =
    side === "pro"
      ? bubble(x, y, w, h, 12, x + 20, x + 34, [x + 10, y + h + 10])
      : bubble(x, y, w, h, 12, x + w - 34, x + w - 20, [x + w - 10, y + h + 10]);
  return {
    shape: tail,
    text: `<text x="${x + w / 2}" y="${y + 24}" font-size="17">${words} words</text>`,
  };
};
const speeches = [
  speech("pro", 48, 400),
  speech("con", 48, 400),
  speech("pro", 108, 300),
  speech("con", 152, 300),
  speech("pro", 212, 300),
  speech("con", 256, 300),
  speech("pro", 316, 150),
  speech("con", 360, 150),
];
const arrow = (y1, y2) => `<path d="M280 ${y1}V${y2}M273 ${y2 - 8}l7 8 7-8"/>`;
const oneRun = svg({
  w: 560,
  h: 690,
  maxWidth: "34rem",
  label:
    "One run of the debate. PRO and CON write 400-word openings at the same time, without seeing each other's. They then take turns through two rounds of 300-word rebuttals and a 150-word closing. A judge scores both sides and checks up to 3 facts, then a stress test tries to break the winning case. The whole run happens again with the sides swapped, and if the winner changes, it's a draw.",
  body: `
  <path d="M60 38H142M418 38H500" stroke-width="1.5"/>
  ${speeches.map((s) => s.shape).join("\n  ")}
  ${arrow(414, 438)}
  <rect x="16" y="444" width="528" height="66" rx="12" ${TINT}/>
  ${arrow(516, 540)}
  <rect x="16" y="546" width="528" height="66" rx="12" ${TINT}/>
  <g fill="currentColor" stroke="none" text-anchor="middle">
    <text x="101" y="28" font-size="20" font-weight="700" letter-spacing="2">PRO</text>
    <text x="459" y="28" font-size="20" font-weight="700" letter-spacing="2">CON</text>
    ${speeches.map((s) => s.text).join("\n    ")}
    <text x="280" y="64" font-size="18" font-weight="700">Openings</text>
    <text x="280" y="84" font-size="15" fill-opacity=".8">written blind</text>
    <text x="280" y="154" font-size="18" font-weight="700">Rebuttal 1</text>
    <text x="280" y="258" font-size="18" font-weight="700">Rebuttal 2</text>
    <text x="280" y="362" font-size="18" font-weight="700">Closings</text>
    <text x="280" y="470" font-size="19" font-weight="700">Judge</text>
    <text x="280" y="494" font-size="16">scores both sides and checks up to 3 facts</text>
    <text x="280" y="572" font-size="19" font-weight="700">Stress test</text>
    <text x="280" y="596" font-size="16">tries to break the winning case</text>
    <text x="280" y="646" font-size="16">Then it all runs again with the sides swapped.</text>
    <text x="280" y="670" font-size="16">If the winner changes, it's a draw.</text>
  </g>`,
});

// 3. Round one was won on a dictionary.
const lines = (x, ys, lengths) =>
  ys.map((y, i) => `M${x} ${y}h${lengths[i % lengths.length]}`).join("");
const pointless = svg({
  w: 640,
  h: 300,
  label:
    "A dictionary open at the entry 'pointless, adjective: having no value at all', with 'at all' highlighted. A robot marked CON points at the highlight.",
  body: `
  <defs>
    ${head("rw-pointless-head")}
  </defs>
  <path d="M30 66V274q110-12 210 4q100-16 210-4V66"/>
  <path d="M240 62q-90-16-200-4v204q110-12 200 4Z" ${TINT}/>
  <path d="M240 62q90-16 200-4v204q-110-12-200 4Z" ${TINT}/>
  <path d="${lines(62, [94, 114, 134, 154, 174, 194, 214, 234], [150, 120, 156, 96, 140, 156, 110, 130])}" stroke-width="3" stroke-opacity=".35"/>
  <path d="${lines(262, [216, 236], [150, 104])}" stroke-width="3" stroke-opacity=".35"/>
  <rect x="257" y="169" width="66" height="27" rx="3" fill="currentColor" fill-opacity=".3" stroke="none" transform="rotate(-2 290 183)"/>
  <g transform="translate(550 96) scale(-1 1)">
    <use href="#rw-pointless-head"/>
    <rect x="-48" y="68" width="96" height="80" rx="14" ${TINT}/>
    <path d="M-20 148v28M20 148v28M-32 176h18M14 176h18"/>
    <path d="M48 80L80 90L196 86"/>
    <circle cx="80" cy="90" r="4" fill="currentColor"/>
    <circle cx="203" cy="86" r="7" ${TINT}/>
    <path d="M210 86h12" stroke-width="4"/>
  </g>
  <g fill="currentColor" stroke="none">
    <text x="262" y="104" font-size="30" font-weight="700">pointless</text>
    <text x="262" y="128" font-size="16" font-style="italic" fill-opacity=".8">adjective</text>
    <text x="262" y="162" font-size="20">Having no value</text>
    <text x="262" y="188" font-size="20">at all.</text>
    <text x="550" y="212" font-size="20" font-weight="700" letter-spacing="2" text-anchor="middle">CON</text>
  </g>`,
});

// 4. Round two: CON's sources after the judges checked them.
const card = (x, angle, title, detail, stamp) => {
  const cx = x + 96;
  return `<g transform="rotate(${angle} ${cx} 122)">
    <rect x="${x}" y="24" width="192" height="196" rx="8" fill="currentColor" fill-opacity=".08"/>
    <path d="M${cx - 70} 128h140" stroke-width="1.5" stroke-opacity=".5"/>
    <g transform="translate(${cx} 172) rotate(-9)">
      <rect x="-84" y="-22" width="168" height="44" rx="4" stroke-width="3"/>
      <rect x="-78" y="-16" width="156" height="32" rx="2" stroke-width="1.5"/>
      <text y="6" font-size="16" font-weight="700" letter-spacing="1" fill="currentColor" stroke="none" text-anchor="middle">${stamp}</text>
    </g>
    <g fill="currentColor" stroke="none" text-anchor="middle">
      <text x="${cx}" y="62" font-size="18" font-weight="700">${title[0]}</text>
      <text x="${cx}" y="84" font-size="18" font-weight="700">${title[1]}</text>
      <text x="${cx}" y="112" font-size="16" fill-opacity=".85">${detail}</text>
    </g>
  </g>`;
};
const evidence = svg({
  w: 640,
  h: 240,
  label:
    "Three of CON's sources as index cards, each stamped by the judges. Parnin and Rugaber's interruptions study is stamped withdrawn. The Claude Code docs quote 'make it a hook' is stamped wrong hooks. Kerzazi, Khomh and Adams' 17.9% build breakage rate is stamped backfired.",
  body: `
  ${card(16, -2, ["Parnin and", "Rugaber"], "interruptions study", "WITHDRAWN")}
  ${card(224, 1.5, ["Claude Code", "docs"], "&quot;make it a hook&quot;", "WRONG HOOKS")}
  ${card(432, -1, ["Kerzazi, Khomh", "and Adams"], "17.9% of builds break", "BACKFIRED")}`,
});

// 5. The stress test that broke PRO's case in run 1.
const bar = (y, minutes) => {
  const end = 180 + minutes * 100;
  return `<path d="M180 ${y}H${end - 4}q4 0 4 4v16q0 4-4 4H180Z"/>`;
};
const breakEven = svg({
  w: 520,
  h: 230,
  maxWidth: "34rem",
  label:
    "Bar chart of the average time lost per commit, if the slow checks fail on 1 commit in 4 and each failure costs 10 minutes. With the hook, 1 minute, because every commit waits. Without the hook, 2.5 minutes, a quarter of 10 minutes.",
  body: `
  <path d="M180 100V214" stroke-width="1" stroke-opacity=".6"/>
  <g fill="currentColor" stroke="none">
    ${bar(112, 1)}
    ${bar(176, 2.5)}
    <text x="10" y="30" font-size="21" font-weight="700">Average time lost per commit</text>
    <text x="10" y="56" font-size="17" fill-opacity=".85">if the slow checks fail on 1 commit in 4,</text>
    <text x="10" y="78" font-size="17" fill-opacity=".85">and each failure costs 10 minutes</text>
    <g text-anchor="end">
      <text x="166" y="122" font-size="18">With the hook</text>
      <text x="166" y="142" font-size="15" fill-opacity=".8">every commit waits</text>
      <text x="166" y="186" font-size="18">Without the hook</text>
      <text x="166" y="206" font-size="15" fill-opacity=".8">a quarter of 10 minutes</text>
    </g>
    <text x="290" y="130" font-size="18" font-weight="700">1 min</text>
    <text x="440" y="194" font-size="18" font-weight="700">2.5 min</text>
  </g>`,
});

for (const [name, content] of Object.entries({
  "debate.svg": debate,
  "one-run.svg": oneRun,
  "pointless.svg": pointless,
  "evidence.svg": evidence,
  "break-even.svg": breakEven,
})) {
  writeFileSync(`${OUT}/${name}`, content);
}
console.log("wrote 5 files to", OUT);
