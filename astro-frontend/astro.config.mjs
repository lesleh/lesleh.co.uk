import { defineConfig, envField, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";

import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://lesleh.co.uk",
  trailingSlash: "always",
  // The home page is the list of posts, so /blog/ has no page of its own.
  redirects: {
    "/blog": "/",
  },
  integrations: [mdx(), preact(), sitemap()],
  // Pages stay static. The adapter is for the one route that opts out of prerendering.
  adapter: vercel(),
  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      CONTACT_FROM_EMAIL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      CONTACT_TO_EMAIL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },
  // Astro downloads the files at build time and serves them from the site.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Nunito Sans",
      cssVariable: "--font-nunito-sans",
      weights: ["200 1000"],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      formats: ["woff2"],
      display: "swap",
      fallbacks: ["sans-serif"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
