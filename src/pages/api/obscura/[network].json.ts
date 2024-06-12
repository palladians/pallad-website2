import type { APIRoute } from "astro";
import { ofetch } from "ofetch";

export const POST: APIRoute = ({ params, request }) => {
  const proxiedUrl = `https://mina-${params.network}.obscura.network/v1/${import.meta.env.OBSCURA_API_KEY}/graphql`;
  return ofetch(proxiedUrl, {
    method: "POST",
    body: request.body,
  });
};
