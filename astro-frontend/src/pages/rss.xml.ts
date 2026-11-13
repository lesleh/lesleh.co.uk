import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const TITLE = "Lesleh.co.uk";
const DESCRIPTION = "Blog posts from Leslie Hoare.";

const escapeXml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error("Set `site` in astro.config.mjs to build the RSS feed.");
  }

  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  const items = posts.map((post) => {
    const link = escapeXml(new URL(`/blog/${post.id}/`, site).href);
    const description = post.data.description
      ? `\n      <description>${escapeXml(post.data.description)}</description>`
      : "";

    return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${post.data.date.toUTCString()}</pubDate>${description}
    </item>`;
  });

  const feedUrl = escapeXml(new URL("/rss.xml", site).href);
  const lastBuildDate = posts[0]
    ? `\n    <lastBuildDate>${posts[0].data.date.toUTCString()}</lastBuildDate>`
    : "";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(TITLE)}</title>
    <link>${escapeXml(site.href)}</link>
    <description>${escapeXml(DESCRIPTION)}</description>
    <language>en-gb</language>${lastBuildDate}
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
