---
name: illustrating-posts
description: Colour line-drawing illustrations for this site's blog posts. Use when adding an illustration, diagram or chart to a post.
---

Illustrations on this site are line drawings with flat colour fills, each on its own paper panel. The colours are CSS variables with a light and a dark value, so the drawings follow both themes. A script draws them as SVG files, and the post shows them inline.

Every script builds on `astro-frontend/scripts/illustration-kit.mjs`, the kit. The kit holds the palette and the `<svg>` root with its panel, and it throws when a drawing breaks a rule it can check. `robot-wars-illustrations.mjs` and `hacking-ddns-illustrations.mjs` in the same folder are worked examples: shape helpers, one constant per drawing, and the files they write. Take the pattern from them, and draw subjects that suit the new post.

## 1. Choose the drawings

Give each section of the post at most one drawing, placed after the paragraph where that section's main idea lands. A drawing shows that idea: a diagram for a process, a chart for numbers, or a small scene for an argument or a joke. Every fact in a drawing comes from the post.

Done when each drawing has a place in the post and a one-line description of what it shows.

## 2. Draw them with a script

Write `astro-frontend/scripts/<post-slug>-illustrations.mjs`. Import the palette, `svg()` and `write()` from the kit. Build each drawing with `svg()`, and save them all with `write()` into a folder named after the post, next to the post's `.mdx` file. Give each repeated shape a helper, and follow the style below. To change a drawing later, edit the script and run it again.

Done when the script runs with no error from the kit and writes every file.

## 3. Put them in the post

Import each SVG at the top of the `.mdx`, after the frontmatter, as an Astro SVG component:

```mdx
import Flow from "./<post-slug>/flow.svg";
```

Put `<Flow />` on its own line after its paragraph, with a blank line on each side.

Done when `pnpm build` in `astro-frontend` completes.

## 4. Look at them

The kit cannot see whether text fits its shape, so look. Serve the build with `pnpm preview`, and view the post three ways:

- light mode at 1280px wide
- dark mode at 1280px wide
- phone width, 375px

With headless Chrome, `--force-dark-mode` gives dark mode, and `--virtual-time-budget=4000` lets the web font load before the screenshot. It will not make a window narrower than about 500px, so for phone width put the post in a 375px-wide iframe inside a local HTML file. The preview server keeps running in the background, so stop it afterwards with `pnpm astro preview stop`.

Done when you have looked at every drawing in all three views, with no clipped or overlapping text and no text touching the edge of its shape.

## Style

- Root: `svg()` writes the `<svg>` root, the shared line style and the paper panel. Draw on the panel as if on paper.
- Colour: the kit's palette constants, and nothing else. Each one has a role:
  - `INK` for every line and all text
  - `SURFACE`, the lightest fill, for speech bubbles, pages, cards and eyes
  - `SHADE` and `SHADE_STRONG` for furniture and neutral boxes
  - `BLUE`, `GOLD` and `PINK` for characters or sides, one colour each, the same in every drawing of the post
  - `ACCENT` for the few marks that need emphasis, such as a stamp, an underline or the bars of a chart
- Meaning: a comment at the top of the script says what blue, gold and pink stand for in that post.
- New colours: a drawing that needs another colour adds an `--illo-*` variable to `astro-frontend/src/stylesheets/global.css` with `light-dark()`, and reads it with the kit's `colour()`. In dark mode the lines are light, so a dark fill is a deep version of the same hue.
- Fixed colours: a drawing that shows a real colour, such as a swatch of a hex value from the post, adds an `--illo-fixed-*` variable with one plain hex value. It is the same in both themes, so put no text on it.
- Fills: solid and opaque. A shape in front hides the one behind it, so draw from back to front.
- Lines: one stroke width, 2.5, with round ends. Use 1 to 1.5 for fine detail.
- Shapes: simple and geometric, with rounded corners. Tilt paper things such as cards, stamps and notes by a degree or two, so the drawing looks less rigid.
- Text: `INK` as the fill, with `stroke="none"`. Leave out `font-family`, so the text uses the site's font. Use weights 400 and 700, and keep labels to a few words. Text in `ACCENT` sits on the panel or on `SURFACE` only.
- Size: the smallest `font-size` is the viewBox width divided by 32, which is about 10px on a phone. Three shapes side by side leave little room for text at that size, so split long labels over two lines, or stack the shapes in a narrower viewBox. A tall or sparse drawing can pass `maxWidth` to `svg()`.
- IDs: the SVGs end up inline in one page, so prefix every `id` with the file name, and put styling in attributes.
- Charts: one series is one colour, `ACCENT`, and needs no legend. Bars are at most 24px thick, with a 4px rounded end and a square end at the baseline. Each value sits at the tip of its bar.

## Accessibility

- The `label` passed to `svg()` says what the drawing shows and includes every word of its text, because screen readers skip the text inside.
- Text reaches 4.5:1 contrast in both themes. The kit checks this for the palette when it loads: `INK` on every fill, and `ACCENT` on the panel and on `SURFACE`.
- Lines and shapes that carry meaning reach 3:1.
