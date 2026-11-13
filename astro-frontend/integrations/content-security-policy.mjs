// Checks the Content-Security-Policy header in vercel.json against the build.
// Vercel reads vercel.json before it builds, so the build cannot write the
// header. The build fails if the header is out of date instead.
// To update the header, run: pnpm csp:update
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const HEADER = "Content-Security-Policy";
const vercelConfig = new URL("../vercel.json", import.meta.url);

// A stylesheet from the first origin loads fonts from the second origin.
const fontOrigins = {
  "https://fonts.googleapis.com": "https://fonts.gstatic.com",
};

const hash = (text) =>
  `'sha256-${createHash("sha256").update(text).digest("base64")}'`;

const origin = (url) => (/^https?:\/\//.test(url) ? new URL(url).origin : null);

const attribute = (tag, name) =>
  tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

// Collects the inline scripts, the inline styles and the external origins
// that one built page uses.
const scanPage = (html, sources) => {
  for (const [, tag, body] of html.matchAll(
    /<script(\s[^>]*)?>([\s\S]*?)<\/script>/g,
  )) {
    const src = attribute(tag ?? "", "src");
    if (src === undefined) sources.script.add(hash(body));
    else if (origin(src)) sources.script.add(origin(src));
  }

  for (const [, body] of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    sources.style.add(hash(body));
  }

  for (const [tag] of html.matchAll(/<link\s[^>]*>/g)) {
    const href = origin(attribute(tag, "href") ?? "");
    if (!href || !/\srel="stylesheet"/.test(tag)) continue;
    sources.style.add(href);
    if (fontOrigins[href]) sources.font.add(fontOrigins[href]);
  }

  for (const [tag] of html.matchAll(/<(?:img|source)\s[^>]*>/g)) {
    const src = origin(attribute(tag, "src") ?? "");
    if (src) sources.image.add(src);
  }
};

const policy = (sources) => {
  const list = (set) => ["'self'", ...[...set].sort()].join(" ");

  return [
    "default-src 'none'",
    `script-src ${list(sources.script)}`,
    // Browsers that do not support the two directives below use this one.
    "style-src 'self' 'unsafe-inline'",
    `style-src-elem ${list(sources.style)}`,
    // Shiki and the post illustrations set style attributes.
    "style-src-attr 'unsafe-inline'",
    `img-src ${list(sources.image)}`,
    `font-src ${list(sources.font)}`,
    "connect-src 'self'",
    "manifest-src 'self'",
    "form-action 'self'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
};

export default function contentSecurityPolicy() {
  return {
    name: "content-security-policy",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const sources = {
          script: new Set(),
          style: new Set(),
          image: new Set(),
          font: new Set(),
        };
        const files = await readdir(dir, { recursive: true });
        for (const file of files.filter((name) => name.endsWith(".html"))) {
          scanPage(await readFile(new URL(file, dir), "utf8"), sources);
        }
        const expected = policy(sources);

        const config = JSON.parse(await readFile(vercelConfig, "utf8"));
        const header = config.headers
          ?.flatMap((rule) => rule.headers)
          .find((item) => item.key === HEADER);
        if (!header) {
          throw new Error(`vercel.json has no ${HEADER} header.`);
        }
        if (header.value === expected) return;

        if (process.env.CSP_UPDATE) {
          header.value = expected;
          await writeFile(vercelConfig, `${JSON.stringify(config, null, 2)}\n`);
          logger.info(`Updated ${HEADER} in ${fileURLToPath(vercelConfig)}.`);
          return;
        }

        throw new Error(
          `The ${HEADER} header in vercel.json does not match the built pages, ` +
            "so browsers would block scripts or styles on the live site. " +
            "Run `pnpm csp:update` in astro-frontend and commit vercel.json.\n" +
            `Expected: ${expected}\nFound: ${header.value}`,
        );
      },
    },
  };
}
