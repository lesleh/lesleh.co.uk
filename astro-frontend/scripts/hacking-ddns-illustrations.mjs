// Generates the hacking-ddns post illustrations. Edit this, not the SVGs.
// Run from astro-frontend: node scripts/hacking-ddns-illustrations.mjs
import { BLUE, GOLD, INK, PINK, SHADE, SHADE_STRONG, SURFACE, ACCENT, svg, write } from "./illustration-kit.mjs";

// In this post, blue is the home network, gold is the function and pink is DNS.

const box = (x, y, w, h, colour, rx = 12) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${colour}"/>`;

// Arrow straight down from y1 to y2.
const down = (x, y1, y2) => `<path d="M${x} ${y1}V${y2}M${x - 7} ${y2 - 8}l7 8 7-8"/>`;

// 1. The name stays the same while the address changes.
const pins = Array.from({ length: 9 }, (_, i) => `<circle cx="${420 + i * 10}" cy="97" r="1.5"/>`).join("");
const nameAndAddress = svg({
  w: 560,
  h: 250,
  label:
    "A name tag reading home.lesleh.co.uk points at a Raspberry Pi. The name stays the same. Above the Raspberry Pi, a card reading 'old IP' is crossed out, next to a card reading 'new IP'. The IP changes.",
  body: `
  <g transform="rotate(-2 116 120)">
    ${box(16, 96, 204, 48, PINK, 8)}
    <circle cx="33" cy="120" r="4" fill="${SURFACE}" stroke-width="1.5"/>
  </g>
  <path d="M236 120H368M360 112l8 8-8 8"/>
  ${box(388, 84, 150, 92, BLUE, 8)}
  <g fill="${SURFACE}" stroke-width="1.5">
    <circle cx="400" cy="97" r="3"/>
    <circle cx="526" cy="97" r="3"/>
    <circle cx="400" cy="164" r="3"/>
    <circle cx="526" cy="164" r="3"/>
  </g>
  ${box(432, 114, 38, 38, SURFACE, 3)}
  <g fill="${SHADE_STRONG}">
    <rect x="518" y="110" width="28" height="18" rx="2"/>
    <rect x="518" y="136" width="28" height="18" rx="2"/>
  </g>
  <g fill="${INK}" stroke="none">${pins}</g>
  <g transform="rotate(-3 422 40)">${box(384, 22, 76, 36, SURFACE, 6)}</g>
  <g transform="rotate(2 512 40)">${box(474, 22, 76, 36, SURFACE, 6)}</g>
  <path d="M512 62V82" stroke-width="1.5"/>
  <g fill="${INK}" stroke="none" text-anchor="middle" font-size="18">
    <text x="126" y="126" font-weight="700" transform="rotate(-2 116 120)">home.lesleh.co.uk</text>
    <text x="118" y="182">The name stays</text>
    <text x="118" y="206">the same.</text>
    <text x="422" y="46" transform="rotate(-3 422 40)">old IP</text>
    <text x="512" y="46" font-weight="700" transform="rotate(2 512 40)">new IP</text>
    <text x="463" y="206" font-weight="700">Raspberry Pi</text>
    <text x="463" y="230">The IP changes.</text>
  </g>
  <path d="M390 43L454 37" stroke="${ACCENT}" stroke-width="3"/>`,
});

