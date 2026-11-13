# astro-frontend

The Astro project for <https://lesleh.co.uk/>. The pages are plain HTML: a blog, a photos page, an about page and a contact page. One server route, `/api/contact/`, sends the messages from the contact form.

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

## Check

Type check the Astro files:

```bash
pnpm check
```

GitHub Actions runs this check and the build on every pull request and on every push to `master`.

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

The `@astrojs/vercel` adapter builds `/api/contact/` as a Vercel function. Every other page is static.

## Contact form

The contact form sends email through the Amazon SES v2 API. `src/lib/ses.ts` signs the request, so there is no AWS SDK dependency. Set these environment variables in Vercel, and in `.env` for local development:

- `SES_ACCESS_KEY_ID` and `SES_SECRET_ACCESS_KEY` are the access key of an IAM user that is only allowed the `ses:SendEmail` action
- `SES_REGION` is the AWS region of the SES identity, for example `eu-west-2`
- `CONTACT_FROM_EMAIL` is the sender address, a verified identity in SES or on a verified domain
- `CONTACT_TO_EMAIL` is the address that receives the messages

Vercel reserves the `AWS_` variable names, so the names start with `SES_`. While the SES account is in the sandbox, `CONTACT_TO_EMAIL` must be a verified address too.

`.env.example` lists the same variables. If one is missing, the route replies with status 503 and the page says it cannot send messages.

## Layout

- `src/pages/` holds the pages and the blog post route
- `src/pages/api/contact.ts` holds the server route for the contact form
- `src/content/blog/` holds the blog posts, as MDX files
- `src/content/photos/` holds the images for the photos page
- `src/layouts/` and `src/components/` hold the shared layout and the Preact components
- `src/stylesheets/global.css` holds the Tailwind setup and the global styles
- `scripts/robot-wars-illustrations.mjs` draws the illustrations for the robot-wars post
