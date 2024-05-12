import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import starlight from "@astrojs/starlight"
import svelte from "@astrojs/svelte"
import tailwind from "@astrojs/tailwind"
import expressiveCode from "astro-expressive-code"
import { defineConfig } from "astro/config"

import node from "@astrojs/node"

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  output: "server",
  integrations: [
    expressiveCode(),
    mdx(),
    sitemap(),
    tailwind(),
    svelte(),
    starlight({
      title: "Pallad Docs",
      titleDelimiter: "-",
      sidebar: [
        {
          label: "Introduction to Pallad",
          link: "/docs",
        },
        {
          label: "Key Management",
          link: "/docs/key-management",
        },
        {
          label: "Providers",
          link: "/docs/providers",
        },
        {
          label: "Vault",
          link: "/docs/vault",
        },
      ],
    }),
  ],
  adapter: node({
    mode: "standalone",
  }),
})
