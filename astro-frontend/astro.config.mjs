import { defineConfig, envField, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";

import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import contentSecurityPolicy from "./integrations/content-security-policy.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://lesleh.co.uk",
  trailingSlash: "always",
  // The home page is the list of posts, so /blog/ has no page of its own.
  redirects: {
    "/blog": "/",
  },
  integrations: [mdx(), preact(), sitemap(), contentSecurityPolicy()],
  // Pages stay static. The adapter is for the one route that opts out of prerendering.
  adapter: vercel(),
  env: {
    schema: {
      SES_ACCESS_KEY_ID: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      SES_SECRET_ACCESS_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      SES_REGION: envField.string({
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
  // The files hold the weight axis only. The Fontsource provider serves a
  // larger file with three more axes that the site does not use.
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Nunito Sans",
      cssVariable: "--font-nunito-sans",
      display: "swap",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/nunito-sans-latin-wght-normal.woff2"],
            weight: "200 1000",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/nunito-sans-latin-wght-italic.woff2"],
            weight: "200 1000",
            style: "italic",
          },
        ],
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
