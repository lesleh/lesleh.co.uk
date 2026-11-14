import { getCollection } from "astro:content";
import { VERCEL_ENV } from "astro:env/server";

// Drafts show in local dev and on Vercel preview deployments, never in production.
const showDrafts = import.meta.env.DEV || VERCEL_ENV === "preview";

// Every post a visitor can see, newest first.
export const getPosts = async () =>
  (await getCollection("blog", ({ data }) => showDrafts || !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
