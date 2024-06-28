import { ofetch } from "ofetch"

const STAKE_POOLS_URL =
  "https://minascan.io/mainnet/api/api/validators/?page=0&limit=100&sortBy=amount_staked&orderBy=DESC&size=100&stake=1000&epoch=1&isFullyUnlocked=true&type=active&isNotAnonymous=false&isWithFee=false&isVerifOnly=false"

export async function GET() {
  const data = await ofetch(STAKE_POOLS_URL)
  return new Response(JSON.stringify(data))
}
