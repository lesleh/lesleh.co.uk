import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.string().pipe(z.coerce.date()),
      // The preview image for a shared link. scripts/social-images.mjs renders it.
      image: image().optional(),
    }),
});

export const collections = { blog };
