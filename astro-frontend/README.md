# astro-frontend

The Astro project for <https://lesleh.co.uk/>. The build output is plain HTML: a blog, a photos page and an about page.

The site uses:

- [Astro](https://astro.build) with MDX for the pages and blog posts
- [Preact](https://preactjs.com) for the interactive parts
- [Tailwind CSS](https://tailwindcss.com) for the styles

## Requirements

- Node.js 22.23.4 or later
- pnpm 12.18.0 (set in the `packageManager` field of `package.json`)

## Install

```bash
pnpm install
```

## Run

Start the development server:

```bash
pnpm dev
```

## Build

Build the site into `dist/`:

```bash
pnpm build
```

Serve the built site locally to check it:

```bash
pnpm preview
```

## Deploy

Vercel deploys the site. There is no deploy script or workflow in this repository.

## Layout

- `src/pages/` holds the pages and the blog post route
- `src/content/blog/` holds the blog posts, as MDX files
- `src/content/photos/` holds the images for the photos page
- `src/layouts/` and `src/components/` hold the shared layout and the Preact components
- `src/stylesheets/global.css` holds the Tailwind setup and the global styles
- `scripts/robot-wars-illustrations.mjs` draws the illustrations for the robot-wars post
