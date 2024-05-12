import dayjs from "dayjs"
import { ofetch } from "ofetch"

export const MINA_FIAT_PRICE_URL =
  "https://api.coingecko.com/api/v3/coins/mina-protocol/market_chart/range"

const requestUrl = new URL(MINA_FIAT_PRICE_URL)
requestUrl.searchParams.set("vs_currency", "usd")
requestUrl.searchParams.set(
  "from",
  dayjs().subtract(6, "months").unix().toString(),
)
requestUrl.searchParams.set("to", dayjs().unix().toString())

export async function GET() {
  const data = await ofetch(requestUrl.toString())
  return new Response(JSON.stringify(data))
}
