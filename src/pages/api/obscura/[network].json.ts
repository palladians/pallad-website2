import type { APIRoute } from "astro"

const getObscuraUrl = (network: string) => {
  if (network === "mainnet") {
    return "https://mina.obscura.network"
  }
  return `https://mina-${network}.obscura.network`
}

export const POST: APIRoute = async ({ params, request }) => {
  const proxiedUrl = `${getObscuraUrl(params.network ?? "mainnet")}/v1/${
    import.meta.env.OBSCURA_API_KEY
  }/graphql`
  const response = await fetch(proxiedUrl, request)
  return new Response(response.body)
}
