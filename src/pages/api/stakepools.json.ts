import { ofetch } from "ofetch"

const STAKE_POOLS_URL =
  "https://minascan.io/mainnet/api/api/validators/new-rewards?page=0&limit=100&sortBy=amountStaked&orderBy=DESC&size=100&stake=1000&epoch=77&isFullyUnlocked=true&type=active"

export async function GET() {
  const data = await ofetch(STAKE_POOLS_URL)
  return new Response(JSON.stringify(data))
}