// 2. What the router sends, and what each part is.
const part = (y, colour, name, note) => ({
  shape: `${box(36, y - 24, 196, 36, colour, 8)}
  <path d="M238 ${y - 6}H256" stroke-width="1.5"/>`,
  text: `<text x="48" y="${y}">${name}</text>
    <text x="264" y="${y}">${note}</text>`,
});
const parts = [
  part(122, SHADE, "hostname=", "ignored"),
  part(174, GOLD, "myip=", "the public IP"),
  part(226, SHADE, "Authorization: Basic", "username:password in base64"),
];
const request = svg({
  w: 520,
  h: 272,
  label:
    "The router's request, GET /nic/update, with three parts labelled. hostname= is ignored. myip= is the public IP. Authorization: Basic is username:password in base64.",
  body: `
  <g transform="rotate(-0.6 260 136)">
    ${box(16, 16, 488, 240, SURFACE, 8)}
    <path d="M36 78H484" stroke-width="1.5" stroke-opacity=".5"/>
    ${parts.map((p) => p.shape).join("\n    ")}
    <g fill="${INK}" stroke="none" font-size="17">
      <text x="38" y="58" font-size="21" font-weight="700">GET /nic/update</text>
      ${parts.map((p) => p.text).join("\n      ")}
    </g>
  </g>`,
});

// 3. The function only writes when the IP is different.
const handler = svg({
  w: 480,
  h: 344,
  maxWidth: "30rem",
  label:
    "How the function handles a request. It takes myip from the router and reads the current A record. Same IP? If yes, it does nothing and replies 'No change required'. If no, it does an UPSERT of the A record and replies 'Record updated'.",
  body: `
  ${box(90, 16, 300, 48, BLUE)}
  ${down(240, 68, 90)}
  ${box(90, 94, 300, 48, GOLD)}
  ${down(240, 146, 168)}
  ${box(150, 172, 180, 48, SURFACE, 24)}
  <path d="M150 196H121V252M114 244l7 8 7-8"/>
  <path d="M330 196H359V252M352 244l7 8 7-8"/>
  ${box(16, 256, 210, 72, SHADE)}
  ${box(254, 256, 210, 72, PINK)}
  <g fill="${INK}" stroke="none" text-anchor="middle" font-size="16">
    <text x="240" y="46" font-size="17">myip from the router</text>
    <text x="240" y="124" font-size="17">Read the current A record</text>
    <text x="240" y="202" font-size="17" font-weight="700">Same IP?</text>
    <text x="134" y="186">yes</text>
    <text x="346" y="186">no</text>
    <text x="121" y="287" font-weight="700">Do nothing</text>
    <text x="121" y="311">“No change required”</text>
    <text x="359" y="287" font-weight="700">UPSERT the A record</text>
    <text x="359" y="311">“Record updated”</text>
  </g>`,
});

// 4. CloudFront sits in front, because the router cannot use HTTPS.
const hop = (y, colour, name, notes = []) => ({
  shape: `${box(16, y, 200, 44, colour)}${notes.length ? `\n  <path d="M222 ${y + 22}H236" stroke-width="1.5"/>` : ""}`,
  text: `<text x="116" y="${y + 28}" font-weight="700" text-anchor="middle">${name}</text>${notes
    .map((n, i) => `\n    <text x="244" y="${y + 28 + (i - (notes.length - 1) / 2) * 22}">${n}</text>`)
    .join("")}`,
});
const hops = [
  hop(16, BLUE, "Router", ["HTTP only"]),
  hop(100, SURFACE, "CloudFront", ["passes hostname and myip", "caching off"]),
  hop(184, SHADE, "API Gateway", ["HTTPS only"]),
  hop(268, GOLD, "Lambda"),
  hop(352, PINK, "Route53"),
];
const path = svg({
  w: 480,
  h: 412,
  maxWidth: "30rem",
  label:
    "The path of a request, from top to bottom. The router is HTTP only. CloudFront passes hostname and myip, with caching off. API Gateway is HTTPS only. Then Lambda, then Route53.",
  body: `
  ${hops.map((h) => h.shape).join("\n  ")}
  ${[64, 148, 232, 316].map((y) => down(116, y, y + 32)).join("\n  ")}
  <g fill="${INK}" stroke="none" font-size="16">
    ${hops.map((h) => h.text).join("\n    ")}
  </g>`,
});

write(new URL("../src/content/blog/2023/02/hacking-ddns", import.meta.url), {
  "name-and-address.svg": nameAndAddress,
  "request.svg": request,
  "handler.svg": handler,
  "path.svg": path,
});
