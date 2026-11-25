import type { CollectionEntry } from "astro:content";
import type { SvgComponent } from "astro/types";

// The PNG a post names in `image` is a light-only copy made for link previews.
// The SVG with the same name follows the theme, so pages show that instead.
const sources = import.meta.glob<string>("../content/blog/**/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
});
const svgs = import.meta.glob<SvgComponent>("../content/blog/**/*.svg", {
  import: "default",
  eager: true,
});

const join = (dir: string, relative: string) =>
  `${dir}/${relative.replace(/^\.\//, "")}`;

// The SVG for a post's `image`, or undefined if the post names no image.
export const getIllustration = (post: CollectionEntry<"blog">) => {
  const [key, source] =
    Object.entries(sources).find(([key]) =>
      post.filePath?.endsWith(key.replace(/^\.\.\//, "")),
    ) ?? [];
  if (!key || !source) return undefined;

  const [, image] = source.match(/^image:\s*(\S+)\.png\s*$/m) ?? [];
  if (!image) return undefined;

  const path = join(key.replace(/\/[^/]+$/, ""), `${image}.svg`);
  const svg = svgs[path];
  if (!svg) throw new Error(`${post.filePath} has no ${image}.svg next to its image`);
  return svg;
};
