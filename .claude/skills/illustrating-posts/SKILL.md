---
name: illustrating-posts
description: Colour line-drawing illustrations for this site's blog posts. Use when adding an illustration, diagram or chart to a post.
---

Illustrations on this site are line drawings with flat colour fills, each on its own paper panel. The colours are CSS variables with a light and a dark value, so the drawings follow both themes. A script draws them as SVG files, and the post shows them inline. `astro-frontend/scripts/robot-wars-illustrations.mjs` is a worked example of the whole pattern: palette constants, shared helpers, one constant per drawing, and the files it writes. Take the pattern from it, and draw subjects that suit the new post.

## 1. Choose the drawings

Give each section of the post at most one drawing, placed after the paragraph where that section's main idea lands. A drawing shows that idea: a diagram for a process, a chart for numbers, or a small scene for an argument or a joke. Every fact in a drawing comes from the post.

Done when each drawing has a place in the post and a one-line description of what it shows.

## 2. Draw them with a script

Write `astro-frontend/scripts/<post-slug>-illustrations.mjs`. It writes one SVG per drawing into a folder named after the post, next to the post's `.mdx` file. Give each repeated shape a helper, and follow the style below. To change a drawing later, edit the script and run it again.

Done when the script runs and writes every file.

## 3. Put them in the post

Import each SVG at the top of the `.mdx`, after the frontmatter, as an Astro SVG component:

```mdx
import Flow from "./<post-slug>/flow.svg";
```

Put `<Flow />` on its own line after its paragraph, with a blank line on each side.

Done when `pnpm build` in `astro-frontend` completes.

## 4. Look at them

Serve the build with `pnpm preview`, and screenshot the post with headless Chrome three ways:

- light mode at 1280px wide
- dark mode at 1280px wide, with `--force-dark-mode`
- phone width, in a 375px-wide iframe inside a local HTML file, because headless Chrome will not make a window narrower than about 500px

Add `--virtual-time-budget=4000` so the web font loads before the screenshot. The preview server keeps running in the background, so stop it afterwards with `pnpm astro preview stop`.

Compute the WCAG contrast of every text colour against the fill behind it, in both themes. The palette is in `astro-frontend/src/stylesheets/global.css`.

Done when you have looked at every drawing in all three screenshots with no clipped or overlapping text, and every text colour meets the contrast rule under Accessibility.

## Style

The `<svg>` root carries the shared style, so shapes inherit it. Its `style` attribute also draws the paper panel:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" width="100%" role="img" aria-label="..." fill="none" stroke="var(--illo-ink, #3b0d1a)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:2rem auto;padding:3%;box-sizing:border-box;border-radius:12px;background:var(--illo-paper, #fbf1e4)">
```

- Colour: the `--illo-*` variables in `global.css`, and nothing else. Write each one with its light value as the fallback, as in the root above, so a file opened on its own keeps its colour. Each variable has a role:
  - `ink` for every line and all text
  - `surface`, the lightest fill, for speech bubbles, pages, cards and eyes
  - `shade` and `shade-strong` for furniture and neutral boxes
  - `blue`, `gold` and `pink` for characters or sides, one colour each, the same in every drawing of the post
  - `accent` for the few marks that need emphasis, such as a stamp, an underline or the bars of a chart
- New colours: a drawing that needs another colour adds a variable to `global.css` with a light and a dark value. In dark mode the lines are light, so a dark fill is a deep version of the same hue.
- Fills: solid and opaque. A shape in front hides the one behind it, so draw from back to front.
- Lines: one stroke width, 2.5, with round ends. Use 1 to 1.5 for fine detail.
- Shapes: simple and geometric, with rounded corners. Tilt paper things such as cards, stamps and notes by a degree or two, so the drawing looks less rigid.
- Text: `ink` as the fill, with `stroke="none"`. Leave out `font-family`, so the text uses the site's font. Use weights 400 and 700, and keep labels to a few words. Text in `accent` sits on `paper` or `surface` only.
- Size: the smallest `font-size` is at least the viewBox width divided by 32, which keeps text at about 10px on a phone after the panel's padding. When text does not fit, make the viewBox narrower. A tall or sparse drawing can add a `max-width` to the root style.
- IDs: the SVGs end up inline in one page, so prefix every `id` with the file name. Put styling in attributes, because a `<style>` block applies to the whole page.
- Charts: one series is one colour, `accent`, and needs no legend. Bars are at most 24px thick, with a 4px rounded end and a square end at the baseline. Each value sits at the tip of its bar.

## Accessibility

- The root has `role="img"` and an `aria-label`. The label says what the drawing shows and includes every word of its text, because screen readers skip the text inside.
- Text reaches 4.5:1 contrast against the fill behind it, in both themes. Lines and shapes that carry meaning reach 3:1.
