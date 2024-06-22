import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ params, request }) => {
  const proxiedUrl = `https://mina-${params.network}.obscura.network/v1/${
    import.meta.env.OBSCURA_API_KEY
  }/graphql`
  const response = await fetch(proxiedUrl, request)
  return new Response(response.body)
}
