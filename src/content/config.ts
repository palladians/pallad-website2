import { defineCollection, z } from "astro:content"
import { docsSchema } from "@astrojs/starlight/schema"

const subpageSchema = z.object({
  title: z.string(),
  excerpt: z.string().optional(),
})

const articleSchema = z.object({
  title: z.string(),
  excerpt: z.string().optional(),
  publishedAt: z.date(),
  coverFileName: z.string(),
})

export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
  subpages: defineCollection({ schema: subpageSchema }),
  articles: defineCollection({ schema: articleSchema }),
}
