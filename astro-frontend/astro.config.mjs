import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";
import contentSecurityPolicy from "./integrations/content-security-policy.mjs";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "always",
  integrations: [mdx(), preact(), contentSecurityPolicy()],
  vite: {
    plugins: [tailwindcss()],
  },
});
