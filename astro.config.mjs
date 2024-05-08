import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import expressiveCode from "astro-expressive-code";

import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [
    expressiveCode(),
    mdx(),
    sitemap(),
    tailwind(),
    svelte(),
    starlight({
      title: "Pallad Docs",
      titleDelimiter: "-",
      sidebar: [{ label: "Welcome", link: "/docs" }],
    }),
  ],
});
