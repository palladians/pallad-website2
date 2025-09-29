import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import expressiveCode from "astro-expressive-code";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

import node from "@astrojs/node";
const { BLOCKBERRY_API_KEY } = loadEnv(
  process.env.BLOCKBERRY_API_KEY,
  process.cwd(),
  ""
);

// https://astro.build/config
export default defineConfig({
  site: "https://pallad.co",
  output: "server",
  integrations: [
    expressiveCode(),
    mdx(),
    sitemap(),
    tailwind(),
    svelte(),
    starlight({
      title: "Pallad",
      logo: { src: "./public/logo.svg" },
      titleDelimiter: "-",
      sidebar: [
        {
          label: "Introduction to Pallad",
          link: "/docs",
        },
        {
          label: "User Guide",
          items: [{ label: "Getting Started", link: "/docs/getting-started" }],
        },
        {
          label: "Developers",
          items: [
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
        },
        {
          label: "Web Provider",
          items: [
            {
              label: "Connector Methods",
              link: "/docs/connector-methods",
            },
          ],
        },
      ],
      social: [
        { icon: "x.com", label: "X", href: "https://get.pallad.co/x" },
        {
          icon: "discord",
          label: "Discord",
          href: "https://get.pallad.co/discord",
        },
      ],
      customCss: ["./src/styles/docs.css"],
    }),
  ],
  adapter: node({
    mode: "standalone",
  }),
});
