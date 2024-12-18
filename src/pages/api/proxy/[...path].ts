import type { APIRoute } from "astro"
import { ofetch } from "ofetch"

export const prerender = false

export const ALL: APIRoute = async ({ request, params }) => {
  const path = params.path
  const apiKey = import.meta.env.BLOCKBERRY_API_KEY
  if (!path) throw new Error("No path provided")
  const url = new URL(path, "https://api.blockberry.one")
  url.search = new URL(request.url).search

  const response = await ofetch(url.toString(), {
    method: request.method,
    headers: {
      "x-api-key": apiKey,
      accept: "application/json",
      "content-type": "application/json",
    },
    body: request.method !== "GET" ? await request.text() : undefined,
  })

  return new Response(JSON.stringify(response), {
    status: 200,
  })
}
